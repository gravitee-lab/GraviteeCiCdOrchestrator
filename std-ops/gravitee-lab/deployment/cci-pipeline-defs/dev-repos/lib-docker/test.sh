#!/bin/bash

set -x

# --
export MAVEN_VERSION=${MAVEN_VERSION:-"3.6.3"}
export OPENJDK_VERSION=${OPENJDK_VERSION:-"11"}
export OCI_REPOSITORY_ORG=${OCI_REPOSITORY_ORG:-"quay.io/gravitee-lab"}
export OCI_REPOSITORY_NAME=${OCI_REPOSITORY_NAME:-"cicd-maven"}


export GITHUB_ORG=${GITHUB_ORG:-"gravitee-lab"}
export OCI_VENDOR=gravitee.io
export CCI_USER_UID=$(id -u)
export CCI_USER_GID=$(id -g)
# [runMavenShellScript] - Will Run Maven Shell Script with CCI_USER_UID=[1001]
# [runMavenShellScript] - Will Run Maven Shell Script with CCI_USER_GID=[1002]
# export CCI_USER_UID=1001
# export CCI_USER_GID=1002
export NON_ROOT_USER_UID=${CCI_USER_UID}
export NON_ROOT_USER_NAME=$(whoami)
export NON_ROOT_USER_GID=${CCI_USER_GID}
export NON_ROOT_USER_GRP=${NON_ROOT_USER_NAME}


# -------------------------------------------------------------------------------- #
# -------------------------------------------------------------------------------- #
# -----------                         TEST DOCKER IMAGE                  --------- #
# -------------------------------------------------------------------------------- #
# -------------------------------------------------------------------------------- #
# This scriptpurpose isto test all use cases of the built docker image
# from simple maven commands,to rnning a maven goal on a repository acutally used by the dev. team


# checking docker image built in previous step is there
docker images


# [gravitee-lab/cicd-maven/staging/docker/quay/botuser/username]
# and
# [gravitee-lab/cicd-maven/staging/docker/quay/botoken/token]
# --> are to be set with secrethub cli, and 2 Circle CI Env. Var. have to
# be set for [Secrethub CLI Auth], at project, or context level
export SECRETHUB_ORG=${SECRETHUB_ORG:-"gravitee-lab"}
export SECRETHUB_REPO=${SECRETHUB_REPO:-"cicd"}

export IMAGE_TAG_LABEL=$(docker inspect --format '{{ index .Config.Labels "oci.image.tag"}}' "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest")
export GH_ORG_LABEL=$(docker inspect --format '{{ index .Config.Labels "cicd.github.org"}}' "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest")
export NON_ROOT_USER_NAME_LABEL=$(docker inspect --format '{{ index .Config.Labels "oci.image.nonroot.user.name"}}' "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest")
export NON_ROOT_USER_GRP_LABEL=$(docker inspect --format '{{ index .Config.Labels "oci.image.nonroot.user.group"}}' "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest")

echo " IMAGE_TAG_LABEL=[${IMAGE_TAG_LABEL}]"
echo " GH_ORG_LABEL=[${GH_ORG_LABEL}]"
echo " NON_ROOT_USER_NAME_LABEL=[${NON_ROOT_USER_NAME_LABEL}]"
echo " NON_ROOT_USER_GRP_LABEL=[${NON_ROOT_USER_GRP_LABEL}]"

# Test no.1
echo "# Test no.1"
docker run -it --name testofimage --entrypoint="" -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" ./test
# Test no.2
echo "# Test no.2"
docker run -it --name testofimage --entrypoint="" --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" /home/test
# Test no.3
echo "# Test no.3"
docker run -it --name testofimage --entrypoint="" --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" mvn --version
# Test no.4
echo "# Test no.4"
git clone https://github.com/gravitee-lab/gravitee-repository ./let_say_here
# First, we need the [settings.xml] file containing the maven profiles secrets
docker run -it --name testofimage --entrypoint="" --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" mvn clean install
# Test no.5
echo "# Test no.5"
docker run -it --name testofimage --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" mvn clean install
# Test no.6
echo "# Test no.6"
docker run -it --name testofimage --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ clean install
# Test no.7
echo "# Test no.7"
docker run -it --name testofimage --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ clean test
# Test no.8
echo "# Test no.8"
export MAVEN_PROFILE_ID=gravitee-dry-run
secrethub read --out-file ./let_say_here/settings.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/settings.xml"
export MAVEN_COMMAND="mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ -s ./settings.xml -B -U -P ${MAVEN_PROFILE_ID} clean test"
docker run -it --name testofimage --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" ${MAVEN_COMMAND}


# Test no.9 :
# Absolutely exactly what is executed with the [gravitee-io/gravitee@dev:1.0.2] Circle CI Orb
echo "# Test no.9"
echo "# Absolutely exactly what is executed with the [gravitee-io/gravitee@dev:1.0.2] Circle CI Orb"
export MAVEN_PROFILE_ID=gravitee-dry-run
# secrethub read --out-file ./let_say_here/settings.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/settings.xml"



mkdir -p ./let_say_here/.circleci
cat <<EOF>>./let_say_here/.circleci/mvn.run.tests.sh
#!/bin/bash
mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ -s ./settings.xml -B -U -P ${MAVEN_PROFILE_ID} clean test
export MVN_EXIT_CODE=\$?
echo "[\$0] The exit code of the [mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ -s ./settings.xml -B -U -P ${MAVEN_PROFILE_ID} clean test] maven command is [\${MVN_EXIT_CODE}] "
if ! [ "\${MVN_EXIT_CODE}" == "0" ]; then
  echo "[\$0] The exit code of the [mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ -s ./settings.xml -B -U -P ${MAVEN_PROFILE_ID} clean test] maven command is [\${MVN_EXIT_CODE}], so not zero "
  exit \${MVN_EXIT_CODE}
fi;
EOF
echo "Content of the [./let_say_here/.circleci/mvn.run.tests.sh] script : "
cat ./let_say_here/.circleci/mvn.run.tests.sh
echo "Now running tests"
chmod +x ./let_say_here/.circleci/mvn.run.tests.sh
docker run -it --name testofimage --rm --user ${CCI_USER_UID}:${CCI_USER_GID} -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" ./.circleci/mvn.run.tests.sh
# runMavenShellScript ./let_say_here/.circleci/mvn.run.tests.sh


# Test no.10 :
# Test GPG Signature with the [gravitee-io/gravitee@dev:1.0.2] Circle CI Orb
export SECRETS_VOLUME=$(pwd)/graviteebot/.secrets/
mkdir -p ${SECRETS_VOLUME}/.gungpg

export RESTORED_GPG_PUB_KEY_FILE="${SECRETS_VOLUME}/.gungpg/graviteebot.gpg.pub.key"
export RESTORED_GPG_PRIVATE_KEY_FILE="${SECRETS_VOLUME}/.gungpg/graviteebot.gpg.priv.key"

secrethub read --out-file ${RESTORED_GPG_PUB_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/pub_key"
secrethub read --out-file ${RESTORED_GPG_PRIVATE_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/private_key"

mkdir -p ./let_say_here/.circleci
cat <<EOF>>./let_say_here/.circleci/gpg.run.tests.sh
#!/bin/bash
export SECRETS_HOME=/home/$NON_ROOT_USER_NAME/.secrets
export RESTORED_GPG_PUB_KEY_FILE="\${SECRETS_HOME}/.gungpg/graviteebot.gpg.pub.key"
export RESTORED_GPG_PRIVATE_KEY_FILE="\${SECRETS_HOME}/.gungpg/graviteebot.gpg.priv.key"
echo "# --------------------- #"
echo "Content of [\\\${SECRETS_HOME}/.gungpg]=[\${SECRETS_HOME}/.gungpg] (are the keys there in the container ?)" :
ls -allh \${SECRETS_HOME}/.gungpg
echo "# --------------------- #"

export EPHEMERAL_KEYRING_FOLDER_ZERO=\$(mktemp -d)
chmod 700 \${EPHEMERAL_KEYRING_FOLDER_ZERO}
export GNUPGHOME=\${EPHEMERAL_KEYRING_FOLDER_ZERO}
echo "GPG Keys before import : "
gpg --list-keys

# ---
# Importing GPG KeyPair
gpg --batch --import \${RESTORED_GPG_PRIVATE_KEY_FILE}
gpg --import \${RESTORED_GPG_PUB_KEY_FILE}
echo "# --------------------- #"
echo "GPG Keys after import : "
gpg --list-keys
echo "# --------------------- #"
echo "  GPG version is :"
echo "# --------------------- #"
gpg --version
echo "# --------------------- #"

EOF
echo "Content of the [./let_say_here/.circleci/gpg.run.tests.sh] script : "
cat ./let_say_here/.circleci/gpg.run.tests.sh
echo "Now running GPG tests"
chmod +x ./let_say_here/.circleci/gpg.run.tests.sh

export C_VOLUMES="-v $(pwd)/graviteebot/.secrets:/home/$NON_ROOT_USER_NAME/.secrets -v "$PWD/let_say_here":/usr/src/giomaven_project -v "$HOME/.m2":/home/${NON_ROOT_USER_NAME_LABEL}/.m2"
docker run -it --name testofimage --rm --user ${CCI_USER_UID}:${CCI_USER_GID} "${C_VOLUMES}" -e MAVEN_CONFIG=/home/${NON_ROOT_USER_NAME_LABEL}/.m2 -w /usr/src/giomaven_project "${OCI_REPOSITORY_ORG}/${OCI_REPOSITORY_NAME}:stable-latest" ./let_say_here/.circleci/gpg.run.tests.sh
