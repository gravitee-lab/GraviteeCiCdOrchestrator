#!/usr/bin/env node
import "./lib/env"
import errorReporter from "./lib/errors"

import { ReleaseManifestFilter } from "./modules/json/ReleaseManifestFilter"



console.log('I am the Gravitee Release Orchestrator !')
console.log('hey there!')

/// DOTENV Checking configuration

console.info(`{[Config]} PRODUCT is set to ${process.env.PRODUCT}`)
console.info(`{[Config]} RETRIES_BEFORE_FAILURE is set to ${process.env.RETRIES_BEFORE_FAILURE}`)
console.info(`{[Config]} SSH_RELEASE_GIT_REPO is set to ${process.env.SSH_RELEASE_GIT_REPO}`)
console.info(`{[Config]} HTTP_RELEASE_GIT_REPO is set to ${process.env.HTTP_RELEASE_GIT_REPO}`)
console.info(`{[Config]} RELEASE_BRANCHES is set to ${process.env.RELEASE_BRANCHES}`)

/// errorReporter.report(new Error("example JBL"))

let manifestParser = new ReleaseManifestFilter("45.21.78", "This will be an awesome release, won't it ? :) ")

/// First, parsing the release.json, and returning an A 2-dimensional array
let selectedDependenciesExecutionPlan : string [][] = manifestParser.parse();

/// then, using the execution plan, we are going to process paralell executions one at a time
