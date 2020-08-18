/// import { CircleCI } from 'circleci';
import { Observable } from 'rxjs';
import axios from 'axios';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';
import * as Collections from 'typescript-collections';

/**
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * [gravitee_release_branch] must match one of the existing branch on https://github.com/gravtiee-io/release.git, see [.DOTNEV] [RELEASE_BRANCHES] env. var.
 *
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {
    private github_org: string;

    /**
    * <p>
    * The Execution plan listing all the components that should be included in the release :
    * <p>
    * <ul>
    * <li>The 2-dim. Array has the exact same structure as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git)</li>
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
    private monitorReport: any[];
    private retries: number;
    private circleci_client: CircleCIClient;
    private secrets: any;

    /**
     *
     * For each Parallel Execution Set of the {@see this.execution_plan}, an instance of {@see ParallelExectionSetProgressBar} is instantiated
     *
     * So for every Parallel Executions Set that is processed, using {@see CircleCiOrchestrator#processExecutionSet()}, there will be a progress bar
     *
     * Also above the progress bars, all pipeline HTTP links will be given.
     *
     * One HTTP Link can be constructed, per githbu repo, if not found in REST API calls JSON responses :
     *
     * => For a repo named  "testrepo1", in the github org "gravitee-lab", and a branch named "dependabot/npm_and_yarn/handlebars-4.5.3", HTTP Link is :
     *
     * ==> https://app.circleci.com/pipelines/github/gravitee-lab/testrepo1?branch=dependabot%2Fnpm_and_yarn%2Fhandlebars-4.5.3
     *
     * ==> Knowing that this link will display page of latest pipeline executions of the https://github.com/gravitee-lab/testrepo1.git repo on the "dependabot/npm_and_yarn/handlebars-4.5.3" branch
     * Note : the key for each {@see ParallelExectionSetProgressBar} is the Parallel Execution Set itself : an array of string
     **/
    private progressBars: Collections.Dictionary<string [],ParallelExectionSetProgressBar>;

    constructor(execution_plan: string [][], retries: number) {
      this.execution_plan = execution_plan;
      this.retries = retries;
      this.loadCircleCISecrets();
      this.circleci_client = new CircleCIClient(this.secrets);
      this.progressMatrix = [];
      this.monitorReport = [];
      this.initProgressBars();
      this.github_org = process.env.GH_ORG;
    }
    /**
     * initializes a new progress bar for every Parallel Executions Set (every entry int this.execution_plan)
     **/
    initProgressBars () : void {
      this.progressBars = new Collections.Dictionary<string [],ParallelExectionSetProgressBar>();
      this.execution_plan.forEach((parallelExecutionsSet, index) => {
        console.info("[{CircleCiOrchestrator}] - initializing Progress Bar for Parallel Execution Set no. ["+`${index}`+"]  ");
        this.progressBars.setValue(parallelExecutionsSet, new ParallelExectionSetProgressBar(parallelExecutionsSet));
      });
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
     * returning an A 2-dimensional array
     **/
    start()  : void {
      console.info("[{CircleCiOrchestrator}] - STARTING PROCESSING EXECUTION PLAN - will retry " + this.retries + " times executing a [Circle CI] pipeline before giving up.")
      console.info("");
      let whoamiSubscription = this.circleci_client.whoami().subscribe({
        next: data => console.log( '[data] => ', data ),
        complete: data => console.log( '[complete]' )
      });
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[CircleCiOrchestrator]} - STARTING PROCESSING EXECUTION PLAN - Execution plan is the value of the 'execution_plan_is' below : ");
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
          this.processExecutionSet(parallelExecutionsSet); /// must be synchronous : send all CircleCI Pipeline triggers, and then start monitoring.
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
      this.monitorProgress(this.execution_plan);
    }



    processExecutionSet (parallelExecutionsSet: string[]) : void {
      console.info("");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[CircleCiOrchestrator]} - Processing Parallel Executions Set : the set under processing is the value of the 'parallelExecutionsSet' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ parallelExecutionsSet: parallelExecutionsSet}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");

      parallelExecutionsSet.forEach((componentName, index) => {
        /// pipeline execution parameters, same as Jenkins build parameters
        let pipelineParameters = { parameters: {}};
        let triggerPipelineSubscription = this.circleci_client.triggerGhBuild(this.secrets.circleci.auth.username, this.github_org, "testrepo1", 'dependabot/npm_and_yarn/handlebars-4.5.3', pipelineParameters).subscribe({
            next: this.handleTriggerPipelineCircleCIResponseData.bind(this),
            complete: data => {
              console.log( '[{[CircleCiOrchestrator]} - triggering Circle CI Build completed! :)]')
            },
            error: this.errorHandlerTriggerCCIPipeline.bind(this)
        });

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
    handleTriggerPipelineCircleCIResponseData (circleCiJsonResponse: any) : void {
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] => ', circleCiJsonResponse )
      let entry: any = {};
      entry.pipeline = {
        execution_index: `${circleCiJsonResponse.number}`,
        id : `${circleCiJsonResponse.id}`,
        created_at: `${circleCiJsonResponse.created_at}`,
        exec_state: `${circleCiJsonResponse.state}`
      }

      this.progressMatrix.push(entry);

      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] [this.progressMatrix] is now :  ');
      console.info(JSON.stringify({progressMatrix: this.progressMatrix}))
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

      this.progressMatrix.forEach((pipelineExecution, index) => {
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


      /// Now retireving the progressBar to update for the component
      if (circleCiJsonResponse.state === "pending") {
        this.progressBars..updateStatus(slugArray[2], ParallelExectionSetProgressStatus.PENDING);
      } else if (circleCiJsonResponse.state === "errored") {
        this.progressBar.updateStatus(slugArray[2], ParallelExectionSetProgressStatus.ERRORED);
      } else if (circleCiJsonResponse.state === "created") {
        this.progressBar.updateStatus(slugArray[2], ParallelExectionSetProgressStatus.CREATED);
      } else {
        throw new Error("[{CircleCiOrchestrator}] - [handleGetPipelineInfoCircleCIResponseData] Undefined Circle CI v2 Pipeline Status [" + `${circleCiJsonResponse.state}` + "]");
      }

    }
    /**
     * RX JS err handler for fetching circle ci pipelines infos
     **/
    errorHandlerGetCCIPipelineInfos (error: any) : void {
      console.error( '[{CircleCiOrchestrator}] - Fetching Circle CI pipeline infos with  Circle CI API failed. ', error )
      let reportEntry: any = {};
      reportEntry.get_pipeline_infos = {
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
    triggerGhBuild(username: string, org_name: string, repo_name: string, branch: string, pipelineParameters: any): any {
      let observableRequest = Observable.create( ( observer ) => {
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
      return observableRequest;
    }
    getLatestGhBuilds(username: string, org_name: string, repo_name: string, branch: string, pipelineParameters: any): any {
      throw new Error("Not impemented yet");
      /// return observableRequest;
    }
    /**
     * Retrieves the Github Repo URI from the PipelineID
     **/
    getPipelineGhRepo(circleCiPipelineID: string): any {
      let observableRequest = Observable.create( ( observer ) => {
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
      let observableRequest = Observable.create( ( observer ) => {
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
      let observableRequest = Observable.create( ( observer ) => {
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
          } )
          .catch( ( error ) => {
              observer.error( error );
          } );
      } );

      return observableRequest;
    }
}

/**
 * {@see ParallelExectionSetProgressBar} :
 *
 * <ul>
 * <li>
 * Displays a multi progress bar for a Parallel Execution Set
 * </li>
 * <li>
 * based on https://www.npmjs.com/package/cli-progress#multi-bar-mode
 * </li>
 * </ul>
 *
 * Each Progress Bar, notifies the progress status of one Pipeline Execution. As of Circle CI API v2, there are 3 possible states for a pipeline execution :
 *
 * <ul>
 * <li>
 * <pre>pending</pre> (pipeline was triggered and pipeline  execution is  <strong>running</strong>)
 * </li>
 * <li>
 * <pre>errored</pre> (pipeline execution  <strong>completed with errors</strong>)
 * </li>
 * <li>
 * <pre>created</pre> (pipeline execution  <strong>succcessfully completed</strong>, with no <strong>errors</strong> )
 * </li>
 * </ul>
 *
 * Before a pipeline is triggered, the pipeline execution does not exists, as far as the Circle CI API is concerned.
 * So I added a fourth one, <strong>untriggered</strong> , in order to display the progress bar for all planed pipeline executions, before they even exists in the CircleCI API v2 :
 *
 * <ul>
 * <li>
 * <pre>untriggered</pre> (pipeline execution was <strong>not triggered yet</strong>, and does not exsits for the Circle CI API v2)
 * </li>
 * <li>
 * <pre>pending</pre> (pipeline was triggered and pipeline  execution is  <strong>running</strong>)
 * </li>
 * <li>
 * <pre>errored</pre> (pipeline execution  <strong>completed with errors</strong>)
 * </li>
 * <li>
 * <pre>created</pre> (pipeline execution  <strong>succcessfully completed</strong>, with no <strong>errors</strong> )
 * </li>
 * </ul>
 *
 * Also [see **barGlue** option](https://www.npmjs.com/package/cli-progress#options-1), to have custom text displayed with status'
 *
 * @comment Zero Circle CI API calls here, this just a progress bar, and it does nothing, unless someone tells him to do something (change singleBar progress status, etc...). Also, the progress Bar does not rmember any state, it just allows update the progress State of one component see {@see ParallelExectionSetProgressBar#updateStatus(componentName: string, newStatus: ParallelExectionSetProgressStatus)}
 **/
export class ParallelExectionSetProgressBar {
  private static COMPLETED_SCALE: number = 100;
  private bars: Collections.Dictionary<string, cliProgress.SingleBar>; /// dunno there, it's just that I wanna remmber for each bar, which component it stands for
  private multibar: cliProgress.MultiBar;
  /**
   * A Parallel Execution Set, is an entry in the {@see CircleCiOrchestrator#execution_plan}. It might be an empty array (Array of length zero)
   * -----
   * Example Parallel Execution Set (very simple, 1-dim. string[] Array, see {@see CircleCiOrchestrator#execution_plan} ) :
   * -----
   * <pre>
   *
   *    [
   *        "gravitee-policy-apikey",
   *        "gravitee-policy-ratelimit",
   *        "gravitee-policy-request-content-limit",
   *        "gravitee-policy-dynamic-routing",
   *        "gravitee-policy-jwt",
   *        "gravitee-policy-callout-http",
   *        "gravitee-fetcher-github"
   *    ]
   *
   * </pre>
   *
   **/
  private parallelExecutionsSet: string[] /// or progressMatrix ? that is the question. I think I'll instantiate a new ParallelExectionSetProgressBar() instance for every non-empty (array of lentgh zero) entry in the progressMatrix

  constructor(parallelExecutionsSet: string[]) {
    this.parallelExecutionsSet = parallelExecutionsSet;
    if (parallelExecutionsSet === undefined || parallelExecutionsSet === null) {
      throw new Error("[{ParallelExectionSetProgressBar}] - parallelExecutionsSet is null or undefined, so can't work on any status to report.")
    }
    if (parallelExecutionsSet.length == 0) {
      console.warn("[{ParallelExectionSetProgressBar}] - parallelExecutionsSet is empty, so can't work on any status to report.")
    }
    this.initMultiBar();
    this.start();
  }

  /**
   * Initializes the {@see cliProgress.MultiBar} <strong>this.multibar</strong> and the {@see Collections.Dictionnary<string, cliProgress.SingleBar>}  <strong>this.bars</strong> https://www.npmjs.com/package/cli-progress component, from
   * the {@see this.parallelExecutionsSet} Parallel Executions Set
   **/
  initMultiBar (): void {
    this.bars = new Collections.Dictionary<string, cliProgress.SingleBar>();
    ///
    // create new MultiBar container
    this.multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591'
    }, cliProgress.Presets.shades_grey);

    this.parallelExecutionsSet.forEach((componentName, index) => {
      // add single bar
      let singleBar = this.multibar.create(ParallelExectionSetProgressBar.COMPLETED_SCALE, 0);
      this.bars.setValue(componentName, singleBar);
    });

  }
  updateStatus(componentName: string, newStatus: ParallelExectionSetProgressStatus) {
    let singleBar = this.bars.getValue(componentName);
    singleBar.update(newStatus, {filename: `${componentName}`});
  }
  /**
   * ---
   * Starts all the single Bars initializing them to the initial state {@see ParallelExectionSetProgressStatus.UNTRIGGERED}
   *
   * @throws {@see Error} when bars Dictionary is undefinied or empty (there must be at least one single bar)
   *
   **/
  private start() : void {
    if (this.bars === undefined || this.bars === null) {
      throw new Error("[{ParallelExectionSetProgressBar}] - Starting Progress Bar failed because [this.bars] is undefined or null, which is unexpected, and should never ever happen.");
    }
    if (this.parallelExecutionsSet.length == 0) {
      console.warn("[{ParallelExectionSetProgressBar}] - parallelExecutionsSet is empty, so can't work on any status to report.");
      this.multibar.stop();
      console.warn("[{ParallelExectionSetProgressBar}] - stopped Progress Bar.");
    } else {
      this.bars.forEach((componentName, singleBar) => {
        // sets the single bar initial State
        singleBar.start(ParallelExectionSetProgressBar.COMPLETED_SCALE, ParallelExectionSetProgressStatus.UNTRIGGERED, {filename: `${componentName}`});
      });
    }
  }
  /**
  * Releases TTY to let the stdout proceed
   **/
  stop() {
    this.multibar.stop();
  }

}

/**
 *
 * The {@see ParallelExectionSetProgressStatus} enumerates all possible Execution Status' of a pipeline Execution
 * <p>
 * Before a pipeline is triggered, the pipeline execution does not exists, as far as the Circle CI API is concerned.
 * So I added a fourth one, <strong>untriggered</strong>, in order to display the progress bar for all planed pipeline executions, before they even exists in the CircleCI API v2 :
 * </p>
 * <ul>
 * <li>
 * <pre>untriggered</pre> (pipeline execution was <strong>not triggered yet</strong>, and does not exsits for the Circle CI API v2)
 * </li>
 * <li>
 * <pre>pending</pre> (pipeline execution was triggered and is running)
 * </li>
 * <li>
 * <pre>errored</pre> (pipeline execution completed with <strong>erros</strong>)
 * </li>
 * <li>
 * <pre>created</pre> (pipeline execution succcessfully completed, with no <strong>errors</strong>)
 * </li>
 * </ul>
 *
 * @comment see {@see ParallelExectionSetProgressBar}
 * @comment Note this might be truned into an internal type (like java inner classes/interfaces) for the {@see ParallelExectionSetProgressBar}
 **/
export enum ParallelExectionSetProgressStatus {
  /**
   * Pipeline execution was <strong>not triggered yet</strong>, and does not exsits for the <strong>Circle CI API v2</strong>
   **/
  UNTRIGGERED = 25,
  /**
   * Pipeline execution was triggered and is running.
   **/
  PENDING = 50,
  /**
   * <p>Pipeline  execution completed with <strong>erros</strong></p>
   * <p>Because fifty-one is far from being one hundred percent, just like completing execution with errors is far from completing successfully (without errors)</p>
   **/
  ERRORED = 51,
  /**
   * Pipeline execution succcessfully completed, with no <strong>errors</strong>.
   **/
  CREATED = 100
}
