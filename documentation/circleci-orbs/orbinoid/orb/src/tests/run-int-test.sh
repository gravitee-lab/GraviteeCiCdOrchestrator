#!/bin/bash


Usage () {
  echo "=== "
  echo "     $0 <TESTS GIT REPO SSH URI> <GIT BRANCH> <ORB_ID>  "
  echo "=== "
  echo " Runs the integration tests for the <ORB_ID> on a dedicated git branch of the <TESTS REPO GIT SSH URI> git repo"
  echo " [$0] should always be invoked from the root folder ofthe Orb Project"
  echo "=== "
  echo " [$0] takes 3 mandatory arguments :"
  echo "     <TESTS GIT REPO SSH URI> (mandatory) The git ssh URI of the git repo to use for integration tests"
  echo "     <GIT BRANCH> (mandatory) The git branch prefix for all git branches on which to run the tests"
  echo "     <ORB_ID> (mandatory) The Orb under test unique ID for the Circle CI Orb Registry of the form <namesapce>/<orb name>@<orb version>"
  echo "=== "
}

export ORB_PROJECT_ROOT=$(pwd)
export INT_TEST_TEMP_DIR=${ORB_PROJECT_ROOT}/tests/temp
export TEST_REPO=$1
export GIT_BRANCH_PREFIX=$2
export ORB_ID=$3
export ORB_VERSION=$(echo "${ORB_ID}" | awk -F ':' '{print $2}')
export GIT_BRANCH="${GIT_BRANCH_PREFIX}-on-orb-version-${ORB_VERSION}"

if [ "x${TEST_REPO}" == "${TEST_REPO}" ]; then
   echo "You did not provide any argument to [$0] : the SSH URI of the git repo on which to run this Orb Int. Test "
   Usage
   exit 1
fi;

if [ "x${GIT_BRANCH_PREFIX}" == "${GIT_BRANCH_PREFIX}" ]; then
   echo "You did not provide the required second argument to [$0] : the git branch prefix for all branches on which to run this Orb Int. Tests"
   Usage
   exit 2
fi;

if [ "x${ORB_ID}" == "${ORB_ID}" ]; then
   echo "You did not provide the required third argument to [$0] : The Orb under test ID  "
   Usage
   exit 2
fi;

echo "Orbinoid Integration Test is running from the [${ORB_PROJECT_ROOT}] folder"


if ![ -d ${ORB_PROJECT_ROOT}/src ]; then
   echo "[$0] - The ${ORB_PROJECT_ROOT}/src does not exists. Are you sure you are running [$0] from the Orb Project root ?"
   Usage
   exit 3
fi;

if ![ -d ${ORB_PROJECT_ROOT}/src/tests ]; then
   echo "[$0] - The ${ORB_PROJECT_ROOT}/src/tests does not exists. Are you sure you are running [$0] from the Orb Project root ?"
   Usage
   exit 3
fi;

if ![ -d ${ORB_PROJECT_ROOT}/src/tests/git-repo ]; then
   echo "[$0] - The ${ORB_PROJECT_ROOT}/src/tests/git-repo does not exists. Are you sure you are running [$0] from the Orb Project root ?"
   Usage
   exit 3
fi;

if ![ -d ${ORB_PROJECT_ROOT}/src/orb.yml ]; then
   echo "[$0] - The ${ORB_PROJECT_ROOT}/src/orb.yml does not exists. Are you sure you are running [$0] from the Orb Project root ?"
   Usage
   exit 3
fi;


if [ -d ${INT_TEST_TEMP_DIR} ]; then
  echo "[${INT_TEST_TEMP_DIR}] already exists. Tearing it down to setup up test environment."
  rm -fr ${INT_TEST_TEMP_DIR}
fi;

mkdir -p ${INT_TEST_TEMP_DIR}

git clone ${TEST_REPO} ${INT_TEST_TEMP_DIR}

cd ${INT_TEST_TEMP_DIR}

git checkout ${INT_TEST_TEMP_DIR}

cp -fR ${ORB_PROJECT_ROOT}/src/tests/git-repo/* ${INT_TEST_TEMP_DIR}

echo "Running Orbinoid Integration Test for the [${ORB_ID}] CircleCI Orb"

git add --all && git commit -m "[${ORB_ID}] Orbinoid Integration Test" && git push -u origin HEAD
