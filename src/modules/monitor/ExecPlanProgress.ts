import * as manifest from '../manifest/ParallelExecutionSet';

/**
 * A ExecPlanProgress represents the progress matrix of all pipeline
*  executions planned by an {@see manifest.ExecutionPlan}
 **/

  export interface ExecPlanProgressArgs {
    parallelExecutionSet: manifest.ParallelExecutionSet[];
  }

  /**
   *
   *
   **/
  export class ExecPlanProgress {

    public readonly parallelExecutionSet: manifest.ParallelExecutionSet[];
    private completed: boolean;

    constructor (
      args: ExecPlanProgressArgs
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
