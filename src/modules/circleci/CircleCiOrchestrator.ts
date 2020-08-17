/// import { CircleCI } from 'circleci';
import { Observable } from 'rxjs';
import axios from 'axios';
import * as fs from 'fs';
import * as cliProgress from 'cli-progress';

/**
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * [gravitee_release_branch] must match one of the existing branch on https://github.com/gravtiee-io/release.git, see [.DOTNEV] [RELEASE_BRANCHES] env. var.
 *
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {
    /**
     *
     * ---
     *
     * Example Execution Plan :
     * -----
     * <pre>
     *
     * </pre>
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
    handleTriggerPipelineCircleCIResponseData (data: any) : void {
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] => ', data )
      let entry: any = {};
      entry.pipeline = {
        execution_index: `${data.number}`,
        id : `${data.id}`,
        created_at: `${data.created_at}`,
        exec_state: `${data.state}`
      }

      this.progressMatrix.push(entry);

      console.info('')
      console.info( '[{CircleCiOrchestrator}] - [handleTriggerPipelineCircleCIResponseData] [this.progressMatrix] is now :  ');
      console.info(JSON.stringify({progressMatrix: this.progressMatrix}))
      console.info('')
      console.warn("[{CircleCiOrchestrator}] - Processing of the execution plan is not implemented yet.");
    }
    handleGetPipelineGhRepoCircleCIResponseData (data: any) : void {
      /// TODO ?
    }
    processExecutionSet (parallelExecutionsSet: string[]) : void {

      parallelExecutionsSet.forEach((dependency, index) => {
        let whoamiSubscription = this.circleci_client.whoami().subscribe( {
            next: data => console.log( '[data] => ', data ),
            complete: data => console.log( '[complete]' )
          } );

      });
      /// pipeline execution parameters, same as Jenkins build parameters
      let pipelineParameters = { parameters: {}};
      let triggerPipelineSubscription = this.circleci_client.triggerGhBuild(this.secrets.circleci.auth.username, 'gravitee-lab', "testrepo1", 'dependabot/npm_and_yarn/handlebars-4.5.3', pipelineParameters).subscribe( {
          next: this.handleTriggerPipelineCircleCIResponseData.bind(this),
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
 * @comment All Circle CI API calls are asynchronous, RxJS ObservableStreams, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class ParallelExectionSetProgressBar {

  private multibar: cliProgress.MultiBar;
  /**
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
    this.init();
    this.parallelExecutionsSet = parallelExecutionsSet;
    if (parallelExecutionsSet === undefined) {
      throw new Error("[{ParallelExectionSetProgressBar}] - parallelExecutionsSet is undefined, so can't work on any status to report.")
    }
    if (parallelExecutionsSet.length == 0) {
      console.warn("[{ParallelExectionSetProgressBar}] - parallelExecutionsSet is empty, so can't work on any status to report.")
    }

  }

  /**
   * Initializes the {@see cliProgress.MultiBar} https://www.npmjs.com/package/cli-progress component, from
   * the {@see this.progressMatrix}
   **/
  init (): void {
    ///
    // create new MultiBar container
    this.multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true
    }, cliProgress.Presets.shades_grey);

    this.parallelExecutionsSet.forEach((componentName, index) => {
      // add bars
      let singleBar = this.multibar.create(100, 0);

      // control bars
      singleBar.increment();
      singleBar.update(20, {filename: "helloworld.txt"});

      // stop all bars

    });

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
  UNTRIGGERED,
  /**
   * Pipeline execution was triggered and is running
   **/
  PENDING,
  /**
   * Pipeline  execution completed with <strong>erros</strong>
   **/
  ERRORED,
  /**
   * Pipeline execution succcessfully completed, with no <strong>errors</strong>
   **/
  CREATED
}
