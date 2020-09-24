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
import { Cli } from './modules/cli/Cli';
import * as pr_robotics from './modules/pr-bot/PullRequestBot'





/// Welcome
console.log('')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('I am the Gravitee CI CD Orchestrator !')
console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
console.log('')

export const cli : Cli = new Cli();

console.log(`{[ index.ts ]} --- valeur yargs de l'option YARGS 'dry-run' : ${cli.gnuOptions.argv["dry-run"]}`);
console.log(`{[ index.ts ]} --- valeur yargs de l'option YARGS 'cicd-stage' : ${cli.gnuOptions.argv["cicd-stage"]}`);

process.argv = cli.gnuOptions.argv;

console.log(`{[ index.ts / process.argv ]} --- valeur yargs de l'option YARGS 'dry-run' : ${process.argv["dry-run"]}`);
console.log(`{[ index.ts / process.argv ]} --- valeur yargs de l'option YARGS 'cicd-stage' : ${process.argv["cicd-stage"]}`);



if (process.argv["cicd-stage"] === 'pull_req') {
  console.log(`{[ index.ts ]} --- Now instantiating [PullRequestBot]`);
  const pr_bot: pr_robotics.PullRequestBot = new pr_robotics.PullRequestBot();
  if (process.argv["dry-run"] === 'true') {
    console.log(`{[ index.ts ]} --- Now executing [PullRequestBot] in dry-run mode`);
    pr_bot.executeDry();
  } else {
    console.log(`{[ index.ts ]} --- Now executing [PullRequestBot] in non-dry-run mode`);
    pr_bot.execute();
  }
} else if (process.argv["cicd-stage"] === 'mvn_release') {
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

  /// then, using the execution plan, we are going to
  /// process parallel executions one after the other
  let orchestrator = new CircleCiOrchestrator(executionPlan, 5);
  orchestrator.start();

}







/// throw new Error("STOP DEBUG POINT - work on yargs");







/// Experiment on retryWhen
const someOtherMonitor = new monitoring_experiments.ExperimentalMonitor("mymonitorDemo", {
  rest_endpoint: 'https://auth-nightly.gravitee.io/management/organizations/DEFAULT/environments/DEFAULT/domains/dine',
  timeout: 10000
});
