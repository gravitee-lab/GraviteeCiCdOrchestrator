/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from './GraviteeComponent';

/**
 * A Template prototype POO structure for all  Orchestrator types :
 * classes, abstract classes, interfaces, and namespaces. Also on how
 * to handle Args type checking.
 **/

  export interface ParallelExecutionSetArgs {
    name: string;
    version: string;
  }

  /**
   *
   *
   **/
  export class ParallelExecutionSet {

    public readonly name: string;
    public readonly version: string;

    ///


    constructor (
      args: ParallelExecutionSetArgs
    ) {
      /// super(`valueofContructorParamOne`, args)


      this.name = args.name;
      this.version = args.version;


      const something = 'ccc';


    }


  }
