# Gravitee CI CD Orchestrator Circle CI Integration

The `Gravitee CI CD Orchestrator` relies a lot on Circle CI, to run most of its operations.

The integration setup between the `Gravitee CI CD Orchestrator` and Circle CI, most consists of
the following steps :

* Run the [Automated Deployment of dev repos Pipeline Definition](#automated-deployment-of-dev-repos-pipeline-definition) :
  * This will produce a `consolidated-git-repos-uris.list` file listing all github.com repositories the `Gravitee CI CD Orchestrator` will control.
* For each Gravitee.io dev repo, listed in the `consolidated-git-repos-uris.list` file, you must _manually_ "setup to start building" each of them in the Cirlce CI Web UI :
  * As of `2020`, Circle CI does not provide any mean to automate this operation
  * If any Circle CI pipeline keeps running, at this stage, manually cancel its execution.
* Finally, you will run the [Automated Ssh Key Setup of Pipelines](#automated-ssh-key-setup-of-pipelines) :
  * Every Circle CI Pipeline will git clone the source code of the github git repository it stands for.
  * and to run the git clone cloen command, Circle Ci mandatorily uses ssh, and therefore needs a private SSH Key
  * **before running the [Automated Ssh Key Setup of Pipelines](#automated-ssh-key-setup-of-pipelines)**, an `Owner` of the `https://github.com/${GITHUB_ORG}` Github Organization must have [setup the SSH Secrets]()




## Automated Deployment of dev repos Pipeline Definition

In this folder, is versioned the standard operation which consists in
deploying the `.circleci/config.yml` Circle CI Pipeline Definition to all
Gravitee Software Development git repositories.

What is below called a Gravitee.io dev repo, is  :
* a git repository in the https://github.com/gravitee-io/ Github Organization
* in which is versioned the source code of any https://gravitee.io software component

To deploy the Circle CI Pipeline defintion on all Gravitee.io dev repos, you must :

* Edit `<THIS GIT REPO ROOT>/std-ops/deployment/cci-pipeline-defs/dev-repos/.circleci/config.yml` file, which contains the Circle CI Pipeline Definition to deploy to all Gravitee.io dev repos : and git commit and push it, with a new release version number.
* Execute the below commands, to :
  * consolidate the set of all Gravitee.io dev repos to which the pipeline defintion must be deployed (this will just generate files, used in the next operation)
  * execute the deployment the pipeline defintion
  * and create a Github Deploy Key for each Gravitee.io dev repos Circle CI Project :  these deploy Keys are used in Circle CI Pipeline to `git clone` over ssh.

```bash
export A_FOLDER_OF_UR_CHOICE=~/gravitee-orchestra-std-ops-gravitee-lab
export GIO_ORCHESTRATOR_VERSION=0.0.4
# latest commit on develop branch is used to test the automation
export GIO_ORCHESTRATOR_VERSION="feature/std_ops_deployment"
export GIO_ORCHESTRATOR_VERSION="develop"
mkdir -p ${A_FOLDER_OF_UR_CHOICE}
git clone git@github.com:gravitee-lab/GraviteeCiCdOrchestrator.git ${A_FOLDER_OF_UR_CHOICE}
cd ${A_FOLDER_OF_UR_CHOICE}
git checkout ${GIO_ORCHESTRATOR_VERSION}
rm -fr ./.git/
cd std-ops/gravitee-lab/deployment/cci-pipeline-defs/dev-repos

SECRETHUB_ORG=gravitee-lab
# SECRETHUB_ORG=gravitee-io
SECRETHUB_REPO=cicd

export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")
export GITHUB_ORG="gravitee-io"
export GITHUB_ORG="gravitee-lab"


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
export GIT_USER_NAME='Jean-Baptiste-Lasselle'
# (mandatory) The git user eamil to use, to configure git [git config --global user.email]
export GIT_USER_EMAIL='jean.baptiste.lasselle@gmail.com'
# (Optional) The git ssh command to use, defaults to 'ssh -i ~/.ssh/id_rsa'"
export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
# (Optional), defaults to "[$0] automatic CICD test setup : adding circleci git config"
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline config version [${GIO_ORCHESTRATOR_VERSION}] "
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline config "
export GIT_COMMIT_MESSAGE="Updating Gravitee.io dev repos Circle CI Pipeline config with new secrethub org and repo parameters"

# (Optional) The GPG public Key to use, to sign commits. Has no default value, and if not set, then git is configured with [git config --global commit.gpgsign false]
export GIT_USER_SIGNING_KEY=7B19A8E1574C2883


# --- #
# List of all git branches to work with, from
# the https://github.com/${GITHUB_ORG}/release
# list must be comma-separated, white spaces are trimmed
# --- #
export RELEASE_BRANCHES=' 3.3.x , 3.2.x , 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '
export RELEASE_BRANCHES=' 3.3.x , 3.2.x , 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '
./deploy.sh

```

* To run the same `.circleci/config.yml` Pipeline definition deployment on a provided, arbitratry, list of Github git repos :

```bash
export A_FOLDER_OF_UR_CHOICE=~/gravitee-orchestra-std-ops-gravitee-lab-diff
export GIO_ORCHESTRATOR_VERSION=0.0.4
# latest commit on develop branch is used to test the automation
export GIO_ORCHESTRATOR_VERSION="develop"
mkdir -p ${A_FOLDER_OF_UR_CHOICE}
git clone git@github.com:gravitee-lab/GraviteeCiCdOrchestrator.git ${A_FOLDER_OF_UR_CHOICE}
cd ${A_FOLDER_OF_UR_CHOICE}
git checkout ${GIO_ORCHESTRATOR_VERSION}
rm -fr ./.git/
cd std-ops/gravitee-lab/deployment/cci-pipeline-defs/dev-repos


SECRETHUB_ORG=gravitee-lab
SECRETHUB_REPO=cicd
export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")

export GITHUB_ORG="gravitee-io"
export GITHUB_ORG="gravitee-lab"

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
export GIT_USER_NAME='Jean-Baptiste-Lasselle'
# (mandatory) The git user eamil to use, to configure git [git config --global user.email]
export GIT_USER_EMAIL='jean.baptiste.lasselle@gmail.com'
# (Optional) The git ssh command to use, defaults to 'ssh -i ~/.ssh/id_rsa'"
export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
# (Optional), defaults to "[$0] automatic CICD test setup : adding circleci git config"
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline config version [${GIO_ORCHESTRATOR_VERSION}] "
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline config "
# (Optional) The GPG public Key to use, to sign commits. Has no default value, and if not set, then git is configured with [git config --global commit.gpgsign false]
export GIT_USER_SIGNING_KEY=7B19A8E1574C2883

# --- #
# provided-arbitratry-repos.list : must be a UTF-8 text file
# provided-arbitratry-repos.list : each line must be the HTTP URI of a github repo
# --- #
./shell/deploy-repo-pipeline-def.sh ./shell/consolidation-diff.list

# ./shell/deploy-repo-pipeline-def.sh ./shell/provided-arbitratry-repos.list
```


## Hard listed repo list



### The difference with the `release.json` consildated repo list

Here is the list of all repos which are not in the list consolidated from the `release.json` :


```bash
https://github.com/gravitee-io/gravitee-clients-sdk.git
https://github.com/gravitee-io/gravitee-notifier-webhook
https://github.com/gravitee-io/gravitee-parents
https://github.com/gravitee-io/gravitee-platform-repository-api
https://github.com/gravitee-io/gravitee-policy-authentication
https://github.com/gravitee-io/gravitee-policy-aws-lambda
https://github.com/gravitee-io/gravitee-policy-basic-authentication
https://github.com/gravitee-io/gravitee-policy-circuit-breaker
https://github.com/gravitee-io/gravitee-policy-geoip-filtering
https://github.com/gravitee-io/gravitee-policy-wssecurity-authentication
https://github.com/gravitee-io/gravitee-policy-xml-validation
https://github.com/gravitee-io/gravitee-repository-hazelcast
https://github.com/gravitee-io/gravitee-resource-auth-provider
https://github.com/gravitee-io/gravitee-resource-auth-provider-inline
https://github.com/gravitee-io/gravitee-resource-auth-provider-ldap
https://github.com/gravitee-io/gravitee-service-geoip
https://github.com/gravitee-io/gravitee-service-maven-archetype
https://github.com/gravitee-io/gravitee-ui-components
https://github.com/gravitee-io/graviteeio-access-management
```

Running the deployment for the diff list :

```bash
export A_FOLDER_OF_UR_CHOICE=~/gravitee-orchestra-std-ops-gravitee-io-diff
export GIO_ORCHESTRATOR_VERSION=0.0.4
# latest commit on develop branch is used to test the automation
export GIO_ORCHESTRATOR_VERSION="feature/std_ops_deployment"
mkdir -p ${A_FOLDER_OF_UR_CHOICE}
git clone git@github.com:gravitee-lab/GraviteeCiCdOrchestrator.git ${A_FOLDER_OF_UR_CHOICE}
cd ${A_FOLDER_OF_UR_CHOICE}
git checkout ${GIO_ORCHESTRATOR_VERSION}
cd std-ops/gravitee-lab/deployment/cci-pipeline-defs/dev-repos

export GITHUB_ORG="gravitee-io"
SECRETHUB_ORG=gravitee-io
SECRETHUB_REPO=cicd
export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")

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
export GIT_USER_NAME='Jean-Baptiste-Lasselle'
# (mandatory) The git user eamil to use, to configure git [git config --global user.email]
export GIT_USER_EMAIL='jean.baptiste.lasselle@gmail.com'
# (Optional) The git ssh command to use, defaults to 'ssh -i ~/.ssh/id_rsa'"
export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
# (Optional), defaults to "[$0] automatic CICD test setup : adding circleci git config"
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline config version [${GIO_ORCHESTRATOR_VERSION}] "
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline config "
# (Optional) The GPG public Key to use, to sign commits. Has no default value, and if not set, then git is configured with [git config --global commit.gpgsign false]
export GIT_USER_SIGNING_KEY=7B19A8E1574C2883

# --- #
# provided-arbitratry-repos.list : must be a UTF-8 text file
# provided-arbitratry-repos.list : each line must be the HTTP URI of a github repo
# --- #
./shell/deploy-repo-pipeline-def.sh ./shell/consolidation-diff.list

```

### The provided hard list

With Nicolas, here are all the git repos consolidated from the github.com `gravitee-io` Org :

```bash
https://github.com/gravitee-io/gravitee-alert-api.git
https://github.com/gravitee-io/gravitee-clients-sdk.git
https://github.com/gravitee-io/gravitee-cockpit-api.git
https://github.com/gravitee-io/gravitee-common.git
https://github.com/gravitee-io/gravitee-definition.git
https://github.com/gravitee-io/gravitee-elasticsearch.git
https://github.com/gravitee-io/gravitee-expression-language.git
https://github.com/gravitee-io/gravitee-fetcher-api.git
https://github.com/gravitee-io/gravitee-fetcher-bitbucket.git
https://github.com/gravitee-io/gravitee-fetcher-git.git
https://github.com/gravitee-io/gravitee-fetcher-github.git
https://github.com/gravitee-io/gravitee-fetcher-gitlab.git
https://github.com/gravitee-io/gravitee-fetcher-http.git
https://github.com/gravitee-io/gravitee-gateway-api.git
https://github.com/gravitee-io/gravitee-gateway.git
https://github.com/gravitee-io/gravitee-identityprovider-api.git
https://github.com/gravitee-io/gravitee-management-rest-api.git
https://github.com/gravitee-io/gravitee-management-webui.git
https://github.com/gravitee-io/gravitee-notifier-api.git
https://github.com/gravitee-io/gravitee-notifier-email.git
https://github.com/gravitee-io/gravitee-notifier-webhook.git
https://github.com/gravitee-io/gravitee-parent.git
https://github.com/gravitee-io/gravitee-platform-repository-api.git
https://github.com/gravitee-io/gravitee-plugin.git
https://github.com/gravitee-io/gravitee-policy-api.git
https://github.com/gravitee-io/gravitee-policy-apikey.git
https://github.com/gravitee-io/gravitee-policy-assign-attributes.git
https://github.com/gravitee-io/gravitee-policy-assign-content.git
https://github.com/gravitee-io/gravitee-policy-authentication.git
https://github.com/gravitee-io/gravitee-policy-aws-lambda.git
https://github.com/gravitee-io/gravitee-policy-basic-authentication.git
https://github.com/gravitee-io/gravitee-policy-cache.git
https://github.com/gravitee-io/gravitee-policy-callout-http.git
https://github.com/gravitee-io/gravitee-policy-circuit-breaker.git
https://github.com/gravitee-io/gravitee-policy-dynamic-routing.git
https://github.com/gravitee-io/gravitee-policy-generate-jwt.git
https://github.com/gravitee-io/gravitee-policy-geoip-filtering.git
https://github.com/gravitee-io/gravitee-policy-groovy.git
https://github.com/gravitee-io/gravitee-policy-html-json.git
https://github.com/gravitee-io/gravitee-policy-ipfiltering.git
https://github.com/gravitee-io/gravitee-policy-json-threat-protection.git
https://github.com/gravitee-io/gravitee-policy-json-to-json.git
https://github.com/gravitee-io/gravitee-policy-json-validation.git
https://github.com/gravitee-io/gravitee-policy-jws.git
https://github.com/gravitee-io/gravitee-policy-jwt.git
https://github.com/gravitee-io/gravitee-policy-keyless.git
https://github.com/gravitee-io/gravitee-policy-latency.git
https://github.com/gravitee-io/gravitee-policy-mock.git
https://github.com/gravitee-io/gravitee-policy-oauth2.git
https://github.com/gravitee-io/gravitee-policy-openid-connect-userinfo.git
https://github.com/gravitee-io/gravitee-policy-override-http-method.git
https://github.com/gravitee-io/gravitee-policy-ratelimit.git
https://github.com/gravitee-io/gravitee-policy-regex-threat-protection.git
https://github.com/gravitee-io/gravitee-policy-request-content-limit.git
https://github.com/gravitee-io/gravitee-policy-request-validation.git
https://github.com/gravitee-io/gravitee-policy-resource-filtering.git
https://github.com/gravitee-io/gravitee-policy-rest-to-soap.git
https://github.com/gravitee-io/gravitee-policy-role-based-access-control.git
https://github.com/gravitee-io/gravitee-policy-ssl-enforcement.git
https://github.com/gravitee-io/gravitee-policy-transformheaders.git
https://github.com/gravitee-io/gravitee-policy-transformqueryparams.git
https://github.com/gravitee-io/gravitee-policy-url-rewriting.git
https://github.com/gravitee-io/gravitee-policy-wssecurity-authentication.git
https://github.com/gravitee-io/gravitee-policy-xml-json.git
https://github.com/gravitee-io/gravitee-policy-xml-threat-protection.git
https://github.com/gravitee-io/gravitee-policy-xml-validation.git
https://github.com/gravitee-io/gravitee-policy-xslt.git
https://github.com/gravitee-io/gravitee-portal-webui.git
https://github.com/gravitee-io/gravitee-reporter-api.git
https://github.com/gravitee-io/gravitee-reporter-file.git
https://github.com/gravitee-io/gravitee-reporter-kafka.git
https://github.com/gravitee-io/gravitee-repository-gateway-bridge-http.git
https://github.com/gravitee-io/gravitee-repository-hazelcast.git
https://github.com/gravitee-io/gravitee-repository-jdbc.git
https://github.com/gravitee-io/gravitee-repository-mongodb.git
https://github.com/gravitee-io/gravitee-repository-redis.git
https://github.com/gravitee-io/gravitee-repository-test.git
https://github.com/gravitee-io/gravitee-repository.git
https://github.com/gravitee-io/gravitee-resource-api.git
https://github.com/gravitee-io/gravitee-resource-auth-provider-inline.git
https://github.com/gravitee-io/gravitee-resource-auth-provider-ldap.git
https://github.com/gravitee-io/gravitee-resource-auth-provider.git
https://github.com/gravitee-io/gravitee-resource-cache.git
https://github.com/gravitee-io/gravitee-resource-oauth2-provider-am.git
https://github.com/gravitee-io/gravitee-resource-oauth2-provider-api.git
https://github.com/gravitee-io/gravitee-resource-oauth2-provider-generic.git
https://github.com/gravitee-io/gravitee-resource-oauth2-provider-keycloak.git
https://github.com/gravitee-io/gravitee-service-discovery-api.git
https://github.com/gravitee-io/gravitee-service-discovery-consul.git
https://github.com/gravitee-io/gravitee-service-discovery-eureka.git
https://github.com/gravitee-io/gravitee-service-geoip.git
https://github.com/gravitee-io/gravitee-service-maven-archetype.git
https://github.com/gravitee-io/gravitee-ui-components.git
https://github.com/gravitee-io/graviteeio-access-management.git
https://github.com/gravitee-io/graviteeio-node.git
```

## Automated Github Deploy Keys Setup of Pipelines

This section explains how to automatically re-setup Github Deploy Keys for all Gravitee.io dev repositories.

This is useful because those deploy keys often become invalid, or are deleted.



* First, go to the Circle CI Web UI, create a Token from the User Settings Menu, and save it as a secret to secrethub [like specified here](../../../secrets)

* Then you will use your Circle CI User Token, and your secrethub user token, to setup a Github Deploy Key for all git repositories listed in the generated `consolidated-git-repos-uris.list` file :

```bash
export A_FOLDER_OF_UR_CHOICE=~/gravitee-orchestra-std-ops
export GIO_ORCHESTRATOR_VERSION=0.0.4
# latest commit on develop branch is used to test the automation
export GIO_ORCHESTRATOR_VERSION=develop
mkdir -p ${A_FOLDER_OF_UR_CHOICE}
git clone git@github.com:gravitee-lab/GraviteeCiCdOrchestrator.git ${A_FOLDER_OF_UR_CHOICE}
cd ${A_FOLDER_OF_UR_CHOICE}
git checkout ${GIO_ORCHESTRATOR_VERSION}
cd std-ops/gravitee-lab/deployment/cci-pipeline-defs/dev-repos


export GITHUB_ORG="gravitee-lab"
export RELEASE_BRANCHES=' 3.3.x , 3.2.x , 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '
# Generate the [consolidated-git-repos-uris.list]
./shell/consolidate-dev-repos-inventory.sh

SECRETHUB_ORG=gravitee-lab
# SECRETHUB_ORG=gravitee-io
SECRETHUB_REPO=cicd

export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")
export GITHUB_ORG="gravitee-lab"


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

* reset the checkout key for only one repo (here the release repo) :

```bash
export CCI_TOKEN=<your circle ci token>
export GITHUB_ORG=gravitee-lab
export JSON_PAYLOAD="{
    \"type\": \"deploy-key\"
}"
# echo "${REPO_URL}" | awk -F '/' '{print $4}'
export REPO_NAME=release
echo "# ------------------------------------------------------------ #"
echo "creating checkout key for [${GITHUB_ORG}/${REPO_NAME}]"
echo "# ------------------------------------------------------------ #"
# --- First let's delete all previous deploy keys
curl -d "${JSON_PAYLOAD}" -X GET https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq '.[]' | jq '.[].fingerprint' | awk -F '"' '{print $2}' | tee -a ./${GITHUB_ORG}.${REPO_NAME}.fingerprints.list

while read FINGERPRINT; do
  curl -d "${JSON_PAYLOAD}" -X DELETE https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key/${FINGERPRINT} -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
done <./${GITHUB_ORG}.${REPO_NAME}.fingerprints.list
# -- Finally we re-create a  new deploy key
# curl -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
curl -d "${JSON_PAYLOAD}" -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
echo "# ------------------------------------------------------------ #"
# cat consolidated-git-repos-uris.list | awk -F '/' '{print $4}'
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



* Test Retrieving the RSA Key Pair on another machine, with another secrethub user :

```bash
export PATH_ONMY_MACHINE=${HOME}/.ssh.cicd.graviteebot
secrethub read --out-file "${PATH_ONMY_MACHINE}/id_rsa.pub" "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/public_key"
secrethub read --out-file "${PATH_ONMY_MACHINE}/id_rsa" "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/github.com/ssh/private_key"
```

-->






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
