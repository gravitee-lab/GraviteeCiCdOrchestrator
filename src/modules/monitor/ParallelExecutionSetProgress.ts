/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from './GraviteeComponent';

  export enum CciPipelineExecutionState  {
    /**
     * Pipeline execution was <strong>not triggered yet</strong>, and does not exists for the <strong>Circle CI API v2</strong>
     *
     * So this state does not exists in the Circle CI API v2 : it is there to represent a state of the pipeline Execution Before
     * the pipeline is triggered, so does not exist for the CircleCI API v2.
     **/
    UNTRIGGERED = 25,
    /**
     * Pipeline execution was triggered and is running.
     **/
    PENDING = 50,
    /**
     * <p>Pipeline  execution completed with <strong>erros</strong></p>
     * <p>Because fifty-one is far from being one hundred percent, just like completing execution with errors is far from completing successfully (without errors)</p>
     **/
    ERRORED = 51,
    /**
     * Pipeline execution succcessfully completed, with no <strong>errors</strong>.
     **/
    CREATED = 100
  }
  export interface CircleCiApiResponsePipeline {
        execution_index: number,
        /**
         * [id] is alpha numeric : it is UUID issued by CircleCI api
         * to uniquely identify a pipeine (a pipeline execution)
         **/
        id: string,
        created_at: string,
        /**
         * [exec_state] is the execution state of the pipeline
         * this value can be :
         * "UNTRIGGERED" "CREATED", "PENDING" or "ERRORED"
         **/
        exec_state: CciPipelineExecutionState
      }/*, for example : {
        "execution_index": "16",
        "id": "952de923-293b-4829-add4-056c4f95940a",
        "created_at": "2020-08-16T22:34:58.273Z",
        "exec_state": "pending"
      }
      */
/**
 * Args for the constructor of {@see PipelineExecution}
 **/
  export interface PipelineExecutionArgs {
    component: giocomponents.GraviteeComponent;
    execution: {
      observableRequest: any,
      cci_response: CircleCiApiResponsePipeline;
    }
  }

export class PipelineExecution {

  public readonly component: giocomponents.GraviteeComponent;
  public readonly cci_response: CircleCiApiResponsePipeline;

  constructor (
    args: PipelineExecution
  ) {
    this.component = args.component;
    this.cci_response = args.cci_response;
  }
}

/**
 * Args for the constructor of {@see ParallelExecutionSetProgress}
 **/
  export interface ParallelExecutionSetProgressArgs {
    pipelineExecutions: PipelineExecution[];
  }

  /**
   * Represents a Paralell Execution Set
   *
   **/
  export class ParallelExecutionSetProgress {

    public readonly pipelineExecutions: PipelineExecution[];
    constructor (
      args: ParallelExecutionSetProgressArgs
    ) {
      /// super(`valueofContructorParamOne`, args)
      this.pipelineExecutions = args.pipelineExecutions;
    }


  }
