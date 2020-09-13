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

export class ProgressMatrix extends rxjs.Subject<any[]> {
  private progressMatrix: any[];
  private parallelExecutionSetIndex: number;
  constructor(ParallelExecutionSetIndex: number){
    super();
    this.progressMatrix = []
  }
  public push(newCciJSONResponse: any, parallelExecutionsSetIndex: number) {
    this.progressMatrix[parallelExecutionsSetIndex].push(newCciJSONResponse);
    this.next(newCciJSONResponse);
  }
  public getMatrix(): any[] {
    return this.progressMatrix;
  }
  public getLength(): number {
    return this.progressMatrix.length;
  }
  public getParallelExecutionSetIndex(): number {
    return this.parallelExecutionSetIndex;
  }
  /**
   * clears the matrix, and resets this.parallelExecutionSetIndex to desried value
   **/
  public clear(pExecutionSetIndex: number): void {
    while(this.progressMatrix.length > 0) {
      this.progressMatrix.pop();
    }
    this.parallelExecutionSetIndex = pExecutionSetIndex;
  }
}
export interface CircleCISecrets {
  circleci: {
    auth: {
      username: string,
      token: string
    }
  }
}
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
    private progressMatrix: ProgressMatrix;
    private monitorReport: any[];
    private retries: number;
    private circleci_client: CircleCIClient;
    private secrets: CircleCISecrets;


    constructor(execution_plan: string [][], retries: number) {
      this.execution_plan = execution_plan;
      this.retries = retries;
      this.loadCircleCISecrets();
      this.circleci_client = new CircleCIClient(this.secrets);
      this.progressMatrix = new ProgressMatrix(); /// will be emptied every time a new parallel execution set is processed
      this.monitorReport = [];
      this.github_org = process.env.GH_ORG;
    }

    loadCircleCISecrets () : void {
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
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");
      this.execution_plan.forEach((parallelExecutionsSet, index) => {
        console.info("[{CircleCiOrchestrator}] - processing Parallel Execution Set no. ["+`${index}`+"] will trigger the following [Circle CI] pipelines : ");
        if (parallelExecutionsSet.length == 0) {
          console.info("[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. ["+`${index}`+"] because it is empty");
        } else {
          console.info(parallelExecutionsSet);
          this.processExecutionSet(parallelExecutionsSet, index); /// must be synchronous : send all CircleCI Pipeline triggers, and then start monitoring.
        }

      });
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
      // this.monitorProgress(this.execution_plan);
    }



    processExecutionSet(parallelExecutionsSet: string[], parallelExecutionsSetIndex) : void {

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
      this.progressMatrix.clear(parallelExecutionsSetIndex);
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
      /// then subscribe to ProgressMatrix RxJS Subject
      this.progressMatrix.subscribe({ // subscription to Subject
        next: ((cciResponse: any) => {
          console.log(">>>>>>>>>> Subject NEXT for ProgressMatrix Circle CI Pipeline trigger / response is : ");
          console.log(cciResponse);
          console.log(">>>>>>>>>> Subject NEXT");
          if (this.progressMatrix.getLength() == this.execution_plan[this.progressMatrix.getParallelExecutionSetIndex()].length) {
              console.log(">>>>>>>>>> Subject NEXT >>> <<< ");
              console.log(">>>>>>>>>> Subject NEXT >>> All Pipeline Triggers HTTP Responses have been received from Circle VI API v2 !!! :D  ProgressMatrix is now [" + this.progressMatrix + "] ");
              console.log(">>>>>>>>>> Subject NEXT >>> ProgressMatrix is now : " + this.progressMatrix);
              console.log(this.progressMatrix);
              console.log(">>>>>>>>>> Subject NEXT >>> <<< ");
          } /* else {
              console.log(">>>>>>>>>>Subject NEXT >>> <<< ");
              console.log(">>>>>>>>>>Subject NEXT >>> Not All Pipeline Triggers HTTP Responses have been received from Circle VI API v2.  ");
              console.log(">>>>>>>>>>Subject NEXT >>> ProgressMatrix is now : " + this.progressMatrix);
              console.log(this.progressMatrix);
              console.log(">>>>>>>>>>Subject NEXT >>> <<< ");
          }*/
        }).bind(this),
        error: ((error: any) => {
           console.log(">>>>>>>>>>Subject ERROR for PipelineExecutionProgress Circle CI Pipeline trigger of Gravitee Components : " + error)
           console.log(error)
        }).bind(this),
        complete: ((cciResponse: any) => {
           console.log(">>>>>>>>>>Subject COMPLETE for ProgressMatrix  Circle CI Pipeline trigger of Gravitee Components : ");
           console.log(cciResponse)
        }).bind(this)
      })
    }

    /**
     * Refonte de la méthode [processExecutionSet]
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
      this.progressMatrix.push(entry.pipeline)

      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] [this.progressMatrix] is now :  ');
      // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "))
      console.info({progressMatrix: this.progressMatrix});
      console.info('')
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
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] [this.progressMatrix] is now :  ');
      console.info(JSON.stringify({progressMatrix: this.progressMatrix}))
      console.info('')
    }

    /**
     * Monitors the progress of each pipeline execution in a Parallel Executions Set (an entry in the {@see CircleCiOrchestrator#execution_plan})
     * @comment Synchronous
     *
     **/
    monitorProgress (execution_plan: string[][]) : void {

      /// Ok, so now I will  need to poll all builds until TIMEOUT


      /// I poll a first time.
      this.progressMatrix.getMatrix().forEach((pipelineExecution, index) => {
        // 1./ I retrieve the pipeline info using the [GET /api/v2/pipeline/${circleci_pipeline_id}] Endpoint
        let getPipelineInfoSubscription = this.circleci_client.getPipelineInfo(pipelineExecution.pipeline.id).subscribe({
            next: this.handleGetPipelineInfoCircleCIResponseData.bind(this),
            complete: data => {
              console.log( '[retrieving Circle CI Pipeline Infos completed! :)]')
            },
            error: this.errorHandlerGetCCIPipelineInfos.bind(this)
        });

      })
    }

    handleGetPipelineInfoCircleCIResponseData (circleCiJsonResponse: any) {
      // 2./ then I update this.progressMatrix and this.progressBar
      circleCiJsonResponse.id
      circleCiJsonResponse.state
      let slugArray: string [] = circleCiJsonResponse.project_slug.split(" ", 3); /// So array indexes [0, 1, 2]
      let git_repo_namme: string = `${slugArray[1]}`;
      let git_repo_http_uri: string = "https://github.com/" + `${slugArray[1]}` + "/" + `${slugArray[1]}`;
      let git_repo_ssh_uri: string = "git@github.com:" + `${slugArray[1]}` + "/" + `${slugArray[1]}`;

      let executionPlan_ParallelExecSet_Index = "git@github.com:" + `${slugArray[1]}` + "/" + `${slugArray[1]}`;

      circleCiJsonResponse.vcs.origin_repository_url;
      circleCiJsonResponse.vcs.target_repository_url;

      /// ++ Update Progress Matrix (In the Progress Matrix, when all entries have a 'state' JSon property with value 'created')


      /// ++ Now Update Progress Bar

      // retireving the progressBar to update for the component

      if (circleCiJsonResponse.state === "pending") {
        // this.progressBars..updateStatus(slugArray[2], ParallelExectionSetProgressStatus.PENDING);
      } else if (circleCiJsonResponse.state === "errored") {
        // this.progressBar.updateStatus(slugArray[2], ParallelExectionSetProgressStatus.ERRORED);
      } else if (circleCiJsonResponse.state === "created") {
        // this.progressBar.updateStatus(slugArray[2], ParallelExectionSetProgressStatus.CREATED);
      } else {
        throw new Error("[{CircleCiOrchestrator}] - [handleGetPipelineInfoCircleCIResponseData] Undefined Circle CI v2 Pipeline Status [" + `${circleCiJsonResponse.state}` + "]");
      }
      /// ++ Update Monitor Report
      let reportEntry: any = {};
      reportEntry.monitor_event = {
        action: 'fetch-CircleCI-API [GET /api/v2/pipeline/${circleci_pipeline_id}]',
        circle_ci_response: circleCiJsonResponse,
        error : {}
      }

      this.monitorReport.push(reportEntry);

      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [errorHandlerGetCCIPipelineInfos] [this.monitorReport] is now :  ');
      console.info(JSON.stringify({monitorReport: this.monitorReport}))
      console.info('')
    }
    /**
     * RX JS err handler for fetching circle ci pipelines infos
     **/
    errorHandlerGetCCIPipelineInfos (error: any) : void {
      console.error( '[{CircleCiOrchestrator}] - Fetching Circle CI pipeline infos with  Circle CI API failed. ', error )
      let reportEntry: any = {};
      reportEntry.monitor_event = {
        action: 'fetch-CircleCI-API [GET /api/v2/pipeline/${circleci_pipeline_id}]',
        error : {message: "[{CircleCiOrchestrator}] - Fetching Circle CI pipeline infos with  Circle CI API failed. ", cause: error}
      }

      this.monitorReport.push(reportEntry);

      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [errorHandlerGetCCIPipelineInfos] [this.monitorReport] is now :  ');
      console.info(JSON.stringify({monitorReport: this.monitorReport}))
      console.info('')
    }
    giveup()  : void {
      console.log("[{CircleCiOrchestrator}] - giveup() method is not implemented yet.");
    }
}


/**
 *
 * Mimics the official Circle CI cLient, only much simpler, and with [RxJS]
 * Circle CI API v2 based
 **/
export class CircleCIClient {

  constructor(private secrets: any) {
    this.secrets = secrets;
  }


    /**
     * Triggers a Circle CI Pipeline, for a repo on Github
     *
     * @argument username {@type string} the Circle CI username. matches your Github username, because you authenticated using Github, to register to Circle Ci . eg "jpstevens",
     * @argument org_name  {@type string} the github organization name if the git repo in on github.com
     * @argument repo_name {@type string} the Circle CI project name, matching the github repo name, e.g."circleci",
     * @argument branch {@type string} the git branch "master" on which to trigger the pipeline
     * @argument pipelineParameters {@type any} the Circle CI pipeline parameters. For Example, a  :
     *
     * -----
     * <pre>
     *      version: 2.1
     *      jobs:
     *        build:
     *          docker:
     *            - image: "circleci/node:<< pipeline.parameters.image-tag >>"
     *          environment:
     *            IMAGETAG: "<< pipeline.parameters.image-tag >>"
     *            GRAVITEEIO_VERSION: "<< pipeline.parameters.graviteeio-version >>"
     *            GRAVITEEIO_VERSION_MINOR: "<< pipeline.parameters.graviteeio-version-minor >>"
     *            GRAVITEEIO_VERSION_MAJOR: "<< pipeline.parameters.graviteeio-version-major >>"
     *          steps:
     *            - run: echo "Docker Image tag used was ${IMAGETAG}"
     *            - run: echo "GRAVITEEIO_VERSION used was ${GRAVITEEIO_VERSION}"
     *            - run: echo "GRAVITEEIO_VERSION_MINOR used was ${GRAVITEEIO_VERSION_MINOR}"
     *            - run: echo "GRAVITEEIO_VERSION_MAJOR used was ${GRAVITEEIO_VERSION_MAJOR}"
     *      parameters:
     *        image-tag:
     *          default: latest
     *          type: string
     *        graviteeio-version:
     *          default: 3.1.0
     *          type: string
     *        graviteeio-version-minor:
     *          default: 3.1
     *          type: string
     *        graviteeio-version-major:
     *          default: 3
     *          type: string
     *
     * </pre>
     * -----
     *
     *  then <pre>pipelineParameters</pre> should be (except the values) :
     *
     * -----
     * <pre>
     * {
     *    "parameters": {
     *      "image-tag": "3.1.14-full",
     *      "graviteeio-version": "3.1.14",
     *      "graviteeio-version-minor": "3.1",
     *      "graviteeio-version-major": "3"
     *    }
     *  }
     * </pre>
     * -----
     *
     *
     * @returns any But it actually is an Observable Stream of the HTTP response you can subscribe to.
     **/
    triggerCciPipeline(username: string, org_name: string, repo_name: string, branch: string, pipelineParameters: any): any/*Observable<any><AxiosResponse<any>>*/ {
      /*
      let observableRequest: any = rxjs.Observable.create( ( observer ) => {
          let config = {
            headers: {
              "Circle-Token": this.secrets.circleci.auth.token,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          };
          // curl -X POST
          let jsonPayload: any = pipelineParameters;
          jsonPayload.branch = `${branch}`;

          console.info("curl -X POST -d " + `${JSON.stringify(jsonPayload)}` + " -H 'Content-Type: application/json'" + " -H 'Accept: application/json'" + " -H 'Circle-Token: " + `${this.secrets.circleci.auth.token}` + "' https://circleci.com/api/v2/project/gh/" + `${org_name}` + "/" + `${repo_name}` + "/pipeline");

          /// axios.post( 'https://circleci.com/api/v2/me', jsonPayloadExample, config ).then(....)
          axios.post( "https://circleci.com/api/v2/project/gh/" + `${org_name}` + "/" + `${repo_name}` + "/pipeline", jsonPayload, config )
          .then( ( response ) => {
              observer.next( response.data );
              observer.complete();
          } )
          .catch( ( error ) => {
              console.log("Circle CI HTTP Error JSON Response is : ");
              /// console.log(JSON.stringify(error.response));
              console.log(error.response);
              observer.error( error );
          } );

      } );
      return observableRequest; */


      let requestConfig = {
        headers: {
          "Circle-Token": this.secrets.circleci.auth.token,
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      };
      let jsonPayload: any = pipelineParameters;
      const cci_rest_endpoint = "https://circleci.com/api/v2/project/gh/";
      const source = rxjs.from(axios.post( "https://circleci.com/api/v2/project/gh/" + `${org_name}` + "/" + `${repo_name}` + "/pipeline", jsonPayload, requestConfig )).pipe(
      tap(val => console.log(`fetching ${cci_rest_endpoint} which you won't see `)),)
      const response$ = source.pipe(
        map(axiosResponse => {
          if (!(axiosResponse.status == 200 || axiosResponse.status == 201 || axiosResponse.status == 203)) {
            //error will be picked up by retryWhen
            throw axiosResponse;
          }
          return axiosResponse; /// return value  HTTP Response Code si 200
        }),
        retryWhen(errors =>
          errors.pipe(
            //log error message
            tap(axiosResponse => {
              console.log(`Error occured, trying to fetch [${cci_rest_endpoint}], HTTP Response is : `);
              console.log(`Error occured, trying to fetch [${JSON.stringify(axiosResponse.data)}], now retrying`);
              console.log(`Error occured, trying to fetch [${cci_rest_endpoint}], now retrying`);
            }),
            //restart in 5 seconds
            delay(3000), /// wait 3 seconds before retrying
            /// delayWhen(val => timer(val * 1000)),
            /// delayWhen(val => rxjs.timer(7 * 1000)), /// wait 7 seconds before retrying
            take(1) // we only need ONE successful HTTP call, to trigger a pipeline, and after that, if ever Circle CI API v2 gets buggy, we ignore it.
          )
        )
      );

      return response$;
    }

    getLatestGhBuilds(username: string, org_name: string, repo_name: string, branch: string, pipelineParameters: any): any {
      throw new Error("Not impemented yet");
      /// return observableRequest;
    }
    /**
     * Retrieves the Github Repo URI from the PipelineID
     **/
    getPipelineGhRepo(circleCiPipelineID: string): any {
      let observableRequest = rxjs.Observable.create( ( observer ) => {
          let config = {
            headers: {
              "Circle-Token": this.secrets.circleci.auth.token,
              "Accept": "application/json"
            }
          };
          axios.get( 'https://circleci.com/api/v2/pipeline/' + `${circleCiPipelineID}`, config )
          .then( ( response ) => {
              observer.next( response.data );
              observer.complete();
          } )
          .catch( ( error ) => {
              observer.error( error );
          } );
      } );

      return observableRequest;
      // throw new Error("Not impemented yet");
      /// return observableRequest;
    }

    /**
     * Retrieves the pipeline Execution Infos based on the Circle CI API v2 <strong>pipeline id<strong> (Which actually is a Pipeline Execution ID, not a Pipeline ID),  using the <pre>[GET /api/v2/pipeline/${circleci_pipeline_id}]</pre> Endpoint
     *
     *
     * ---
     * <strong>Circle CI API v2<strong> JSON Response will be of the form :
     * ---
     *      {
     *        "id": "f71bb92d-534f-485d-9dae-af32df1b340d",
     *        "errors": [],
     *        "project_slug": "gh/gravitee-lab/testrepo1",
     *        "updated_at": "2020-08-16T21:33:43.830Z",
     *        "number": 14,
     *        "state": "created",
     *        "created_at": "2020-08-16T21:33:43.830Z",
     *        "trigger": {
     *          "received_at": "2020-08-16T21:33:43.799Z",
     *          "type": "api",
     *          "actor": {
     *            "login": "Jean-Baptiste-Lasselle",
     *            "avatar_url": "https://avatars2.githubusercontent.com/u/35227860?v=4"
     *          }
     *        },
     *        "vcs": {
     *          "origin_repository_url": "https://github.com/gravitee-lab/testrepo1",
     *          "target_repository_url": "https://github.com/gravitee-lab/testrepo1",
     *          "revision": "b9940405385ab81ad7bb44880ed71f0c23e55c17",
     *          "provider_name": "GitHub",
     *          "branch": "dependabot/npm_and_yarn/handlebars-4.5.3"
     *        }
     *      }
     *
     **/
    getPipelineInfo(circleCiPipelineID: string): any {
      let observableRequest = rxjs.Observable.create( ( observer ) => {
          let config = {
            headers: {
              "Circle-Token": this.secrets.circleci.auth.token,
              "Accept": "application/json"
            }
          };
          axios.get( 'https://circleci.com/api/v2/pipeline/' + `${circleCiPipelineID}`, config )
          .then( ( response ) => {
              observer.next( response.data );
              observer.complete();
          } )
          .catch( ( error ) => {
              observer.error( error );
          } );
      } );

      return observableRequest;
      // throw new Error("Not impemented yet");
      /// return observableRequest;
    }
    /**
     * Hits the Circle CI API and return an {@see ObservableStream<any>} emitting the Circle CI JSON answer for the https://circleci.com/api/v2/me Endpoint
     **/
    whoami(): any {
      let observableRequest = rxjs.Observable.create( ( observer ) => {
          let config = {
            headers: {
              "Circle-Token": this.secrets.circleci.auth.token,
              "Accept": "application/json"
            }
          };
          axios.get( 'https://circleci.com/api/v2/me', config )
          .then( ( response ) => {
              observer.next( response.data );
              observer.complete();
          })
          .catch( ( error ) => {
              observer.error( error );
          });
      } );
      return observableRequest;
    }
}
