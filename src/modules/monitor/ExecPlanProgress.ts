import { ParallelExecutionSet } from '../manifest/ParallelExecutionSet';
import { ExecutionPlan } from '../manifest/ExecutionPlan';
import { ParallelExecutionSetProgress } from '../monitor/ParallelExecutionSetProgress';

  /**
   * A ExecPlanProgress represents the progress matrix of all pipeline
   * executions planned by an {@see ExecutionPlan}
   **/
  export interface ExecPlanProgressArgs {
    // allParallelExecutionSetProgress: ParallelExecutionSetProgress;
    executionPlan: ExecutionPlan;
  }

  /**
   *
   *
   **/
  export class ExecPlanProgress {
    /**
     * Not used to run any execution, justy there to keep a
     * refrence on the executionPlan
     **/
    public readonly executionPlan: ExecutionPlan;
    /**
     * Used to follow up progress of each {@see ParallelExecutionSetProgress}
     **/
    public readonly allParallelExecutionSetProgress: ParallelExecutionSetProgress[];
    /**
     * True as soon as all Pipeline execution have completed, regardless of pipeline execution final status (failure/success, etc...)
     **/
    private completed: boolean;

    constructor (
      args: ExecPlanProgressArgs
    ) {
      /// super(`valueofContructorParamOne`, args)
      this.executionPlan = args.executionPlan;
      this.completed = false;

    }
    setCompleted() {
      this.completed = true;
    }
    isCompleted(): boolean {
      return this.completed;
    }
  }
