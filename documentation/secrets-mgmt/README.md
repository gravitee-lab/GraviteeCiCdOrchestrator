
# Secret manager, and Circle CI Pipelines : The Secrethub

Secrets will be used in Gravitee Team Circle CI Pipelines, to :

* docker login to docker registries
* Operate Gravitee deployment targets, mainly `Kubernetes` clusters, and `Docker Compose` Hosts on Cloud Providers.
* authenticate to the maven central repositories (`Nexus Sonatype`, `JFrog`, etc...)
* authenticate to the `Github API v3/v4`
* authenticate to the Log collection system (Filebeat => Lgstash => Elasticsearch)
* etc...

For theses cases, we will have two main cases :
* case 1 : the secret is a simple string.
* case 2 : the secret is file (KUBECONFIG, certificates,  etc...)

These two cases are discussed in the irst two sections below.

Additionally, there is also another couple of matters to master, for us at `Gravitee` to manage all those secrets, in our pipelines :
* Global initialization Process of all secrets, for all pipelines
* Collaboration on the devops/cicd team (sharing secrets, user/permissions mannagement in secrethub)
* Secrets rotation
* Global backup Process of all secrets, for all pipelines

So those four matters are the subject of the four last sections

### Simple String secrets

```bash
~$ secrethub account inspect
{
    "Username": "pokusbot",
    "FullName": "pokusbot",
    "Email": "jean.baptiste.lasselle.pokus@gmail.com",
    "CreatedAt": "2020-08-08T22:16:41+02:00",
    "PublicAccountKey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBd0pzM0tzMlJBZzBoS0dIbW5ocWIKa01iVjNyZm53VDVzRWlZdlhWcldrTFFjcit4dERwQTFCaGlCS2xuUERYRFVJbldKNWNMQitrUHoxWmcxUU1MaAp0WUl5UUZpOFd0ZVV1N2d4ZFk4dFp5Q1lpSERzSDVzWVNDQ25tZUxhTmc1bDMyNUtCbWNBZHVsc3Jnc2UvQ2lyCjZMV3VITGJzRTBlTXBRaEdmYzEvTlZTZG1EejRiQkUwQ0lDMWU0Y1crSmJWREEzMWhhUnRDYUc5emxVLzBlY1kKczNFWGt5QzB0b3c3eVhCMHorYUFrMzZqNGNXVGpSaFZIbEt6Y1gxL1V1akVtL3drVkZ0ODBMazBLUGtiVk1NMQpPeWFsNHFsejlKeXVxOXZMNzdicElhUnV3bE1IUXVrdHQrai8vZjNEYkpYc2J3N041ODVxYmtYT1JkMUVDYlNFCmhSWnlRY2tESU9sVll6ZHpITXd2MThOamlCZVJYNDBPTjh4ZTJvM2FrVXVwQW5UMzlPZVdEd1YxK1pZRjlWRTQKZnNBd25NNUpNcnMwTUNiV1lJRWc4U014QVUyejk3dEd4MWZqK3E4VjJNVjNRT2FPS3hGUTRHYU54SnFyZTRaVApyOTByWE9pcHRPaDNPeVEzKytsajlONzB4alFpZDdEVmF2elUyTERyR1kvUU40cVQzc3IreW11UWJ0RUxuUGlUClJoRVNOelRqT3pYclRqbk5RMkRxSmJMSFcyZTBSOEc4eFRvRWk2MWl6dmV1U0FVMnRxcjhORXREQ3FrelRwbDIKalRHd0oxRWNsKzFiMVJyQUN3eGFIYmF5Ui9jR1gvUGduamxTN3Nsc0xYYVlhRi8rVUwwR2lSeXMyaFJ5VG9ROApGdnVLVGsxbERCSjk2NFZnSjhqWjdsY0NBd0VBQVE9PQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tCg=="
}
~$ ls -allh ~/.secrethub
total 24K
drwx------   2 jbl jbl 4.0K Aug  8 22:43 .
drwxr-xr-x 243 jbl jbl  16K Aug 31 10:44 ..
-rw-r--r--   1 jbl jbl 3.1K Aug  8 22:53 credential
~$ ls -allh ~/.secrethub/credential
-rw-r--r-- 1 jbl jbl 3.1K Aug  8 22:53 /home/jbl/.secrethub/credential
```

* content of `~/.secrethub/credential` is the value of the Secrethub token :
  * for a `Circle CI` project, or Organization Context, create the `SECRETHUB_CREDENTIAL` env. variable, and set its value to the secrethub token : then `secrethub cli` will be able to auth. against secrethub SAAS service.


* Now we need to create the secrets :

```bash

echo "Implementation not finished TODO"
exit 1
# ---> [gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/username]
# secrethub repo init to create a repository
secrethub repo init gravitee-lab/cicd-orchestrator
secrethub repo inspect gravitee-lab/cicd-orchestrator
secrethub repo ls gravitee-lab/cicd-orchestrator

# secrethub mkdir to create a directory
secrethub mkdir gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/
secrethub repo ls gravitee-lab/cicd-orchestrator/staging/
secrethub repo ls gravitee-lab/cicd-orchestrator/staging/docker
secrethub repo ls gravitee-lab/cicd-orchestrator/staging/docker/quay

# secrethub write to write some secrets
secrethub write username
# ---> [gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/token]

```


_**Reference Documentation**_ :

* https://secrethub.io/docs/guides/circleci/



### Secret files

_Could be used for TLS/SSL Certificates, KUBECONFIG, for example_


* On one machine :

```bash
# Example with kubeconfig
export FILE_LOCAL_PATH=${HOME}/.kube/config

# store the file to secrethub (from pipeline provisining the cluster)
secrethub write --in-file ${FILE_LOCAL_PATH} gravitee-io/cicd/envs/staging/k8s/kubeconfig
secrethub write --in-file ${FILE_LOCAL_PATH} gravitee-io/cicd/envs/integration/k8s/kubeconfig
```

* On the other machine :

```bash
# retrieve the file (on another machine)
# Example with kubeconfig
export KUBECONFIG=${HOME}/.kube/config

secrethub read --out-file ${KUBECONFIG} gravitee-io/cicd/envs/integration/k8s/kubeconfig

```

_**Reference Documentation**_ :

https://secrethub.io/docs/guides/key-files/#store

### Secrethub everyday CLI

* Installing secrethub CLI :

 * on linux debian  and probably all deban based linux distrib such as ubuntu, potentially all GNU/Linux distribs) :

```bash

# TODO

# eg : https://github.com/secrethub/secrethub-cli/releases/download/v0.41.0/secrethub-v0.41.0-linux-amd64.tar.gz
export SECRETHUB_CLI_VERSION=0.41.0
export SECRETHUB_OS=linux
export SECRETHUB_CPU_ARCH=amd64

curl -LO https://github.com/secrethub/secrethub-cli/releases/download/v${SECRETHUB_CLI_VERSION}/secrethub-v${SECRETHUB_CLI_VERSION}-${SECRETHUB_OS}-${SECRETHUB_CPU_ARCH}.tar.gz


mkdir -p /usr/local/secrethub
tar -C /usr/local/secrethub -xzf secrethub-v${SECRETHUB_CLI_VERSION}-${SECRETHUB_OS}-${SECRETHUB_CPU_ARCH}.tar.gz

# note : on debian binary is installed to [/usr/bin/secrethub] by package manager

```


 * on `Macos` linux debian  and probably all deban based linux distrib such as ubuntu, potentially all GNU/Linux distribs) :

```bash

# TODO

# eg : https://github.com/secrethub/secrethub-cli/releases/download/v0.41.2/secrethub-v0.41.2-darwin-amd64.tar.gz
export SECRETHUB_CLI_VERSION=0.41.0
export SECRETHUB_OS=darwin
export SECRETHUB_CPU_ARCH=amd64


curl -LO https://github.com/secrethub/secrethub-cli/releases/download/v${SECRETHUB_CLI_VERSION}/secrethub-v${SECRETHUB_CLI_VERSION}-${SECRETHUB_OS}-${SECRETHUB_CPU_ARCH}.tar.gz

mkdir -p /usr/local/secrethub
tar -C /usr/local/secrethub -xzf secrethub-v${SECRETHUB_CLI_VERSION}-${SECRETHUB_OS}-${SECRETHUB_CPU_ARCH}.tar.gz

```



* Signup secret hub uisng the CLI : `secrethub signup` (interactive)

* You now have a secrethub credential file

* Now cheatsheet :

```bash
# --- #
# Checking out my own user account
secrethub account inspect | jq .
# --- #
# see all Organizations you created
secrethub org ls
# --- #
# inspect one Organization
export NAME_OF_ORG="gravitee-lab"
secrethub org inspect "${NAME_OF_ORG}"
# --- #
# retrieve list of all existing repos in an Organization
secrethub org inspect "${NAME_OF_ORG}" | jq .Repos
# --- #
# inspecting a given secrethub repo;, in a organization
# (example assumes there are at least 3 repos in the given Organization)
#
export export NAME_OF_REPO_IN_ORG=$(secrethub org inspect "${NAME_OF_ORG}" | jq .Repos[2] | awk -F '"' '{print $2}')
echo "NAME_OF_REPO_IN_ORG=[${NAME_OF_REPO_IN_ORG}]"
secrethub repo inspect "${NAME_OF_REPO_IN_ORG}" | jq .

# --- #
# listing all directories (like on Filesystem) of a given repo
secrethub ls "${NAME_OF_REPO_IN_ORG}" | jq .
# --- #
# [-q] option to strip column headers, and just
# get the directory path
secrethub ls -q "${NAME_OF_REPO_IN_ORG}"

# --- #
# --- #
# create a directory in a repo, to later write secrets into that directory
# get the directory path
secrethub mkdir "${NAME_OF_REPO_IN_ORG}/whatever/i/want/as/a/path/for/that/directory"
# --- #
# write secrets into that directory
# first secret is a simple string
echo "This is a very secret string I keep secret thanks to secrethub" | secrethub write "${NAME_OF_REPO_IN_ORG}/whatever/i/want/as/a/path/for/that/directory/mysecretone"
# second secret is a file
export FILE_LOCAL_PATH=${HOME}/.somewhere/onme/machine/somefile
mkdir -p ${HOME}/.somewhere/onme/machine
echo "this is very secret and I keep it in that file" > ${FILE_LOCAL_PATH}
secrethub write --in-file ${FILE_LOCAL_PATH} "${NAME_OF_REPO_IN_ORG}/whatever/i/want/as/a/path/for/that/directory/mysecrettwo_is_a_file"
# --- #
# now reading back those two secrets
secrethub read "${NAME_OF_REPO_IN_ORG}/whatever/i/want/as/a/path/for/that/directory/mysecretone"
secrethub read "${NAME_OF_REPO_IN_ORG}/whatever/i/want/as/a/path/for/that/directory/mysecrettwo_is_a_file"

export PATH_ONMY_MACHINE=$(pwd)/where/iwanna/retrieve/that/secret_file/
mkdir -p ${PATH_ONMY_MACHINE}
secrethub read --out-file ${PATH_ONMY_MACHINE} "${NAME_OF_REPO_IN_ORG}/whatever/i/want/as/a/path/for/that/directory/mysecrettwo_is_a_file"

```
* gifty tricks :

```bash
# --- #
# silently remove created directory
secrethub rm -r -f "${NAME_OF_REPO_IN_ORG}/somedirectory"
```

* some example stdouts just to let you see what you wil get should look like :
  * Inspecting and listing existing organizations :

```bash
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ secrethub org ls
NAME          REPOS  USERS  CREATED
gravitee-lab  3      1      6 weeks ago
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ secrethub org inspect gravitee-lab
{
    "Name": "gravitee-lab",
    "Description": "A Secrethub Workspace to test collaboration on SecretHub",
    "CreatedAt": "2020-08-05T20:43:25+02:00",
    "MemberCount": 1,
    "Members": [
        {
            "Username": "graviteebot",
            "Role": "admin",
            "CreatedAt": "2020-08-05T20:43:25+02:00",
            "LastChangedAt": "2020-08-05T20:43:25+02:00"
        }
    ],
    "RepoCount": 3,
    "Repos": [
        "gravitee-lab/apim-gateway",
        "gravitee-lab/ohmyrepo",
        "gravitee-lab/testrepo"
    ]
}
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$

```

* reading simple string secrets :

```bash
export NAME_OF_REPO_IN_ORG="gravitee-lab/apim-gateway"
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ secrethub read "${NAME_OF_REPO_IN_ORG}/staging/docker/quay/botuser/username:63"
gravitee-lab+graviteebot
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ secrethub read "${NAME_OF_REPO_IN_ORG}/staging/docker/quay/botoken/token:63"
6RGGinyourdreamsGGinyourdreamsGGinyourdreamsGGinyourdreamsyeaa5PUC5CJ2
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$

```


### Global initialization Process of all secrets, for all pipelines

* How I initialized the docker registry secrets for the Gravitee CI CD Orchestrator Circle CI Pipeline :

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
export QUAY_BOT_SECRET="inyourdreams;)"
echo "${QUAY_BOT_USERNAME}" | secrethub write "${NAME_OF_REPO_IN_ORG}/dev/docker/quay/botuser/username"

echo "${QUAY_BOT_SECRET}" | secrethub write "${NAME_OF_REPO_IN_ORG}/dev/docker/quay/botuser/token"

# --- #
# And in the Circle CI Pipeline, I will :
#
# QUAY_BOT_USERNAME=$(secrethub read gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/username)
# QUAY_BOT_SECRET=$(secrethub read gravitee-lab/cicd-orchestrator/staging/docker/quay/botoken/token)

```


### Collaboration on the devops/cicd team (sharing secrets, user/permissions mannagement in secrethub)

To begin with, see :
  * secrethub service accounts
  * and (to share secrets) :

```bash
secrethub org invite --help
# --- #
# usage: secrethub org invite [<flags>] <org-name> <username>
#
# Invite a user to join an organization.
#
# Flags:
#       --role="member"  Assign a role to the invited member. This can be either `admin` or `member`. It defaults to `member`.
#                        ($SECRETHUB_ORG_INVITE_ROLE)
#   -f, --force          Ignore confirmation and fail instead of prompt for missing arguments. ($SECRETHUB_ORG_INVITE_FORCE)
#
# Args:
#   <org-name>  The organization name
#   <username>  The username of the user to invite
# --- #

```

### Secrets rotation

### Global backup Process of all secrets, for all pipelines

For the time being I just saved the secrethub credentail file into a private git repo.

That's A "root secret" : a secret which can allow you to retrieve all others.

Another possibilitty : a Hashicorp Vault to harden those root secrets backups (and manage their rotation).

### Secrethub Service Accounts, and Bots Management

For example in `Circle CI` Pipelines, do not use any CircleCI User credential,but instead use _**Service Accounts**_ : https://secrethub.io/docs/reference/cli/service/

https://secrethub.io/docs/reference/cli/service/

So, to initialize the bot running in the `Gravitee CI CD Orchestrator` CircleCI Pipeline I :

* Created a service account for a secrethub repo (which is inside a secrethub organization)
* And gave the service account access to all directories ans secrets inside that secrethub repo.


```bash
# --- #
# created a service account
export NAME_OF_REPO_IN_ORG="gravitee-lab/cicd-orchestrator"
secrethub service init "${NAME_OF_REPO_IN_ORG}" --description "Circle CI Service for Gravitee CI CD Orchestrator" --permission read | tee ./.the-created.service.token

secrethub service ls "${NAME_OF_REPO_IN_ORG}"
echo "Beware : you will see the service token only once, then you will not ever be able to see it again, don'tloose it (or create another)"
# --- #
# and give the service accoutn access to all directories and secrets in the given repo, with the option :
# --- #
# finally, in Circle CI, I created a 'cicd-orchestrator' context in the [gravitee-lab] organization
# dedicated to the Gravitee Ci CD Orchestrator application
# and in that 'cicd-orchestrator' Circle CI context, I set the 'SECRETHUB_CREDENTIAL' env. var. with
# value the token of the service account I just created


```

Also know that there are finer ways to gant service accounts permissions, see https://secrethub.io/docs/reference/cli/service/#permission
