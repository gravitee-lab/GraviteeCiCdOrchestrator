import "./lib/env";
import errorReporter from "./lib/errors";
import { ReleaseManifestFilter } from "./modules/manifest/ReleaseManifestFilter";
import { CircleCiOrchestrator } from "./modules/circleci/CircleCiOrchestrator";
import { monitoring }  from './modules/monitor/Monitor';
import { monitoring_experiments }  from './modules/monitor/ExperimentalMonitor';
import * as cicd_spinner from './modules/progress/PipelineExecutionSpinner';
/// import { Observable } from 'rxjs';
import * as rxjs from 'rxjs';
/// import * as cli from './modules/cli/GNUOptions';
import { gnuOptions } from './modules/cli/GNUOptions';


/// Welcome
console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('I am the Gravitee Release Orchestrator !')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')

/// export const cli.gnuOptions;

const cliGnuOptions = gnuOptions;

/*
let cicd_stage_option_desc = "\n\n" +`['mvn_release'] will run the maven release process, handling all dependency tree parallelization, with reactive behavior (using RxJS), based on the 'release.json' versioned in the https://github.com/${process.env.GH_ORG}/release git repository`
cicd_stage_option_desc += "\n\n" +`['docker_release'] will run the docker release process : docker builds and push all docker images for the product, LTS and STS Releases`
cicd_stage_option_desc += "\n\n"

const argv = yargs.options({
  'dry-run': { type: 'boolean', default: true, desc: "Use this option to run the CICD Process dry, or not.", alias: 'd' },
  'cicd-stage': { choices: ['mvn_release', 'docker_release', 'rpm_release', 'doc_release', 'deploy_demos', 'social_announcements'], demandOption: true, desc: `Use this option to specify the CICD Process to run. ${cicd_stage_option_desc}`, alias: 's' },

  b: { type: 'string', demandOption: true },
  c: { type: 'number', alias: 'chill' },
  d: { type: 'array' },
  e: { type: 'count' },
  f: { choices: ['1', '2', '3'] }
}).argv;

console.log(`valeur yargs de l'option YARGS 'dry-run' : ${argv["dry-run"]}`);
console.log(`valeur yargs de l'option YARGS 'b' : ${argv["b"]}`);
*/
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
