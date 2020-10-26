# Deployment : dev repos Pipeline Definition

In this folder, is versioned the standard operation which consists in
deploying the `.circleci/config.yml` Circle CI Pipeline Definition to all
Gravitee Software Development git repositories.


## How to use

What is below called a Gravitee.io dev repo, is  :
* a git repository in the https://github.com/gravitee-io/ Github Organization
* in which is versioned the source code of any https://gravitee.io software component

To deploy the Circle CI Pipeline defintion on all Gravitee.io dev repos, you must :

* Execute the below commands, to consolidate the set of all Gravitee.io dev repos to which the pipeline defintion must be deployed (this will jsut generate files, used in the next operation) :

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
# on gavitee-lab org, for tests
# comment the line below, to consolidate from "gavitee-io" org
# export GITHUB_ORG="gravitee-lab"

./shell/consolidate-dev-repos-inventory.sh

```

* The `<GIT REPO ROOT>/std-ops/deployment/cci-pipeline-defs/dev-repos/.circleci/config.yml` file contains the Circle CI Pipeline Definition to deploy to all Gravitee.io dev repos : edit this to the desired Circle CI Pipeline definition to deploy
* Execute the below commands, to deploy the pipeline definition to all Gravitee.io dev repos :

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
# on "gavitee-lab" org, for tests
# comment the line below, to deploy to "gavitee-io" org
export GITHUB_ORG="gravitee-lab"

./shell/deploy.sh

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
