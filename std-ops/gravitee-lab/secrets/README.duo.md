
## CICD Secrets taxonomy trees

All CI CD Secrets have to be managed with Secrethub.

The Glocal CI CD system, will run into two isolated worlds :
* the "real world" (production) : where the CI CD System works for the Gravitee.io Team. That's the https
* the "test world" (tests) : where the CI CD System is tested
* isolation is reached at the Github Organization level :
  * 2 completely different Github organizations
  * and therefore 2 completely different secrets taxonomy trees to operate.

With this point of view, the _**The Gravitee Secrets Inventory**_ will therefore have to extensively document those two taxonomy trees.

## CICD Secrets taxonomy tree for https://github.com/gravitee-lab (Tests)


* Secrethub orgs:
  * `gravitee-lab`
* Secrethub repos:
  * `gravitee-lab/cicd`

* secrets :
  * `gravitee-lab/cicd/graviteebot/circleci/secrethub-svc-account/token`: Secrethub Service Account (Robot user) for Circle CI Pipelines (Secrethub / Circle CI integration)
  * `gravitee-lab/cicd/graviteebot/circleci/api/token` : Circle CI Token used by the Gravitee CI CD Orchestrator
  * `gravitee-lab/cicd/graviteebot/circleci/api/.secrets.json` : Circle CI secret file used by the Gravitee CI CD Orchestrator
  * [Gravitee Lab bot](https://github.com/gravitee-lab) `GnuPG` identity :
    * `gravitee-lab/cicd/graviteebot/gpg/user_name`
    * `gravitee-lab/cicd/graviteebot/gpg/user_name_comment`
    * `gravitee-lab/cicd/graviteebot/gpg/user_email`
    * `gravitee-lab/cicd/graviteebot/gpg/passphrase`
    * `gravitee-lab/cicd/graviteebot/gpg/key_id`
    * (file) `gravitee-lab/cicd/graviteebot/gpg/pub_key`
    * (file) `gravitee-lab/cicd/graviteebot/gpg/private_key`
  * [Gravitee Lab bot](https://github.com/gravitee-lab) git config in all Git Service providers (Github, Gitlab, Bitbucket etc...) :
    * `gravitee-lab/cicd/graviteebot/git/user/name` : [Gravitee bot](https://github.com/gravitee-lab) git user name
    * `gravitee-lab/cicd/graviteebot/git/user/email` : [Gravitee bot](https://github.com/gravitee-lab) git user email
    * `gravitee-lab/cicd/graviteebot/git/ssh/private_key` : [Gravitee bot](https://github.com/gravitee-lab) git ssh private key
    * `gravitee-lab/cicd/graviteebot/git/ssh/public_key` :  [Gravitee bot](https://github.com/gravitee-lab) git ssh public key
  * [Gravitee Lab bot](https://github.com/gravitee-lab) artifactory credentials and the multiple `settings.xml` (maven) files used in all CI CD Processes :
    * `gravitee-lab/cicd/graviteebot/infra/maven/dry-run/artifactory/user-name`
    * `gravitee-lab/cicd/graviteebot/infra/maven/dry-run/artifactory/user-pwd`
    * `gravitee-lab/cicd/graviteebot/infra/maven/dry-run/artifactory/snaphots-repo-url`
    * `gravitee-lab/cicd/graviteebot/infra/maven/dry-run/artifactory/release-repo-url`
    * `gravitee-lab/cicd/graviteebot/infra/maven/dry-run/artifactory/settings.xml`
  * Quay.io credentials to manage `Gravitee CI CD Orchestrator` Container image (and all container images of all "meta-CI/CD" components - the components of the CICD of the CICD System ) :
    * `gravitee-lab/cicd/graviteebot/meta-cicd/orchestrator/docker/quay/username` : [Gravitee bot](https://github.com/gravitee-lab) username to authenticate to Quay.io in `gravitee-lab/cicd-orchestrator` repository
    * `gravitee-lab/cicd/graviteebot/meta-cicd/orchestrator/docker/quay/token` :  [Gravitee bot](https://github.com/gravitee-lab) token to authenticate to Quay.io in `gravitee-lab/cicd-orchestrator` repository


### Init/Rotate secrets

#### `Secrethub` Service Account (Robot user) for `Circle CI` Pipelines

```bash
# made with @JB 's Github User for https://github.com/gravitee-lab Github Org
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

secrethub org init ${SECRETHUB_ORG}
secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/secrethub-svc-account"
```

  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/secrethub-svc-account/token`

#### `Circle CI` Token used by the Gravitee CI CD Orchestrator


```bash
export CCI_SECRET_FILE=$PWD/.secrets.json
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

# secrethub org init ${SECRETHUB_ORG}
# secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

secrethub mkdir --parents ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api

```

  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/token`
  * (file) `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/circleci/api/.secret.json`

#### Gravitee.io Lab Bot GPG identity


```bash

export SECRETHUB_ORG="gravitee-lab"
export SECRETHUB_REPO="cicd"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg"

```

  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/user_name`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/user_name_comment`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/user_email`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/passphrase`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/key_id`
  * (file) `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/pub_key`
  * (file) `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/gpg/private_key`

#### Gravitee.io Lab Bot git config

```bash
# --
# ENV. VARS
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

# secrethub org init ${SECRETHUB_ORG}
# secrethub repo init ${SECRETHUB_ORG}/${SECRETHUB_REPO}

secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/gpg"
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh"

```
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/name`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/user/email`
  * (file) `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/public_key`
  * (file) `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/git/ssh/private_key`

#### Gravitee.io Bot artifactory credentials

```bash
export SECRETHUB_ORG="gravitee-lab"
export SECRETHUB_REPO="cicd"
# secrethub org init "${SECRETHUB_ORG}"
# secrethub repo init "${SECRETHUB_ORG}/${SECRETHUB_REPO}"

# --- #
# for the DEV CI CD WorkFlow of
# the Gravitee CI CD Orchestrator
secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/"

```

  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/user-name`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/user-pwd`

#### Gravitee.io CI CD `settings.xml` files in https://github.com/gravitee-lab

* init / rotate the Gravitee.io Lab Bot `settings.xml` files used in all CI CD Processes :
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/snaphots-repo-url`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/release-repo-url`
  * `${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/settings.xml`

#### Gravitee.io CI CD System Container library : Quay.io credentials

* Quay.io credentials to manage `Gravitee CI CD Orchestrator` Container image (and all container images of all "meta-CI/CD" components - the components of the CICD of the CICD System ) :
* ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/meta-cicd/orchestrator/docker/quay/botuser
```bash
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/meta-cicd/orchestrator/docker/quay/botuser"
```
* `gravitee-lab/cicd-orchestrator/dev/docker/quay/botuser/username`
* `gravitee-lab/cicd-orchestrator/dev/docker/quay/botuser/token`
