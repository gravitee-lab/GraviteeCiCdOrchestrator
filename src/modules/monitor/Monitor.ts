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
import * as parallel from '../../modules/monitor/ParallelExecutionSetProgress';
import * as orchestra from '../circleci/CircleCiOrchestrator';

import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'

/// import * as Collections from 'typescript-collections';

export namespace monitoring {

  export namespace subscribers {

      interface ICciApiSubscriberNext {
        (data: any): void;
      }

      interface ICciApiSubscriberComplete {
        (data: any): void;
      }

      interface ICciApiSubscriberError {
        (error: any): void;
      }

      export interface ICciApiSubscriber {
        next: ICciApiSubscriberNext, /// method with signature (data: any) => {}
        complete: ICciApiSubscriberComplete,/// method with signature (data: any) => {}
        error: ICciApiSubscriberError /// method with signature (error: any) => {}
      }

      export class CciApiPipelineStatusChecksSubscriber implements ICciApiSubscriber {

        public readonly pipelineStatus: parallel.PipelineExecutionProgress;

        constructor (
          somePipelineExecution: parallel.PipelineExecutionProgress
        ) {
           this.pipelineStatus = somePipelineExecution;
           // immediately subscribes to Circle CI API HTTP request to check Pipeline Status 's observableRequest (which is an RxJS {@see ObservableStream} )
           this.pipelineStatus.pipeline_execution.cci_statuscheck.observableRequest.subscribe(this);
        }
        public next (theCci_Api_response: any) : void {
          console.log( '[{[Monitor]} - querying Circle CI API to check Pipeline Status : response received ! (below received Circle CI answer) :)]')
          console.log( JSON.stringify(theCci_Api_response, null, " "));
          this.pipelineStatus.pipeline_execution.cci_statuscheck.response = theCci_Api_response.data;
        }
        public complete(theCci_Api_response: any) : void {
          console.log( '[{[Monitor]} - querying Circle CI API to check Pipeline Status completed! (below received Circle CI answer) :)]')
          console.log( JSON.stringify(theCci_Api_response, null, " "));
        }
        public error(theCci_Api_error: any) : void { // handleTriggerPipelineCciResponseError
          console.log( '[{[Monitor]} -  querying Circle CI API to check Pipeline Status returned HTTP error! :o  (below received Circle CI answer)]')
          console.log( JSON.stringify(theCci_Api_error, null, " "));
          this.pipelineStatus.pipeline_execution.cci_statuscheck.error = theCci_Api_error;
        }
      }
      /**
       * Used to Subscribe to the ObservableStream for each Circle CI API invocation
       * to trigger a pipeline execution
       **/
      export class CciApiTriggerPipelineSubscriber implements ICciApiSubscriber {

        public readonly pipelineExecution: parallel.PipelineExecutionProgress;
        constructor (
          somePipelineExecution: parallel.PipelineExecutionProgress
        ) {
           this.pipelineExecution = somePipelineExecution;
           // immediately subscribes to PipelineExecution 's observableRequest (which is an RxJS {@see ObservableStream} )
           this.pipelineExecution.pipeline_execution.cci_trigger.observableRequest.subscribe(this);
        }
        public next (theCci_Api_response: any) : void {
          console.log( '[{[Monitor]} - triggering Circle CI Pipeline : response received ! (below received Circle CI answer) :)]')
          console.log( JSON.stringify(theCci_Api_response, null, " "));
          this.pipelineExecution.pipeline_execution.cci_trigger.response = theCci_Api_response.data;
        }
        public complete(theCci_Api_response: any) : void {
          console.log( '[{[Monitor]} - triggering Circle CI Pipeline completed! (below received Circle CI answer) :)]')
          console.log( JSON.stringify(theCci_Api_response, null, " "));
        }
        public error(theCci_Api_error: any) : void { // handleTriggerPipelineCciResponseError
          console.log( '[{[Monitor]} - triggering Circle CI Pipeline returned HTTP error :o ! (below received HTTP error) ]')
          console.log( JSON.stringify(theCci_Api_error, null, " "));
          this.pipelineExecution.pipeline_execution.cci_trigger.error = theCci_Api_error;
        }

      }

    } // end of [subscribers] namespace



      export interface FetchResult {
         httpCode: number;
         JSONresponse: any; // the resulting JSON Response from the fetched API
      }


      export interface MonitorArgs  {
        parallelExecutionSetProgress: parallel.ParallelExecutionSetProgress,
        timeout: number,
        secrets: CircleCISecrets
      }

  /**
   *
   * CircleCiOrchestrator will subscribe to the Monitor as RxJS Subject , in order to detect when
   **/
  export class Monitor extends rxjs.Subject<parallel.PipelineExecutionProgress> { // CircleCiOrchestrator will subscribe to

    public readonly parallelExecutionSetProgress: parallel.ParallelExecutionSetProgress;


    /**
     *
     * Those help the Monitor find out when all CircleCI API HTTP Responses
     * have been received, when triggering pipline executions
     *
     **/
    public readonly triggerSubscribers: monitoring.subscribers.CciApiTriggerPipelineSubscriber[];
    public readonly statusSubscribers: monitoring.subscribers.CciApiPipelineStatusChecksSubscriber[];
    /**
     * Set to <code>true</code> as soon as this PipelineExecution has completed, regardless of
     * pipeline execution final status (failure/success, etc...)
     **/
    public readonly completed: boolean;
    /**
     * Timeout for the status checks and trigerring of all Pipelines
     **/
    public readonly timeout: number;

    /**
     * Circle CI Secrets used byt his Monitor, like the (API Token) to authenticate to Circle CI API
     **/
    private secrets: CircleCISecrets;

    constructor (
      name: string,
      args: monitoring.MonitorArgs
    ) {
      super()
      /**
       * Monitor subscribes to all crated ObservableStreams
       * for all Circle CI v2 invocations to trigger all pipeline executions
       **/
      this.timeout = args.timeout; // unsued yet
      this.triggerSubscribers = [];
      this.statusSubscribers = [];
      // ok, first, RxJS subscribe to Observable Streams for all Circle CI Pipeline triggers
      this.initTriggerSubscribers();
      // Then, we need to find out when all triggers actually received Circle CI API Response
      // this is done using an RxJS "Subject"

      // throw new Error("Implementation not finished : need to instatiate RxJS Subject to detect when [this.parallelExecutionSetProgress.all_pipeline_execution_progress] have ")
      /// see https://rxjs-dev.firebaseapp.com/guide/subject => PipelineExecutionProgress must be equiped with a Subject to subscribe to

      this.parallelExecutionSetProgress.subscribe({ // subscription to Subject
        next: ((pipeExecProgress: parallel.PipelineExecutionProgress) => {
          console.log(">>>>>>>>>>Subject NEXT for PipelineExecutionProgress Circle CI Pipeline trigger of Gravitee Component : [" + pipeExecProgress.component.repo_http_uri + "]")

          if (this.parallelExecutionSetProgress.haveAllPipelineTriggersResponseBeenReceived()) {
             console.log(">>>>>>>>>>Subject NEXT >>> All Pipeline Triggers HTTP Responses have been received from Circle VI API v2 !!! :D (last was for Gravitee Component [" + pipeExecProgress.component + "] ");
             this.start();
          } else {
             console.log("Not All Pipeline Triggers HTTP Responses have been received from Circle VI API v2 , proceeeding after Gravitee Component [" + pipeExecProgress.component + "] ");
          }
        }).bind(this),
        error: ((error: parallel.CciApiPipelineStatusResponse) => {
           console.log(">>>>>>>>>>Subject ERROR for PipelineExecutionProgress Circle CI Pipeline trigger of Gravitee Components : " + error)
           console.log(error)
        }).bind(this),
        complete: ((data: parallel.PipelineExecutionProgress) => {
           console.log(">>>>>>>>>>Subject COMPLETE for PipelineExecutionProgress Circle CI Pipeline trigger of Gravitee Components : ");
           console.log(data)
        }).bind(this)
      })
    }

    /**
     * Queries the Circle CI API to check execution status of workflows of a given Circle CI Pipeline
     *
     * @paramter <code>pipeline_uuid</code> the UUID of the Pipeline you want to check Workflows execution status for. CircleCI API simply names 'id' this pipline uuid
     **/
    private checkCciWorkflowsExecStatusFor(pipeline_uuid: string) : rxjs.Observable<AxiosResponse<any>> {
      let requestConfig = {
        headers: {
          "Circle-Token": this.secrets.circleci.auth.token,
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      };
      const cci_rest_endpoint = "https://circleci.com/api/v2/pipeline";
      const source = rxjs.from(axios.post(`${cci_rest_endpoint}` + "/" + `${pipeline_uuid}` + "/workflow", null, requestConfig )).pipe(
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
              console.log(`Error occured, trying to check workflows execution status of pipeline [${pipeline_uuid}], HTTP Response is : `);
              console.log(`Error occured, trying to fetch [${JSON.stringify(axiosResponse.data)}], now retrying`);
              console.log(`Error occured, now retrying`);
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
    private start(){
      /// okay, so now let's launch all http requests to Circle CI API, to check Pipelines Workflows Execution Status
      let arrLength = this.parallelExecutionSetProgress.all_pipeline_execution_progress.length;

      for (let  i = 0; i < arrLength; i++) {
        let pipeline_uuid = this.parallelExecutionSetProgress.all_pipeline_execution_progress[i].pipeline_execution.cci_trigger.response.id;
        this.parallelExecutionSetProgress.all_pipeline_execution_progress[i].pipeline_execution.cci_statuscheck.observableRequest = this.checkCciWorkflowsExecStatusFor(pipeline_uuid);
      }
      // Ok, now we need to init status checks subscribers
      this.initStatusSubscribers();

      ///
      /// And finally we have to determine when all status checks have
      /// detected Pipeline Execution Completed, to then emit an
      /// Observable Stream event, to the Main Orchestrator, who then
      /// knows all Pipeline Executions have completed, and :
      ///
      /// => Store All Pipeline Execution in the {@see ParallelExecutionSet} in the Global Pipeline Execution Report (printed when all {@see ParallelExecutionSet} have completed)
      /// => Print the report to the Winston logger, (and Filebeat forwards to Logstash / ElasticSearch, with CICD Process label)
      /// => Proceed with next {@see ParallelExecutionSet}, if no pipeline execution completed with 'failed' status
      ///



    }
    // -----
    // -----
    // ----- Pipeline Executions Monitoring
    // -----
    // -----

    private initStatusSubscribers() : void {
      let arrayLength = this.parallelExecutionSetProgress.all_pipeline_execution_progress.length;
      for (let i: number; i < arrayLength ; i++){
        // create a new Subscriber which immediately subscribes to PipelineExecution 's observableRequest
        let thisSubscriber = new monitoring.subscribers.CciApiPipelineStatusChecksSubscriber(this.parallelExecutionSetProgress.all_pipeline_execution_progress[i]);
        // keep a reference over the new subscriber
        this.statusSubscribers.push(thisSubscriber);
      }
    }
    /**
     * When this one returns true : all triggers HTTP Respense have been received from Circle CI API :
     * So Monitor can proceed with checking pipeline status
     **/
    private haveAllPipelineStatusChecksResponseBeenReceived(): boolean {
      return this.parallelExecutionSetProgress.haveAllPipelineStatusChecksResponseBeenReceived();
    }

    // -----
    // -----
    // ----- Pipeline Triggers Monitoring
    // -----
    // -----

    private initTriggerSubscribers() : void {
      let arrayLength = this.parallelExecutionSetProgress.all_pipeline_execution_progress.length;
      for (let i: number; i < arrayLength ; i++){
        // create a new Subscriber which immediately subscribes to PipelineExecution 's observableRequest
        let thisSubscriber = new monitoring.subscribers.CciApiTriggerPipelineSubscriber(this.parallelExecutionSetProgress.all_pipeline_execution_progress[i]);
        // keep a reference over the new subscriber
        this.triggerSubscribers.push(thisSubscriber);
      }
    }


  }

}
