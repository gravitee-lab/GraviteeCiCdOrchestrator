#!/bin/bash

export GITHUB_ORG=${GITHUB_ORG:"gravitee-io"}


# -- ENV
# ------
# Circle Ci Pipeline definition is by default, NOT deployed
# to the "real" Gravitee.io Github Org.!!!
# export GITHUB_ORG=${GITHUB_ORG}
export OPS_HOME=$(pwd)


# ------
# -- FUNCTIONS
# ------

Usage () {
  echo "---"
  echo " The [$0] script will commit and push the [.circleci/config.yml] on every [*.*.x] git branch of the [https://github.com/${GITHUB_ORG}/release] git repo (and the master git branch)   "
  echo "---"
  echo "Usage :"
  echo "---"
  echo "  $0 "
  echo "---"
  echo "env. variables :"
  echo "---"
  echo "  GITHUB_ORG (Required) The github org where the [release] repo is"
  echo "  GIT_SSH_COMMAND (Optional) The git ssh command to use, defaults to 'ssh -i ~/.ssh/id_rsa'"
  echo "  GIT_USER_NAME (mandatory) The git user name to use, to configure git [git config --global user.name]"
  echo "  GIT_USER_EMAIL (mandatory) The git user eamil to use, to configure git [git config --global user.email]"
  echo "  GIT_USER_SIGNING_KEY (Optional) The GPG public Key to use, to sign commits. Has no default value, and if not set, then git is configured with [git config --global commit.gpgsign false]"
  echo "---"
}

setupSSHGithubUser () {
  echo "[$0 - setupSSHGithubUser] QUICK DEBUG "
  echo "[$0 - setupSSHGithubUser] [GIT_USER_NAME=[${GIT_USER_NAME}]] "
  echo "[$0 - setupSSHGithubUser] [GIT_USER_EMAIL=[${GIT_USER_EMAIL}]] "
  echo "[$0 - setupSSHGithubUser] [GIT_SSH_COMMAND=[${GIT_SSH_COMMAND}]] "

  # export GIT_USER_NAME=${GIT_USER_NAME:-'Jean-Baptiste-Lasselle'}
  if [ "x${GIT_USER_NAME}" == "x" ]; then
    echo "[$0 - setupSSHGithubUser] You did not set the [GIT_USER_NAME] env. var."
    Usage
    exit 1
  fi;
  # export GIT_USER_EMAIL=${GIT_USER_EMAIL:-'jean.baptiste.lasselle.pegasus@gmail.com'}
  if [ "x${GIT_USER_EMAIL}" == "x" ]; then
    echo "[$0 - setupSSHGithubUser] You did not set the [GIT_USER_EMAIL] env. var."
    Usage
    exit 1
  fi;
  if [ "x${GIT_USER_SIGNING_KEY}" == "x" ]; then
    echo "[$0 - setupSSHGithubUser] You did not set the [GIT_USER_SIGNING_KEY] env. var."
    git config --global commit.gpgsign false
  else
    git config --global commit.gpgsign true
    git config --global user.signingkey ${GIT_USER_SIGNING_KEY}
  fi;

  # export GIT_SSH_COMMAND=${GIT_SSH_COMMAND:-'ssh -i ~/.ssh.perso.backed/id_rsa'}
  export GIT_SSH_COMMAND=${GIT_SSH_COMMAND:-'ssh -i ~/.ssh/id_rsa'}
  export SSH_PRIVATE_KEY=$(echo "$GIT_SSH_COMMAND" | awk '{print $3}' | sed "s#~#${HOME}#g")

  # git config --global user.name "Jean-Baptiste-Lasselle"
  git config --global user.name "${GIT_USER_NAME}"
  # git config --global user.email jean.baptiste.lasselle.pegasus@gmail.com
  git config --global user.email "${GIT_USER_EMAIL}"

  git config --global --list

  # will re-define the default identity in use
  # https://docstore.mik.ua/orelly/networking_2ndEd/ssh/ch06_04.htm
  ssh-add ${SSH_PRIVATE_KEY}

  # --- #
  # ssh-add -D
  # --- #
  # case of gitlab.com
  # export TEST_STR=$(ssh -Ti ${SSH_PRIVATE_KEY} git@gitlab.com 2>&1|tee)
  # case of github.com
  export TEST_STR=$(ssh -Ti ${SSH_PRIVATE_KEY} git@github.com 2>&1|tee)

  echo "[$0 - setupSSHGithubUser] Before final test TEST_STR=[${TEST_STR}]"
  # case of gitlab.com
  export SUCCESS_STR="Welcome to GitLab"
  # case of github.com
  export SUCCESS_STR="You've successfully authenticated"
  # echo "${TEST_STR}" | grep "${SUCCESS_STR}"
  export GIT_SSH_CONF_TEST_STR=$(echo "${TEST_STR}" | grep "${SUCCESS_STR}")
  echo "[$0 - setupSSHGithubUser] final test GIT_SSH_CONF_TEST_STR=[${GIT_SSH_CONF_TEST_STR}]"

  if [ "x${GIT_SSH_CONF_TEST_STR}" == "x" ]; then
    echo "---"
    echo "[$0 - setupSSHGithubUser] You must change the content of the [setupSSHGithubUser] function in [$0], to properly configure your local git for your github user"
    echo "---"
    Usage
    exit 3
  else
    echo "---"
    echo "[$0 - setupSSHGithubUser] your github user local git config is operational, starting operations"
    echo "---"
  fi;
}

setupCircleCIConfig () {
  export THIS_REPO_URL=$1
  export THIS_REPO_NAME=$(echo ${THIS_REPO_URL} | awk -F '/' '{print $NF}')
  cd ${OPS_HOME}/gitops/
  echo "[setupCircleCIConfig => ] processing THIS_REPO_URL=[${THIS_REPO_URL}]"
  echo "[setupCircleCIConfig => ] processing THIS_REPO_NAME=[${THIS_REPO_NAME}]"
  git clone ${THIS_REPO_URL}
  if [ "$?" == "0" ]; then
    # then the git clone succeeded (the git repo does exists)
    cd ${OPS_HOME}/gitops/${THIS_REPO_NAME}
    git branch -a | grep -E '*.*.x$' | awk -F '/' '{print $NF}' > ${OPS_HOME}/gitops/${THIS_REPO_NAME}.branches.list
    echo "master" >> ${OPS_HOME}/gitops/${THIS_REPO_NAME}.branches.list
    while read THIS_GIT_BRANCH; do
      git checkout ${THIS_GIT_BRANCH}
      mkdir -p ${OPS_HOME}/gitops/${THIS_REPO_NAME}/.circleci/
      cp -f ${OPS_HOME}/.circleci/config.yml ${OPS_HOME}/gitops/${THIS_REPO_NAME}/.circleci/
      export GIT_COMMIT_MESSAGE=${GIT_COMMIT_MESSAGE:-"[$0] automatic CICD test setup : adding circleci git config"}
      git add --all && git commit -m "${GIT_COMMIT_MESSAGE}" && git push -u origin HEAD
    done <${OPS_HOME}/gitops/${THIS_REPO_NAME}.branches.list
  else
    echo "[setupCircleCIConfig => ] the [${THIS_REPO_URL}] git repo does not exist, skipping any git operation"
  fi;

  cd ${OPS_HOME}/gitops/
}



# ------
# -- OPS
# ------

if [ "x${*GITHUB_ORG}" == "x" ]; then
  echo "[$0] You did not set the [GITHUB_ORG] env. var."
  Usage
  exit 1
fi;
# - first, setup Github User Git SSH config

setupSSHGithubUser

rm -fr ${OPS_HOME}/gitops/
mkdir -p ${OPS_HOME}/gitops/

# - Then deploy Circle CI Pipeline defintion to each git repo
setupCircleCIConfig git@github.com:${GITHUB_ORG}/release
