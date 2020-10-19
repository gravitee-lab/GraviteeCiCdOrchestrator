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
// RxJS v6+
import * as rxjs from 'rxjs';
import { map, tap, retryWhen, delayWhen,delay,take } from 'rxjs/operators';
import axios from 'axios';
import {AxiosResponse} from 'axios';

/// import * as Collections from 'typescript-collections';

export namespace monitoring_experiments {


  export abstract class AbstractExperimentalMonitor implements monitoring_experiments.IExperimentalMonitor {
    constructor (
      name: string,
      args: AbstractExperimentalMonitorArgs
    ) {
      console.log('Hey i am AbstractExperimentalMonitor \'s constructor ')
    }
  }
  export interface IExperimentalMonitor {

  }

  export interface FetchResult {
     httpCode: number;
     JSONresponse: any; // the resulting JSON Response from the fetched API
  }

  export interface AbstractExperimentalMonitorArgs {
    timeout: number; // in milliseconds
  }

  export interface ExperimentalMonitorArgs extends monitoring_experiments.AbstractExperimentalMonitorArgs {
    rest_endpoint: string; // to delete, just for demo purposes.
  }

  /**
   *
   *
   **/
  export class ExperimentalMonitor extends monitoring_experiments.AbstractExperimentalMonitor {

    public readonly rest_endpoint: string
    ///
    ///
    /**
     * Timeout for the execution of this module
     **/
    public readonly timeout: number;

    constructor (
      name: string,
      args: ExperimentalMonitorArgs
    ) {
      super(`valueofContructorParamOne`, args)

      this.timeout = args.timeout;

      const apiObjID: string = "69d67c0a-fa60-451f-848e-f8eb4695bbf8";
      const jsonPayload: string = "69d67c0a-fa60-451f-848e-f8eb4695bbf8";
      const config: any = {};
      // const rest_endpoint = `https://api.circleci.com/pipelines/${apiObjID}`;
      this.rest_endpoint = `https://randomuser.me/api`;
      this.rest_endpoint = args.rest_endpoint;// on purpose miscofiguration to test retryWhen


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
