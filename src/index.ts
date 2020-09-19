#!/usr/bin/env node
import "./lib/env";
import errorReporter from "./lib/errors";
import { ReleaseManifestFilter } from "./modules/manifest/ReleaseManifestFilter";
import { CircleCiOrchestrator } from "./modules/circleci/CircleCiOrchestrator";
import { monitoring }  from './modules/monitor/Monitor';
import { monitoring_experiments }  from './modules/monitor/ExperimentalMonitor';
import * as ora from 'ora';
import * as progress from './modules/progress/PipelineExecutionMonitor';

/// Welcome
console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('I am the Gravitee Release Orchestrator !')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')






const pipeline1: progress.IPipelineRef = {
  number: 2458,
  uuid: 'fe08c622-a779-45ee-aa0b-672c2d4fedea',
  workflows: [
  {
    name: 'tests_without_deployment',
    spinner: null
  },
  {
    name: 'docker_build',
    spinner: null
  },
  {
    name: 'docker_push',
    spinner: null
  }
]};

const pipeline2: progress.IPipelineRef = {
  number: 2467,
  uuid: 'ea73741d-0493-4b00-b7ba-9ebefbb87c25',
  workflows: [
  {
    name: 'tests_without_deployment',
    spinner: null
  },
  {
    name: 'setup_integ_deployment_target',
    spinner: null
  },
  {
    name: 'integration_tests',
    spinner: null
  },
  {
    name: 'docker_build_n_push',
    spinner: null
  }
]};

console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')
console.log(`Pipeline execution (Circle CI pipeline #[${pipeline1.number}] / pipeline uuid[${pipeline1.uuid}])`);
console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')


for (let i = 0; i < pipeline1.workflows.length; i++) {
  pipeline1.workflows[i].spinner = ora(` Workflow (${pipeline1.workflows[i].name}) Running`).start();
  console.log('')
  pipeline1.workflows[i].spinner.color = 'yellow'; // running
}

for (let i = 0; i < pipeline1.workflows.length; i++) {
  setTimeout(() => {
      pipeline1.workflows[i].spinner.color = 'red'; // errored
      pipeline1.workflows[i].spinner.color = 'green'; // completed
      pipeline1.workflows[i].spinner.text = 'Completed !';
      console.log('')
      console.log(`debug [i+1]=[${i + 1}]`);
      console.log(`debug [pipeline1.workflows.length]=[${pipeline1.workflows.length}]`);
      if ((i + 1) == pipeline1.workflows.length) {
        console.log(`throwing Error debug [i+1]=[${i + 1}]`);
        throw new Error("DEBUG STOP POINT");
      }
  }, (i + 1) * 3000);
}
