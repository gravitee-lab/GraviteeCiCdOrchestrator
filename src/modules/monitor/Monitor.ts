// RxJS v6+
import * as rxjs from 'rxjs';
import { map, tap, retryWhen, delayWhen,delay,take } from 'rxjs/operators';
import axios from 'axios';
import {AxiosResponse} from 'axios';
import * as parallel from '../../modules/monitor/ParallelExecutionSetProgress';
import * as giocomponents from '../manifest/GraviteeComponent';


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
          this.pipelineStatus.pipeline_execution.cci_statuscheck.response = theCci_Api_response;
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
          this.pipelineExecution.pipeline_execution.cci_trigger.response = theCci_Api_response;
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



  /**
   *
   *
   **/
  export class Monitor {

    public readonly parallelExecutionSetProgress: parallel.ParallelExecutionSetProgress;
    /**
     * Subscribe to this one, to find out when all
     * triggers HTTP Responses have all been received
     *
     **/
    private trigger$: rxjs.Subject<parallel.PipelineExecutionProgress>;
    private statu$: rxjs.Subject<parallel.PipelineExecutionProgress>;

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

    constructor (
      name: string,
      args: monitoring.MonitorArgs
    ) {
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

      this.trigger$.subscribe({
        next: ((pipeExecProgress: parallel.PipelineExecutionProgress) => {
          console.log("NEXT Subject for PipelineExecutionProgress Trigger : ")

          if (this.haveAllPipelineTriggersResponseBeenReceived()) {
             console.log("All Pipeline Triggers HTTP Responses have been received from Circle VI API v2 !!! :D ")
             this.start();
          }
        }).bind(this),
        error: ((error: parallel.CciApiPipelineStatusResponse) => {

        }).bind(this),
        complete: ((data: parallel.PipelineExecutionProgress) => {

        }).bind(this)
      })
    }

    private start(){
      /// okay, so first let's
      /// [pipelineParameters] => pipeline execution parameters, same as Jenkins build parameters
      let pipelineParameters = { parameters: {} };
      let observableSentRequest = this.circleci_client.triggerGhBuild(this.secrets.circleci.auth.username, this.github_org, "testrepo1", 'dependabot/npm_and_yarn/handlebars-4.5.3', pipelineParameters)


      /// then let's init status checks subscribers
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

    /**
     * When this one returns true : all triggers HTTP Respense have been received from Circle CI API :
     * So Monitor can proceed with checking pipeline status
     **/
    private haveAllPipelineTriggersResponseBeenReceived(): boolean {
      return this.parallelExecutionSetProgress.haveAllPipelineTriggersResponseBeenReceived();
    }

  }

}
