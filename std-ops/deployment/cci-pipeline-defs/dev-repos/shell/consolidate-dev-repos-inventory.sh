#!/bin/bash

# the folder in which you opened your IDE, i.e. where you
export OPS_DIR=$(pwd)
# Data are by default, consolidated from the "real" Gravitee.io Github Org.
export GITHUB_ORG=${GITHUB_ORG:-'gravitee-io'}
# export RELEASE_BRANCHES=${RELEASE_BRANCHES:-'master, 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '}
export RELEASE_BRANCHES=${RELEASE_BRANCHES:-' 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '}
# export SCOPE_FILES_DIR=${SCOPE_FILES_DIR:-"${OPS_DIR}/gio_release_scope"}
export SCOPE_FILES_DIR=${SCOPE_FILES_DIR:-"${OPS_DIR}/inventory"}

# ----
# The purpose of this script is to generate one file per branch on
# the 'release repo' (https://github.com/${GITHUB_ORG}/release) :
# - One file per git branch on the release repo : [repos-scope.${RELEASE_BRANCH}.list]
# - each [repos-scope.${RELEASE_BRANCH}.list] will contain the list of all github git repos, potentially involved in each release
# -
# ----

mkdir -p ${OPS_DIR}/inventory

# ----
# FUNCTIONS
# ----

# --->>> <<<---
# --->>> <<<---
# This function will generate the scope file for
# a given release branch in the ccc repo
# ---
# This function also generates into your IDE worskspace
# each 'release.json' file for each release branch, in a different folder :
# the release.json from the ${RELEASE_BRANCH} will be stored into
# the [<your IDE workspace>/release-data/apim/${RELEASE_BRANCH}] folder.
# --->>> <<<---
generateScopeFile () {
  THE_RELEASE_BRANCH=$1
  echo "THE_RELEASE_BRANCH=${THE_RELEASE_BRANCH}"
  # Scope file generation
  #
  cd ${SCOPE_FILES_DIR}/git
  git checkout "${THE_RELEASE_BRANCH}"
  cd ${SCOPE_FILES_DIR}/
  cat ${SCOPE_FILES_DIR}/git/release.json | jq .components[].name | awk -F '"' '{print $2}' | tee ${SCOPE_FILES_DIR}/repos-names.${THE_RELEASE_BRANCH}.list
  while read repo_name; do
    echo "https://github.com/${GITHUB_ORG}/$repo_name" | tee -a ${SCOPE_FILES_DIR}/repos-scope.${THE_RELEASE_BRANCH}.list
  done <${SCOPE_FILES_DIR}/repos-names.${THE_RELEASE_BRANCH}.list

  # Now copying release.json into its dedicated folder
  mkdir -p ${OPS_DIR}/inventory/apim/${THE_RELEASE_BRANCH}
  cp -f ${SCOPE_FILES_DIR}/git/release.json ${OPS_DIR}/inventory/apim/${THE_RELEASE_BRANCH}
}

# ----
# OPERATIONS
# ----
mkdir -p ${SCOPE_FILES_DIR}/git
git clone https://github.com/${GITHUB_ORG}/release ${SCOPE_FILES_DIR}/git

echo "${RELEASE_BRANCHES}" | awk -F ',' '{for (i = 0; i < NF + 1; i++) {print $i}}' | grep -v ',' > ${SCOPE_FILES_DIR}/release-branches.list.raw


# echo "--->> content of [${SCOPE_FILES_DIR}/release-branches.list.raw] : "

# cat ${SCOPE_FILES_DIR}/release-branches.list.raw

# echo "--->> now stripping all whitespaces"

while read line; do
  echo "$line" | awk '{print $1}' | tee -a ${SCOPE_FILES_DIR}/release-branches.list
done <${SCOPE_FILES_DIR}/release-branches.list.raw


echo "--->> <<---"
echo "--->> content of [${SCOPE_FILES_DIR}/release-branches.list] : "
echo "--->> <<---"
cat ${SCOPE_FILES_DIR}/release-branches.list
echo "--->> <<---"

echo "--->> <<---"
echo "--->> Now generating scope lists files <<---"

while read CURR_RELEASE_BRANCH; do
  generateScopeFile ${CURR_RELEASE_BRANCH}
done <${SCOPE_FILES_DIR}/release-branches.list

echo "--->> <<---"
echo "--->> completed scope lists files generation <<---"
echo "--->> Folder where inventory files were generated : [${SCOPE_FILES_DIR}]"
# echo "--->> Generated inventory list files : [${OPS_DIR}/inventory]"
echo "--->> <<---"

# ls -allh ${SCOPE_FILES_DIR}
# ls -allh ${SCOPE_FILES_DIR}/repos-scope.*.list
# cp -f ${SCOPE_FILES_DIR}/repos-scope.*.list ${OPS_DIR}/inventory/
# mv ${SCOPE_FILES_DIR}/repos-names.*.list ${OPS_DIR}/inventory/apim

tree ${OPS_DIR}/inventory/apim/
ls -allh ${OPS_DIR}/inventory
echo "--->> <<---"
echo "--->> To run again, execute : <<---"
echo "rm -fr ${SCOPE_FILES_DIR}"
echo "$0"
echo "--->> <<---"

if [ -f ${SCOPE_FILES_DIR}/scope-files.list ]; then
  rm -f ${SCOPE_FILES_DIR}/scope-files.list
fi;

if [ -d ${OPS_DIR}/gitops ]; then
  rm -fr ${OPS_DIR}/gitops
fi;

# rm -f ${OPS_DIR}/*.sh
# rm -fr ${OPS_DIR}/.circleci

# cp ${SCOPE_FILES_DIR}/src/modules/circleci/status/tests/backup-repos.sh ${OPS_DIR}
# cp ${SCOPE_FILES_DIR}/src/modules/circleci/status/tests/deploy-repo-pipeline-def.sh ${OPS_DIR}

# cp -fR ${SCOPE_FILES_DIR}/src/modules/circleci/status/tests/.circleci ${OPS_DIR}

# As required, we forget about [1.20.*] [1.25.*] [1.29.*]
# echo "${SCOPE_FILES_DIR}/repos-scope.1.20.x.list" >> ${SCOPE_FILES_DIR}/scope-files.list
# echo "${SCOPE_FILES_DIR}/repos-scope.1.25.x.list" >> ${SCOPE_FILES_DIR}/scope-files.list
# echo "${SCOPE_FILES_DIR}/repos-scope.1.29.x.list" >> ${SCOPE_FILES_DIR}/scope-files.list
# echo "${SCOPE_FILES_DIR}/repos-scope.1.30.x.list" >> ${SCOPE_FILES_DIR}/scope-files.list
# echo "${SCOPE_FILES_DIR}/repos-scope.3.0.x.list" >> ${SCOPE_FILES_DIR}/scope-files.list
# echo "${SCOPE_FILES_DIR}/repos-scope.3.1.x.list" >> ${SCOPE_FILES_DIR}/scope-files.list

# --- #
# As required, we forget about [1.20.*] [1.25.*] [1.29.*]
ls ${SCOPE_FILES_DIR}/repos-scope.*.list | grep -v '1.20.x' | grep -v '1.25.x' | grep -v '1.29.x' | awk '{for (i=0; i < NF ;i++){print $i}}' | tee ${SCOPE_FILES_DIR}/scope-files.list


# tree
ls -allh .

# cat scope-files.list
cat ${SCOPE_FILES_DIR}/scope-files.list

# --- #
# --- #
# each file listed in [scope-files.list] contain a list of URIs of git repositories.
# two different files listed in [scope-files.list] may contain the same URIs of a git repository
# --- #
# Now merging all files listed in [scope-files.list], into
# one unique file listing all URIs of git
# repositories, without redundancy : [${OPS_DIR}/consolidated-git-repos-uris.list]

# cat $(cat ${SCOPE_FILES_DIR}/scope-files.list | head -n 1) |  ${OPS_DIR}/consolidated-git-repos-uris.list

ITERATION_COUNT=0
while read FILEPATH; do
  # echo "ITERATION NUMBER = [${ITERATION_COUNT}]"
  if [ "x${ITERATION_COUNT}" == "x0" ]; then
    # echo "This is the first iteration, of ITERATION NUMBER = [${ITERATION_COUNT}]"
    # I begin by adding all git URIs from the first file
    cat ${FILEPATH} | tee ${OPS_DIR}/consolidated-git-repos-uris.list
  else
    # echo "This is NOT the first iteration, and ITERATION NUMBER = [${ITERATION_COUNT}]"
    while read CURRENT_GIT_URI; do
      # is [CURRENT_GIT_URI] already in [${OPS_DIR}/consolidated-git-repos-uris.list] ?
      export SEARCH_RESULT=$(cat ${OPS_DIR}/consolidated-git-repos-uris.list | grep ${CURRENT_GIT_URI})
      if [ "x${SEARCH_RESULT}" == "x" ]; then
        # if git URIs was not found in [${OPS_DIR}/consolidated-git-repos-uris.list], then we add it
        echo "${CURRENT_GIT_URI}" | tee -a ${OPS_DIR}/consolidated-git-repos-uris.list
      else
        echo "EXCLUDED GT URI - The [${CURRENT_GIT_URI}] Git URI is already inside the [${OPS_DIR}/consolidated-git-repos-uris.list] - EXCLUDED "
      fi;
    done <${FILEPATH}
  fi;
  (( ITERATION_COUNT++ ))
done <${SCOPE_FILES_DIR}/scope-files.list

# And now, [${OPS_DIR}/consolidated-git-repos-uris.list] contains only
# one occurrence of any GIT URI listed in Any of the [${SCOPE_FILES_DIR}/repos-scope.*.list] files

# --- #
# --- #
echo "# --------------------------------------------------------------------------------------- #"
echo "# --------------------------------------------------------------------------------------- #"
echo "# --------------------------------------------------------------------------------------- #"
echo "# ------------------ The [${OPS_DIR}/consolidated-git-repos-uris.list] file now contains  -------------- #"
echo "# ------------------ the list of URIs of all the git repo to  ----------------------------#"
echo "# ------------------ deploy the Circle CI Pipeline Definition to.  -----------------------#"
echo "# --------------------------------------------------------------------------------------- #"
echo "# --------------------------------------------------------------------------------------- #"
echo "# --------------------------------------------------------------------------------------- #"
exit 0


# ---------------------------------------------------------------- #
# ---------------------------------------------------------------- #
# ---- KEPT BELOW : SOME UNIT TESTS USED TO DESIGN HIS SCRIPT ---- #
# ---------------------------------------------------------------- #
# ---------------------------------------------------------------- #

echo "--->> <<---"
echo "--->> testing function [generateScopeFile] : "

# note : aucunes différences entre les repo listes des versions [1.29.x] et [3.1.x]
generateScopeFile 1.29.x
# note : des différences entre les repo listes des versions [3.0.x] et [3.1.x]
generateScopeFile 3.0.x
generateScopeFile 3.1.x

echo "--->> <<---"
echo "--->> testing function [generateScopeFile] value of THE_RELEASE_BRANCH=[${THE_RELEASE_BRANCH}]: "
echo "--->> testing function [generateScopeFile] content of SCOPE_FILES_DIR=[${SCOPE_FILES_DIR}]: "
echo "--->> <<---"
ls -allh ${SCOPE_FILES_DIR}
echo "--->> <<---"


# cat release-data/apim/1.30.x/tests/release.test4-20-conccurrent.json | jq .components[].name | awk -F '"' '{print $2}' | tee ./repos.list
