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

/**
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * [gravitee_release_branch] must match one of the existing branch on https://github.com/gravtiee-io/release.git, see [.DOTNEV] [RELEASE_BRANCHES] env. var.
 *
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {

    private github_org: string;
    private monitor: monitoring.Monitor;
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
    private progressMatrix: any[];
    private progressMatrixSubject = new rxjs.Subject<any>();
    private pipelines_nb: number;
    private parallelExecutionSetsNotifier = new rxjs.Subject<number>(); // this one will be used to find out when each parallelExecutionSet has completed
    /**
     * The current parallel execution set being processed
     **/
    /// private currentParallelExecutionsSetIndex: number;
    private retries: number;
    private circleci_client: CircleCIClient;
    private secrets: CircleCISecrets;


    constructor(execution_plan: string [][], retries: number) {
      this.execution_plan = execution_plan;
      this.pipelines_nb = 0;
      for (let i: number = 0; i < this.execution_plan.length; i++) {
        this.pipelines_nb = this.pipelines_nb + this.execution_plan[i].length;
      }


      this.retries = retries;
      this.loadCircleCISecrets();
      this.circleci_client = new CircleCIClient(this.secrets);
      /// initialiazing [this.progressMatrix] to an Array of same lentgh as [this.execution_plan], but with empty arrays as entries
      // this.progressMatrix = new SimpleProgressMatrix();
      this.progressMatrix = [];

      this.github_org = process.env.GH_ORG;

      this.parallelExecutionSetsNotifier.subscribe({
        next: (data) => {
          console.log( '[CircleCiOrchestrator] => Parallel Execution Set no.['+ data +'] just completed triggering [Circle CI] Pipelines'  )
        }
      })
    }

    loadCircleCISecrets () : void { ///     private secrets: CircleCISecrets;
      /// first load the secretfile

      let secretFileAsString: string = fs.readFileSync(process.env.SECRETS_FILE_PATH,'utf8');
      this.secrets = JSON.parse(secretFileAsString);
      console.debug('');
      console.debug("[{CircleCiOrchestrator}] - secrets file content :");
      console.debug('');
      console.debug(this.secrets)
      console.debug('');

    }
    /**
     * Queries Circle CI API ti check identity of the
     * authenticated Circle CI user
     * @returns the JSON Object returned by Circle CI API
     **/
    public whoami(): any {
      let whoamiSubscription = this.circleci_client.whoami().subscribe({
        next: data => console.log( '[Whomai data] => ', data ),
        complete: data => console.log( '[complete]' )
      });
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
      console.info(JSON.stringify({ third_is: this.execution_plan[3]}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");



      let parallelExecSet: ReactiveParallelExecutionSet = new ReactiveParallelExecutionSet(this.execution_plan[3], 3, this.circleci_client, this.secrets, this.parallelExecutionSetsNotifier); // test cause I know entry of index 3 will exists in [this.execution_plan] , and will have several entries
      parallelExecSet.doSubscribe(); // this.parallelExecutionSetsNotifier // this.parallelExecutionSetsNotifier.next(3)
      parallelExecSet.triggerPipelines();

      setTimeout(() => {
       throw new Error('>>>DEBUG STOP POINT');
      }, 10000);

/*
      let arrLength: number = this.execution_plan.length;
      for (let parallelExecutionsSetIndex: number = 0; parallelExecutionsSetIndex < arrLength; parallelExecutionsSetIndex++) {


        console.info("[{CircleCiOrchestrator}] - processing Parallel Execution Set no. ["+`${parallelExecutionsSetIndex}`+"] will trigger the following [Circle CI] pipelines : ");
        if (this.execution_plan[parallelExecutionsSetIndex].length == 0) {
          console.info("[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. ["+`${parallelExecutionsSetIndex}`+"] because it is empty");
        } else {
          console.info(this.execution_plan[parallelExecutionsSetIndex]);
          this.processExecutionSet(this.execution_plan[parallelExecutionsSetIndex], parallelExecutionsSetIndex); /// must be synchronous : send all CircleCI Pipeline triggers, and then start monitoring.
        }
      }
      /// everything before this, should log only to debug level, or to file only, using winston
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[CircleCiOrchestrator]} - STARTING MONITORING EXECUTION PLAN - Execution plan is the value of the 'execution_plan_is' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ execution_plan_is: this.execution_plan}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");



      this.progressMatrixSubject.subscribe({
        next: ((triggerProgress) => {
          console.log("[-----------------------------------------------]");
          console.log("[-----------------------------------------------]");
          console.log(`[ --- progress Matrix Observer, Progress Matrix is now  : `);
          console.log("[-----------------------------------------------]");
          console.log("[-----------------------------------------------]");
          console.log(triggerProgress);
          console.log("[-----------------------------------------------]");
          console.log("[-----------------------------------------------]");
          console.log(`[ --- progress Matrix Observer, this.pipelines_nb : [` + this.pipelines_nb + `]`);
          console.log(`[ --- progress Matrix Observer, triggerProgress.length : [` + triggerProgress.length + `]`);
          console.log("[-----------------------------------------------]");
          console.log("[-----------------------------------------------]");
          console.log(triggerProgress);
          if (triggerProgress.length == this.pipelines_nb){
            console.log("[-----------------------------------------------]");
            console.log("[-----------------------------------------------]");
            console.log(`[ --- progress Matrix Observer:   `);
            console.log(`[ --- All Pipelines have been triggered !   `);
            console.log("[-----------------------------------------------]");
            console.log("[-----------------------------------------------]");
          }

        }).bind(this)
      });


      // this.monitorProgress(this.execution_plan);
      setTimeout((() => { // will interrupt while loop after 10 seconds
        console.log("[-----------------------------------------------]");
        console.log("[-----------------------------------------------]");
        console.log("[Waited 10 seconds before checking progressMatrix content]");
        console.log("[-----------------------------------------------]");
        console.log("[-----------------------------------------------]");
        console.info('')
        console.info( '[{FINAL CHECK}] - [this.progressMatrix] is now :  ');
        // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
        console.info({progressMatrix: this.progressMatrix});
        console.info('')

      }).bind(this), 10000);
*/

    }



    processExecutionSet(parallelExecutionsSet: string[], parallelExecutionsSetIndex: number) : void {

      console.info("");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[CircleCiOrchestrator]} - Processing Parallel Executions Set : the set under processing is the value of the 'parallelExecutionsSet' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ parallelExecutionsSet: parallelExecutionsSet }, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");

      /// First, trigger all pipelines in the parallel execution set
      parallelExecutionsSet.forEach(((componentName, index) => {
        /// pipeline execution parameters, same as Jenkins build parameters
        let pipelineParameters = { parameters: {}};
        let triggerPipelineSubscription = this.circleci_client.triggerCciPipeline(this.secrets.circleci.auth.username, this.github_org, "testrepo1", 'dependabot/npm_and_yarn/handlebars-4.5.3', pipelineParameters).subscribe({
            next: this.handleTriggerPipelineCircleCIResponseData.bind(this),
            complete: data => {
              console.log( '[{[CircleCiOrchestrator]} - triggering Circle CI Build completed! :)]')
            },
            error: this.errorHandlerTriggerCCIPipeline.bind(this)
        });
      }).bind(this));
      /// then start watching Progress of Circle CI API invocations to trigger pipelines


      /// this.watchParallelExecutionsSetTriggersProgress(parallelExecutionsSetIndex);
      /// then send all Circle CI API requests to check execution status of each pipeline

      /// finally proceed with next parallel execution set (if any error occured, the whole process stops)
    }
    /**
     *
     **/
    private watchParallelExecutionsSetTriggersProgress(parallelExecutionsSetIndex: number) {

      //
      console.log('[watchParallelExecutionsSetTriggersProgress] - BEFORE WHILE LOOP => [parallelExecutionsSetIndex] is ' + parallelExecutionsSetIndex);
      console.log('[watchParallelExecutionsSetTriggersProgress] - BEFORE WHILE LOOP => this.progressMatrix.length is ' + this.progressMatrix.length);
      console.log('[watchParallelExecutionsSetTriggersProgress] - BEFORE WHILE LOOP => this.execution_plan[parallelExecutionsSetIndex].length is ' + this.execution_plan[parallelExecutionsSetIndex].length);
      console.log('[watchParallelExecutionsSetTriggersProgress] - BEFORE WHILE LOOP => this.execution_plan[parallelExecutionsSetIndex] is : ');
      console.log(this.execution_plan[parallelExecutionsSetIndex]);
      console.log('[watchParallelExecutionsSetTriggersProgress] - BEFORE WHILE LOOP => this.progressMatrix is : ');
      console.log(this.progressMatrix);
      console.info('');
      console.info( '[watchParallelExecutionsSetTriggersProgress] - BEFORE WHILE LOOP => [this.execution_plan] is :  ');
      console.info(JSON.stringify({execution_plan: this.execution_plan}, null, " "));
      console.info('');


      while(this.progressMatrix.length != this.execution_plan[parallelExecutionsSetIndex].length){
        if(this.progressMatrix.length == this.execution_plan[parallelExecutionsSetIndex].length) {
          console.log('[watchParallelExecutionsSetTriggersProgress] - WHILE LOOP => this.progressMatrix[parallelExecutionsSetIndex].length is ' + this.progressMatrix[parallelExecutionsSetIndex].length);
          console.log('[watchParallelExecutionsSetTriggersProgress] - WHILE LOOP => this.execution_plan[parallelExecutionsSetIndex].length is ' + this.execution_plan[parallelExecutionsSetIndex].length);
        }
      }

      if(this.progressMatrix.length != this.execution_plan[parallelExecutionsSetIndex].length) {
        throw new Error("[watchParallelExecutionsSetTriggersProgress] - => Did not detect progress Matrix completion ");
      }
      // when completed triggering Pipelines for Parallel Execution set, just log it
      console.log("[watchParallelExecutionsSetTriggersProgress] - All Circle CI API Pipeline triggers JSON response for parallel execution set no. [" + parallelExecutionsSetIndex + "] have been received without errors.");
      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [watchParallelExecutionsSetTriggersProgress] [this.progressMatrix] is now :  ');
      // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "))
      console.info({progressMatrix: this.progressMatrix});
      console.info('')
      throw new Error("DEBUG POINT");

    }
    /**
     * Refonte de la méthode [processExecutionSet] : future RxJS implementation, unsused for now.
     **/
    processExecutionSet2 (parallelExecutionsSet: ParallelExecutionSet) : void {
      console.info("");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[CircleCiOrchestrator]} - Processing Parallel Executions Set : the set under processing is the value of the 'parallelExecutionsSet' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ parallelExecutionsSet: parallelExecutionsSet }, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");

      let parallelExecutionSetProgress: parallel.ParallelExecutionSetProgress = new parallel.ParallelExecutionSetProgress();
      let parallelExecutionsSetArray: GraviteeComponent[] = parallelExecutionsSet.getComponents();
      let parallelExecSetLength: number = parallelExecutionsSetArray.length;
      /// First, trigger all pipelines in the parallel execution set
      for (let i = 0; i < parallelExecSetLength; i++) {
        let comp = parallelExecutionsSetArray[i];
        /// [pipelineParameters] => pipeline execution parameters, same as Jenkins build parameters
        let pipelineParameters = { parameters: {} };
        let observableSentRequest = this.circleci_client.triggerCciPipeline(this.secrets.circleci.auth.username, this.github_org, "testrepo1", 'dependabot/npm_and_yarn/handlebars-4.5.3', pipelineParameters)
        let pipelExecProgress: parallel.PipelineExecutionProgress = {
          component: comp,
          pipeline_execution: {
            cci_trigger: {
              observableRequest: observableSentRequest,
              response: {
                created_at: null,
                state: null,
                number: null,
                id: null
              },
              error: null
            },
            cci_statuscheck: {
              observableRequest: null,
              response: {
                items: []
              },
              error: null
            }
          }
        };
        parallelExecutionSetProgress.addPipelineExecutionProgress(pipelExecProgress);
      }

      /// Now, passing on [parallelExecutionSetProgress] to Monitor which
      /// will subscribe to all Observable Streams,
      let someMonitor = new monitoring.Monitor(`monitor`, {
        parallelExecutionSetProgress: parallelExecutionSetProgress,
        secrets: this.secrets,
        timeout:10000 // 10 seconds
      });


    }

    /**
     * This method is there to serve as handler method for the <strong>Circle CI </strong> API call that trigger <strong>Circle CI <strong> Pipeline :
     * Every time this method is invoked, it adds an entry  in the {@see this.progressMatrix}, from the <pre>data</pre> returned by the <strong>Circle CI</strong> API call
     * then, the {@see this.progressMatrix}
     *
     *
     * @argument data A JSOn Object returned by the Circle CI API as Response of a Pipeline trigger
     * -----
     * <pre>
     * {
     *
     *    "number": "17",
     *    "id": "c08fe570-a3ea-4232-9ed8-432ed65921a1",
     *    "state": "pending",
     *    "created_at": "2020-08-16T18:18:01.891Z"
     *
     *  }
     * </pre>
     * -----
     *
     *
     **/
    handleTriggerPipelineCircleCIResponseData (circleCiJsonResponse: any, component: GraviteeComponent) : void {
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] => ', circleCiJsonResponse.data )
      let entry: any = {};
      entry.pipeline = {
        pipeline_exec_number: `${circleCiJsonResponse.data.number}`,
        id : `${circleCiJsonResponse.data.id}`,
        created_at: `${circleCiJsonResponse.data.created_at}`,
        exec_state: `${circleCiJsonResponse.data.state}`
      }
      this.progressMatrix.push(entry.pipeline);
      /// this.progressMatrixSubject.next(entry.pipeline);
      this.progressMatrixSubject.next(this.progressMatrix);


      /// console.info('')
      /// console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] [this.progressMatrix] is now :  ');
      // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
      /// console.info({progressMatrix: this.progressMatrix});
      /// console.info('')
    }

    /**
     * RX JS err handler for triggering circle ci pipelines
     **/
    errorHandlerTriggerCCIPipeline (error: any) : void {
      console.info( '[{CircleCiOrchestrator}] - Triggering Circle CI pipeline failed Circle CI API Response [data] => ', error )
      let entry: any = {};
      entry.pipeline = {
        execution_index: null,
        id : null,
        created_at: null,
        exec_state: null,
        error : {message: "[{CircleCiOrchestrator}] - Triggering Circle CI pipeline failed ", cause: error}
      }

      this.progressMatrix.push(entry);

      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [errorHandlerTriggerCCIPipeline] [this.progressMatrix] is now :  ');
      // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
      console.info({progressMatrix: this.progressMatrix});
      console.info('')
      throw new Error('[{CircleCiOrchestrator}] - [errorHandlerTriggerCCIPipeline] CICD PROCESS INTERRUPTED BECAUSE TRIGGERING PIPELINE FAILED with error : [' + error + '] '+ ' and, when failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
    }

}
