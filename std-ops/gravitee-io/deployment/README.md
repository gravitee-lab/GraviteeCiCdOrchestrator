# Gravitee CI CD Orchestrator


## Setup in https://gthub.com/gravitee-io Github Organization

Left todos :

* release the `gravitee-io/gravitee@dev:1.0.1` : test it in `gravitee-lab` for last ops in mvn release, then validate pull request 4
* deploy to gravitee-io the pipeline `.circleci/config.yml` to all gravitee dev repos
* setup run environement for the `Gravitee CI CD Orchestrator` in https://github.com/gravitee-io :
  * in https://github.com/gravitee-io/release, git commit and push [the `.circleci/config.yml` pipeline definition](./cci-pipeline-defs/release/.circleci/config.yml) on all `*.*.x` Branches and master : doing that with
  * create for org gravitee-io , the Circle CI _context_ `cicd-orchestrator`, and in that context :
    * create env. var `SECRETHUB_CREDENTIAL` (with value of the secrethub service account token created [here](#initialize-the-secrets) )
    * create env.var. `GRVT33_GH_ORG` with value `gravitee-io`


#### Initialize the Secrets


* Using your Secrethub user, and the below commands, you will create the secrethub service account to integrate Circle Ci ans secrethub :


```bash
# --
# ENV. VARS
export SECRETHUB_ORG=gravitee-io
export SECRETHUB_ORG=graviteeio
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}
# --- #
# created a service account
secrethub service init "${SECRETHUB_ORG}/${SECRETHUB_REPO}" --description "Circle CI Gravitee.io Bot Service Account for Gravitee CI CD" --permission read | tee ./.the-created.service.token
secrethub service ls "${SECRETHUB_ORG}/${SECRETHUB_REPO}"
echo "Beware : you will see the service token only once, then you will not ever be able to see it again, don'tloose it (or create another)"
# --- #
# and give the service accoutn access to all directories and secrets in the given repo, with the option :
# --- #
# finally, in Circle CI, you created a 'cicd-orchestrator' context in the [gravitee-io] organization
# dedicated to the Gravitee Ci CD Orchestrator application
# and in that 'cicd-orchestrator' Circle CI context, you set the 'SECRETHUB_CREDENTIAL' env. var. with
# value the token of the service account you just created


# saving service account token
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/secrethub-svc-account"
cat ./.the-created.service.token | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/secrethub-svc-account/token"


# --- CREATE THE CIRCLE CI SECRET
echo "<circleci user token value>" > ./.circleci.token
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api"
cat ./.circleci.token | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token"

```

* `secrethub signup`
* create secrethub org `graviteeio`
* Give Devops Team Leader JB read write permissions on all secrets in the Secrethub `${SECRETHUB_ORG}/${SECRETHUB_REPO}` secrethub repo :

```bash

export TEAM_MATE_SECRETHUB_USERNAME=<username>
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd
# invite into org
secrethub org invite ${SECRETHUB_ORG} ${TEAM_MATE_SECRETHUB_USERNAME}
# invite into repo
secrethub org invite ${SECRETHUB_ORG}/${SECRETHUB_REPO} ${TEAM_MATE_SECRETHUB_USERNAME}
# give permissions to ${TEAM_MATE_SECRETHUB_USERNAME} on the whole secrethub repo ${SECRETHUB_ORG}/${SECRETHUB_REPO}
secrethub acl ${SECRETHUB_ORG}/${SECRETHUB_REPO} ${TEAM_MATE_SECRETHUB_USERNAME} write
```

* [x] `${TEAM_MATE_SECRETHUB_USERNAME}` Creates the secret file used by the `Gravitee CI CD Orchestrator`, containing the Circle CI Token to use to trigger Pipelines in the https://github.com/gravitee-io Github Org :

```bash
export CCI_SECRET_FILE=$PWD/.secrets.json
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd

export CIRCLECI_TOKEN=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token)

echo "{" | tee -a ${CCI_SECRET_FILE}
echo "  \"circleci\": {" | tee -a ${CCI_SECRET_FILE}
echo "    \"auth\": {" | tee -a ${CCI_SECRET_FILE}
echo "      \"username\": \"Graviteeio Bot\"," | tee -a ${CCI_SECRET_FILE}
echo "      \"token\": \"${CIRCLECI_TOKEN}\"" | tee -a ${CCI_SECRET_FILE}
echo "    }" | tee -a ${CCI_SECRET_FILE}
echo "  }" | tee -a ${CCI_SECRET_FILE}
echo "}" | tee -a ${CCI_SECRET_FILE}


secrethub write --in-file ${CCI_SECRET_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/.secret.json"

```
* [ ] `${TEAM_MATE_SECRETHUB_USERNAME}` Changes the `.circleci/config.yml` defined for the `Gravitee CI CD Orchestrator` with the secret read :

```bash
secrethub read --out-file ${CCI_SECRET_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/.secret.json"

```
* [ ] `${TEAM_MATE_SECRETHUB_USERNAME}` git commit and push `.circleci/config.yml` on git branches :

```bash
- 1.20.x
- 1.25.x
- 1.29.x
- 1.30.x
- 3.0.0-beta
- 3.0.x
- 3.1.x
- 3.2.x
- master
```

* [ ] And `${TEAM_MATE_SECRETHUB_USERNAME}` triggers the the `Gravitee CI CD Orchestrator`, in the https://github.com/gravitee-io Github Org , with a `curl` :

```bash
export CCI_TOKEN=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token)
export ORG_NAME="gravitee-io"
export REPO_NAME="release"
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"dry_release\",
    }

}"

curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline
```


#### More Secrets

* Using your Secrethub user, and the below commands, you will create the secrethub secrets, for the Graviteebot

```bash
# --
# ENV. VARS
export SECRETHUB_ORG=gravitee-io
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh"


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

echo "${GIT_USER_NAME}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/name"
echo "${GIT_USER_EMAIL}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/email"

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

export GRAVITEEBOT_GPG_USER_NAME="Gravitee.io Bot"
export GRAVITEEBOT_GPG_USER_EMAIL="contact@gravitee.io"

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

secrethub write --in-file ${GPG_PUB_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg/pub_key"
secrethub write --in-file ${GPG_PRIVATE_KEY_FILE} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg/private_key"

echo "${GRAVITEEBOT_GPG_USER_NAME}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg/user_name"
echo "${GRAVITEEBOT_GPG_USER_EMAIL}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg/user_email"
echo "${GPG_SIGNING_KEY}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg/signing_key"



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

secrethub write --in-file ${LOCAL_SSH_PUBKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/public_key"
secrethub write --in-file ${LOCAL_SSH_PRVIKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/private_key"


secrethub account inspect

# --- #
```
* then anywhere, to restore the Gravitee.io Bot SSH Key pair :

```bash
export LOCAL_SSH_PUBKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa.pub
export LOCAL_SSH_PRVIKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa
mkdir -p ${HOME}/.ssh.cicd.graviteebot
secrethub read --out-file ${LOCAL_SSH_PUBKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/public_key"
secrethub read --out-file ${LOCAL_SSH_PRVIKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/private_key"
sudo chmod 700 ${HOME}/.ssh.cicd.graviteebot
sudo chmod 644 ${LOCAL_SSH_PUBKEY}
sudo chmod 600 ${LOCAL_SSH_PRVIKEY}

```
