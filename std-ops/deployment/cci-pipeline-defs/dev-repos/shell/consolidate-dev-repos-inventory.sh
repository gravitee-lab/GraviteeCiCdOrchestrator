#!/bin/bash

# the folder in which you opened your IDE, i.e. where you
export OPS_DIR=$(pwd)
# those four can be reset from bash env.
export GITHUB_ORG=${GITHUB_ORG:-'gravitee-io'}
# export RELEASE_BRANCHES=${RELEASE_BRANCHES:-'master, 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '}
export RELEASE_BRANCHES=${RELEASE_BRANCHES:-' 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '}
export SCOPE_FILES_DIR=${SCOPE_FILES_DIR:-"${OPS_DIR}/gio_release_scope"}

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

echo "QUICK DEBUG POINT"
echo "check out [${SCOPE_FILES_DIR}/release-branches.list]"
exit 0

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
echo "--->> Folder where files were generated : [${SCOPE_FILES_DIR}]"
echo "--->> Generated scope list files : [${OPS_DIR}/inventory]"
echo "--->> <<---"
# ls -allh ${SCOPE_FILES_DIR}
# ls -allh ${SCOPE_FILES_DIR}/repos-scope.*.list
cp -f ${SCOPE_FILES_DIR}/repos-scope.*.list ${OPS_DIR}/inventory/
ls -allh ${OPS_DIR}/inventory
echo "--->> <<---"
echo "--->> To run again, execute : <<---"
echo "rm -fr ${SCOPE_FILES_DIR}"
echo "$0"
echo "--->> <<---"

exit 0

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
