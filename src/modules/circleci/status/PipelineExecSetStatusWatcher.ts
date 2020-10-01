import * as rxjs from 'rxjs';
import { CircleCIClient } from '../../../modules/circleci/CircleCIClient';
import { ReactiveParallelExecutionSet } from '../../../modules/circleci/ReactiveParallelExecutionSet'
import * as reporting from '../../../modules/circleci/status/PipelineExecSetReport';


export interface PipeExecSetStatusNotification {
  is_errored: boolean,
  exec_status_report: reporting.PipelineExecSetReport
}

/**
 * Keeps fetching the Circle CI API, to determine when :
 *
 * has a timeout
 **/
export class PipelineExecSetStatusWatcher {

  /**
   * This RxJS Subject will emit an integer :
   * => To notify the subscribers that all pipelines in this
   *    Pipeline Execution Set have reached a final execution
   *    state : Final State In the sense of Automata theory
   * => The emited integer is the index of this Pipeline Execution State in the Execution Plan (Array)
   *
   * The pattern for rXJS Subjects :
   * A./ Subcribers subscribe to the Subject
   * B./ Subject emits value with the next(value) method
   * C./
   * The {@link ReactiveParallelExecutionSet} subscribes to this RxSubject, so that it
   * is notified when all Pipelines have reached a final execution state.
   **/
  public readonly finalStateNotifier: rxjs.Subject<PipeExecSetStatusNotification>;
  /**
   * This is the progress matrix for all pipeline executions
   * in one {ParallelExecutionSet}, built by a <code>src/modules/circleci/PipelineExecSetStatusWatcher.ts</code>, not
   * the whole execution plan, as understood by the {@link CircleCiOrchestrator} class.
   * --
   * It is filled with all the HTTP JSON responses of Circle CI API HTTP request to trigger pipelines.
   * --
   * Each entry inthis array is of the following form :
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
   * => build the execution report using ccc
   * => and call the next() method of the <code>this.finalStateNotifier</code> RxJS Subject, to notify its {@link ReactiveParallelExecutionSet} friend
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
        next: this.handleTriggerPipelineCircleCIResponseData.bind(this),
        complete: data => {
           console.log( '[{[PipelineExecSetStatusWatcher]} - triggering Circle CI Build completed! :)]')
        },
        error: this.errorHandlerTriggerCCIPipeline.bind(this)
      });
    }).bind(this));
  }

  public getFinalStateNotifier(): rxjs.Subject<PipeExecSetStatusNotification> {
    return this.finalStateNotifier;
  }
}



/// Calculations on time spans : https://www.thetopsites.net/article/53538894.shtml
