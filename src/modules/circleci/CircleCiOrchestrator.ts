/// import { CircleCI } from 'circleci';
import { Observable } from 'rxjs';
import axios from 'axios';
import * as fs from 'fs';

/**
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * @comment All methods are asynchronous, RxJS or at least Promises, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {
    /**
     * [gravitee_release_branch] must match one the of the existing branch on
     **/
    private execution_plan: string [][];
    private retries: number;

    private circleci_client: CircleCIClient;

    constructor(execution_plan: string [][], retries: number) {
        this.execution_plan = execution_plan;
        this.retries = retries;
        this.circleci_client = new CircleCIClient();

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
      console.warn("[{CircleCiOrchestrator}] - Processing of the execution plan is not implemented yet.");
    }

    processExecutionSet (parallelExecutionsSet: string[]) : void {

      parallelExecutionsSet.forEach((dependency, index) => {
        let observableRequest = this.circleci_client.whoami();
        let subscription = observableRequest.subscribe( {
            next: data => console.log( '[data] => ', data ),
            complete: data => console.log( '[complete]' )
        } );
      });
    }
    giveup()  : void {
      console.log("[{CircleCiOrchestrator}] - giveup() method is not implemented yet.");
    }
}


/**
 *
 * Mimics the official CircleCI cLient, only much simpler, and with [RxJS]
 *
 **/
export class CircleCIClient {
  private secrets: any;
  constructor() {
    this.loadCircleCISecrets();
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
     * Triggers a Circle CI Pipeline
     *
     * @argument username {@type string} the Circle CI username , eg "jpstevens",
     * @argument project {@type string} the Circle CI project name, matching the github repo name, e.g."circleci",
     * @argument branch {@type string} the git branch "master" on which to trigger the pipeline
     **/
    triggerBuild(username: string, project: string, branch: string): Observable<any>{
      let observableRequest = Observable.create( ( observer ) => {
          axios.get( 'https://circleci.com/api/v2/me' )
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
    whoami(): any {
      let observableRequest = Observable.create( ( observer ) => {
          let config = {
            headers: {
              "Circle-Token": this.secrets.circleci.auth.token,
            }
          };

          let jsonPayloadExample = {
            'if I have to': 'ccc'
          };
          /// axios.post( 'https://circleci.com/api/v2/me', jsonPayloadExample, config ).then(....)
          axios.get( 'https://circleci.com/api/v2/me', config )
          .then( ( response ) => {
              observer.next( response.data );
              observer.complete();
          } )
          .catch( ( error ) => {
              observer.error( error );
          } );
      } );
      let subscription = observableRequest.subscribe( {
          next: data => console.log( '[data] => ', data ),
          complete: data => console.log( '[complete]' ),
      } );
      return observableRequest;
    }
}
