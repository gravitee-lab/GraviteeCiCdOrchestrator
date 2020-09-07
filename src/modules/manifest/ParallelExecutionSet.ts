/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from './GraviteeComponent';

/**
 * A Template prototype POO structure for all  Orchestrator types :
 * classes, abstract classes, interfaces, and namespaces. Also on how
 * to handle Args type checking.
 **/

  export interface ParallelExecutionSetArgs {
    components: giocomponents.GraviteeComponent[];
  }

  /**
   *
   *
   **/
  export class ParallelExecutionSet {

    public readonly components: giocomponents.GraviteeComponent[];

    ///


    constructor (
      args: ParallelExecutionSetArgs
    ) {
      /// super(`valueofContructorParamOne`, args)


      this.components = args.components;


      const something = 'ccc';


    }


  }
