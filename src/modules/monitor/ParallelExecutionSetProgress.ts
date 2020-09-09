/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from '../manifest/GraviteeComponent';

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
         * <p>Pipeline  execution completed with <strong>errors</strong></p>
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
      } /*, for example : {
            "execution_index": "16",
            "id": "952de923-293b-4829-add4-056c4f95940a",
            "created_at": "2020-08-16T22:34:58.273Z",
            "exec_state": "pending"
          }
          */
      /**
      * JSON Object Schema to Represent a pipeline execution
      **/
      export interface PipelineExecution {
        component: giocomponents.GraviteeComponent;
        execution: {
          observableRequest: any,
          /**
           * Set to <code>true</code> as soon as this PipelineExecution has completed, regardless of pipeline execution final status (failure/success, etc...)
           **/
          completed: boolean,
          cci_response: CircleCiApiResponsePipeline;
        }
      }
     /**
      * JSON Object Schema to Represent a Parallel Execution Set  's Execution Progress
      **/
      export class ParallelExecutionSetProgress {
        /**
         * Used by {@see Monitor} to subscribe to all {@see PipelineExecution}s <code>observableRequest</code>s and
         * follow up progress of each {@see PipelineExecution} in this ParallelExecutionSetProgress
         **/
        public readonly pipeline_executions: PipelineExecution[];

      }
