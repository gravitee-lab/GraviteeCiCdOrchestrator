#!/bin/bash

# that's where the [https://github.com/gravitee-lab/GraviteeCiCdOrchestrator]
# is git cloned
export DEV_REPOS_DATASPACE=$(pwd)/inventory


export OPS_HOME=$(pwd)


rm -f ${OPS_HOME}/release-data-files.list
# rm -f ${OPS_HOME}/*.sh
# rm -fr ${OPS_HOME}/.circleci
rm -fr ${OPS_HOME}/gitops

# cp ${DEV_REPOS_DATASPACE}/src/modules/circleci/status/tests/backup-repos.sh ${OPS_HOME}
# cp ${DEV_REPOS_DATASPACE}/src/modules/circleci/status/tests/deploy-repo-pipeline-def.sh ${OPS_HOME}

# cp -fR ${DEV_REPOS_DATASPACE}/src/modules/circleci/status/tests/.circleci ${OPS_HOME}

# As required, we forget about [1.20.*] [1.25.*] [1.29.*]
# echo "${DEV_REPOS_DATASPACE}/repos-scope.1.20.x.list" >> ${OPS_HOME}/release-data-files.list
# echo "${DEV_REPOS_DATASPACE}/repos-scope.1.25.x.list" >> ${OPS_HOME}/release-data-files.list
# echo "${DEV_REPOS_DATASPACE}/repos-scope.1.29.x.list" >> ${OPS_HOME}/release-data-files.list
# echo "${DEV_REPOS_DATASPACE}/repos-scope.1.30.x.list" >> ${OPS_HOME}/release-data-files.list
# echo "${DEV_REPOS_DATASPACE}/repos-scope.3.0.x.list" >> ${OPS_HOME}/release-data-files.list
# echo "${DEV_REPOS_DATASPACE}/repos-scope.3.1.x.list" >> ${OPS_HOME}/release-data-files.list

# --- #
# As required, we forget about [1.20.*] [1.25.*] [1.29.*]
ls ${DEV_REPOS_DATASPACE}/repos-scope.*.list | grep -v '1.20.x' | grep -v '1.25.x' | grep -v '1.29.x' | awk '{for (i=0; i < NF ;i++){print $i}}' | tee ${OPS_HOME}/release-data-files.list


# tree
ls -allh .

# cat release-data-files.list
cat ${OPS_HOME}/release-data-files.list

# --- #
# --- #
# each file listed in [release-data-files.list] contain a list of URIs of git repositories.
# two different files listed in [release-data-files.list] may contain the same URIs of a git repository
# --- #
# Now merging all files listed in [release-data-files.list], into
# one unique file listing all URIs of git
# repositories, without redundancy : [${OPS_HOME}/all-git-uris.list]

# cat $(cat ${OPS_HOME}/release-data-files.list | head -n 1) |  ${OPS_HOME}/all-git-uris.list

ITERATION_COUNT=0
while read FILEPATH; do
  # echo "ITERATION NUMBER = [${ITERATION_COUNT}]"
  if [ "x${ITERATION_COUNT}" == "x0" ]; then
    # echo "This is the first iteration, of ITERATION NUMBER = [${ITERATION_COUNT}]"
    # I begin by adding all git URIs from the first file
    cat ${FILEPATH} | tee ${OPS_HOME}/all-git-uris.list
  else
    # echo "This is NOT the first iteration, and ITERATION NUMBER = [${ITERATION_COUNT}]"
    while read CURRENT_GIT_URI; do
      # is [CURRENT_GIT_URI] already in [${OPS_HOME}/all-git-uris.list] ?
      export SEARCH_RESULT=$(cat ${OPS_HOME}/all-git-uris.list | grep ${CURRENT_GIT_URI})
      if [ "x${SEARCH_RESULT}" == "x" ]; then
        # if git URIs was not found in [${OPS_HOME}/all-git-uris.list], then we add it
        echo "${CURRENT_GIT_URI}" | tee -a ${OPS_HOME}/all-git-uris.list
      else
        echo "EXCLUDED GT URI - The [${CURRENT_GIT_URI}] Git URI is already inside the [${OPS_HOME}/all-git-uris.list] - EXCLUDED "
      fi;
    done <${FILEPATH}
  fi;
  (( ITERATION_COUNT++ ))
done <${OPS_HOME}/release-data-files.list

# And now, [${OPS_HOME}/all-git-uris.list] contains only
# one occurrence of any GIT URI listed in Any of the [${DEV_REPOS_DATASPACE}/repos-scope.*.list] files

# --- #
# --- #

echo "QUICK DEBUG POINT now check content of [${OPS_HOME}/all-git-uris.list] "
exit 0

while read FILEPATH; do
  echo "---"
  echo "backing-up repos listed in [${FILEPATH}]"
  # In each ${FILEPATH}
  echo "---"
  ${OPS_HOME}/shell/backup-repos.sh ${FILEPATH}

  export EXIT_CODE_HERE="$?"
  echo "EXIT_CODE_HERE=[${EXIT_CODE_HERE}]"
  if [ "${EXIT_CODE_HERE}" == "0" ]; then
    echo "---"
    echo "processing repos listed in [${FILEPATH}]"
    echo "---"
    # testing error handling
    # ${OPS_HOME}/deploy-repo-pipeline-def.sh
    ${OPS_HOME}/shell/deploy-repo-pipeline-def.sh ${FILEPATH}
    echo "---"
  else
    echo "there has been a problem backing up one of the reposlisted in  [${FILEPATH}] "
    echo "So operations were cancelled on repos listed in [${FILEPATH}]"
    return
    # exit 1
  fi;
done <${OPS_HOME}/release-data-files.list
