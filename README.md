# The Gravitee Release Orchestrator

https://gravitee-lab.github.io/GraviteeReleaseOrchestrator/

A Component in `Gravitee`'s CICD, that orchestrates Gravitee CICD, bringing distributed builds in.

## How it works

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
