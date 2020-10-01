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

setupSSHGithubUser () {
  git config --global commit.gpgsign true
  git config --global user.name "Jean-Baptiste-Lasselle"
  git config --global user.email jean.baptiste.lasselle.pegasus@gmail.com
  git config --global user.signingkey 7B19A8E1574C2883

  git config --global --list

  # will re-define the default identity in use
  # https://docstore.mik.ua/orelly/networking_2ndEd/ssh/ch06_04.htm
  ssh-add ~/.ssh.perso.backed/id_rsa

  export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
  # ssh -Ti ~/.ssh.perso.backed/id_rsa git@github.com
  # ssh-add -D
  # export TEST_STR=$(ssh -T git@github.com 2>&1|tee)
  export TEST_STR=$(ssh -Ti ~/.ssh.perso.backed/id_rsa git@github.com 2>&1|tee)
  echo "before final test TEST_STR=[${TEST_STR}]"
  export SUCCESS_STR="You've successfully authenticated"
  # echo "${TEST_STR}" | grep "${SUCCESS_STR}"
  export GIT_SSH_CONF_TEST_STR=$(echo "${TEST_STR}" | grep "${SUCCESS_STR}")
  echo "final test GIT_SSH_CONF_TEST_STR=[${GIT_SSH_CONF_TEST_STR}]"

  if [ "x${GIT_SSH_CONF_TEST_STR}" == "x" ]; then
    echo "---"
    echo "You must change the content of the [setupSSHGithubUser] function in [$0], to match your github user local git config"
    echo "---"
    Usage
    exit 3
  else
    echo "---"
    echo "your github user local git config is operational, starting operations"
    echo "---"
  fi;
}

setupCircleCIConfig () {
  export THIS_REPO_URL=$1
  export THIS_REPO_NAME=$(echo ${THIS_REPO_URL} | awk -F '/' '{print $NF}')
  cd ${WSPACE}/gitops/
  echo "[setupCircleCIConfig => ] processing THIS_REPO_URL=[${THIS_REPO_URL}]"
  echo "[setupCircleCIConfig => ] processing THIS_REPO_NAME=[${THIS_REPO_NAME}]"
  git clone ${THIS_REPO_URL}
  if [ "$?" == "0" ]; then
    # then the git clone succeeded (the git repo does exists)
    cd ${WSPACE}/gitops/${THIS_REPO_NAME}
    git branch -a | grep -E '*.*.x$' | awk -F '/' '{print $NF}' > ${WSPACE}/gitops/${THIS_REPO_NAME}.branches.list
    echo "master" >> ${WSPACE}/gitops/${THIS_REPO_NAME}.branches.list
    while read THIS_GIT_BRANCH; do
      git checkout ${THIS_GIT_BRANCH}
      mkdir ${WSPACE}/gitops/${THIS_REPO_NAME}/.circleci/
      cp -f ${WSPACE}/.circleci/config.yml ${WSPACE}/gitops/${THIS_REPO_NAME}/.circleci/
      export THIS_COMMIT_MESSAGE="[$0] automatic CICD test setup : adding circleci git config"
      git add --all && git commit -m "${THIS_COMMIT_MESSAGE}" && git push -u origin HEAD
    done <${WSPACE}/gitops/${THIS_REPO_NAME}.branches.list
  else
    echo "[setupCircleCIConfig => ] the [${THIS_REPO_URL}] git repo doesnot exist, skipping any git operation"
  fi;

  cd ${WSPACE}/gitops/
}


# ------
# -- ENV
# ------

export WSPACE=$(pwd)
export REPOS_URL_LIST_FILE=$1

if [ "x${REPOS_URL_LIST_FILE}" == "x" ]; then
  echo "You did not provide a first argument to [$0] as the <REPOS_URL_LIST_FILE>"
  Usage
  exit 2
fi;

export BARE_FILENAME=$(echo "${REPOS_URL_LIST_FILE}" | awk -F '/' '{print $NF}')
cp ${REPOS_URL_LIST_FILE} ${WSPACE}/${BARE_FILENAME}.ssh
# ---
# WORKING TESTS ON GRAVITEE-LAB , NOT GRAVITEE-IO !!! BEWARE !!! => never the less,there is a local backup made locally, just in case

sed -i "s#https://github.com/gravitee-io#git@github.com:gravitee-lab#g" ${WSPACE}/${BARE_FILENAME}.ssh
echo "---"
echo "SECURITY CHECK NO GRAVITEE-IO in \${WSPACE}/\${BARE_FILENAME}.ssh=[${WSPACE}/${BARE_FILENAME}.ssh] : "
echo "---"
cat ${WSPACE}/${BARE_FILENAME}.ssh
echo "---"
echo " IN CASE ANY PROBLEM, A BACK-UP WAS PREPARED ON THIS MACHINE [$(hostname)] in the [${WSPACE}/gitops.backup/] Folder "
echo "---"

echo "---"
echo "  REPOS_URL_LIST_FILE=[${REPOS_URL_LIST_FILE}]"
echo "---"
echo "  \${WSPACE}/\${BARE_FILENAME}.ssh=[${WSPACE}/${BARE_FILENAME}.ssh]"
echo "---"
echo " Now turning [git HTTP URLs] into [git SSH URLs] REPOS_URL_LIST_FILE=[${REPOS_URL_LIST_FILE}]"
echo "---"



# ------
# -- OPS
# ------


# first, setup Github User Git SSH config
setupSSHGithubUser

rm -fr ${WSPACE}/gitops/
mkdir -p ${WSPACE}/gitops/

while read REPO_URL; do
  echo "---"
  setupCircleCIConfig ${REPO_URL}
done <${WSPACE}/${BARE_FILENAME}.ssh
