#!/usr/bin/env node
import { ReleaseManifestFilter } from "./modules/json/ReleaseManifestFilter"

console.log('I am the Gravitee Release Orchestrator !')
console.log('hey there!')

let manifestParser = new ReleaseManifestFilter("45.21.78", "This will be an awesome release, won't it ? :) ")


let selectedDependencies = manifestParser.parse();
