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
import * as rxjs from 'rxjs';
import { map, tap, retryWhen, delayWhen,delay,take } from 'rxjs/operators';
import axios from 'axios';
import {AxiosResponse} from 'axios';
import * as fs from 'fs';
import * as Collections from 'typescript-collections';
import { monitoring }  from '../../modules/monitor/Monitor';
import * as parallel from '../../modules/monitor/ParallelExecutionSetProgress';
import { GraviteeComponent } from '../../modules/manifest/GraviteeComponent';
import { ParallelExecutionSet } from '../../modules/manifest/ParallelExecutionSet'
import { CircleCIClient } from '../../modules/circleci/CircleCIClient'
import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import { ReactiveParallelExecutionSet } from '../../modules/circleci/ReactiveParallelExecutionSet'
import {ReleaseProcessStatePersistenceManager} from '../../modules/resume-release/ReleaseProcessStatePersistenceManager';

/**
 *
 *  CICD Stage : Represents the Pull Request Bot managing the Pull Request CICD Stage
 *  [--cicd-stage mvn_release] GNU Option to activate
 *
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * [gravitee_release_branch] must match one of the existing branch on https://github.com/gravtiee-io/release.git, see [.DOTNEV] [RELEASE_BRANCHES] env. var.
 *
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {
    private releaseStatePersistenceMngr: ReleaseProcessStatePersistenceManager;
    /**
    * <p>
    * The Execution plan listing all the components that should be included in the release :
    * <p>
    * <ul>
    * <li>The 2-dim. Array has the exact same structure as the 'buildDependencies' JSON property in the 'release.json' (from https://github.com/gravitee-io/release.git)</li>
    * <li>The 2-dim. Array has the exact same entries than the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git), only  structure as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git), only all dependencies that do not require processing release, were removed as Array entries.</li>
    * <li>The 2-dim. Array has the exact same length as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git), only some entries are empty arrays (not undefined, but of length zero)</li>
    * <ul>
     * -----
     * Example Execution Plan :
     * -----
     * <pre>
     *      [
     *          [
     *              "gravitee-common"
     *          ],
     *          [
     *          ],
     *          [
     *              "gravitee-repository-test"
     *          ],
     *          [
     *              "gravitee-reporter-api",
     *              "gravitee-notifier-email"
     *          ],
     *          [
     *          ],
     *          [
     *          ],
     *          [
     *          ],
     *          [
     *          ],
     *          [
     *              "gravitee-resource-oauth2-provider-api"
     *          ],
     *          [
     *              "gravitee-resource-cache"
     *          ],
     *          [
     *              "gravitee-policy-apikey",
     *              "gravitee-policy-ratelimit",
     *              "gravitee-policy-dynamic-routing",
     *              "gravitee-fetcher-bitbucket",
     *              "gravitee-fetcher-github"
     *          ],
     *          [
     *              "gravitee-management-rest-api",
     *              "gravitee-management-webui"
     *          ]
     *      ]
     * </pre>
     *
     *
     * See also {@see ReleaseManifestFilter#buildExecutionPlan() }
     *
     **/
    private execution_plan: string [][];
    /**
     * Example Progress Matrix :
     * -----
     * <pre>
     *      {
     *        "progressMatrix": [
     *          {
     *            "pipeline": {
     *              "execution_index": "15",
     *              "id": "71938e5a-536f-482f-8bef-edae81801fb9",
     *              "created_at": "2020-08-16T22:34:58.224Z",
     *              "exec_state": "pending"
     *            }
     *          },
     *          {
     *            "pipeline": {
     *              "execution_index": "16",
     *              "id": "952de923-293b-4829-add4-056c4f95940a",
     *              "created_at": "2020-08-16T22:34:58.273Z",
     *              "exec_state": "pending"
     *            }
     *          },
     *          {
     *            "pipeline": {
     *              "execution_index": "17",
     *              "id": "c3ea1b05-1273-42ce-a04f-7e9fa8aa4d93",
     *              "created_at": "2020-08-16T22:34:58.282Z",
     *              "exec_state": "pending"
     *            }
     *          },
     *          {
     *            "pipeline": {
     *              "execution_index": "18",
     *              "id": "a42e7542-fded-4163-9e0a-a5839370ede6",
     *              "created_at": "2020-08-16T22:34:58.302Z",
     *              "exec_state": "pending"
     *            }
     *          },
     *          {
     *            "pipeline": {
     *              "execution_index": "19",
     *              "id": "46b17f2b-3b3f-4c9f-a6b3-5e608c113bab",
     *              "created_at": "2020-08-16T22:34:58.305Z",
     *              "exec_state": "pending"
     *            }
     *          }
     *        ]
     *      }
     *
     * </pre>
     *
     **/
    private pipelines_nb: number;
    private parallelExecutionSetsNotifier: rxjs.Subject<number> = new rxjs.Subject<number>(); // this one will be used to find out when each parallelExecutionSet has completed
    private parallelExecutionSetsNotifiers: rxjs.Subject<number>[]; // this one will be used to find out when each parallelExecutionSet has completed
    /**
     * The current parallel execution set being processed
     **/
    /// private currentParallelExecutionsSetIndex: number;
    private retries: number;
    private circleci_client: CircleCIClient;


    constructor(execution_plan: string [][], retries: number) {
      this.execution_plan = execution_plan;
      this.pipelines_nb = 0;
      for (let i: number = 0; i < this.execution_plan.length; i++) {
        this.pipelines_nb = this.pipelines_nb + this.execution_plan[i].length;
      }


      this.retries = retries;
      this.circleci_client = new CircleCIClient();
      this.releaseStatePersistenceMngr = new ReleaseProcessStatePersistenceManager();
      this.initializeNotifiers();

      this.parallelExecutionSetsNotifier.subscribe({
        next: (parallelExecutionSetIndex) => {
          console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
          console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
          console.info('{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x');
          console.info("{[CircleCiOrchestrator]} - PARALLEL EXECUTION SET NO.[" + parallelExecutionSetIndex  + "] JUST COMPLETED TRIGGERING [CIRCLE CI] PIPELINES - ");
          console.info('{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x');
          console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
          console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
        }
      })
    }
    private initializeNotifiers() : void {
      this.parallelExecutionSetsNotifiers = [];
      for (let k: number = 0; k < this.execution_plan.length; k++) {
        this.parallelExecutionSetsNotifiers[k] = new rxjs.Subject<number>();
        this.parallelExecutionSetsNotifiers[k].subscribe({
          next: ((parallelExecutionSetIndex: number) => {
            console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
            console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
            console.info('{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x');
            console.info("{[CircleCiOrchestrator]} - PARALLEL EXECUTION SET NO.[" + parallelExecutionSetIndex  + "] JUST COMPLETED TRIGGERING [CIRCLE CI] PIPELINES - ");

            if (parallelExecutionSetIndex + 1 < this.execution_plan.length){
              console.info("{[CircleCiOrchestrator]} - NOW EXECUTING NEXT PARALLEL EXECUTION SET NO.[" + (parallelExecutionSetIndex + 1) + "]  - ");
              /// console.info("{[CircleCiOrchestrator]} - Intropsecting the [this] instance  => [" + JSON.stringify(this, null , " ") + "]  - ");
              /// console.info("{[CircleCiOrchestrator]} - The [typeof this] is  => [" + (typeof this) + "]  - ");

              this.processExecutionSetNumber(parallelExecutionSetIndex + 1)
            } else {
              console.info("{[CircleCiOrchestrator]} - NOT EXECUTING NEXT PARALLEL EXECUTION SET, BECAUSE CURRENT IS LAST OF INDEX NO.[" + parallelExecutionSetIndex + "]  - ");
            }

            console.info('{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x');
            console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
            console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x');
          }).bind(this)
        })
      }

    }


    /**
     * returning an A 2-dimensional array
     **/
    start()  : void {
      console.info("");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[CircleCiOrchestrator]} - STARTING PROCESSING EXECUTION PLAN - ");
      console.info("[{CircleCiOrchestrator}] - will retry " + this.retries + " times triggering a [Circle CI] pipeline before giving up.")
      console.info("{[CircleCiOrchestrator]} - Execution plan is the value of the 'execution_plan_is' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ execution_plan_is: this.execution_plan}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");
      this.releaseStatePersistenceMngr.tagReleaseStart("CICD Orchestrator starts here The Release")

      /* WORKING TEST
      let parallelExecSet1: ReactiveParallelExecutionSet = new ReactiveParallelExecutionSet(this.execution_plan[3], 3, this.circleci_client, this.parallelExecutionSetsNotifiers[3]); // test cause I know entry of index 3 will exists in [this.execution_plan] , and will have several entries
      // let subscription1 : rxjs.Subscription = parallelExecSet1.doSubscribe(); // this.parallelExecutionSetsNotifier // this.parallelExecutionSetsNotifier.next(3)
      parallelExecSet1.doSubscribe(); // this.parallelExecutionSetsNotifier // this.parallelExecutionSetsNotifier.next(3)
      parallelExecSet1.triggerPipelines();
      */
      /// this.processExecutionSetNumber(3); // anomaly here : should start at zero
      this.processExecutionSetNumber(0);

    }

    private processExecutionSetNumber(parallelExecutionsSetIndex: number) : void {

      console.info("[{CircleCiOrchestrator}] - processing Parallel Execution Set no. ["+`${parallelExecutionsSetIndex}`+"] will trigger the following [Circle CI] pipelines : ");
      if (this.execution_plan[parallelExecutionsSetIndex].length == 0) {

        if (parallelExecutionsSetIndex + 1 < this.execution_plan.length) { // reccurrence stop condition
          console.info("[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. ["+`${parallelExecutionsSetIndex}`+"] because it is empty, proceed with next");
          this.processExecutionSetNumber(parallelExecutionsSetIndex + 1)
        } else {
          console.info("[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. ["+`${parallelExecutionsSetIndex}`+"] because it is empty, do not proceed with next, cause this was last.");
        }
      } else {

        let isLast:boolean = (this.getLastNonEmptyParallelExecutionSetIndex() == parallelExecutionsSetIndex);
        console.log(`[{CircleCiOrchestrator}] - is [${parallelExecutionsSetIndex}] the last non empty parallel execution set ? Answer : [${isLast}]`)
        let parallelExecSet1: ReactiveParallelExecutionSet = new ReactiveParallelExecutionSet(this.execution_plan[parallelExecutionsSetIndex], parallelExecutionsSetIndex, this.circleci_client, this.parallelExecutionSetsNotifiers[parallelExecutionsSetIndex], isLast); // test cause I know entry of index 3 will exists in [this.execution_plan] , and will have several entries
        // let subscription1 : rxjs.Subscription = parallelExecSet1.doSubscribe(); // this.parallelExecutionSetsNotifier // this.parallelExecutionSetsNotifier.next(3)
        parallelExecSet1.doSubscribe(); // this.parallelExecutionSetsNotifier // this.parallelExecutionSetsNotifier.next(3)
        parallelExecSet1.triggerPipelines();
      }

    }

    private getLastNonEmptyParallelExecutionSetIndex() : number {
      let toReturn: number = -1;
      console.info("[{CircleCiOrchestrator}] - ");
      for (let k:number = 0; k < this.execution_plan.length; k++) {
        if (this.execution_plan[k].length != 0) {
          toReturn = k;
        }
      }
      return toReturn;
    }

}
