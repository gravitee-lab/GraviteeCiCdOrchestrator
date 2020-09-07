/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from './GraviteeComponent';


/**
 * Args for the constructor of {@see PipelineExecution}
 **/
  export interface PipelineExecutionArgs {
    component: giocomponents.GraviteeComponent;
    execution: {
      observableRequest: {},
      result: {}
    }
  }

export class PipelineExecution {

  public readonly component: giocomponents.GraviteeComponent;

  constructor (
    args: PipelineExecution
  ) {
    this.component = args.component;
  }


}

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
    public readonly pipelineExecution: giocomponents.GraviteeComponent[];
    constructor (
      args: ParallelExecutionSetArgs
    ) {
      /// super(`valueofContructorParamOne`, args)
      this.components = args.components;
    }


  }
