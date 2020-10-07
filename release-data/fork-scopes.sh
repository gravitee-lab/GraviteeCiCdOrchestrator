#!/bin/bash

# ---
# the github organization where I fork all github repos
export GITHUB_ORG=${GITHUB_ORG:-'gravitee-lab'}
export WHERE_I_WORK=${WHERE_I_WORK:-"${HOME}/gio_forking"}

# ----
# The purpose of this script is to fork all github repos involved in the Release CICD Process
#
# -
# ----


# ----
# FUNCTIONS
# ----

forkOneRepo () {
  THE_FORKED_REPO_HTTP_URI=$1
  THE_FORKED_REPO_NAME=$(echo ${THE_FORKED_REPO_HTTP_URI} | awk -F '/' '{print $NF}')
  echo "THE_FORKED_REPO_HTTP_URI=[${THE_FORKED_REPO_HTTP_URI}]"
  echo "THE_FORKED_REPO_NAME=[${THE_FORKED_REPO_NAME}]"

  git clone ${THE_FORKED_REPO_HTTP_URI} ${WHERE_I_WORK}/git/${THE_FORKED_REPO_NAME}
  cd ${WHERE_I_WORK}/git/${THE_FORKED_REPO_NAME}
  git remote add fork_target 
}

mkdir -p ${WHERE_I_WORK}/git
forkOneRepo https://github.com/gravitee-io/gravitee-policy-request-content-limit


exit 0
