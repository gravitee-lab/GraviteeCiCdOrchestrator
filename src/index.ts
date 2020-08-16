#!/usr/bin/env node
import "./lib/env"
import errorReporter from "./lib/errors"
import { ReleaseManifestFilter } from "./modules/json/ReleaseManifestFilter"
import { CircleCiOrchestrator } from "./modules/circleci/CircleCiOrchestrator"

/// Welcome
console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('I am the Gravitee Release Orchestrator !')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')

/// DOTENV Checking .DOTENVuration
console.info(`{[.DOTENV]} RELEASE_MANIFEST_PATH is set to ${process.env.RELEASE_MANIFEST_PATH}`)
console.info(`{[.DOTENV]} PRODUCT is set to ${process.env.PRODUCT}`)
console.info(`{[.DOTENV]} RETRIES_BEFORE_FAILURE is set to ${process.env.RETRIES_BEFORE_FAILURE}`)
console.info(`{[.DOTENV]} SSH_RELEASE_GIT_REPO is set to ${process.env.SSH_RELEASE_GIT_REPO}`)
console.info(`{[.DOTENV]} HTTP_RELEASE_GIT_REPO is set to ${process.env.HTTP_RELEASE_GIT_REPO}`)
console.info(`{[.DOTENV]} RELEASE_BRANCHES is set to ${process.env.RELEASE_BRANCHES}`)
console.info(`{[.DOTENV]} SECRETS_FILE_PATH is set to ${process.env.SECRETS_FILE_PATH}`)
console.log('');

errorReporter.report(new Error("{[.DOTENV]} - GraviteeReleaseOrchestrator .DOTENV. Error Manager"))


/// Processing now

let manifestParser = new ReleaseManifestFilter("45.21.78", "This will be an awesome release, won't it ? :) ")

/// First, parsing the release.json, and returning a 2-dimensional array : the execution Plan
let executionPlan : string [][] = manifestParser.buildExecutionPlan();

/// then, using the execution plan, we are going to process parallel executions one after the other
let orchestrator = new CircleCiOrchestrator(executionPlan, 5);
orchestrator.start();
