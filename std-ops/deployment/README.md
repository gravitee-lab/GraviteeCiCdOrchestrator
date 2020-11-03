# Gravitee CI CD Orchestrator


## Setup in https://gthub.com/gravitee-io Github Organization

Left todos :

* release the `gravitee-io/gravitee@dev:1.0.1`




#### Initialize the Secrets


* Using your Secrethub user, and the below commands, you will create the secrethub secrets, for the Graviteebot

```bash
# --
# ENV. VARS
export SECRETHUB_ORG=gravitee-io
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/user"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh"


# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
#            Git user name and email of               #
#                 the Gravitee.io Bot                 #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #

# --- #
# https://github.com/graviteeio is the Github User of the Gravitee.io Bot
# --- #
export GIT_USER_NAME="graviteeio"
export GIT_USER_EMAIL="graviteeio-bot@gravitee.io"

echo "${GIT_USER_NAME}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/user/name"
echo "${GIT_USER_EMAIL}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/user/email"

# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
#        GPG Key Pair of the Gravitee.io Bot          #
#                for Github SSH Service               #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #

export GRAVITEEBOT_GPG_USER_NAME="Jean-Baptiste Lasselle"
export GRAVITEEBOT_GPG_USER_EMAIL="jean.baptiste.lasselle@gmail.com"

export GRAVITEEBOT_GPG_USER_NAME="Graviteebot.io"
export GRAVITEEBOT_GPG_USER_EMAIL="graviteeio-bot@gravitee.io"

export GRAVITEEBOT_GPG_USER_NAME="Graviteelab-bot.io"
export GRAVITEEBOT_GPG_USER_EMAIL="graviteelab-bot@graviteelab.io"


read -p "Create a GPG KEY for the Gravitee.io bot with username [${GRAVITEEBOT_GPG_USER_NAME}] and email [${GRAVITEEBOT_GPG_USER_EMAIL}], then hit the enter Key to proceed secrets initalization"

export GPG_SIGNING_KEY=$(gpg --list-signatures -a "${GRAVITEEBOT_GPG_USER_NAME} <${GRAVITEEBOT_GPG_USER_EMAIL}>" | grep 'sig' | tail -n 1 | awk '{print $2}')
echo "GPG_SIGNING_KEY=${GPG_SIGNING_KEY}"

export GPG_PUB_KEY_FILE="./graviteebot.gpg.pub.key"
export GPG_PRIVATE_KEY_FILE="./graviteebot.gpg.priv.key"

# --- #
# saving
gpg --export -a "${GRAVITEEBOT_GPG_USER_NAME} <${GRAVITEEBOT_GPG_USER_EMAIL}>" | tee ${GPG_PUB_KEY_FILE}
# -- #
# Will be interactive for private key : you
# will have to type your GPG password
gpg --export-secret-key -a "${GRAVITEEBOT_GPG_USER_NAME} <${GRAVITEEBOT_GPG_USER_EMAIL}>" | tee ${GPG_PRIVATE_KEY_FILE}

secrethub write --in-file ${GPG_PUB_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg/pub_key"
secrethub write --in-file ${GPG_PRIVATE_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg/private_key"

echo "${GRAVITEEBOT_GPG_USER_NAME}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg/user_name"
echo "${GRAVITEEBOT_GPG_USER_EMAIL}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg/user_email"
echo "${GPG_SIGNING_KEY}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg/signing_key"



# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
#        SSH RSA Key Pair of the Gravitee.io Bot      #
#                for Github SSH Service               #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #


export LOCAL_SSH_PUBKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa.pub
export LOCAL_SSH_PRVIKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa
# --- #
# https://github.com/graviteeio is the Github User of the Gravitee.io Bot
# --- #
export ROBOTS_ID=graviteeio

export LE_COMMENTAIRE_DE_CLEF="[$ROBOTS_ID]-cicd-bot@github.com"
# --- #
# Is it extremely important that the Private Key passphrase is empty, for
# the Key Pair to be used as SSH Key with Github.com Git Service
# --- #
export PRIVATE_KEY_PASSPHRASE=''

mkdir -p ${HOME}/.ssh.cicd.graviteebot
ssh-keygen -C "${LE_COMMENTAIRE_DE_CLEF}" -t rsa -b 4096 -f ${LOCAL_SSH_PRVIKEY} -q -P "${PRIVATE_KEY_PASSPHRASE}"

sudo chmod 700 ${HOME}/.ssh.cicd.graviteebot
sudo chmod 644 ${LOCAL_SSH_PUBKEY}
sudo chmod 600 ${LOCAL_SSH_PRVIKEY}

secrethub write --in-file ${LOCAL_SSH_PUBKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/public_key"
secrethub write --in-file ${LOCAL_SSH_PRVIKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/private_key"

secrethub account inspect

# --- #
```
