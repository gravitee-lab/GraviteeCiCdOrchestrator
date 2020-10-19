#!/bin/bash

# the folder in which you opened your IDE, i.e. where you
export IDE_DIR=$(pwd)
# those four can be reset from bash env.
export GITHUB_ORG=${GITHUB_ORG:-'gravitee-io'}
# export RELEASE_BRANCHES=${RELEASE_BRANCHES:-'master, 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '}
export RELEASE_BRANCHES=${RELEASE_BRANCHES:-' 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '}
export WHERE_I_WORK=${WHERE_I_WORK:-"${HOME}/gio_release_scope"}

# ----
# The purpose of this script is to generate one file per branch on
# the 'release repo' (https://github.com/${GITHUB_ORG}/release) :
# - One file per git branch on the release repo : [repos-scope.${RELEASE_BRANCH}.list]
# - each [repos-scope.${RELEASE_BRANCH}.list] will contain the list of all github git repos, potentially involved in each release
# -
# ----

mkdir -p ${IDE_DIR}/release-data

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
  cd ${WHERE_I_WORK}/git
  git checkout "${THE_RELEASE_BRANCH}"
  cd ${WHERE_I_WORK}/
  cat ${WHERE_I_WORK}/git/release.json | jq .components[].name | awk -F '"' '{print $2}' | tee ${WHERE_I_WORK}/repos-names.${THE_RELEASE_BRANCH}.list
  while read repo_name; do
    echo "https://github.com/${GITHUB_ORG}/$repo_name" | tee -a ${WHERE_I_WORK}/repos-scope.${THE_RELEASE_BRANCH}.list
  done <${WHERE_I_WORK}/repos-names.${THE_RELEASE_BRANCH}.list

  # Now copying release.json into its dedicated folder
  mkdir -p ${IDE_DIR}/release-data/apim/${THE_RELEASE_BRANCH}
  cp -f ${WHERE_I_WORK}/git/release.json ${IDE_DIR}/release-data/apim/${THE_RELEASE_BRANCH}
}

# ----
# OPERATIONS
# ----
mkdir -p ${WHERE_I_WORK}/git
git clone https://github.com/${GITHUB_ORG}/release ${WHERE_I_WORK}/git

echo "${RELEASE_BRANCHES}" | awk -F ',' '{for (i = 0; i < NF + 1; i++) {print $i}}' | grep -v ',' > ${WHERE_I_WORK}/release-branches.list.raw

# echo "--->> content of [${WHERE_I_WORK}/release-branches.list.raw] : "

# cat ${WHERE_I_WORK}/release-branches.list.raw

# echo "--->> now stripping all whitespaces"

while read line; do
  echo "$line" | awk '{print $1}' | tee -a ${WHERE_I_WORK}/release-branches.list
done <${WHERE_I_WORK}/release-branches.list.raw



echo "--->> <<---"
echo "--->> content of [${WHERE_I_WORK}/release-branches.list] : "
echo "--->> <<---"
cat ${WHERE_I_WORK}/release-branches.list
echo "--->> <<---"

echo "--->> <<---"
echo "--->> Now generating scope lists files <<---"

while read CURR_RELEASE_BRANCH; do
  generateScopeFile ${CURR_RELEASE_BRANCH}
done <${WHERE_I_WORK}/release-branches.list

echo "--->> <<---"
echo "--->> completed scope lists files generation <<---"
echo "--->> Folder where files were generated : [${WHERE_I_WORK}]"
echo "--->> Generated scope list files : [${IDE_DIR}/release-data]"
echo "--->> <<---"
# ls -allh ${WHERE_I_WORK}
# ls -allh ${WHERE_I_WORK}/repos-scope.*.list
cp -f ${WHERE_I_WORK}/repos-scope.*.list ${IDE_DIR}/release-data/
ls -allh ${IDE_DIR}/release-data
echo "--->> <<---"
echo "--->> To run again, execute : <<---"
echo "rm -fr ${WHERE_I_WORK}"
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
echo "--->> testing function [generateScopeFile] content of WHERE_I_WORK=[${WHERE_I_WORK}]: "
echo "--->> <<---"
ls -allh ${WHERE_I_WORK}
echo "--->> <<---"


# cat release-data/apim/1.30.x/tests/release.test4-20-conccurrent.json | jq .components[].name | awk -F '"' '{print $2}' | tee ./repos.list
