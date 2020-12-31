#!/bin/sh

export CONTAINER_OPS_HOME=$(pwd)
# ---
sed -i "s#GH_ORG=.*#GH_ORG=${GH_ORG}#g" ./.env
sed -i "s#SECRETHUB_ORG=.*#SECRETHUB_ORG=${SECRETHUB_ORG}#g" ./.env
sed -i "s#SECRETHUB_REPO=.*#SECRETHUB_REPO=${SECRETHUB_REPO}#g" ./.env

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
cp ./.secrethub.credential ${HOME}/.secrethub
echo "Secrethub CLI installed :"
secrethub --version

# ------------------------------------------- #
#               GIT CONFIG                    #
# ------------------------------------------- #

./git_config.sh
# Git ignore the files which should not be commit pushed to the release git repo
echo '.circleci/gpg.script.snippet.sh' >> ./pipeline/.gitignore
echo 'graviteebot/.secrets/.gungpg/graviteebot.gpg.priv.key' >> ./pipeline/.gitignore
echo 'graviteebot/.secrets/.gungpg/graviteebot.gpg.pub.key' >> ./pipeline/.gitignore
echo '.secrets.json' >> ./pipeline/.gitignore
echo ''
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
