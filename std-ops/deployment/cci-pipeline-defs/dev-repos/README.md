# Gravitee CI CD Orchestrator Circle CI Integration

The `Gravitee CI CD Orchestrator` relies a lot on Circle CI, to run most of its operations.

The integration setup between the `Gravitee CI CD Orchestrator` and Circle CI, most consists of
the following steps :

* Run the [Automated Deployment of dev repos Pipeline Definition](#automated-deployment-of-dev-repos-pipeline-definition) :
  * This will produce a `consolidated-git-repos-uris.list` file listing all github.com repositories the `Gravitee CI CD Orchestrator` will control.
* For each Gravitee.io dev repo, listed in the `consolidated-git-repos-uris.list` file, you must _manually_ "setup to start building" each of them in the Cirlce CI Web UI :
  * As of `2020`, Circle CI does not provide any mean to auomate this operation
  * If any Circle CI pipeline keeps running, at this stage, manually cancel its execution.
* Finally, you will run the [Automated Ssh Key Setup of Pipelines](#automated-ssh-key-setup-of-pipelines) :
  * Every Circle CI Pipeline will git clone the source code of the github git repository it stands for.
  * and to run the git clone cloen command, Circle Ci mandatorily uses ssh, and therefore needs a private SSH Key
  * before running the [Automated Ssh Key Setup of Pipelines](#automated-ssh-key-setup-of-pipelines), an `Owner` of the `https://github.com/${GITHUB_ORG}` Github Organization must have [setup the SSH Secrets]()








## Automated Deployment of dev repos Pipeline Definition

In this folder, is versioned the standard operation which consists in
deploying the `.circleci/config.yml` Circle CI Pipeline Definition to all
Gravitee Software Development git repositories.

What is below called a Gravitee.io dev repo, is  :
* a git repository in the https://github.com/gravitee-io/ Github Organization
* in which is versioned the source code of any https://gravitee.io software component

To deploy the Circle CI Pipeline defintion on all Gravitee.io dev repos, you must :

* Edit `<THIS GIT REPO ROOT>/std-ops/deployment/cci-pipeline-defs/dev-repos/.circleci/config.yml` file, which contains the Circle CI Pipeline Definition to deploy to all Gravitee.io dev repos : and git commit and push it, with a new release version number.
* Execute the below commands, to
  * consolidate the set of all Gravitee.io dev repos to which the pipeline defintion must be deployed (this will just generate files, used in the next operation)
  * and execute the deployment

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
export GIT_COMMIT_MESSAGE="Deploying Gravitee.io dev repos Circle CI Pipeline connfig version [${GIO_ORCHESTRATOR_VERSION}] "
# (Optional) The GPG public Key to use, to sign commits. Has no default value, and if not set, then git is configured with [git config --global commit.gpgsign false]
export GIT_USER_SIGNING_KEY=7B19A8E1574C2883



# --- #
# List of all git branches to work with, from
# the https://github.com/${GITHUB_ORG}/release
# list must be comma-separated, white spaces are trimmed
# --- #
export RELEASE_BRANCHES=' 3.2.x , 3.1.x ,   3.0.x, 1.30.x,   1.29.x ,1.25.x , 1.20.x   '
./deploy.sh

```

## Automated Ssh Key Setup of Pipelines

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

```

## Secret Management and SSH Keys for Circle CI Pipelines

This section is useful for the Owner of the `https://github.com/${GITHUB_ORG}` Github Organization who
will setup a secret used in the [Automated Ssh Key Setup of Pipelines](#automated-ssh-key-setup-of-pipelines)




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
