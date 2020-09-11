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

# How to contribute

cf. [How to contribute guide](https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/tree/master/documentation/contribute)

<!--
     (feature branch) cf. [How to contribute guide](https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/tree/feature/specs_implementation/documentation/contribute)
-->


# The Gravitee CICD testing model : An Optimization problem

The problem :

* When pull request are created, from Support or Dev Team, we need to automatically run tests, with Gravitee deloyed.
* For those tests requiring `Gravitee` deployment ready, deployment will always be done in a `Kubernetes` Cluster : `Gravitee` is a `Kubernetes` native / `Kubernetes` first Product.
* `Gravitee` Support and Dev Work Flows are creating a huge number of pull requests
