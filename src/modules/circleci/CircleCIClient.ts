import * as rxjs from 'rxjs';
import { map, tap, retryWhen, delayWhen,delay,take } from 'rxjs/operators';
import axios from 'axios';
import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import * as fs from 'fs';
/**
 *
 * Mimics the official Circle CI cLient, only much simpler, and with [RxJS]
 * Circle CI API v2 based
 **/
export class CircleCIClient {
  private secrets: CircleCISecrets;
  constructor() {
    this.loadCircleCISecrets();
  }
  loadCircleCISecrets () : void { ///     private secrets: CircleCISecrets;
    /// first load the secretfile

    let secretFileAsString: string = fs.readFileSync(process.env.SECRETS_FILE_PATH,'utf8');
    this.secrets = JSON.parse(secretFileAsString);
    console.debug('');
    console.debug("[{CircleCIClient}] - loaded secrets file content :");
    console.debug('');
    console.debug(this.secrets)
    console.debug('');

  }

    /**
     * Triggers a Circle CI Pipeline, for a repo on Github
     *
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
    triggerCciPipeline(org_name: string, repo_name: string, branch: string, pipelineParameters: any): any/*Observable<any> or Observable<AxiosResponse<any>>*/ {

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
      return observableRequest;

/*
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

      return response$;*/
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
