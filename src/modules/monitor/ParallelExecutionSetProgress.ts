/// import * as whatever from '@some/pkgIneed';
import * as giocomponents from '../manifest/GraviteeComponent';


      /**
       * Unsued yet
       **/
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
      /**
       * In CircleCI API v2,  API response , see https://circleci.com/docs/api/v2/#trigger-a-new-pipeline
       **/
      export interface CircleCiApiTriggerPipelineResponse {
            number: string, // in Circle CI API v2, a pipeline may be executed many times : each execution is indexed with that number
            /**
             * [id] is alpha numeric : it is UUID issued by CircleCI api
             * to uniquely identify a triggered pipeline (a pipeline execution)
             **/
            id: string,
            /**
             *
             **/
            created_at: string,
            /**
             * [exec_state] is the current execution state of the pipeline
             * this value can be :
             * "UNTRIGGERED" "CREATED", "PENDING" or "ERRORED"
             * and this state is :
             * 'UNTRIGGERED', before the pipeline has been triggered using the Circle CI API
             * 'PENDING', right after the pipeline has been triggered using the Circle CI API
             * 'CREATED', when the pipeline execution has actually started in Circle CI infra
             * 'ERRORED', when the pipeline execution has actually started in Circle CI infra, and at least one Job has completed with errors.
             **/
            state: string
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
          cci_response: CircleCiApiTriggerPipelineResponse,
          error: any
        }
      }
      export interface PipelineExecutionError {
        message: string,
        cause: any
      }
     /**
      * JSON Object Schema to Represent a Parallel Execution Set  's Execution Progress
      * Does not trigger any Pipeline execution, or subscribe to any ObservableStream : it just
      * keeps a reference on every Observable Stream the {@see Monitor} will subscribe to, and
      * remembers to which {@see GraviteeComponent} the ObservableStream is related.
      **/
      export class ParallelExecutionSetProgress {
        /**
         * Used by {@see Monitor} to subscribe to all {@see PipelineExecution}s <code>observableRequest</code>s and
         * follow up progress of each {@see PipelineExecution} in this ParallelExecutionSetProgress
         **/
         public readonly pipeline_executions: PipelineExecution[];
         public readonly pipeline_executions_errors: PipelineExecution[];

        constructor() {
          this.pipeline_executions = []
        }
        /**
         * Adds a {@see PipelineExecution} to this {@see ParallelExecutionSetProgress}
         * @param <code>pipeExec</code> the {@see PipelineExecution} to add to this {@øee ParallelExecutionSetProgress}
         * @returns the {@see GraviteeComponent} of the added pipeline execution
         **/
        addPipelineExecution(pipeExec: PipelineExecution): giocomponents.GraviteeComponent {

          this.pipeline_executions.push(pipeExec);
          return pipeExec.component;
        }
        /**
         *
         * Updates the {@see PipelineExecution} associated with the provided <code>someGioComponent</code> {@see GraviteeComponent}, with the provided CircleCI API response <code>theCci_Api_response</code>, and the provided CircleCI API error <code>theCci_Api_error</code>
         *
         * @paramter <code>someGioComponent</code>
         * @paramter <code>theCci_Api_response</code> The Circle CI API returned JSON response, set it to null if error returned
         * @paramter <code>theCci_Api_error</code> The Circle CI API returned error, set it to null if no error returned
         **/
        updatePipelineExecution(someGioComponent: giocomponents.GraviteeComponent, theCci_Api_response: any, theCci_Api_error: any) {
          /// first, must find the Pipeline execution for the [component]
          if (theCci_Api_response == null) {
            this.getPipelineExecutionFrom(someGioComponent).execution.cci_response = {
              created_at: null,
              state: null,
              number: null,
              id: null
            };
          } else {
            this.getPipelineExecutionFrom(someGioComponent).execution.cci_response = theCci_Api_response;
          }
          this.getPipelineExecutionFrom(someGioComponent).execution.error = theCci_Api_error;
          this.getPipelineExecutionFrom(someGioComponent).execution.completed = true;

        }
        /**
         *
         * Use this method to retrieve a {@see PipelineExecution} from its {@see GraviteeComponent}
         *
         * @parameter <code>gioComponent</code> the {@see GraviteeComponent} for which you want to retrieve the associated {@see PipelineExecution}
         * @returns the {@see PipelineExecution} associated with the provided {@see GraviteeComponent} <code>gioComponent</code>
         **/
        public getPipelineExecutionFrom(gioComponent: giocomponents.GraviteeComponent) : PipelineExecution {
          let toReturn : PipelineExecution = null;
          for (let i:number; i < this.pipeline_executions.length; i++) {
            if (this.pipeline_executions[i].component.name == gioComponent.name && this.pipeline_executions[i].component.version == gioComponent.version) {
              toReturn = this.pipeline_executions[i];
              break;
            }
          }
          return toReturn;
        }
        public toString(): string {
          return JSON.stringify(this.pipeline_executions);
        }
      }
