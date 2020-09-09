import * as executionsets from './ParallelExecutionSet';

/**
 * An Execution Plan represents a Matrix (2-dim. array), of {@see executionsets.ParallelExecutionSet}s :
 *
 **/

  /**
   *
   *
   **/
  export class ExecutionPlan {

    public readonly parallelExecutionSets: executionsets.ParallelExecutionSet[];

    constructor () {
      /// super(`valueofContructorParamOne`, args)
      this.parallelExecutionSets = [];
    }
    /**
     * Returns the {@see executionsets.ParallelExecutionSet} which will be executed as <code>ofIndex</code>-th place :
     *
     * It will be executed after the <code>ofIndex - 1</code> previous ones have completed their execution
     *
     * @argument <code>ofIndex</code> the execution index of the {@see ParallelExecutionSet}
     * @returns the {@see executionsets.ParallelExecutionSet} which will be executed as <code>ofIndex</code>-th
     *
     **/
    getParallelExecutionSet(ofIndex: number): executionsets.ParallelExecutionSet {
      return this.parallelExecutionSets[ofIndex];
    }

    /**
     * Pushes the {@see ParallelExecutionSet} provided as argument, on top of this {@see ExecutionPlan}
     *
     * @argument <code>execSet</code> the {@see ParallelExecutionSet} to push on top of this {@see ExecutionPlan}
     * @returns the execution index assigned to the pushed {@see ParallelExecutionSet} <code>execSet</code>
     **/
    addParallelExecutionSet(execSet: executionsets.ParallelExecutionSet): number {
      return this.parallelExecutionSets.push(execSet);
    }
  }
