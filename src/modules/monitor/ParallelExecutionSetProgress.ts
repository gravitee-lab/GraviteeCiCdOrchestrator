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
      export interface CciApiTriggerPipelineResponse {
            /**
             * In Circle CI API v2, a pipeline may be executed many
             * times : each execution is indexed with that number
             **/
            number: number,
            /**
             * [id] is alpha numeric : it is UUID issued by CircleCI api
             * to uniquely identify a pipeline execution
             * This one identifier will be used to
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
      * JSON Object Schema to Represent a pipeline execution, made of :
      * - the Gravitee Component for which the pipeline is triggered
      * - For the HTTP request to trigger the pipeline execution :
      *   --> the RxJS Observable Stream
      *   --> the Circle CI API JSON Response
      *   --> the Circle CI API HTTP Response error
      * - For the HTTP request to check status of the pipeline execution
      *   --> the RxJS Observable Stream
      *   --> the Circle CI API JSON Response
      *   --> the Circle CI API HTTP Response error
      **/
      export interface PipelineExecutionProgress {
        component: giocomponents.GraviteeComponent;
        pipeline_execution: {
          cci_trigger: {
            observableRequest: any,
            response: CciApiTriggerPipelineResponse,
            error: any
          },
          cci_statuscheck: {
            observableRequest: any,
            response: CciApiPipelineStatusResponse,
            error: any
          }
        }

      }

      /**
       * In CircleCI API v2, API response, of the HTTP Request made to
       * check the Pipeline Execution status :
       *
       * curl -X GET https://circleci.com/api/v2/pipeline/${PIPELINE_ID}/workflow \
       *   -H 'Accept: application/json' \
       *   -H 'Circle-Token: API_KEY'
       *
       * see https://circleci.com/docs/api/v2/#get-a-pipeline-39-s-workflows
       **/
      export interface CciWorkflowStatus {
        pipeline_id: string,
        id: string,
        name: string,
        project_slug: string,
        status: string,
        started_by: string,
        pipeline_number: number,
        created_at: string,
        stopped_at: string
      } /*, for example : {
                    "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
                    "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c",
                    "name": "docker_build_and_push",
                    "project_slug": "gh/gravitee-lab/GraviteeReleaseOrchestrator",
                    "status": "failed",
                    "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
                    "pipeline_number": 126,
                    "created_at": "2020-09-12T17:47:21Z",
                    "stopped_at": "2020-09-12T17:48:26Z"
                  }
          */
      export interface CciApiPipelineStatusResponse {
        items: CciWorkflowStatus[]
      } /*, for example : {
                "next_page_token": null,
                "items": [
                  {
                    "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
                    "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c",
                    "name": "docker_build_and_push",
                    "project_slug": "gh/gravitee-lab/GraviteeReleaseOrchestrator",
                    "status": "failed",
                    "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
                    "pipeline_number": 126,
                    "created_at": "2020-09-12T17:47:21Z",
                    "stopped_at": "2020-09-12T17:48:26Z"
                  },
                  {
                    "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
                    "id": "cd7b408f-48d4-4ba7-8a0a-644d82267434",
                    "name": "yet_another_test_workflow",
                    "project_slug": "gh/gravitee-lab/GraviteeReleaseOrchestrator",
                    "status": "success",
                    "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
                    "pipeline_number": 126,
                    "created_at": "2020-09-12T17:47:21Z",
                    "stopped_at": "2020-09-12T17:48:11Z"
                  }
                ]
          }
          */

     /**
      * JSON Object Schema to Represent a Parallel Execution Set's Execution Progress
      * Does not trigger any Pipeline execution, or subscribe to any ObservableStream : it just
      * keeps a reference on every Observable Stream the {@see Monitor} will subscribe to, and
      * remembers which {@see GraviteeComponent} each ObservableStream is related to.
      **/
      export class ParallelExecutionSetProgress {
        /**
         * Used by {@see Monitor} to subscribe to all {@see PipelineExecutionProgress}s <code>observableRequest</code>s and
         * follow up progress of each {@see PipelineExecutionProgress} in this ParallelExecutionSetProgress
         **/
        public readonly all_pipeline_execution_progress: PipelineExecutionProgress[];

        constructor() {
          this.all_pipeline_execution_progress = [];
        }
        /**
         * Adds a {@see PipelineExecutionProgress} to this {@see ParallelExecutionSetProgress}
         * @param <code>pipeExec</code> the {@see PipelineExecutionProgress} to add to this {@øee ParallelExecutionSetProgress}
         * @returns the {@see GraviteeComponent} of the added pipeline execution
         **/
        addPipelineExecutionProgress(pipeExecProgress: PipelineExecutionProgress): giocomponents.GraviteeComponent {
          this.all_pipeline_execution_progress.push(pipeExecProgress);
          return pipeExecProgress.component;
        }
        public haveAllPipelineTriggersResponseBeenReceived(): boolean {
          let haveHttpResponsesBeenReceived: boolean = true;
          let arrayLength: number = this.all_pipeline_execution_progress.length;
          for (let i: number; i < arrayLength ; i++){
            ///  As soon as at least one trigger has both error and pipeline 'id' set to null, well there is one Pripeline Execution Trigger which did not complete
            if (this.all_pipeline_execution_progress[i].pipeline_execution.cci_trigger.error === null && this.all_pipeline_execution_progress[i].pipeline_execution.cci_trigger.response.id  === null) {
              haveHttpResponsesBeenReceived = false;
              break; // no need to keep on looping
            }
          }
          return haveHttpResponsesBeenReceived;
        }
        public haveAllPipelineStatusChecksResponseBeenReceived(): boolean {
          let haveHttpResponsesBeenReceived: boolean = true;
          let arrayLength: number = this.all_pipeline_execution_progress.length;
          for (let i: number; i < arrayLength ; i++){
            ///  As soon as at least one trigger has both error and pipeline 'id' set to null, well there is one Pripeline Execution Trigger which did not complete
            if (this.all_pipeline_execution_progress[i].pipeline_execution.cci_statuscheck.error === null && this.all_pipeline_execution_progress[i].pipeline_execution.cci_statuscheck.response.items.length == 0) {
              haveHttpResponsesBeenReceived = false;
              break; // no need to keep on looping
            }
          }
          return haveHttpResponsesBeenReceived;
        }

        /**
         * @returns <code>null</code>, if at not all Pipelines completed their executions
         **/
        public haveAllPipelineExecutionSuccessfullyCompleted(): boolean {
          let allCompletedSuccessfully: boolean = false;
          let arrayLength: number = this.all_pipeline_execution_progress.length;
          if (!this.haveAllPipelineStatusChecksResponseBeenReceived()) {
            return null;
          }
          for (let i: number; i < arrayLength ; i++){
            ///  As soon as at least one trigger has both error and pipeline 'id' set to null, well there is one Pripeline Execution Trigger which did not complete
            if (this.all_pipeline_execution_progress[i].pipeline_execution.cci_statuscheck.error === null && this.all_pipeline_execution_progress[i].pipeline_execution.cci_statuscheck.response.items.length == 0) {
              haveHttpResponsesBeenReceived = false;
              break; // no need to keep on looping
            }
          }
          return haveHttpResponsesBeenReceived;
        }

        /**
         *
         * Updates the {@see PipelineExecutionProgress} associated with the provided <code>someGioComponent</code> {@see GraviteeComponent}, with the provided CircleCI API response <code>theCci_Api_response</code>, and the provided CircleCI API error <code>theCci_Api_error</code>
         *
         * @paramter <code>someGioComponent</code>
         * @paramter <code>theCci_Api_response</code> The Circle CI API returned JSON response, set it to null if error returned
         * @paramter <code>theCci_Api_error</code> The Circle CI API returned error, set it to null if no error returned
         **/
        updatePipelineExecutionProgress(someGioComponent: giocomponents.GraviteeComponent, theCci_Api_response: any, theCci_Api_error: any) {
          /// first, must find the Pipeline execution for the [component]
          if (theCci_Api_response === null) {
            this.getPipelineExecutionTriggerFrom(someGioComponent).pipeline_execution.cci_trigger.response = {
              created_at: null,
              state: null,
              number: null,
              id: null
            };
          } else {
            this.getPipelineExecutionTriggerFrom(someGioComponent).pipeline_execution.cci_trigger.response = theCci_Api_response;
          }
          this.getPipelineExecutionTriggerFrom(someGioComponent).pipeline_execution.cci_trigger.error = theCci_Api_error;

        }
        /**
         *
         * Use this method to retrieve a {@see PipelineExecutionProgress} from its {@see GraviteeComponent}
         *
         * @parameter <code>gioComponent</code> the {@see GraviteeComponent} for which you want to retrieve the associated {@see PipelineExecutionProgress}
         * @returns the {@see PipelineExecutionProgress} associated with the provided {@see GraviteeComponent} <code>gioComponent</code>
         **/
        public getPipelineExecutionTriggerFrom(gioComponent: giocomponents.GraviteeComponent) : PipelineExecutionProgress {
          let toReturn : PipelineExecutionProgress = null;
          for (let i:number; i < this.all_pipeline_execution_progress.length; i++) {
            if (this.all_pipeline_execution_progress[i].component.name == gioComponent.name && this.all_pipeline_execution_progress[i].component.version == gioComponent.version) {
              toReturn = this.all_pipeline_execution_progress[i];
              break;
            }
          }
          return toReturn;
        }
        public toString(): string {
          return JSON.stringify(this.all_pipeline_execution_progress, null, " ");
        }
      }
