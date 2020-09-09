// RxJS v6+
import * as rxjs from 'rxjs';
import { map, tap, retryWhen, delayWhen,delay,take } from 'rxjs/operators';
import axios from 'axios';
import {AxiosResponse} from 'axios';
import * as parallel from '../../modules/monitor/ParallelExecutionSetProgress';
/// import { GraviteeComponent } from '../../modules/manifest/GraviteeComponent';
/// import { ParallelExecutionSet } from '../../modules/manifest/ParallelExecutionSet'
/// import * as Collections from 'typescript-collections';

export namespace monitoring {


  export interface FetchResult {
     httpCode: number;
     JSONresponse: any; // the resulting JSON Response from the fetched API
  }


  export interface MonitorArgs  {
    parallelExecutionSetProgress: parallel.ParallelExecutionSetProgress;
    timeout: number;
  }

  /**
   *
   *
   **/
  export class Monitor {

    public readonly parallelExecutionSetProgress: parallel.ParallelExecutionSetProgress;
    ///
    ///
    /**
     * Timeout for the execution of this module
     **/
    public readonly timeout: number;

    constructor (
      name: string,
      args: MonitorArgs
    ) {
      this.timeout = args.timeout;

    }
  start(){
    let arrayLength = this.parallelExecutionSetProgress.pipeline_executions.length;
    for (let i: number; i < arrayLength ; i++){
      this.parallelExecutionSetProgress.pipeline_executions[i].execution.observableRequest.subscribe({
          next: this.handleTriggerPipelineCircleCIResponseData.bind(this),
          complete: (data) => {
            console.log( '[{[CircleCiOrchestrator]} - triggering Circle CI Build completed! :)]')
          },
          error: this.errorHandlerTriggerCCIPipeline.bind(this)
      });
    }

  }
  public fetch (): rxjs.Observable<AxiosResponse<any>> {

          //emit fetch result every 1s
          //emit value every 1s
          //emit value every 1s
          const source = rxjs.from(axios.get(`${this.rest_endpoint}`)).pipe(
          tap(val => console.log(`fetching ${this.rest_endpoint} which you won't see `)),)
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
                  console.log(`Error occured, trying to fetch [${this.rest_endpoint}], HTTP Response is : `);
                  console.log(`Error occured, trying to fetch [${JSON.stringify(axiosResponse.data)}], now retrying`);
                  console.log(`Error occured, trying to fetch [${this.rest_endpoint}], now retrying`);

                }),
                //restart in 5 seconds
                delay(2000), /// wait 2 seconds before retrying
                /// delayWhen(val => timer(val * 1000)),
                /// delayWhen(val => rxjs.timer(7 * 1000)), /// wait 7 seconds before retrying
                take(5)
              )
            )
          );

          return response$;

    }
    // perfect test is :
    // curl -X DELETE https://auth-nightly.gravitee.io/management/organizations/DEFAULT/environments/DEFAULT/domains/dine
    // {"message":"No JWT token found","http_status":401}
    public demoRetryWhen (): rxjs.Observable<AxiosResponse<any>> {

            const source = rxjs.from(axios.delete(`${this.rest_endpoint}`)).pipe(
            tap(val => console.log(`fetching ${this.rest_endpoint} which you won't see `)))
            const response$ = source.pipe(
              map(axiosResponse => {
                if (!(axiosResponse.status == 200 || axiosResponse.status == 201 || axiosResponse.status == 203)) {
                  //error will be picked up by retryWhen
                  console.log(` Fetch Response' request is : [${axiosResponse.request}], `);
                  console.log(` HTTP status is : [${axiosResponse.statusText}], `);
                  console.log(` AxiosResponse config is [${axiosResponse.config}]`);

                  throw axiosResponse;
                }
                return axiosResponse; /// return value  HTTP Response Code si 200
              }),
              retryWhen(errors =>
                errors.pipe(
                  //log error message
                  tap(axiosResponse => {
                    console.log(`What is passed on to tap >>  [${JSON.stringify(axiosResponse,null,2)}],`);
                    console.log(`now retrying`);

                  }),
                  //restart in 5 seconds
                  delay(2000), /// wait 2 seconds before retrying
                  /// delayWhen(val => timer(val * 1000)),
                  /// delayWhen(val => rxjs.timer(7 * 1000)), /// wait 7 seconds before retrying
                  take(5)
                )
              )
            );

            return response$;

      }
  }

}
