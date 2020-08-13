#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var ReleaseManifestFilter_1 = require("./modules/json/ReleaseManifestFilter");
console.log('I am the Gravitee Release Orchestrator !');
console.log('hey there!');
var manifestParser = new ReleaseManifestFilter_1.ReleaseManifestFilter("45.21.78", "This will be an awesome release, won't it ? :) ");
/// First, parsing the release.json, and returning an A 2-dimensional array
var selectedDependenciesExecutionPlan = manifestParser.parse();
/// then, using the execution plan, we are going to process paralell executions one at a time
