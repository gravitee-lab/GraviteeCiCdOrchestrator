import * as rxjs from 'rxjs';
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
   * => The emitted integer is the index of this Pipeline Execution State in the Execution Plan (Array)
   *
   * The pattern for rXJS Subjects :
   * A./ Subcribers subscribe to the Subject
   * B./ Subject emits value with the next(value) method
   * C./
   *
   **/
  public readonly finalStateNotifier: rxjs.Subject<number>;

}




/// Calculations on time spans : https://www.thetopsites.net/article/53538894.shtml
