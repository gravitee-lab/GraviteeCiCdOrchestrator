import * as executionsets from './ParallelExecutionSet';

/**
 * A Template prototype POO structure for all  Orchestrator types :
 * classes, abstract classes, interfaces, and namespaces. Also on how
 * to handle Args type checking.
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
    public readonly completed: boolean;

    ///


    constructor (
      args: ExecutionPlanArgs
    ) {
      /// super(`valueofContructorParamOne`, args)


      this.parallelExecutionSet = args.parallelExecutionSet;
      this.completed = false;


      const something = 'ccc';


    }


  }
