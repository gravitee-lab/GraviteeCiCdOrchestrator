#!/usr/bin/env node
import { ReleaseManifestFilter } from "./modules/json/ReleaseManifestFilter"

console.log('I am the Gravitee Release Orchestrator !')
console.log('hey there!')

let manifestParser = new ReleaseManifestFilter("45.21.78", "This will be an awesome release, won't it ? :) ")

/// First, parsing the release.json, and returning an A 2-dimensional array
let selectedDependenciesExecutionPlan : string [][] = manifestParser.parse();

/// then, using the execution plan, we are going to process paralell executions one at a time
