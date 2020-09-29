#!/bin/bash

# ------
# -- FUNCTIONS
# ------

Usage () {
  echo "---"
  echo " The [$0] script will commit and push the [.circleci/config.yml] on every [*.*.x] git branch of every git repo    "
  echo "---"
  echo "Usage :"
  echo "---"
  echo "  $0 <REPOS_URL_LIST_FILE>"
  echo "---"
}

setupCircleCIConfig () {
  export THIS_REPO_URL=$1
  export THIS_REPO_NAME=$(echo ${THIS_REPO_URL} | awk -F '/' '{print $NF}')
  cd ${WSPACE}/gitops/
  echo "[setupCircleCIConfig => ] processing THIS_REPO_URL=[${THIS_REPO_URL}]"
  echo "[setupCircleCIConfig => ] processing THIS_REPO_NAME=[${THIS_REPO_NAME}]"
  git clone ${THIS_REPO_URL}
}


# ------
# -- ENV
# ------
export WSPACE=$(pwd)
export REPOS_URL_LIST_FILE=$1

if [ "x${REPOS_URL_LIST_FILE}" == "x" ]; then
  echo
  Usage
  exit 2
fi;

echo "---"
echo "  REPOS_URL_LIST_FILE=[${REPOS_URL_LIST_FILE}]"
echo "---"


# ------
# -- OPS
# ------

rm -fr ${WSPACE}/gitops/
mkdir -p ${WSPACE}/gitops/

while read REPO_URL; do
  echo "---"
  setupCircleCIConfig ${REPO_URL}
done <${REPOS_URL_LIST_FILE}
