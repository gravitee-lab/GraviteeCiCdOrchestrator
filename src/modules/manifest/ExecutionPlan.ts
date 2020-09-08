import * as executionsets from './ParallelExecutionSet';

/**
 * An Execution Plan represents a Matrix (2-dim. array), of {@see executionsets.ParallelExecutionSet}s :
 *  
 **/

  export interface ExecutionPlanArgs {
    parallelExecutionSet: executionsets.ParallelExecutionSet[];
  }

  /**
   *
   *
   **/
  export class ExecutionPlan {

    public readonly parallelExecutionSet: executionsets.ParallelExecutionSet[];
    private completed: boolean;

    constructor (
      args: ExecutionPlanArgs
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
