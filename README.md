# The Gravitee Release Orchestrator

https://gravitee-lab.github.io/GraviteeReleaseOrchestrator/

A distributed software which orchestrates all Gravitee CI CD Processes, bringing distributed builds in.

# How it works

## Where and how the Gravitee CI CD Orchestrator runs

To manage CI CD Processes, the Gravitee CI CD Orchestrator will execute:
* always in a docker container
* a different CI CD Stage based on the `--cicd-stage` (alias `-s`) GNU Option value (required option with no default value)   : SO Gravitee CI CDI Orchestrator hasmultiple personalities syndrom, and we don't want to cure him from that.
* in many git repos :
  * in the release git repo, asthe Release Orchestrator  , using GNU Option `-s mvn_release`
  * in each gravitee component repos, as the Pull Request Bot , using GNU Option `-s pull_req`
  * in a git repo versioning all Product `Dockerfile`s, using GNU Option `-s oci_release`
  * etc...for all CI CD statges, cf. GNU help menu `npm start --help`

In that Sense, The Gravitee CI CD Orchestrator is a distributed software : it's execution definition is distributed (and versioned) among all git repos of an organzation.

What better way to run a distributed application, than git ?


```bash
~$ npm start --help

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
I am the Gravitee CI CD Orchestrator !
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -d, --dry-run

                      Use this option to run the CICD Process Stage in 'dry run'
                      mode.                            [boolean] [default: true]
  -s, --cicd-stage  Use this option to specify the CICD Process to run.

                    ['mvn_release'] designed to run in the
                    [https://github.com/gravitee-lab/release] gravitee-lab git
                    repo, will run the maven release process, handling all
                    dependency tree parallelization, with reactive behavior
                    (using RxJS), based on the 'release.json' versioned in the
                    https://github.com/gravitee-lab/release git repository

                    ['pull_req'] designed to run in every the gravitee-lab
                    product component git repo (dev git repos, aka repos where
                    product source code is versioned), to manage pull requests
                    with different Circle CI Pipeline Workflows, for support
                    sprints, dev sprints, or even secops sprints. , and based
                    on git branch names (prefix).

                    ['release_bundle'] designed to run in the [https://github.
                    com/gravitee-lab/docker-library] gravitee-lab git repo, to
                    make bundles (something like tar arhcives, zip files of
                    jars...) used to install many dependencies in Container
                    images.

                    ['oci_release'] designed to run in the [https://github.com
                    /gravitee-lab/docker-library] gravitee-lab git repo, will
                    run the docker release process : docker builds and push
                    all docker images for the product, LTS and STS Releases

                    ['rpm_release'] designed to run in the [https://github.com
                    /gravitee-lab/docker-library] gravitee-lab git repo,
                    [https://github.com/gravitee-lab/rpm-library] gravitee-lab
                    git repo, will run the RPM release process : builds RPM
                    packagesand publishes them to https://packagecloud.io/

                    ['doc_release'] builds and publish the Gravitee
                    Documentation to https://docs.gravitee.io

                    ['social_release'] builds and publish the Social networks
                    , and communication channels announcements (twitter,
                    medium.com, hackernews, facebook, linkedIn, Jumbo posts on
                    website)

                    ['demos_release'] bluegreen deploys all public gravitee
                    demos

         [required] [choices: "mvn_release", "release_bundle", "docker_release",
          "rpm_release", "doc_release", "demos_release", "social_announcements",
                                                                     "pull_req"]

```


## Circle CI Pipeline definition in Release repo and Gravitee components repo (dev repos)

### Release Repo

* The `gravitee-cicd-orchestrator`, in the https://github.com/gravitee-lab/release  Circle CI Pipeline, will run as a docker container, with the following  `.circleci/config.yml` :


```Yaml
# Machine executor, set the machine key to true in .circleci/config.yml:
version: 2.1

parameters:
  gio_action:
    type: enum
    enum: [wet_release, empty]
    # the [default:] clause is required : without it, a Circle CI error will occur
    # default: none
    # the [default:] clause must have a valid value : without a valid value, a Circle CI error will occur
    default: empty
orbs:
  secrethub: secrethub/cli@1.0.0
jobs:
  empty_job:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: stable-latest
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "This is a dummy empty job (isn't it ?)"
          command: echo "Yes it is."

  dry_run_orchestrator:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: stable-latest
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "Testing local docker installation"
          command: docker version
      - run: # print the name of the branch we're on
          name: "What branch am I on ?"
          command: echo ${CIRCLE_BRANCH}
      - run:
          name: "Docker pull"
          command: |
                    docker pull quay.io/gravitee-lab/cicd-orchestrator:stable-latest
      - run: # print the name of the branch we're on
          name: "Running the Gio CICD Orchestrator as docker container"
          command: |
                    echo "Checking local SGF : "
                    ls -allh

                    # checking docker image pulled in previous step is there
                    docker images
                    # --> .secrets.json is used by Gravitee CI CD Orchestrator to authenticate to Circle CI
                    CCI_SECRET_FILE=$PWD/.secrets.json
                    secrethub read --out-file ${CCI_SECRET_FILE} gravitee-lab/cicd-orchestrator/dev/cci/botuser/.secret.json
                    ls -allh ${CCI_SECRET_FILE}
                    # Docker volumes to map pipeline checked out git tree, .env file and .secrets.json files inside the docker container
                    # export DOCKER_VOLUMES="-v $PWD:/graviteeio/cicd/pipeline -v $PWD/.env:/graviteeio/cicd/.env -v $PWD/.secrets.json:/graviteeio/cicd/.secrets.json"
                    export DOCKER_VOLUMES="-v $PWD:/graviteeio/cicd/pipeline -v $PWD/.secrets.json:/graviteeio/cicd/.secrets.json"
                    docker run --name orchestrator ${DOCKER_VOLUMES} --restart no -itd quay.io/gravitee-lab/cicd-orchestrator:stable-latest -s mvn_release --dry-run
                    docker logs -f orchestrator
  run_orchestrator:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: stable-latest
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "Testing local docker installation"
          command: docker version
      - run: # print the name of the branch we're on
          name: "What branch am I on ?"
          command: echo ${CIRCLE_BRANCH}
      - run:
          name: "Docker pull"
          command: |
                    docker pull quay.io/gravitee-lab/cicd-orchestrator:stable-latest
      - run: # print the name of the branch we're on
          name: "Running the Gio CICD Orchestrator as docker container"
          command: |
                    echo "Checking local SGF : "
                    ls -allh

                    # checking docker image pulled in previous step is there
                    docker images
                    # --> .secrets.json is used by Gravitee CI CD Orchestrator to authenticate to Circle CI
                    CCI_SECRET_FILE=$PWD/.secrets.json
                    secrethub read --out-file ${CCI_SECRET_FILE} gravitee-lab/cicd-orchestrator/dev/cci/botuser/.secret.json
                    ls -allh ${CCI_SECRET_FILE}
                    # Docker volumes to map pipeline checked out git tree, .env file and .secrets.json files inside the docker container
                    # export DOCKER_VOLUMES="-v $PWD:/graviteeio/cicd/pipeline -v $PWD/.env:/graviteeio/cicd/.env -v $PWD/.secrets.json:/graviteeio/cicd/.secrets.json"
                    export DOCKER_VOLUMES="-v $PWD:/graviteeio/cicd/pipeline -v $PWD/.secrets.json:/graviteeio/cicd/.secrets.json"
                    docker run --name orchestrator ${DOCKER_VOLUMES} --restart no -itd quay.io/gravitee-lab/cicd-orchestrator:stable-latest -s mvn_release --dry-run false
                    docker logs -f orchestrator
workflows:
  version: 2.1
  # Release Process DRY RUN
  dry_release_process:
    jobs:
      - dry_run_orchestrator:
          context: cicd-orchestrator
          filters:
            branches:
              # ---
              # Will run only when git commits are pushed to a release branch
              # Therefore, will be triggered when a pull request, with target branch being
              # a release branch, is accepted
              only:
                - 1.20.x
                - 1.25.x
                - 1.29.x
                - 1.30.x
                - 3.0.0-beta
                - 3.0.x
                - 3.1.x
                - master # ? as discussed ? if un-commented, any new pushed commit to master will trigger a Release Process DRY RUN
  release_process:
    when:
      equal: [ wet_release, << pipeline.parameters.gio_action >> ]
    jobs:
      - run_orchestrator:
          context: cicd-orchestrator
          # one cannot filters branches when conditonal workflows ?
          filters:
            branches:
              # ---
              # Will run only when git commits are pushed to master branch
              # Therefore, will be triggered when a pull request is accepted, with target branch being
              # the master branch.
              only:
                - 1.20.x
                - 1.25.x
                - 1.29.x
                - 1.30.x
                - 3.0.0-beta
                - 3.0.x
                - 3.1.x
                - master # ? as discussed ? if un-commented, any new pushed commit to master will trigger a Release Process RUN
  empty_process:
    when:
      equal: [ empty, << pipeline.parameters.gio_action >> ]
    jobs:
      - empty_job:
          context: cicd-orchestrator
          # one cannot filters branches when conditonal workflows
          filters:
            branches:
              # ---
              # Will run only when git commits are pushed to a release branch
              # Therefore, will be triggered when a pull request, with target branch being
              # a release branch, is accepted
              ignore:
                - 1.20.x
                - 1.25.x
                - 1.29.x
                - 1.30.x
                - 3.0.0-beta
                - 3.0.x
                - 3.1.x
                - master
                - /^*/
```


### Gravitee Components Repos (Dev Repos)

* The `gravitee-cicd-orchestrator`, in the https://github.com/gravitee-lab/release  Circle CI Pipeline, will run as a docker container, with the following  `.circleci/config.yml` :




* fork all git repos of components involved in the test release.json `release-data/apim/1.30.x/tests/release.test4-20-conccurrent.json`
* for all those git repos, add the `.circleci/config.yml`  on all release branches, just pushing a new git commit (no pull request)
* add a `.circleci/config.yml`, in the `release.json` : defined like all gravitee components, except that it will run with git branch filter, filtering all release branches :

```Yaml
# Machine executor, set the machine key to true in .circleci/config.yml:
version: 2.1
parameters:
  gio_action:
    type: enum
    enum: [product_release, product_release_dry_run, lts_support_release, sts_support_release, dev_pr_review, support_pr_review, build, pull_requests_bot]
    # the [default:] clause is required : without it, a Circle CI error will occur
    # default: none
    # the [default:] clause must have a valid value : without a valid value, a Circle CI error will occur
    default: pull_requests_bot
  pull_req_bot_image_tag:
    type: string
    default: 'stable-latest' # stable -latest is not understood by docker, as "latest" of all tags. So we will use this docker tag to automatically updae / upgrade the Pull Request Bot
    # default: '3.0.76' # we dpo not use explicit version number for docker tag, for us not to be doomed to update a lot of [.circleci/config.yml]
    # default : 'latest' # we never ever use 'latest', but stable-latest
  is_triggered_from_pr:
    type: boolean
    default: true
orbs:
  secrethub: secrethub/cli@1.0.0
jobs:
  pull_requests_bot_exec:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: stable-latest
      PIPELINE_PARAM_GIO_ACTION: << pipeline.parameters.gio_action >>
      PIPELINE_PARAM_PR_BOT_IMAGE_TAG: << pipeline.parameters.pull_req_bot_image_tag >>
      PIPELINE_PARAM_IS_TRIGGERED_FROM_PR: << pipeline.parameters.is_triggered_from_pr >>
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "Running Pull Request Bot"
          command: |
                    echo "This job will run the pull request bot, in its docker image "
                    echo " ---"
                    echo "Here are the values of the Circle CI Pipeline Parameters : "
                    echo " ---"
                    echo "PIPELINE_PARAM_GIO_ACTION=[${PIPELINE_PARAM_GIO_ACTION}] "
                    echo "PIPELINE_PARAM_PR_BOT_IMAGE_TAG=[${PIPELINE_PARAM_PR_BOT_IMAGE_TAG}] "
                    echo "PIPELINE_PARAM_IS_TRIGGERED_FROM_PR=[${PIPELINE_PARAM_IS_TRIGGERED_FROM_PR}]"
                    echo " ---"
                    echo "Here are the values of the Circle CI pull requests related native env. var. : "
                    echo " ---"
                    echo "CIRCLE_PULL_REQUEST=[${CIRCLE_PULL_REQUEST}] "
                    echo "CIRCLE_PULL_REQUESTS=[${CIRCLE_PULL_REQUESTS}] "
                    echo "CIRCLE_PR_NUMBER=[${CIRCLE_PR_NUMBER}] "
                    echo "CIRCLE_PR_REPONAME=[${CIRCLE_PR_REPONAME}] "
                    echo "CIRCLE_PR_USERNAME=[${CIRCLE_PR_USERNAME}] "
                    echo " ---"
                    echo "Here are the values infered from Circle CI env. var., releated to the checked out git branch, and the last commit that branch : "
                    echo " ---"
                    echo "CHECKED OUT GIT BRANCH IS : [${CIRCLE_BRANCH}] "
                    echo "LAST COMMIT ON THIS BRANCH IS : [$(git rev-parse ${CIRCLE_BRANCH})] "
                    echo "Circle CI [CIRCLE_SHA1] value is [${CIRCLE_SHA1}]"
                    echo " ---"
                    docker pull quay.io/gravitee-lab/cicd-orchestrator:stable-latest
                    # checking docker image pulled in previous step is there
                    docker images
                    # --> .secrets.json is used by Gravitee CI CD Orchestrator to authenticate to Circle CI
                    CCI_SECRET_FILE=$PWD/.secrets.json
                    secrethub read --out-file ${CCI_SECRET_FILE} gravitee-lab/cicd-orchestrator/dev/cci/botuser/.secret.json
                    ls -allh ${CCI_SECRET_FILE}
                    # Docker volumes to map pipeline checked out git tree, .env file and .secrets.json files inside the docker container
                    # export DOCKER_VOLUMES="-v $PWD:/graviteeio/cicd/pipeline -v $PWD/.env:/graviteeio/cicd/.env -v $PWD/.secrets.json:/graviteeio/cicd/.secrets.json"
                    export DOCKER_VOLUMES="-v $PWD:/graviteeio/cicd/pipeline -v $PWD/.secrets.json:/graviteeio/cicd/.secrets.json"
                    docker run --name orchestrator ${DOCKER_VOLUMES} --restart no -itd quay.io/gravitee-lab/cicd-orchestrator:stable-latest -s pull_req --dry-run false
                    docker logs -f orchestrator

  mvn_verify:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_MAVEN_VERSION: 3.6.3
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "Simple Maven Build for the component"
          command: |
                    echo "This job will execute the maven build for the Gravitee IO Component"
                    echo "This job will be triggered for any PR on the github git repo of the Gravitee Component."
                    echo "Never the less, there might be just any"
                    echo "Run Maven Package"
                    export MVN_DOCKER="maven:${DESIRED_MAVEN_VERSION}-openjdk-16 "
                    export MAVEN_COMMAND="mvn clean verify"
                    echo "Run Maven Tests MAVEN_COMMAND=[${MAVEN_COMMAND}]"
                    docker run -it --rm -v "$PWD":/usr/src/mymaven -v "$HOME/.m2":/root/.m2 -w /usr/src/mymaven ${MVN_DOCKER} ${MAVEN_COMMAND}

  product_release_job1:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: 5.27.1
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "First WORKFLOW for Product Release"
          command: |
               echo "First WORKFLOW for Product Release"
  product_release_dry_job1:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: 5.27.1
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "[DRY RUN] First WORKFLOW for Product Release Dry Run"
          command: |
                    echo "[DRY RUN] First WORKFLOW for Product Release Dry Run"
                    echo "Here what will be done is just echoing all Product Release Shell commands, to check their paramters /optionsvalues, the git branch etc..."


  dev_pr_job1:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: 5.27.1
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "A FIRST TEST JOB for Dev Pull Request Review"
          command: |
               echo "A FIRST TEST JOB for Dev Pull Request Review"
  support_pr_job1:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: 5.27.1
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "A FIRST TEST JOB for Support Pull Request Review"
          command: |
               echo "A FIRST TEST JOB for Support Pull Request Review"
  support_release_job1:
    machine:
      image: 'ubuntu-1604:201903-01'    # recommended linux image - includes Ubuntu 16.04, docker 18.09.3, docker-compose 1.23.1
      # resource_class: medium
      # docker_layer_caching: true    # default - false # requires a Circle CI plan that includes [Docker layer caching feature]
    environment:
      DESIRED_DOCKER_TAG: 5.27.1
    steps:
      - checkout
      - secrethub/install
      - run:
          name: "A FIRST TEST JOB for Support Release"
          command: |
               echo "A FIRST TEST JOB for Support Release"

workflows:
  version: 2.1
  pull_requests_bot:
    when:
      equal: [ pull_requests_bot, << pipeline.parameters.gio_action >> ]
    jobs:
      - pull_requests_bot_exec:
          context: cicd-orchestrator
  product_release_dry_run:
    when:
      equal: [ product_release_dry_run, << pipeline.parameters.gio_action >> ]
    jobs:
      - product_release_dry_job1:
          context: gravitee-lab
  product_release:
    when:
      equal: [ product_release, << pipeline.parameters.gio_action >> ]
    jobs:
      - product_release_job1:
          context: gravitee-lab
  lts_support_release:
    when:
      equal: [ lts_support_release, << pipeline.parameters.gio_action >> ]
    jobs:
      - support_release_job1:
          context: gravitee-lab
  sts_support_release:
    when:
      equal: [ sts_support_release, << pipeline.parameters.gio_action >> ]
    jobs:
      - support_release_job1:
          context: gravitee-lab

  support_pr_review:
    when:
      equal: [ support_pr_review, << pipeline.parameters.gio_action >> ]
    jobs:
      - support_pr_job1:
          context: gravitee-lab
  dev_pr_review:
    when:
      equal: [ dev_pr_review, << pipeline.parameters.gio_action >> ]
    jobs:
      - dev_pr_job1:
          context: gravitee-lab
  build:
    when:
      equal: [ build, << pipeline.parameters.gio_action >> ]
    jobs:
      - mvn_verify:
          context: cicd-orchestrator
```

* running the `gravitee-cicd-orchestrator`, in the https://github.com/gravitee-lab/release  Circle CI Pipeline, as a docker container, will basically look like :

```bash
export CICD_STAGE_NAME=mvn_release
export CICD_STAGE_NAME=pull_req
export CICD_STAGE_NAME=oci_release
export CICD_STAGE_NAME=release_bundle
export CICD_STAGE_NAME=doc_release
export CICD_STAGE_NAME=social_release

# any stage can run in dry-run mode
# and you will build a CI CD Proces, by combining,Orchestrating a set of CICD Stages.


docker run --name orchestrator -v $PWD/pipeline:/graviteeio/cicd/pipeline -v $PWD/.env:/graviteeio/cicd/.env --restart no -itd quay.io/gravitee-lab/cicd-orchestrator:stable-latest -s ${CICD_STAGE_NAME} --dry-run true

# and then display logs
docker logs -f orchestrator
```



# Drafts

The following branches are present on https://github.com/gravitee-lab/release :

* `1.20.x`
* `1.25.x`
* `1.30.x`
* `3.0.0-beta`
* `3.0.x`
* `3.0.0-beta`
* `3.1.x`
* (and There will be other support branches for future Major / Minor versions.)

To make a new release, the process is the following :

* will parse `release.json` to determine which `Gravitee APIM` dependencies have to be released,
* will then request Circle CI REST API to trigger , for each selected `Gravitee APIM` dependency, the Pipeline defined in the `.circleci/config.yml` of each of those dependencies, to actually distribute the build (and scale it out)
* will trigger the Circle CI Pipelines respecting the paralellization constriants defined by the  `buildDependencies` property in the `release.json`, to maximize scale out.
* confer to  the specs specified in `CICD_APIM_TheGroovyGraviteeReleaseProcess.png` (team privately shared document)

The **Gravitee Release Orchestrator** makes use of the following technologies :
* `typescript`
* [`.DOTENV`](https://github.com/motdotla/dotenv), to manage its confguration file `.env`, as a twelve factor app.
* The [Circle CI client](https://www.npmjs.com/package/circleci#startbuild), to hit Circle CI REST API, trigger builds, and inspect them.
* `typedoc`
* `RxJS` to process asynchronous Circle CI API calls
* [CLI Progess](https://www.npmjs.com/package/cli-progress#multi-bar-mode), to display a "multi progess bar", in the std output, and inform of execution progress for each dependency in a parallel execution set.
* `Docker`, to containerize the Gravitee CICD Orchestrator


# Buld, test n run

The **Gravitee Release Orchestrator** makes use of secrets : the Circle CI `username` and `token`.

The **Gravitee Release Orchestrator**  will load those secrets from a local json file, which path is `.secrets.json`.

You can set the `SECRETS_FILE_PATH``env. variable n the `.env` file, to set the secret file path to another location.

The **Gravitee Release Orchestrator**  secrets file, must have the following structure (soon, a JSon Schema) :

```JSon
{
  "circleci": {
    "auth": {
      "username": "Jean-Baptiste-Lasselle", /// should be a bot
      "token": "KZSOx/FPEKFFAKEFAKEPQLvKQQCdsD5-dsTRQSDLKQqsd"
    }
  }
}
```


* create the `.secrests.json` file, add your Gravitee Bot's username and token,
* set the confguration values in the `.env`, and run :

```bash
npm start
```

* build _(compile, test, and generate source code docs)_ :

```bash
npm run build
```

* compile source code with `tsc` :

```bash
npm run compile
```

* test :

```bash
npm run test
```

* generate source code [typedoc](https://github.com/TypeStrong/typedoc) :

```bash
npm run doc
```

# Running locally with docker

```bash
# --- #
# edit the Dockerfile, git commit and push : this will trigger
# Circle CI Pipeline, and re-build and push a new 'stable-latest' tagged
# OCI image to the docker registry
# --- #
# retrieve the realse.json you wanna work on
#
git clone https://github.com/gravitee-lab/release graviteeio/cicd/pipeline
# --- #
# (re-)spawn it all, re-downloading the "stable-latest image"
#
docker-compose down --rmi all && docker-compose up --force-recreate -d
# --- #
# retrieve the realse.json you wanna work on
#
sudo git clone https://github.com/gravitee-lab/release graviteeio/cicd/pipeline
# enter the beast, to test it :
docker exec -it gio_cicd_orchestrator sh
```

# How to contribute

cf. [How to contribute guide](https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/tree/master/documentation/contribute)

<!--
     (feature branch) cf. [How to contribute guide](https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/tree/feature/specs_implementation/documentation/contribute)
-->

# The gravitee CICD Processes

This part of ducemntation is important for the Gravitee CICD Orchestrator autobot, and is also confidential at Gravitee.

cf. https://github.com/gravitee-io/kb/wiki/The-Gravitee-CICD-Reference-Guide#the-gravitee-cicd-testing-model--an-optimization-problem
