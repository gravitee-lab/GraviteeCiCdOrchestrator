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

const spinnerDemo: progress.PipelineExecutionMonitorDemo = new progress.PipelineExecutionMonitorDemo();

spinnerDemo.start();
