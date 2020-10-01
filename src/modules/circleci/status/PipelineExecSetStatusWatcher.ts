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


  constructor(progressMatrix: any[], circleci_client) {
    this.progressMatrix = progressMatrix;
    this.finalStateNotifier = new rxjs.Subject<PipeExecSetStatusNotification>();
  }

  /**
   * ---
   * This method queries the CircleCI API and updates each entry of
   * the <code>this.progressMatrix</code> array's [exec_state] JSon property
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
  updateProgressMatrixWithExecStatus() {
    console.info("");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info("{[PipelineExecSetStatusWatcher]} - Updating Progress Matrix Execution state ofeach Pipeline : ");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info(" ---");
    console.info(JSON.stringify({ progressMatrix: this.progressMatrix }, null, " "));
    console.info(" ---");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info("");

    /// First, trigger all pipelines in the parallel execution set
    this.progressMatrix.forEach(((pipelineRef, index) => {

      console.log( `[{[PipelineExecSetStatusWatcher # triggerPipelines()]} - value of Pipeline GUID : [${pipelineRef.id}]`);
      let pipeline_guid = pipelineRef.id;

      /// if (process.argv["dry-run"] === 'true') {
      if (process.argv["dry-run"]) {
       console.log( '[{[PipelineExecSetStatusWatcher]} - (process.argv["dry-run"] === \'true\') condition is true');
      } else {
       console.log( '[{[PipelineExecSetStatusWatcher]} - (process.argv["dry-run"] === \'true\') condition is false');
      }

      let inspectPipelineExecStateSubscription = this.circleci_client.inspectPipelineExecState(`${pipeline_guid}`).subscribe({
        next: this.handleInspectPipelineExecStateResponseData.bind(this),
        complete: data => {
           console.log( '[{[PipelineExecSetStatusWatcher]} - inspecting ccc Circle CI Build completed! :)]')
        },
        error: this.errorHandlerInspectPipelineExecState.bind(this)
      });
    }).bind(this));
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
   *
   **/
  private handleInspectPipelineExecStateResponseData (circleCiJsonResponse: any) : void {
    console.info( '[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is : ', circleCiJsonResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )
    /// if the pipeline has zeroworkflows,then wehave a problem here : so we stop all operations
    if (circleCiJsonResponse.items.length == 0) {
      throw new Error("The last processed Pipeline has no workflows, which is an anomaly, so stopping all operations.")
    }
    let pipeline_guid = circleCiJsonResponse.items[0].pipeline_id;
    let next_page_token = circleCiJsonResponse.next_page_token;

    let entry: any = {};
    entry.pipeline = {
      /*
      // when retryWhen is used
      pipeline_exec_number: `${circleCiJsonResponse.data.number}`,
      id : `${circleCiJsonResponse.data.id}`,
      created_at: `${circleCiJsonResponse.data.created_at}`,
      exec_state: `${circleCiJsonResponse.data.state}`
      */
      pipeline_exec_number: `${circleCiJsonResponse.number}`,
      id : `${circleCiJsonResponse.id}`,
      created_at: `${circleCiJsonResponse.created_at}`,
      exec_state: `${circleCiJsonResponse.state}`
    }

    this.progressMatrix.push(entry.pipeline);
    /// this.progressMatrixSubject.next(this.progressMatrix);

  }

  /**
   *
   **/
  private errorHandlerInspectPipelineExecState (error: any) : void {
    console.info( '[{PipelineExecSetStatusWatcher}] - Triggering Circle CI pipeline failed Circle CI API Response [data] => ', error )
    let entry: any = {};
    entry.pipeline = {
      execution_index: null,
      id : null,
      created_at: null,
      exec_state: null,
      error : {message: "[{PipelineExecSetStatusWatcher}] - Triggering Circle CI pipeline failed ", cause: error}
    }

    this.progressMatrix.push(entry);

    console.info('');
    console.info( '[{PipelineExecSetStatusWatcher}] - [errorHandlerTriggerCCIPipeline] [this.progressMatrix] is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info({progressMatrix: this.progressMatrix});
    console.info('')
    throw new Error('[{PipelineExecSetStatusWatcher}] - [errorHandlerTriggerCCIPipeline] CICD PROCESS INTERRUPTED BECAUSE TRIGGERING PIPELINE FAILED with error : [' + error + '] '+ ' and, when failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
  }


  /**
   *
   **/
  public getFinalStateNotifier(): rxjs.Subject<PipeExecSetStatusNotification> {
    return this.finalStateNotifier;
  }
}



/// Calculations on time spans : https://www.thetopsites.net/article/53538894.shtml
