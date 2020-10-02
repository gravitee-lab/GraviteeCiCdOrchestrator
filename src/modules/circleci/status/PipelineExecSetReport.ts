import * as rxjs from 'rxjs';
import { CircleCIClient } from '../../../modules/circleci/CircleCIClient';

export enum VCS_TYPE {
  GITHUB,
  GITLAB,
  BITBUCKET
}

export interface CciPipelineState {
 /**
  * The Pipeline GUID
  **/
 pipeline_guid: string,
 /**
  * The JSON Object returned from the Circle CI API Endpoint :
  *
  * curl -X GET https://circleci.com/api/v2/project/gh/gravitee-lab/GraviteeCiCdOrchestrator/pipeline/$PIPELINE_NUMBER -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}"
  *
  **/
 cci_api_infos: any
 workflows_states: CciWorkflowState[];
}

export interface CciWorkflowState {
 /**
  * The Workflow GUID
  **/
 workflow_guid: string,
 /**
  * The JSON Object returned from the Circle CI API Endpoint :
  *
  * curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID} -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}"
  *
  **/
 cci_api_infos: any
 jobs_states: CciWorkflowState[];
}

export interface CciJobState {
 job_guid: string,
 /**
  * The JSON Object returned from the Circle CI API Endpoint :
  *
  * curl -X GET https://circleci.com/api/v2/project/${PROJ_SLUG}/job/${JOB_NUMB} -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}"
  *
  **/
 cci_api_infos: any
}

/**
 * In th Circle CI model :
 * - A Pipeline is made of Workflows
 * - A Worflow is made of jobs
 *
 * A Pipeline Execution Set Report is a set of Pipeline State
 **/
export interface PipelineExecSetReport {
  pipelines_states: CciPipelineState[]
}

export class PipelineExecSetReportBuilder {
  private circleci_client: CircleCIClient;
  private report: PipelineExecSetReport;
  /**
   * An array, in which for each entry has  a JSon Property named 'id', which is the GUID of a Circle CI Pipeline execution
   *
   * Provided by a {@link ReactiveParallelExecutionSet}, when is has finished triggering all Circle CI Pipelines for its Parallel Execution Set
   *
   **/
  private progressMatrix: any[];

  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for all pipeline executions state
   **/
  pipelineReportingNotifier: rxjs.Subject<PipelineExecSetReport>;
  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for all workflows state
   *
   * The emited string is a Circle CI Pipeline GUID
   *
   **/
  workflowReportingNotifier: rxjs.Subject<string>;
  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for pipeline jobs state
   **/
  jobsReportingNotifier: rxjs.Subject<PipelineExecSetReport>;


  constructor(progressMatrix: any[], circleci_client: CircleCIClient) {
    this.circleci_client = circleci_client;
    this.progressMatrix = progressMatrix;
    this.initReport();
  }
  private initReport(): void {
    this.report = {
      pipelines_states: []
    }
    for (let k = 0; k < this.progressMatrix.length; k++) {
      this.report.pipelines_states.push({
        pipeline_guid: this.progressMatrix[k].id,
        cci_api_infos: {},
        workflows_states: []
      })
    }
  }
  private initNotifersSubscriptions () {
    let wfNotifierSubsciption = this.workflowReportingNotifier.subscribe({
      next: this.reportPipelinesState/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we need to both report Pipeline state itself, using the 'pipeline_number'
        // and Jobs states
      }*/
    })
  }
  /**
   *
   * We inspect Workflows state, then, with [pipeline_number], Pipelines state, and finally Jobs state
   *
   **/
  public build(): PipelineExecSetReport {
    throw new Error(`Not implemented`);
    return this.report;
  }

  /// ----------------------------------------------------------------------
  /// ---   Circle CI Workflows
  /// ----------------------------------------------------------------------

  private reportWorkflowsState(): void {
    for (let k = 0; k < this.report.pipelines_states.length; k++) {

        console.log( `[{PipelineExecSetReportBuilder}] - [reportWorkflowsState()] - value of Pipeline GUID : [${this.report.pipelines_states[k].pipeline_guid}]`);
        /// if (process.argv["dry-run"] === 'true') {
        if (process.argv["dry-run"]) {
         console.log( '[{PipelineExecSetReportBuilder}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is true');
        } else {
         console.log( '[{PipelineExecSetReportBuilder}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is false');
        }

        let reportWorklowsExecStateSubscription = this.circleci_client.inspectPipelineWorkflowsExecState(`${this.report.pipelines_states[k].pipeline_guid}`).subscribe({
          next: this.reportWorflowStateResponseDataHandler.bind(this),
          complete: data => {
             console.log( `[{PipelineExecSetReportBuilder}] - Inspecting Pipeline of GUID [${this.progressMatrix[k].id}] Execution state completed! :) ]`)
          },
          error: this.reportWorflowStateErrorHandler.bind(this)
        });
    }
  }

  /**
   *
   * Note that the HTTP JSON Response will be ofthe following form :
   *
   *      {
   *        "next_page_token": null,
   *        "items": [
   *          {
   *            "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
   *            "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c",
   *            "name": "docker_build_and_push",
   *            "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
   *            "status": "failed",
   *            "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   *            "pipeline_number": 126,
   *            "created_at": "2020-09-12T17:47:21Z",
   *            "stopped_at": "2020-09-12T17:48:26Z"
   *          },
   *          {
   *            "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
   *            "id": "cd7b408f-48d4-4ba7-8a0a-644d82267434",
   *            "name": "yet_another_test_workflow",
   *            "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
   *            "status": "success",
   *            "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   *            "pipeline_number": 126,
   *            "created_at": "2020-09-12T17:47:21Z",
   *            "stopped_at": "2020-09-12T17:48:11Z"
   *          }
   *        ]
   *      }
   *
   * ---
   *
   **/
  private reportWorflowStateResponseDataHandler (circleCiJsonResponse: any) : void {
    console.info( '[{PipelineExecSetReportBuilder}] - [reportWorflowStateResponseDataHandler] Processing Circle CI API Response [data] is : ', circleCiJsonResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )

    let pipeline_guid = circleCiJsonResponse.items[0].pipeline_id;

    /// let next_page_token = circleCiJsonResponse.next_page_token;
    let pipelineStateIndexInReport = this.getIndexOfPipelineStateInReport(pipeline_guid);
    this.report.pipelines_states[pipelineStateIndexInReport].workflows_states = circleCiJsonResponse.items;
    this.workflowReportingNotifier.next(pipeline_guid);
  }

  private reportWorflowStateErrorHandler(error: any) : void {
    console.info( '[{PipelineExecSetReportBuilder}] - [reportWorflowStateErrorHandler] - Reporting Circle CI pipeline failed Circle CI API Response [data] => ', error )

    console.info('');
    console.info( '[{PipelineExecSetReportBuilder}] - [reportWorflowStateErrorHandler] Report is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info(this.report);
    console.info('')
    throw new Error('[{PipelineExecSetReportBuilder}] - [reportWorflowStateErrorHandler] CICD PROCESS INTERRUPTED BECAUSE INSPECTING PIPELINE WORKFLOW EXEC STATE FAILED with error : [' + error + '] '+ '. Note that When failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
  }
  private getIndexOfPipelineStateInReport(ofGuid: string): number {
    let indexToReturn: number = -1;
     for (let k = 0; k < this.report.pipelines_states.length; k++) {
       if (this.report.pipelines_states[k].pipeline_guid === ofGuid) {
         console.log(`[{PipelineExecSetReportBuilder}] - [getIndexOfPipelineStateInReport] - Pipeline of GUID [${ofGuid}] was found in progressMatrix, its index is : [${k}]`);
         indexToReturn = k;
         break;
       }
     }
    if (indexToReturn == -1) {
      throw new Error(`[{PipelineExecSetReportBuilder}] - [getIndexOfPipelineStateInReport] - Pipeline of GUID [${ofGuid}] was not found in report : [${this.report}], So this CICD Stage is now stopping execution of the whole ${process.argv["cicd-stage"]} CI CD Process`);
    }
    return indexToReturn;
  }

  /// ----------------------------------------------------------------------
  /// ---   Circle CI Pipelines
  /// ----------------------------------------------------------------------

  private reportPipelinesState(ofGuid: string): void {

  }

  /// ----------------------------------------------------------------------
  /// ---   Circle CI Jobs
  /// ----------------------------------------------------------------------

  private reportJobsState(): void {

  }

  ///

}
