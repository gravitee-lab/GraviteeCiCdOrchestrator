import * as executionsets from './ParallelExecutionSet';
import * as giocomponents from './GraviteeComponent';

  /**
   * An Execution Plan represents an ordered set of {@see executionsets.ParallelExecutionSet}s :
   * they are executed in the order defined by the index of
   * the [public readonly parallelExecutionSets: executionsets.ParallelExecutionSet[];] Array
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
     * Returns a positive integer, which can be zero, of the number of  {@see ParallelExecutionSet}s in this {@see ExecutionPlan}
     *
     * @returns the number of  {@see ParallelExecutionSet}s in this {@see ExecutionPlan}
     **/
    getPlanLength() : number {
      return this.parallelExecutionSets.length;
    }
    /**
     * Returns a JSON Object with only one JSON property, named 'components' which is an array of {@see giocomponents.GraviteeComponents}s.
     * the 'components' array lists all components which will be invovled in /impacted by this {@see ExecutionPlan} :
     * The Gravitee Components for which this {@see ExecutionPlan} will trigger a 'Circle CI' Pipeline
     * @returns  a JSON Object with only one JSON property, named 'components', array which lists all {@see giocomponents.GraviteeComponents}s for which this {@see ExecutionPlan} will trigger a 'Circle CI' Pipeline.
     **/
    getPlanImpact() : giocomponents.GraviteeComponent[] {
      let toReturn: any = {
        components: giocomponents.GraviteeComponent[]
      };
      let execPlanLentgh = this.getPlanLength();
      for (let i: number = 0; i < execPlanLentgh; i++) {
         toReturn.push
      }
      return toReturn;
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
