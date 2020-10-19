/*
Author (Copyright) 2020 <Jean-Baptiste-Lasselle>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

If your software can interact with users remotely through a computer
network, you should also make sure that it provides a way for users to
get its source.  For example, if your program is a web application, its
interface could display a "Source" link that leads users to an archive
of the code.  There are many ways you could offer source, and different
solutions will be better for different programs; see section 13 for the
specific requirements.

You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU AGPL, see
<https://www.gnu.org/licenses/>.
*/
import "./lib/env";
import "./lib/errors";
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

/// throw new Error("DEBUG STOP POINT")

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






/*
/// Experiment on retryWhen
const someOtherMonitor = new monitoring_experiments.ExperimentalMonitor("mymonitorDemo", {
  rest_endpoint: 'https://auth-nightly.gravitee.io/management/organizations/DEFAULT/environments/DEFAULT/domains/dine',
  timeout: 10000
});
*/
