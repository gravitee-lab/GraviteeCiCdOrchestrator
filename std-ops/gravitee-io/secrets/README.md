
## CICD Secrets taxonomy trees

All CI CD Secrets have to be managed with Secrethub.

The Glocal CI CD system, will run into two isolated worlds :
* the "real world" (production) : where the CI CD System works for the Gravitee.io Team. That's the https
* the "test world" (tests) : where the CI CD System is tested
* isolation is reached at the Githbu Organization level :
  * 2 completely different Github organizations
  * and therefore 2 completely different secrets taxonomy trees to operate.

With this point of view, the _**The Gravitee Secrets Inventory**_ will therefore have to extensively docuement those two taxonomy trees.

### CICD Secrets taxonomy tree for https://github.com/gravitee-io (Production)

* Secrethub orgs:
  * `graviteeio`
* Secrethub repos:
  * `graviteeio/cicd`

* secrets :
  * `graviteeio/cicd/graviteebot/circleci/secrethub-svc-account/token`: Secrethub Service Account (Robot user) for Circle CI Pipelines (Secrethub / Circle CI integration)
  * `graviteeio/cicd/graviteebot/circleci/api/token` : Circle CI Token used by the Gravitee CI CD Orchestrator
  * `graviteeio/cicd/graviteebot/circleci/api/.secrets.json` : Circle CI secret file used by the Gravitee CI CD Orchestrator
  * [Gravitee bot](https://github.com/graviteeio) git config in all Git Service providers (Github, Gitlab, Bitbucket etc...) :
    * `graviteeio/cicd/graviteebot/git/user/name` : [Gravitee bot](https://github.com/graviteeio) git user name
    * `graviteeio/cicd/graviteebot/git/user/email` : [Gravitee bot](https://github.com/graviteeio) git user email
    * `graviteeio/cicd/graviteebot/git/ssh/private_key` : [Gravitee bot](https://github.com/graviteeio) git ssh private key
    * `graviteeio/cicd/graviteebot/git/ssh/public_key` :  [Gravitee bot](https://github.com/graviteeio) git ssh public key
  * [ ] **THOSE HAVE NOT BEEN CREATED YET MUST BE DONE WITH @NicolasGeraud** Quay.io credentials to manage `Gravitee CI CD Orchestrator` Container image (and all container images of all "meta-CI/CD" components - the components of the CICD of the CICD System ) :
    * `graviteeio/cicd/graviteebot/meta-cicd/orchestrator/docker/quay/username` : [Gravitee bot](https://github.com/graviteeio) username to authenticate to Quay.io in https://quay.io/repository/gravitee_io/cicd-orchestrator repository
    * `graviteeio/cicd/graviteebot/meta-cicd/orchestrator/docker/quay/token` :  [Gravitee bot](https://github.com/graviteeio) token to authenticate to Quay.io in https://quay.io/repository/gravitee_io/cicd-orchestrator repository


#### Install Secrethub CLI

* To install Secrethub CLI on Windows, go to https://secrethub.io/docs/reference/cli/install/#windows
* To install Secrethub CLI on any GNU/Linux or Mac OS:

```bash
# eg : https://github.com/secrethub/secrethub-cli/releases/download/v0.41.2/secrethub-v0.41.2-darwin-amd64.tar.gz
export SECRETHUB_CLI_VERSION=0.41.0
# Use [export SECRETHUB_OS=linux] instead of [export SECRETHUB_OS=darwin] for
# most of GNU/Linux Distribution that is not Mac OS.
export SECRETHUB_OS=darwin
export SECRETHUB_CPU_ARCH=amd64


curl -LO https://github.com/secrethub/secrethub-cli/releases/download/v${SECRETHUB_CLI_VERSION}/secrethub-v${SECRETHUB_CLI_VERSION}-${SECRETHUB_OS}-${SECRETHUB_CPU_ARCH}.tar.gz

sudo mkdir -p /usr/local/bin
sudo mkdir -p /usr/local/secrethub/${SECRETHUB_CLI_VERSION}
sudo tar -C /usr/local/secrethub/${SECRETHUB_CLI_VERSION} -xzf secrethub-v${SECRETHUB_CLI_VERSION}-${SECRETHUB_OS}-${SECRETHUB_CPU_ARCH}.tar.gz

sudo ln -s /usr/local/secrethub/${SECRETHUB_CLI_VERSION}/bin/secrethub /usr/local/bin/secrethub

secrethub --version
```

#### Init/Rotate secrets

* Secrethub Service Account (Robot user) for Circle CI Pipelines (Secrethub / Circle CI integration) :

```bash
# made with @NicolasGeraud 's github User for https://github.com/gravitee-io Github Org
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}
# --- #
# create a service account
secrethub service init "${SECRETHUB_ORG}/${SECRETHUB_REPO}" --description "Circle CI  Service Account for the [cicd-orchestrator] Cirlce CI context for the https://github.com/gravitee-io Organization" --permission read | tee ./.the-created.service.token
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
```

* Circle CI Token and secret file used by the Gravitee CI CD Orchestrator :

```bash
export CCI_SECRET_FILE=$PWD/.secrets.json
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd

# echo "<value of the Circle CI token>" | secrethub write ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token

export CIRCLECI_TOKEN=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token)

echo "{" | tee -a ${CCI_SECRET_FILE}
echo "  \"circleci\": {" | tee -a ${CCI_SECRET_FILE}
echo "    \"auth\": {" | tee -a ${CCI_SECRET_FILE}
echo "      \"username\": \"Graviteeio Bot\"," | tee -a ${CCI_SECRET_FILE}
echo "      \"token\": \"${CIRCLECI_TOKEN}\"" | tee -a ${CCI_SECRET_FILE}
echo "    }" | tee -a ${CCI_SECRET_FILE}
echo "  }" | tee -a ${CCI_SECRET_FILE}
echo "}" | tee -a ${CCI_SECRET_FILE}


secrethub write --in-file ./test.retrievieving.secret.json "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/.secret.json"
secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token

```

* SSH Key Pair used by the Gravitee.io Bot to git commit n push to https://github.com/gravitee-io repos :

```bash
# --
# ENV. VARS
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd

# secrethub org init ${SECRETHUB_ORG}
# secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

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
export GIT_USER_NAME="Gravitee.io Bot"
export GIT_USER_EMAIL="contact@gravitee.io"

echo "${GIT_USER_NAME}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/name"
echo "${GIT_USER_EMAIL}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/email"



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

# --- The admin who can add an SSH Key to the Gravitee Bot's Github User
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd
secrethub read --out-file ".retrieved.ssh.cicd.graviteebot.id_rsa.pub" "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/public_key"
echo ''
echo "Add the below PUBLIC Rsa Key to the SSH Keys of https://github.com/graviteeio, the Github User of the Gravitee.io Bot, then proceed secrets initalization"
cat .retrieved.ssh.cicd.graviteebot.id_rsa.pub
echo ''

secrethub account inspect

# --- #
```

* Quay.io credentials to manage `Gravitee CI CD Orchestrator` Container image (and all container images of all "meta-CI/CD" components - the components of the CICD of the CICD System ) :

```bash
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd

secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/meta-cicd/orchestrator/docker/quay/botuser"

# Credentials to authenticate to quay.io
export QUAY_BOT_USERNAME="gravitee_io+graviteebot"
export QUAY_BOT_SECRET="very long value of the quay.io authentication token"



# [Gravitee bot](https://github.com/gravitee-lab) username to authenticate to Quay.io in [gravitee-lab/cicd-orchestrator] repository
echo "${QUAY_BOT_USERNAME}" | secrethub write ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/meta-cicd/orchestrator/docker/quay/botuser/username
# [Gravitee bot](https://github.com/gravitee-lab) token to authenticate to Quay.io in `gravitee-lab/cicd-orchestrator` repository
echo "${QUAY_BOT_SECRET}" | secrethub write ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/meta-cicd/orchestrator/docker/quay/botuser/token

```

* Jean-Baptiste Lasselle created the `gravitee-io` organization on Quay.io :
  * dots and dashes are not accepted in container registries GUNs (unique identifiers), so underscored `gravitee_io` was best option :
![creation of the `gravitee-io` organization on Quay.io 1](https://raw.githubusercontent.com/gravitee-lab/GraviteeCiCdOrchestrator/0.0.4-alpha/std-ops/gravitee-io/secrets/images/GRAVITEE-IO-ORG_CREATION_ON_QUAY.IO_1_2020-11-06T00-05-45.887Z.png)
  * finally created `gravitee_io` organization on quay.io :
![creation of the `gravitee-io` organization on Quay.io 2](https://raw.githubusercontent.com/gravitee-lab/GraviteeCiCdOrchestrator/0.0.4-alpha/std-ops/gravitee-io/secrets/images/GRAVITEE-IO-ORG_CREATION_ON_QUAY.IO_2_2020-11-06T00-16-16.313Z.png)
  * Jean-Baptiste Lasselle had to create an email address to associate to the `gravitee_io` organization on quay.io :
![creation of the `gravitee-io` organization on Quay.io 3 - email account](https://raw.githubusercontent.com/gravitee-lab/GraviteeCiCdOrchestrator/0.0.4-alpha/std-ops/gravitee-io/secrets/images/compte_gmail_associe_2020-11-06T00-13-51.885Z.png)
