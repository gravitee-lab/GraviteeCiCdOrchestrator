#!/bin/sh

export CONTAINER_OPS_HOME=$(pwd)
# ---
sed -i "s#GH_ORG=.*#GH_ORG=${GH_ORG}#g" ./.env
sed -i "s#SECRETHUB_ORG=.*#SECRETHUB_ORG=${SECRETHUB_ORG}#g" ./.env
sed -i "s#SECRETHUB_REPO=.*#SECRETHUB_REPO=${SECRETHUB_REPO}#g" ./.env
sed -i "s#MAVEN_PROFILE_ID=.*#MAVEN_PROFILE_ID=${MAVEN_PROFILE_ID}#g" ./.env
sed -i "s#CIRCLE_BUILD_URL=.*#CIRCLE_BUILD_URL=${CIRCLE_BUILD_URL}#g" ./.env
sed -i "s#CICD_PROCESS_MANIFEST_PATH=.*#CICD_PROCESS_MANIFEST_PATH=${CICD_PROCESS_MANIFEST_PATH}#g" ./.env

echo ''
echo 'Content of DOTENV [./.env] file'
echo ''
ls -allh ./.env
cat ./.env
source ./.env

# ------------------------------------------- #
#           SECRETHUB CREDENTIAL              #
# ------------------------------------------- #
#
# export SECRETHUB_CREDENTIAL=${SECRETHUB_CREDENTIAL}
# export SECRETHUB_CREDENTIAL=$(cat ./.secrethub.credential)
mkdir -p ${HOME}/.secrethub
cp ./.secrethub.credential ${HOME}/.secrethub/
cp ${HOME}/.secrethub/.secrethub.credential ${HOME}/.secrethub/credential
rm ${HOME}/.secrethub/.secrethub.credential
rm ./.secrethub.credential

echo "Secrethub CLI installed :"
secrethub --version

# ------------------------------------------- #
#               GIT CONFIG                    #
# ------------------------------------------- #
export GIT_SSH_COMMAND='ssh -i ~/.ssh.gravitee.io/id_rsa'
./git_config.sh

# ------------------------
# Git ignore the files which should not be
# commited and pushed to the release git repo
# ------------------------
# We need a .gitignore to ignore all the secrets used by the CICD System
# git ignores everything inside the [.circleci/] folder, except
export CHECK_GITIGNORE=$(cat ./.gitignore | grep -wE '^.circleci/\*\*/\*$')
if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [.circleci/**/*] into [.gitignore]"
  echo '# -- Cicd : Git ignore the [.circleci/**/*] which contains' | tee -a ./.gitignore
  echo '# files which do not need to be commited (password to artifactory)' | tee -a ./.gitignore
  echo '.circleci/**/*' | tee -a ./.gitignore
else
  echo "I do not need to add [.circleci/**/*] into [.gitignore], it's already there"
fi;
# git ignores everything inside the [.circleci/] folder, except the config.yml
export CHECK_GITIGNORE=$(cat ./.gitignore | grep -wE '^!' | grep '.circleci/config.yml')
if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [!./.circleci/config.yml] into [.gitignore]"
  echo '# -- Cicd : Do not git ignore the [!./.circleci/config.yml] which contains' | tee -a ./.gitignore
  echo '# the pipeline definition' | tee -a ./.gitignore
  echo '!./.circleci/config.yml' | tee -a ./.gitignore
else
  echo "I do not need to add [!./.circleci/config.yml] into [.gitignore], it's already there"
fi;

export CHECK_GITIGNORE=$(cat ./.gitignore | grep 'gpg.script.snippet.sh')
if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [gpg.script.snippet.sh] into [.gitignore]"
  echo '# -- Cicd : Git ignore the [gpg.script.snippet.sh] which contains' | tee -a ./.gitignore
  echo '# secrets (password to artifactory)' | tee -a ./.gitignore
  echo 'gpg.script.snippet.sh' | tee -a ./.gitignore
else
  echo "I do not need to add [gpg.script.snippet.sh] into [.gitignore], it's already there"
fi;


export CHECK_GITIGNORE=$(cat ./.gitignore | grep 'graviteebot.gpg.priv.key')
if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [graviteebot.gpg.priv.key] into [.gitignore]"
  echo "# -- Cicd : The [graviteebot.gpg.priv.key] file contains secrets " | tee -a ./.gitignore
  echo "# which should not be commited" | tee -a ./.gitignore
  echo 'graviteebot.gpg.priv.key' | tee -a ./.gitignore
else
  echo "I do not need to add [graviteebot.gpg.priv.key] into [.gitignore], it's already there"
fi;

export CHECK_GITIGNORE=$(cat ./.gitignore | grep 'graviteebot.gpg.pub.key')
if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [graviteebot.gpg.pub.key] into [.gitignore]"
  echo "# -- Cicd : The [.secrethub.credential] file contains secrets " | tee -a ./.gitignore
  echo "# which should not be commited" | tee -a ./.gitignore
  echo 'graviteebot.gpg.pub.key' | tee -a ./.gitignore
else
  echo "I do not need to add [graviteebot.gpg.pub.key] into [.gitignore], it's already there"
fi;

export CHECK_GITIGNORE=$(cat ./.gitignore | grep 'graviteebot')

if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [graviteebot] into [.gitignore]"
  echo "# -- Cicd : The [graviteebot] folder contains secrets " | tee -a ./.gitignore
  echo "# which should not be commited" | tee -a ./.gitignore
  echo 'graviteebot' | tee -a ./.gitignore
else
  echo "I do not need to add [graviteebot] into [.gitignore], it's already there"
fi;

export CHECK_GITIGNORE=$(cat ./.gitignore | grep '.secrets.json')

if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [.secrets.json] into [.gitignore]"
  echo "# -- Cicd : The [.secrets.json] file contains secrets " | tee -a ./.gitignore
  echo "# which should not be commited" | tee -a ./.gitignore
  echo '.secrets.json' | tee -a ./.gitignore
else
  echo "I do not need to add [.secrets.json] into [.gitignore], it's already there"
fi;

export CHECK_GITIGNORE=$(cat ./.gitignore | grep '.secrethub.credential')

if [ "x${CHECK_GITIGNORE}" == "x" ]; then
  echo "I need to add [.secrethub.credential] into [.gitignore]"
  echo "# -- Cicd : The [.secrethub.credential] file contains secrets " | tee -a ./.gitignore
  echo "# which should not be commited" | tee -a ./.gitignore
  echo '.secrethub.credential' | tee -a ./.gitignore
else
  echo "I do not need to add [.secrethub.credential] into [.gitignore], it's already there"
fi;


# ------------------------


echo '------------------------------------------'
echo 'Checking the git global configuration :'
echo '------------------------------------------'
cd ./pipeline/
git config --global --list
echo '------------------------------------------'
echo 'Checking the git local configuration :'
echo '------------------------------------------'
git config --list
echo '------------------------------------------'
echo ''
cd ${CONTAINER_OPS_HOME}


echo ''
echo ''
echo "Starting Orchestrator on [${PRODUCT}]"
echo ''
echo 'Script invocation passed arguments are :'
for var in "$@"
do
    echo "$var"
done
echo ''
echo 'Start command is :'
echo ''
echo "[npm start $@]"
echo ''
npm start $@
