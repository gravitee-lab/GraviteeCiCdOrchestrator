#!/bin/bash

# that's where the [https://github.com/gravitee-lab/GraviteeCiCdOrchestrator]
# is git cloned
export DEV_REPOS_DATASPACE="${HOME}/gravitee-orchestra"
export DEV_REPOS_DATASPACE=$(pwd)


export OPS_HOME=$(pwd)


rm -f ${OPS_HOME}/release-data-files.list
rm -f ${OPS_HOME}/*.sh
rm -fr ${OPS_HOME}/.circleci
rm -fr ${OPS_HOME}/gitops

cp ${DEV_REPOS_DATASPACE}/src/modules/circleci/status/tests/backup-repos.sh ${OPS_HOME}
cp ${DEV_REPOS_DATASPACE}/src/modules/circleci/status/tests/deploy-repo-pipeline-def.sh ${OPS_HOME}

cp -fR ${DEV_REPOS_DATASPACE}/src/modules/circleci/status/tests/.circleci ${OPS_HOME}

echo "${DEV_REPOS_DATASPACE}/release-data/repos-scope.1.20.x.list" >> ${OPS_HOME}/release-data-files.list
echo "${DEV_REPOS_DATASPACE}/release-data/repos-scope.1.25.x.list" >> ${OPS_HOME}/release-data-files.list
echo "${DEV_REPOS_DATASPACE}/release-data/repos-scope.1.29.x.list" >> ${OPS_HOME}/release-data-files.list
echo "${DEV_REPOS_DATASPACE}/release-data/repos-scope.1.30.x.list" >> ${OPS_HOME}/release-data-files.list
echo "${DEV_REPOS_DATASPACE}/release-data/repos-scope.3.0.x.list" >> ${OPS_HOME}/release-data-files.list
echo "${DEV_REPOS_DATASPACE}/release-data/repos-scope.3.1.x.list" >> ${OPS_HOME}/release-data-files.list

tree

cat release-data-files.list


while read FILEPATH; do
  echo "---"
  echo "backing-up repos listed in [${FILEPATH}]"
  echo "---"
  ${OPS_HOME}/backup-repos.sh ${FILEPATH}
  export EXIT_CODE_HERE="$?"
  echo "EXIT_CODE_HERE=[${EXIT_CODE_HERE}]"
  if [ "${EXIT_CODE_HERE}" == "0" ]; then
    echo "---"
    echo "processing repos listed in [${FILEPATH}]"
    echo "---"
    # testing error handling
    # ${OPS_HOME}/deploy-repo-pipeline-def.sh
    ${OPS_HOME}/deploy-repo-pipeline-def.sh ${FILEPATH}
    echo "---"
  else
    echo "there has been a problem backing up one of the reposlisted in  [${FILEPATH}] "
    echo "So operations were cancelled on repos listed in [${FILEPATH}]"
    return
    # exit 1
  fi;
done <${OPS_HOME}/release-data-files.list
