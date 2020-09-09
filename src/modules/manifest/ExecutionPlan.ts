import * as executionsets from './ParallelExecutionSet';

/**
 * An Execution Plan represents a Matrix (2-dim. array), of {@see executionsets.ParallelExecutionSet}s :
 *
 **/

  export interface ExecutionPlanArgs {
    parallelExecutionSets: executionsets.ParallelExecutionSet[];
  }

  /**
   *
   *
   **/
  export class ExecutionPlan {

    public readonly parallelExecutionSets: executionsets.ParallelExecutionSet[];
    private completed: boolean;

    constructor (
      args: ExecutionPlanArgs
    ) {
      /// super(`valueofContructorParamOne`, args)


      this.parallelExecutionSets = args.parallelExecutionSets;
      this.completed = false;

    }
    setCompleted() {
      this.completed = true;
    }
    isCompleted(): boolean {
      return this.completed;
    }
  }
