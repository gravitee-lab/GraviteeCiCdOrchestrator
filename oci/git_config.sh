#!/bin/bash


echo " [--------------------------------------------------------------------------------] "
echo "   Running [$0] with Secret Hub Org name [${SECRETHUB_ORG}] " >> check.secretconf
echo "   Running [$0] with Secret Hub Repo name [${SECRETHUB_REPO}] " >> check.secretconf
echo "   Running [$0] with Secret Hub Org name [${SECRETHUB_ORG}] "
echo "   Running [$0] with Secret Hub Repo name [${SECRETHUB_REPO}] "
cat check.secretconf
rm  check.secretconf
echo " [--------------------------------------------------------------------------------] "
# ---
# ---
# +++ ++++++++++++++++ +++ #
# +++ The GPG Identity +++ #
# +++ ++++++++++++++++ +++ #
export GPG_BOT_SECRETS_RESTORED=$(pwd)/graviteebot/.secrets/
mkdir -p ${GPG_BOT_SECRETS_RESTORED}/.gungpg

export RESTORED_GPG_PUB_KEY_FILE="${GPG_BOT_SECRETS_RESTORED}/.gungpg/graviteebot.gpg.pub.key"
export RESTORED_GPG_PRIVATE_KEY_FILE="${GPG_BOT_SECRETS_RESTORED}/.gungpg/graviteebot.gpg.priv.key"

secrethub read --out-file ${RESTORED_GPG_PUB_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/pub_key"
secrethub read --out-file ${RESTORED_GPG_PRIVATE_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/private_key"

# ---
# The Signing key ID
export GRAVITEEBOT_GPG_SIGNING_KEY_ID=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/key_id")

export NON_ROOT_USER_NAME=$(whoami)
# ---
# The GnuPG SNIPPET
cat <<EOF>>./.circleci/gpg.script.snippet.sh
#!/bin/bash
echo "# --------------------- #"
export RESTORED_GPG_PUB_KEY_FILE="${GPG_BOT_SECRETS_RESTORED}/.gungpg/graviteebot.gpg.pub.key"
export RESTORED_GPG_PRIVATE_KEY_FILE="${GPG_BOT_SECRETS_RESTORED}/.gungpg/graviteebot.gpg.priv.key"
echo "# --------------------- #"
echo "Content of [\\\${GPG_BOT_SECRETS_RESTORED}/.gungpg]=[${GPG_BOT_SECRETS_RESTORED}/.gungpg] (are the keys there ?)" :
ls -allh ${GPG_BOT_SECRETS_RESTORED}/.gungpg
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

# ---
# now we trust ultimately the Public Key in the Ephemeral Context,
export GRAVITEEBOT_GPG_SIGNING_KEY_ID=${GRAVITEEBOT_GPG_SIGNING_KEY_ID}
echo "GRAVITEEBOT_GPG_SIGNING_KEY_ID=[\${GRAVITEEBOT_GPG_SIGNING_KEY_ID}]"

echo -e "5\\ny\\n" |  gpg --command-fd 0 --expert --edit-key \${GRAVITEEBOT_GPG_SIGNING_KEY_ID} trust

echo "# --------------------- #"
echo "# --- OK READY TO SIGN"
echo "# --------------------- #"
EOF


Usage() {
  echo " [--------------------------------------------------------------------------------] "
  echo "    The [$0] script runs the git config for the bot userin your pipeline "
  echo " [--------------------------------------------------------------------------------] "
  echo "    Usage :  "
  echo " [--------------------------------------------------------------------------------] "
  echo "        $0 "
  echo " [--------------------------------------------------------------------------------] "
  echo "    Environment Variables : "
  echo " [--------------------------------------------------------------------------------] "
  echo "  SECRETHUB_ORG (Required) The name of the Secrethub Org from which Secrets have to be fetched"
  echo "  SECRETHUB_REPO (Required) The name of the Secrethub Repo from which Secrets have to be fetched"
  echo " [--------------------------------------------------------------------------------] "
}

Info() {
  echo " [--------------------------------------------------------------------------------] "
  echo "   Running [$0] with Secret Hub Org name [${SECRETHUB_ORG}] "
  echo "   Running [$0] with Secret Hub Repo name [${SECRETHUB_REPO}] "
  echo " [--------------------------------------------------------------------------------] "
}

# -------------------------------------------------------------------------------- #
# -------------------------------------------------------------------------------- #
# -                        GPG CONFIG FOR THE GRAVITEE BOT                       - #
# -------------------------------------------------------------------------------- #
# -------------------------------------------------------------------------------- #
chmod +x ./.circleci/gpg.script.snippet.sh
# ./.circleci/gpg.script.snippet.sh

# -------------------------------------------------------------------------------- #
# -------------------------------------------------------------------------------- #
# -                        GIT CONFIG FOR THE GRAVITEE BOT                       - #
# -------------------------------------------------------------------------------- #
# -------------------------------------------------------------------------------- #

if [ "x${SECRETHUB_ORG}" == "x" ]; then
  echo "[$0 - setupSSHGithubUser] You did not set the [SECRETHUB_ORG] env. var."
  Usage
  exit 1
fi;
if [ "x${SECRETHUB_REPO}" == "x" ]; then
  echo "[$0 - setupSSHGithubUser] You did not set the [SECRETHUB_REPO] env. var."
  Usage
  exit 1
fi;
echo "[$0 - setupSSHGithubUser] [SECRETHUB_ORG=[${SECRETHUB_ORG}]] "
echo "[$0 - setupSSHGithubUser] [SECRETHUB_REPO=[${SECRETHUB_REPO}]] "

export GIT_USER_NAME=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/name)
export GIT_USER_EMAIL=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/email)
export LOCAL_SSH_PUBKEY="${HOME}/.ssh.gravitee.io/id_rsa.pub"
export LOCAL_SSH_PRVIKEY="${HOME}/.ssh.gravitee.io/id_rsa"
export GIT_SSH_COMMAND='ssh -i ~/.ssh.gravitee.io/id_rsa'
mkdir -p "${HOME}/.ssh.gravitee.io/"
secrethub read --out-file ${LOCAL_SSH_PUBKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/public_key"
secrethub read --out-file ${LOCAL_SSH_PRVIKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/private_key"
chmod 700 "${HOME}/.ssh.gravitee.io/"
chmod 644 "${LOCAL_SSH_PUBKEY}"
chmod 600 "${LOCAL_SSH_PRVIKEY}"
ssh-add -D
ssh-add "${LOCAL_SSH_PRVIKEY}"

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
  echo "[$0 - setupSSHGithubUser] The [GIT_USER_EMAIL] env. var. was not properly set from secret manager"
  Usage
  exit 1
fi;
if [ "x${GIT_USER_SIGNING_KEY}" == "x" ]; then
  echo "[$0 - setupSSHGithubUser] the [GIT_USER_SIGNING_KEY] env. var. was not set, So [${GIT_USER_NAME}]] won't be signed"
  git config --global commit.gpgsign false
else
  echo "[$0 - setupSSHGithubUser] [${GIT_USER_NAME}] commits will be signed with signature [${GIT_USER_SIGNING_KEY}]"
  git config --global commit.gpgsign true
  git config --global user.signingkey ${GIT_USER_SIGNING_KEY}
fi;

echo "[$0 - setupSSHGithubUser] skipped almost everything else, and stripped out function "
# export SSH_PRIVATE_KEY=$(echo "$GIT_SSH_COMMAND" | awk '{print $3}' | sed "s#~#${HOME}#g")
git config --global user.name "${GIT_USER_NAME}"
git config --global user.email "${GIT_USER_EMAIL}"
# git config --global --list
echo "[$0 - setupSSHGithubUser] completed "
