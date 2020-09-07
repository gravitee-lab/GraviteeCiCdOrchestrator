/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from './GraviteeComponent';

/**
 * Args for the constructor of {@see ParallelExecutionSet}
 **/
  export interface ParallelExecutionSetArgs {
    components: giocomponents.GraviteeComponent[];
  }

  /**
   * Represents a Paralell Execution Set
   *
   **/
  export class ParallelExecutionSet {

    public readonly components: giocomponents.GraviteeComponent[];

    constructor (
      args: ParallelExecutionSetArgs
    ) {
      /// super(`valueofContructorParamOne`, args)
      this.components = args.components;
    }


  }
