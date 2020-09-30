#!/bin/bash

# ------
# -- FUNCTIONS
# ------
Usage () {
  echo "---"
  echo " The [$0] script will \"setup to start building\" all the Circle Ci projects matching the git repos listed in the <CCI_PROJECTS_LIST_FILE> "
  echo " Set the GH_ORG env. var. to force using the desired Github Organization, instead of the default one, 'gravitee-lab' : export GH_ORG='<the desired gihub org>' "
  echo "---"
  echo "Usage :"
  echo "---"
  echo "  $0 <CCI_PROJECTS_LIST_FILE>"
  echo "---"
  echo "  <CCI_PROJECTS_LIST_FILE> : (required) The file listing all github repos "

  echo "---"
}


# ------
# -- ENV
# ------

export WSPACE=$(pwd)
export CCI_PROJECTS_LIST_FILE=$1

if [ "x${CCI_PROJECTS_LIST_FILE}" == "x" ]; then
  echo "You did not provide a first argument to [$0] as the <CCI_PROJECTS_LIST_FILE>"
  Usage
  exit 2
fi;

export GH_ORG=${GH_ORG:-'gravitee-lab'}


# --
export PROJECT_SLUGS_FILE=${WSPACE}/${CCI_PROJECTS_LIST_FILE}.projects-slugs


while read REPO_URL; do
  echo "${REPO_URL}" | awk -v GH_ORG=${GH_ORG} -F '/' '{print gh/${GH_ORG}/$NF}' | ${PROJECT_SLUGS_FILE}
done <${CCI_PROJECTS_LIST_FILE}


echo "---"
echo " check PROJECT_SLUGS_FILE=[${PROJECT_SLUGS_FILE}] content : "
cat ${PROJECT_SLUGS_FILE}
echo "---"
