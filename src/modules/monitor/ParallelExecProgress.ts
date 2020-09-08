import * as executionsets from './ParallelExecutionSet';

/**
 * A ParallelExecProgress represents the progress matrix of the
*  executions of each {@see executionsets.ParallelExecutionSet} 
 **/

  export interface ParallelExecProgressArgs {
    parallelExecutionSet: executionsets.ParallelExecutionSet[];
  }

  /**
   *
   *
   **/
  export class ParallelExecProgress {

    public readonly parallelExecutionSet: executionsets.ParallelExecutionSet[];
    private completed: boolean;

    constructor (
      args: ParallelExecProgressArgs
    ) {
      /// super(`valueofContructorParamOne`, args)


      this.parallelExecutionSet = args.parallelExecutionSet;
      this.completed = false;

    }
    setCompleted() {
      this.completed = true;
    }
    isCompleted(): boolean {
      return this.completed;
    }
  }
