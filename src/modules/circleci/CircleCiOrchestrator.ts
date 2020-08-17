/// import { CircleCI } from 'circleci';
import { Observable } from 'rxjs';
import axios from 'axios';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

/**
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {
    /**
     * [gravitee_release_branch] must match one the of the existing branch on
     **/
    private execution_plan: string [][];
    /**
     *
     * -----
     * <pre>
     * {
     *   "progressMatrix": [
     *     {
     *       "pipeline": {
     *         "execution_index": "14",
     *         "id": "f71bb92d-534f-485d-9dae-af32df1b340d",
     *         "created_at": "2020-08-16T21:33:43.830Z",
     *         "exec_state": "2020-08-16T21:33:43.830Z",
     *       }
     *     },
     *     {
     *       "pipeline": {
     *         "execution_index": "14",
     *         "id": "f71bb92d-534f-485d-9dae-af32df1b340d",
     *         "created_at": "2020-08-16T21:33:43.830Z",
     *         "exec_state": "2020-08-16T21:33:43.830Z",
     *       }
     *     }
     *   ]
     * }
     *
     * </pre>
     * -----
     *  Note how to retrieve "everything about a pipeline", from its <strong>Circle CI</strong> Pipeline ID :
     * -----
     * <pre>
     * ~/gravitee-orchestra$ curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: 6622dda825a8305bd927e6f77b71b4ad2df87e2f' https://circleci.com/api/v2/pipeline/f71bb92d-534f-485d-9dae-af32df1b340d | jq
     * % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
     *                                  Dload  Upload   Total   Spent    Left  Speed
     * 100   663  100   663    0     0   1735      0 --:--:-- --:--:-- --:--:--  1731
     * {
     *   "id": "f71bb92d-534f-485d-9dae-af32df1b340d",
     *   "errors": [],
     *   "project_slug": "gh/gravitee-lab/testrepo1",
     *   "updated_at": "2020-08-16T21:33:43.830Z",
     *   "number": 14,
     *   "state": "created",
     *   "created_at": "2020-08-16T21:33:43.830Z",
     *   "trigger": {
     *     "received_at": "2020-08-16T21:33:43.799Z",
     *     "type": "api",
     *     "actor": {
     *       "login": "Jean-Baptiste-Lasselle",
     *       "avatar_url": "https://avatars2.githubusercontent.com/u/35227860?v=4"
     *     }
     *   },
     *   "vcs": {
     *     "origin_repository_url": "https://github.com/gravitee-lab/testrepo1",
     *     "target_repository_url": "https://github.com/gravitee-lab/testrepo1",
     *     "revision": "b9940405385ab81ad7bb44880ed71f0c23e55c17",
     *     "provider_name": "GitHub",
     *     "branch": "dependabot/npm_and_yarn/handlebars-4.5.3"
     *   }
     * }
     *
     * </pre>
     * -----
     **/
    private progressMatrix: any[];

    private retries: number;

    private circleci_client: CircleCIClient;
    private secrets: any;

    constructor(execution_plan: string [][], retries: number) {
        this.execution_plan = execution_plan;
        this.retries = retries;
        this.loadCircleCISecrets();
        this.circleci_client = new CircleCIClient(this.secrets);
        this.progressMatrix = [];

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
      console.info("[{CircleCiOrchestrator}] - started processing execution plan, and will retry " + this.retries + " times executing a [Circle CI] pipeline before giving up.")
      this.execution_plan.forEach((parallelExecutionsSet, index) => {
        console.info("[{CircleCiOrchestrator}] - processing Parallel Execution Set no. ["+`${index}`+"] will trigger the following [Circle CI] pipelines : ");
        if (parallelExecutionsSet.length == 0) {
          console.info("[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. ["+`${index}`+"] because it is empty");
        } else {
          console.info(parallelExecutionsSet);
          this.processExecutionSet(parallelExecutionsSet); /// must be synchronous
        }

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
    handleCircleCIData (data: any) : void {
      console.info( '[{CircleCiOrchestrator}] - [handleCircleCIData] Processing Circle CI API Response [data] => ', data )
      let entry: any = {};
      entry.pipeline = {
        execution_index: `${data.number}`,
        id : `${data.id}`,
        created_at: `${data.created_at}`,
        exec_state: `${data.state}`
      }
      this.progressMatrix.push(entry);
      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [handleCircleCIData] [this.progressMatrix] is now :  ');
      console.info(JSON.stringify({progressMatrix: this.progressMatrix}))
      console.info('')
      console.warn("[{CircleCiOrchestrator}] - Processing of the execution plan is not implemented yet.");
    }
    processExecutionSet (parallelExecutionsSet: string[]) : void {

      parallelExecutionsSet.forEach((dependency, index) => {
        let whoamiSubscription = this.circleci_client.whoami().subscribe( {
            next: data => console.log( '[data] => ', data ),
            complete: data => console.log( '[complete]' )
          } );

      });
      /// A simle test to run once for every parallelExecutionSet
      /// A test : just one pipeline build trigger on a test repo
      let pipelineParameters = { parameters: {}};
      let triggerPipelineSubscription = this.circleci_client.triggerGhBuild(this.secrets.circleci.auth.username, 'gravitee-lab', "testrepo1", 'dependabot/npm_and_yarn/handlebars-4.5.3', pipelineParameters).subscribe( {
          next: this.handleCircleCIData.bind(this),
          complete: data => {
            console.log( '[triggering Circle CI Build completed! :)]')
          }
      });

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
    getLatestGhBuild(username: string, org_name: string, repo_name: string, branch: string, pipelineParameters: any): any {
      let observableRequest = Observable.create( ( observer ) => {
          let config = {
            headers: {
              "Circle-Token": this.secrets.circleci.auth.token,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          };

          console.info("curl -X POST -d -H 'Content-Type: application/json'" + " -H 'Accept: application/json'" + " -H 'Circle-Token: " + `${this.secrets.circleci.auth.token}` + "' https://circleci.com/api/v2/project/gh/" + `${org_name}` + "/" + `${repo_name}` + "/pipeline");

          /// axios.post( 'https://circleci.com/api/v2/me', jsonPayloadExample, config ).then(....)
          axios.get( "https://circleci.com/api/v2/project/gh/" + `${org_name}` + "/" + `${repo_name}` + "/pipeline", config )
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
 * <ul>
 * <li>
 * Displays a multi progress bar for a Parallel Execution Set
 * </li>
 * <li>
 * based on https://www.npmjs.com/package/cli-progress#multi-bar-mode
 * </li>
 * </ul>
 *
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class ParallelExectionSetProgressBar {
  /// ccc;

  constructor(){

  }

}
