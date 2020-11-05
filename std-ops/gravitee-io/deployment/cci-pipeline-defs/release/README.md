# Gravitee CI CD Orchestrator Circle CI Integration





```bash
export A_FOLDER_OF_UR_CHOICE=~/gravitee-orchestra-std-ops-gravitee-io
export GIO_ORCHESTRATOR_VERSION=0.0.4
# latest commit on develop branch is used to test the automation
export GIO_ORCHESTRATOR_VERSION=develop
mkdir -p ${A_FOLDER_OF_UR_CHOICE}
git clone git@github.com:gravitee-lab/GraviteeCiCdOrchestrator.git ${A_FOLDER_OF_UR_CHOICE}
cd ${A_FOLDER_OF_UR_CHOICE}
git checkout ${GIO_ORCHESTRATOR_VERSION}
cd std-ops/deployment/cci-pipeline-defs/dev-repos

SECRETHUB_ORG=gravitee-lab
# SECRETHUB_ORG=gravitee-io
SECRETHUB_REPO=cicd

export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")
export GITHUB_ORG="gravitee-io"

# --- #
# Opional :
# determines from which Github Org, data are consolidated (defaults to "gravitee-io" (the real org))
# determines to which Github Org, Circle Ci Pipeline definition is deployed (defaults to "gravitee-lab" (the fake org))
# export GITHUB_ORG=${GITHUB_ORG:-'gravitee-lab'}
# --- #
# Those env. var. will be used to configure
# your local Git for the deployment
# --- #
# (mandatory) The git user name to use, to configure git [git config --global user.name]
export GIT_USER_NAME=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/user/name")
export GIT_USER_NAME='Jean-Baptiste-Lasselle'

# (mandatory) The git user eamil to use, to configure git [git config --global user.email]
export GIT_USER_EMAIL=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/user/email")
export GIT_USER_EMAIL='jean.baptiste.lasselle@gmail.com'

restoreSSHGraviteeBotSSHKey () {
  export LOCAL_SSH_PUBKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa.pub
  export LOCAL_SSH_PRVIKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa
  mkdir -p ${HOME}/.ssh.cicd.graviteebot
  secrethub read --out-file ${LOCAL_SSH_PUBKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/public_key"
  secrethub read --out-file ${LOCAL_SSH_PRVIKEY} "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/private_key"
  sudo chmod 700 ${HOME}/.ssh.cicd.graviteebot
  sudo chmod 644 ${LOCAL_SSH_PUBKEY}
  sudo chmod 600 ${LOCAL_SSH_PRVIKEY}
}
# restoreSSHGraviteeBotSSHKey

# (Optional) The git ssh command to use, defaults to 'ssh -i ~/.ssh/id_rsa'"
export GIT_SSH_COMMAND='ssh -i ~/.ssh.cicd.graviteebot/id_rsa'
export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'

# (Optional) The GPG public Key to use, to sign commits. Has no default value, and if not set, then git is configured with [git config --global commit.gpgsign false]
export GIT_USER_SIGNING_KEY=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/gpg/signing_key")
export GIT_USER_SIGNING_KEY=7B19A8E1574C2883



# --- #
# List of all git branches to work with, from
# the https://github.com/${GITHUB_ORG}/release
# list must be comma-separated, white spaces are trimmed
# --- #
export RELEASE_BRANCHES=' 3.3.x , 3.2.x , 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x , master  '
./deploy.sh

```

## Automated Github Deploy Keys Setup of Pipelines

This section explains how to automatically re-setup Github Deploy Keys for all Gravitee.io dev repositories.

This is useful because those deploy keys often become invalid, or are deleted.



* First, go to the Circle CI Web UI, create a Token from the User Settings Menu, and save it as a secret to secrethub like this :

```bash
# --
# ENV. VARS
export SECRETHUB_ORG=graviteeio
# SECRETHUB_ORG=gravitee-io
export SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
#   Circle CI Token to auth to the Circle CI API v2   #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
export HUMAN_NAME=jblasselle
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci"

export MY_CCI_USER_TOKEN=<YOUR TOKEN VALUE>
echo "${MY_CCI_USER_TOKEN}" | secrethub write "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token"

```

* Then you will use your Circle CI User Token, and your secrethub user token, to setup the SSH Key for all git repositories listed in the generated `consolidated-git-repos-uris.list` file :

```bash
export A_FOLDER_OF_UR_CHOICE=~/gravitee-orchestra-std-ops
export GIO_ORCHESTRATOR_VERSION=0.0.4
# latest commit on develop branch is used to test the automation
export GIO_ORCHESTRATOR_VERSION=develop
mkdir -p ${A_FOLDER_OF_UR_CHOICE}
git clone git@github.com:gravitee-lab/GraviteeCiCdOrchestrator.git ${A_FOLDER_OF_UR_CHOICE}
cd ${A_FOLDER_OF_UR_CHOICE}
git checkout ${GIO_ORCHESTRATOR_VERSION}
cd std-ops/deployment/cci-pipeline-defs/dev-repos


export GITHUB_ORG="gravitee-io"
export RELEASE_BRANCHES=' 3.3.x , 3.2.x , 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '
# Generate the [consolidated-git-repos-uris.list]
./shell/consolidate-dev-repos-inventory.sh

export SECRETHUB_ORG=graviteeio
# SECRETHUB_ORG=gravitee-io
export SECRETHUB_REPO=cicd

export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")
export GITHUB_ORG="gravitee-io"


export JSON_PAYLOAD="{
    \"type\": \"deploy-key\"
}"


while read REPO_URL; do
  # echo "${REPO_URL}" | awk -F '/' '{print $4}'
  echo "# ------------------------------------------------------------ #"
  echo "creating checkout key for [${GITHUB_ORG}/${REPO_NAME}]"
  echo "# ------------------------------------------------------------ #"
  export REPO_NAME=$(echo "${REPO_URL}" | awk -F '/' '{print $5}')
  # curl -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  curl -d "${JSON_PAYLOAD}" -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  echo "# ------------------------------------------------------------ #"
  # cat consolidated-git-repos-uris.list | awk -F '/' '{print $4}'
done <./consolidated-git-repos-uris.list

```


## Secret Management for Circle CI Pipelines

This section is useful for the Owner of the `https://github.com/${GITHUB_ORG}` Github Organization who
will setup a secret used in the [Automated Ssh Key Setup of Pipelines](#automated-ssh-key-setup-of-pipelines)

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

Now that you have secrethub CLI installed, go to [this page](https://github.com/gravitee-io/kb/wiki/Secrets-Everywhere#the-root-secret) to create your secrethub user, and do not forget to save the rrot secret to `Keypass2`

Once your secrethub user is created, the `secrethub account inspect` command will allow you to check your user main informations. For example, my secrethub user is :

```bash
$ secrethub account inspect
{
    "Username": "graviteebot",
    "FullName": "jean-baptiste-lasselle",
    "Email": "jean-baptiste.lasselle@graviteesource.com",
    "EmailVerified": true,
    "CreatedAt": "2020-08-05T20:42:18+02:00",
    "PublicAccountKey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBcDNJMEhRQTNQVmJvWTkzOWg3MUkKV2Q4bnpBSmVaYklTYXhSM05VVldGMXBLWHB4cFRYODZacXZqZW4yQU9YdERhRUFEblZjTDJOMG1GT0E0cTlEMApFUnd0eSswNlVFTnMwYzNucnA4SkpyT3NaNUFTTklDZnFaVWw1ZllMYXR1L3VBNmZhc3lSbjVBakF6aGwrZ2ErCjFIRDBiVDRKUDJQREJHOXEzdmRMbU5lM0NNb0JpUUVvVWJnTC93SUFXSmVGR1VBUVNuTklvakNWMWFoTUgzMlgKM3pwOXpBblNFaE5yK21TNWFlWitITVNEYU52UmJTV2F6azhrS3l6ZGpPS2ZYMW1LaWJwVVpQUE9BWGJIdk9RegoyZGNmVkU4aXU4cW0rMFBPY2pmcThFNWxLNVoyalo2SnlyYzVSdkpaQjVldnRtNUpha1VIRHRyRjhkU1k1RkNVCmhabTJBRFRoWXVMUmh6aEFObFc1U241UEtHWVR4TXhuL0lkNUV1S2ZDYkU3dlBVTnBNNjh5c0hKdkxidjBwbHcKZkhHbnBhc3ZXMmlIVjUxblRjY3dwem8zWVhuL09Zdk80RGJaMW56b3dlR0N5dy82VzZRZnpoV25PMURlTG5QdwoyUTBpbVhIRHB5MUV4QUFWQ2hldllDUjh5cW0yVnpXNVlTRzdieDFzOVpNeHRsOGhyT2NzZndVNDh1RlBPSkdjCjlDdEk1WmdnV2VWN2lUdVdrQXBFVDdnUXkrOTN6SDBqS2FEV0w3MEl6WXV1QjNwTHZ3TkwySGhyKzNIYjlQUmYKbkdwdXBOQWZvYVFQOUlUY3NmQUlwR2x4blczYmI5TjJRY1gwYklmdVhzbThhK0VWM2g0UUNxL2dOYXpPdUZvcQpoQjh2c3ovWjVRYStmQVpsQ2paSzR4OENBd0VBQVE9PQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tCg=="
}
```

<!--
#### Initialize the SSH Secrets for CI / CD


* Using your Secrethub user, and the below commands, you will create two secrethub secrets, for the RSA Key Pair which will be used by Circle CI Pipelines to git clone over SSH

```bash
# --
# ENV. VARS
SECRETHUB_ORG=gravitee-lab
# SECRETHUB_ORG=gravitee-io
SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}


# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
#      RSA Key Pair to use for Github SSH Service     #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh"

export LOCAL_SSH_PUBKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa.pub
export LOCAL_SSH_PRVIKEY=${HOME}/.ssh.cicd.graviteebot/id_rsa
# --- #
# https://github.com/graviteeio is the Github User
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



-->




* Test Retrieving the RSA Key Pair on another machine, with another secrethub user :

```bash
export PATH_ONMY_MACHINE=${HOME}/.ssh.cicd.graviteebot
secrethub read --out-file "${PATH_ONMY_MACHINE}/id_rsa.pub" "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/public_key"
secrethub read --out-file "${PATH_ONMY_MACHINE}/id_rsa" "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/private_key"
```



<!--
## ANNEX A. SemVer and Product management

* In the `https://github.com/${GITHUB_ORG}` Github Organization, your organization develops a product.
* This product is released using the [semver](https://semver.org/) industry standard, therefore :
  * each of its releases is numbered with three integers, `MAJOR_VERSION`,`MINOR_VERSION`, `PATCH_VERSION`, respectively called major, minor, and patch version numbers.
  * And every release of your product has one version number, `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`, made of those three integers.
* At a given point in time, among all versions of your product, which have ever been released :
  * all are of the form `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`
  * you can "classify" thsoe versions, into sets of versions : two versions, are in the same set, if they have the same  `${MAJOR_VERSION}`, and the same `${MINOR_VERSION}`.
  * using this classification, some "sets of versions", are said to have reached "End of Life", and the others, aresaid to be "supported versions."
    * a set of versions of your product, has reached "End of Life" : means that given two fixed `MAJOR_VERSION`, and `MINOR_VERSION`, for example `MAJOR_VERSION=4`, and `MINOR_VERSION=7`, your team will not ever, in the futre, release any new version, numbered `4.7.${PATCH_VERSION}`.
    * a set of versions of your product, is said to be "supported" :  means that given two fixed `MAJOR_VERSION`, and `MINOR_VERSION`, for example `MAJOR_VERSION=6`, and `MINOR_VERSION=3`, your team will release new versions, numbered `6.3.${PATCH_VERSION}`, for example, to fix a bug, or fix a security vulnerability.
* I did not here exeplained everything one can explain, about "how people releasing a software product, work with version numbers, when they use the [semver](https://semver.org/) industry standard, but my point is :
  * that you classify those versions numbers, out of "grouping" version numbers, into sets of releases
  * and everyday only care about _some_, of those sets of releases, not _all_ of them.
-->
