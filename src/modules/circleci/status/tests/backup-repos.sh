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

backUpRepo () {
  export THIS_REPO_URL=$1
  export THIS_REPO_NAME=$(echo ${THIS_REPO_URL} | awk -F '/' '{print $NF}')
  cd ${WSPACE}/gitops.backup/
  echo "[BACKUP => ] backing-up THIS_REPO_URL=[${THIS_REPO_URL}]"
  echo "[BACKUP => ] backing-up THIS_REPO_NAME=[${THIS_REPO_NAME}]"
  git clone ${THIS_REPO_URL}
  if [ "$?" == "0" ]; then
    # then the git clone succeeded (the git repo does exists)
    cd ${WSPACE}/gitops.backup/${THIS_REPO_NAME}
    git branch -a | grep -E '^*.*.x' | awk -F '/' '{print $NF}' > ${WSPACE}/gitops.backup/${THIS_REPO_NAME}.branches.list
    while read THIS_GIT_BRANCH; do
      git checkout ${THIS_GIT_BRANCH}
      git fetch && git pull
    done <${WSPACE}/gitops.backup/${THIS_REPO_NAME}.branches.list
  else
    echo "[backUpRepo => ] the [${THIS_REPO_URL}] git repo does not exist, skipping any git operation"
  fi;

  cd ${WSPACE}/gitops.backup/
}


# ------
# -- ENV
# ------

export WSPACE=$(pwd)
export REPOS_URL_LIST_FILE=$1

if [ "x${REPOS_URL_LIST_FILE}" == "x" ]; then
  echo "REPOS_URL_LIST_FILE is an empty string"
  Usage
  exit 2
fi;

export BARE_FILENAME=$(echo "${REPOS_URL_LIST_FILE}" | awk -F '/' '{print $NF}')
cp ${REPOS_URL_LIST_FILE} ${WSPACE}/${BARE_FILENAME}.ssh

sed -i "s#https://github.com/gravitee-io#git@github.com:gravitee-lab#g" ${WSPACE}/${BARE_FILENAME}.ssh
echo "---"
echo "SECURITY CHECK NO GRAVITEE-IO in \${WSPACE}/\${BARE_FILENAME}.ssh=[${WSPACE}/${BARE_FILENAME}.ssh] : "
echo "---"
cat ${WSPACE}/${BARE_FILENAME}.ssh

exit 1
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

# ------
# -- First, setup Github User Git SSH config
# ------

setupSSHGithubUser

rm -fr ${WSPACE}/gitops.backup/
mkdir -p ${WSPACE}/gitops.backup/

while read REPO_URL; do
  echo "---"
  backUpRepo ${REPO_URL}
done <${WSPACE}/${BARE_FILENAME}.ssh
