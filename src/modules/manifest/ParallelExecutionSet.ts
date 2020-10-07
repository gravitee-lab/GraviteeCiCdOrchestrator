/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from './GraviteeComponent';


/**
 * Args for a constructor of {@see ParallelExecutionSet}
 **/
  export interface ParallelExecutionSetArgs {
    components: giocomponents.GraviteeComponent[];
  }

  /**
   * Represents a Paralell Execution Set:
   * a Set of Gravitee Components whose pipelines can
   * be triggered in parallel
   * see release.json 'buildDependencies' property
   **/
  export class ParallelExecutionSet {

    public readonly components: giocomponents.GraviteeComponent[];
    /*constructor (
      args: ParallelExecutionSetArgs
    ) {
      /// super(`valueofContructorParamOne`, args)
      this.components = args.components;
    }*/
    constructor () {
      /// super(`valueofContructorParamOne`, args)
      this.components = [];
    }
    /**
     * Adds a component to this {@see ParallelExecutionSet}
     **/
    public addComponent(component: giocomponents.GraviteeComponent ): void {
      this.components.push(component);
    }
    /**
     * Gets the array of components of this {@see ParallelExecutionSet}
     **/
    public getComponents(): giocomponents.GraviteeComponent[] {
      return this.components;
    }


  }
