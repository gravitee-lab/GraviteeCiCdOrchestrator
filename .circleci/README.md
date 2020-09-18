# Pipeline defintion

The pipeline definition is very simple :
* there is just one Circle CI Pipeline WorkFlow
* this WorkFlow does the docker build of the docker image of the `Gravitee CI CD Orchestrator`, and then docker pushes it to


### Global initialization Process of all secrets, for all pipelines

* How I initialized the docekr registry secrets for the Gravitee CI CD Orchestrator Circle CI Pipeline :

```bash

export NAME_OF_ORG="gravitee-lab"
export NAME_OF_REPO_IN_ORG="gravitee-lab/cicd-orchestrator"
secrethub org init "${NAME_OF_ORG}"
secrethub repo init "${NAME_OF_REPO_IN_ORG}"

# --- #
# for the DEV CI CD WorkFlow of
# the Gravitee CI CD Orchestrator
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/dev"
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/dev/docker"
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/dev/docker/quay"
secrethub mkdir --parents "${NAME_OF_REPO_IN_ORG}/dev/docker/quay/botuser"

# --- #
# for the STAGING CI CD WorkFlow of
# the Gravitee CI CD Orchestrator
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/staging"
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/staging/docker"
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/staging/docker/quay"
secrethub mkdir --parents "${NAME_OF_REPO_IN_ORG}/staging/docker/quay/botuser"


# --- #
# for the PRODUCTION CI CD WorkFlow of
# the Gravitee CI CD Orchestrator
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/prod"
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/prod/docker"
# secrethub mkdir "${NAME_OF_REPO_IN_ORG}/prod/docker/quay"
secrethub mkdir --parents "${NAME_OF_REPO_IN_ORG}/prod/docker/quay/botuser"


# --- #
# write quay secrets for the DEV CI CD WorkFlow of
# the Gravitee CI CD Orchestrator
export QUAY_BOT_USERNAME="gravitee-lab+graviteebot"
export QUAY_BOT_SECRET="ccc"
echo "${QUAY_BOT_USERNAME}" | secrethub write "${NAME_OF_REPO_IN_ORG}/dev/docker/quay/botuser/username"

echo "${QUAY_BOT_SECRET}" | secrethub write "${NAME_OF_REPO_IN_ORG}/dev/docker/quay/botuser/token"

# --- #
# And in the Circle CI Pipeline, I will :
#
QUAY_BOT_USERNAME=$(secrethub read gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/username)
QUAY_BOT_SECRET=$(secrethub read gravitee-lab/cicd-orchestrator/staging/docker/quay/botoken/token)

```

## Bot Initialization

### Bots Management

In `Circle CI` Pipelines, I do not use any CircleCI User credential, but instead I use _**Service Accounts**_ :

https://secrethub.io/docs/reference/cli/service/

So, to initialize the bot running in the `Gravitee CI CD Orchestrator` CircleCI Pipeline I :

* Created a service account for a secrethub repo (which is inside a secrethub organization)
* And the service account has access to all directories ans secrets inside that secrethub repo.


```bash
# --- #
# created a service account
export NAME_OF_REPO_IN_ORG="gravitee-lab/cicd-orchestrator"
secrethub service init "${NAME_OF_REPO_IN_ORG}" | tee ./.the-created.service.token
secrethub service ls "${NAME_OF_REPO_IN_ORG}"
echo "Beware : you will see the service token only once, then you will not ever be able to see it again, don'tloose it (or create another)"
# --- #
# and the sercice accoutn has access to all directories and secrets in the given repo
# --- #
# finally, in Circle CI, I created a 'cicd-orchestrator' context in the [gravitee-lab] organization
# dedicated to the Gravitee Ci CD Orchestrator application
# and in that 'cicd-orchestrator' Circle CI context, I set the 'SECRETHUB_CREDENTIAL' env. var. with
# value the token of the service account I just created


```

## More on Secrethub

For more on secret management, see [this documentation page](../documentation/secrets-mgmt/README.md)
