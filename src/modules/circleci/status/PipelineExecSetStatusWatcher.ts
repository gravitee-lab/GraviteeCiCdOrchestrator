import * as rxjs from 'rxjs';
import { CircleCIClient } from '../../../modules/circleci/CircleCIClient';
import * as reporting from '../../../modules/circleci/status/PipelineExecSetReport';


export interface PipeExecSetStatusNotification {
  is_errored: boolean,
  exec_status_report: reporting.PipelineExecSetReport
}

/**
 * ---
 * Keeps fetching the Circle CI API, to determine when either :
 * => all Pipelines referenced in <code>this.progressMatrix</code>
 * have successfully completed their execution,
 * => or one Pipeline has reached a final execution state, but did not successfully completed
 * => or timeout has been reached
 * ---
 *
 **/
export class PipelineExecSetStatusWatcher {

  /**
   * This RxJS Subject will emit an integer :
   * => To notify the subscribers that all pipelines in this
   *    Pipeline Execution Set have reached a final execution
   *    state : Final State In the sense of Automata theory
   * => The emited integer is the index of this Pipeline Execution State in the Execution Plan (Array)
   * ---
   * The pattern with the RxJS Subject :
   * A./ Subcribers subscribe to the Subject
   * B./ this {@link PipelineExecSetStatusWatcher} will emit a {@link PipeExecSetStatusNotification}
   *     with <code>this.finalStateNotifier.next()</code> method, only after <code>this.start()</code> is invoked.
   * ---
   * The {@link ReactiveParallelExecutionSet} subscribes to this RxSubject, so that it
   * is notified when all Pipelines have reached a final execution state,with or without errors.
   **/
  public readonly finalStateNotifier: rxjs.Subject<PipeExecSetStatusNotification>;
  /**
   * This is the progress matrix for all pipeline executions
   * in one {ParallelExecutionSet}, built by a <code>src/modules/circleci/PipelineExecSetStatusWatcher.ts</code>, not
   * the whole execution plan, as understood by the {@link CircleCiOrchestrator} class.
   * --
   * It is filled with all the HTTP JSON responses of Circle CI API HTTP request to trigger pipelines.
   * --
   * Each entry in this array is of the following form :
   *
   *
   * {
   *   pipeline_exec_number: '2',
   *   id: 'ef4264c2-f6f4-4cc4-a928-e7f89f3aff90',
   *   created_at: '2020-09-30T10:59:27.610Z',
   *   exec_state: 'pending'
   * }
   *
   *
   * --
   **/
  private progressMatrix: any[];
  private circleci_client: CircleCIClient;
  private startDate: Date;
  /// the timeout in seconds
  public readonly timeout: number;
  /**
   * The watch interval in seconds :
   * this {@link PipelineExecSetStatusWatcher} will update progressMatrix every <code>this.watch_interval</code> seconds
   **/
  public readonly watch_interval: number;
  /**
   * The maximum number of workflows allowedforany Pipeline execution
   * If that number is exceeded by any Circle Pipeline execution, then the
   * current CI CD Stage is aborted (stops its execution)
   **/
  public readonly max_nb_of_wflows: number;

  constructor(progressMatrix: any[], circleci_client) {
    this.progressMatrix = progressMatrix;
    this.finalStateNotifier = new rxjs.Subject<PipeExecSetStatusNotification>();
    this.startDate = null;
    this.timeout = parseInt(process.env.PIPELINE_COMPLETE_TIMEOUT);
    this.watch_interval = 7; // watcher will update progressMatrix every 7 seconds
    this.max_nb_of_wflows = parseInt(process.env.MAX_NB_OF_WFLOWS_PER_PIPELINE);
  }

  /**
   * ---
   * This method queries the CircleCI API and adds or updates each entry of
   * the <code>this.progressMatrix</code> array's [workflows_exec_state] JSon property
   * ---
   * Now, when :
   *
   * => all Pipelines have reached a final execution state,
   * => or any Pipeline has reach a final execution state with errors,
   *
   * Then this method will :
   * => build the execution report using {@link reporting.PipelineExecSetReport}
   * => and call the next() method of the <code>this.finalStateNotifier</code> RxJS Subject, to notify its {@link PipelineExecSetStatusWatcher} friend
   * ---
   *
   **/
  updateProgressMatrixWorkflowsExecStatus() {
    console.info("");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info("{[PipelineExecSetStatusWatcher]} - Updating Progress Matrix Execution state ofeach Pipeline : ");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info(" ---");
    console.info(JSON.stringify({ progressMatrix: this.progressMatrix }, null, " "));
    console.info(" ---");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info("");

    /**
     * First, launch all HTTP Requests to update all entries in the [progressMatrix] 's [workflows_exec_state] JSON Property
     **/
    for (let k = 0; k < this.progressMatrix.length; k++) {

        console.log( `[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus()] - value of Pipeline GUID : [${this.progressMatrix[k].id}]`);
        /// if (process.argv["dry-run"] === 'true') {
        if (process.argv["dry-run"]) {
         console.log( '[{PipelineExecSetStatusWatcher}] - (process.argv["dry-run"] === \'true\') condition is true');
        } else {
         console.log( '[{PipelineExecSetStatusWatcher}] - (process.argv["dry-run"] === \'true\') condition is false');
        }

        let inspectPipelineExecStateSubscription = this.circleci_client.inspectPipelineExecState(`${this.progressMatrix[k].id}`).subscribe({
          next: this.handleInspectPipelineExecStateResponseData.bind(this),
          complete: data => {
             console.log( `[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [${this.progressMatrix[k].id}] Execution state completed! :) ]`)
          },
          error: this.errorHandlerInspectPipelineExecState.bind(this)
        });
    }

  }
  public start () {
    if (this.startDate === null) {
      this.startDate = new Date();
    } else {
      console.log("No, someVar is not null");
    }
  }

  /**
   *
   * Note that the HTTP JSON Response will be ofthe following form :
   *
   *      {
   *        "next_page_token": null,
   *        "items": [
   *          {
   *            "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
   *            "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c",
   *            "name": "docker_build_and_push",
   *            "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
   *            "status": "failed",
   *            "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   *            "pipeline_number": 126,
   *            "created_at": "2020-09-12T17:47:21Z",
   *            "stopped_at": "2020-09-12T17:48:26Z"
   *          },
   *          {
   *            "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
   *            "id": "cd7b408f-48d4-4ba7-8a0a-644d82267434",
   *            "name": "yet_another_test_workflow",
   *            "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
   *            "status": "success",
   *            "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   *            "pipeline_number": 126,
   *            "created_at": "2020-09-12T17:47:21Z",
   *            "stopped_at": "2020-09-12T17:48:11Z"
   *          }
   *        ]
   *      }
   *
   * ---
   *
   * Will update the progressMatrix Entry matching the [pipeline_id] in the [circleCiJsonResponse], like this :
   *
   *    from the following form :
   *    {
   *      pipeline_exec_number: 'unchanged_value',
   *      id : 'unchanged_value',
   *      created_at: 'unchanged_value',
   *      exec_state: 'unchanged_value'
   *    }
   *    to the following form :
   *    {
   *      pipeline_exec_number: 'unchanged_value',
   *      id : 'unchanged_value',
   *      created_at: 'unchanged_value',
   *      exec_state: 'unchanged_value',
   *      workflows_exec_state: `${circleCiJsonResponse}`
   *    }
   *
   **/
  private handleInspectPipelineExecStateResponseData (circleCiJsonResponse: any) : void {
    console.info( '[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is : ', circleCiJsonResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )
    /// if the pipeline has zero workflows,then wehave a problem here : so we stop all operations
    if (circleCiJsonResponse.items.length == 0) {
      throw new Error("The last processed Pipeline has no workflows, which is an anomaly, so stopping all operations.")
    }
    let pipeline_guid = circleCiJsonResponse.items[0].pipeline_id;
    if (!((circleCiJsonResponse.items.length + 1) < this.max_nb_of_wflows)) {
      throw new Error(`The Pipeline execution of GUID [${pipeline_guid}] has more than the maximum number of workflows authorized for any Gravitee CIrcleCI Pipeline, which is [${this.max_nb_of_wflows}], which is an anomaly, so the [${process.argv["cicd-stage"]}] CI CD Stage is aborted (stopping all operations).`)
    }
    let next_page_token = circleCiJsonResponse.next_page_token;
    let pipelineIndexInProgressMatrix= this.getIndexInProgressMatrixOfPipeline(pipeline_guid);
    this.progressMatrix[pipelineIndexInProgressMatrix].workflows_exec_state = circleCiJsonResponse;
  }

  /**
   *
   **/
  private errorHandlerInspectPipelineExecState (error: any) : void {
    console.info( '[{PipelineExecSetStatusWatcher}] - [errorHandlerInspectPipelineExecState] - Triggering Circle CI pipeline failed Circle CI API Response [data] => ', error )
    let entry: any = {};
    entry.pipeline = {
      execution_index: null,
      id : null,
      created_at: null,
      exec_state: null,
      error : {message: "[{PipelineExecSetStatusWatcher}] - [errorHandlerInspectPipelineExecState] - Triggering Circle CI pipeline failed ", cause: error}
    }

    console.info('');
    console.info( '[{PipelineExecSetStatusWatcher}] - [errorHandlerInspectPipelineExecState] [this.progressMatrix] is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info({progressMatrix: this.progressMatrix});
    console.info('')
    throw new Error('[{PipelineExecSetStatusWatcher}] - [errorHandlerInspectPipelineExecState] CICD PROCESS INTERRUPTED BECAUSE INSPECTING PIPELINE EXEC STATE FAILED with error : [' + error + '] '+ '. Note that When failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
  }

  private getIndexInProgressMatrixOfPipeline(ofGuid: string): number {
    let indexToReturn: number = -1;
     for (let k = 0; k < this.progressMatrix.length; k++) {
       if (this.progressMatrix[k].id === ofGuid) {
         console.log(`[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [${ofGuid}] was found in progressMatrix, its index is : [${k}]`);
         indexToReturn = k;
       }
     }
    if (indexToReturn == -1) {
      throw new Error(`[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [${ofGuid}] was not found in progressMatrix : [${this.progressMatrix}], So this CICD Stage is now stopping execution of the whole ${process.argv["cicd-stage"]} CI CD Process`);
    }
    return indexToReturn;
  }

}



/// Calculations on time spans : https://www.thetopsites.net/article/53538894.shtml
