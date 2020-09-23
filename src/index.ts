import "./lib/env";
import errorReporter from "./lib/errors";
import { ReleaseManifestFilter } from "./modules/manifest/ReleaseManifestFilter";
import { CircleCiOrchestrator } from "./modules/circleci/CircleCiOrchestrator";
import { monitoring }  from './modules/monitor/Monitor';
import { monitoring_experiments }  from './modules/monitor/ExperimentalMonitor';
import * as cicd_spinner from './modules/progress/PipelineExecutionSpinner';
/// import { Observable } from 'rxjs';
import * as rxjs from 'rxjs';
import * as cli from './modules/cli/GNUOptions';
/// import { gnuOptions } from './modules/cli/GNUOptions';


/// Welcome
console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('I am the Gravitee Release Orchestrator !')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')

/// export const cli.gnuOptions;

export const gnuOptions: cli.GNUOptions = new cli.GNUOptions();
/// export const cliGnuOptions = gnuOptions;

console.log(`valeur yargs de l'option YARGS 'dry-run' : ${gnuOptions.argv["dry-run"]}`);
console.log(`valeur yargs de l'option YARGS 'cicd-stage' : ${gnuOptions.argv["cicd-stage"]}`);


throw new Error("STOP DEBUG POINT - work on yargs");

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


/// ---
/// ReleaseManifestFilter runs inside the Circle CI pipeline defined in the
///
///
/// ---
let manifestParser = new ReleaseManifestFilter("45.21.78", "This will be an awesome release, won't it ? :) ")
/// ---
/// First, parses the locally git cloned [release.json], and returns a
/// 2-dimensional array : the execution Plan
/// ---
let executionPlan : string [][] = manifestParser.buildExecutionPlan();



/// throw new Error("DEBUG POINT");

/// then, using the execution plan, we are going to process parallel executions one after the other
let orchestrator = new CircleCiOrchestrator(executionPlan, 5);
orchestrator.start();




/// Experiment on retryWhen
export const someOtherMonitor = new monitoring_experiments.ExperimentalMonitor("mymonitorDemo", {
  rest_endpoint: 'https://auth-nightly.gravitee.io/management/organizations/DEFAULT/environments/DEFAULT/domains/dine',
  timeout: 10000
});

/*
const demoResponse$ = someOtherMonitor.demoRetryWhen();

const demoSubscription = demoResponse$.subscribe(fetchedResult => {
  console.log('')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log(' >>>>>>>>>>>>>> I am the Gravitee CICD MONITOR (demo-ing on retryWhen) !')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
  console.log('')
  console.log(` subscriber got fetchedResult = [${JSON.stringify(fetchedResult.data)}]`)
});



/// ---
/// PipelineExecutionSpinner Test
/// ---


let pipeRefZero: cicd_spinner.IPipelineRef = {
  number: 2467,
  uuid: 'ea78881d-0493-4b00-b7ba-9ebfssdb87c',
  workflows: [
  {
    name: 'workf1',
    spinner: null
  },
  {
    name: 'workf2',
    spinner: null
  },
  {
    name: 'workf3',
    spinner: null
  },
  {
    name: 'workf4',
    spinner: null
  }
]};



let pipeRef1: cicd_spinner.IPipelineRef = {
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


let pipeRef2: cicd_spinner.IPipelineRef = {
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


/// ---
/// PipelineExecutionProgress Test
/// ---

let pExecSpinner = new cicd_spinner.PipelineExecutionSpinner(pipeRef1);

pExecSpinner.start();


*/
