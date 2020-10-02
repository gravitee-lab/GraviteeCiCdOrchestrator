import * as rxjs from 'rxjs';
import { CircleCIClient } from '../../../modules/circleci/CircleCIClient';
/// import { PipelineExecSetStatusWatcher, PipeExecSetStatusNotification } from '../../../modules/circleci/status/PipelineExecSetStatusWatcher';

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


/**
 * A Pipeline reference holding all required informations to fetch the Circle CI API v2 for Pipeline State
 **/
export interface CciPipelineRef {
  cci_project_slug: string,
  pipeline_number: number
}

export interface wfPaginationRef {
  next_page_token: string,
  pipeline_guid: string
}

export class PipelineExecSetReportLogger {
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
   *
   * The emited string is the Circle CI pipeline GUID which will be used to report WorkflowsState of he Circle CI Pipeline
   **/
  pipelineReportingNotifier: rxjs.Subject<string>;
  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for all workflows state
   *
   * The emited number is a Circle CI Pipeline Execution number, 'pipeline_number' in CircleCI HTTP JSon Response, and is used to report the pipeline state
   *
   **/
  workflowReportingNotifier: rxjs.Subject<CciPipelineRef>;
  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for pipeline jobs state
   *
   * The report under construction is emited everytime a Circle CI job execution state is reported, to check if
   *  all Pipeline Execution states,
   *  all Workflow States,
   *  and all Job execution states,
   *  have been reported (So then the report is ready to be logged )
   *
   **/
   /// jobsReportingNotifier: rxjs.Subject<PipelineExecSetReport>;
   reportingCompletionNotifier: rxjs.Subject<PipelineExecSetReport>;


  /**
   * This RxJS is used to paginate the Circle CI API v2 for Workflows
   *
   **/
  private workflowPaginationNotifier: rxjs.Subject<wfPaginationRef>;

  private rxSubscriptions: rxjs.Subscription[];

  constructor(progressMatrix: any[], circleci_client: CircleCIClient) {
    this.circleci_client = circleci_client;
    this.progressMatrix = progressMatrix;
    this.initReport();
    this.initNotifersSubscriptions();
    this.buildReport();
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
    this.rxSubscriptions = [];
    let wfPaginationSubscription = this.workflowPaginationNotifier.subscribe({
        next: (paginator) => {
          this.reportWorkflowsState(paginator.pipeline_guid, paginator.next_page_token);
        }
    });

    let pipelineReportingNotifierSubsciption = this.pipelineReportingNotifier.subscribe({
      next: this.reportJobsState/*(report: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    })
    let wfReportingNotifierSubsciption = this.workflowReportingNotifier.subscribe({
      next: this.reportPipelinesState/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    })
    let jobReportingNotifierSubsciption = this.reportingCompletionNotifier.subscribe({
      next: (report) => {
        throw new Error('Implementation Not finished : will log the report if and only if All Pipeline, Workflows, and Jobs execution states have been added to the report. If not,thjen will emit the GUID of the next pipeline')
        console.log(report)
      }/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    })

    this.rxSubscriptions.push(pipelineReportingNotifierSubsciption);
    this.rxSubscriptions.push(wfReportingNotifierSubsciption);
    this.rxSubscriptions.push(jobReportingNotifierSubsciption);
    this.rxSubscriptions.push(wfPaginationSubscription);


  }
  /**
   *
   * We inspect Workflows state, then, with [pipeline_number], Pipelines state, and finally Jobs state
   *
   **/
  private buildReport(): void {
    /// reporting a workflow state triggers reporting the pipeline state
    /// reporting a pipeline state triggers reporting the pipeline jobs state
    /// reporting a pipeline job state trigger checking for report completion ( using RxJS Subject)
    for (let k = 0; k < this.report.pipelines_states.length; k++) {
      this.reportWorkflowsState(this.report.pipelines_states[k].pipeline_guid, null)
    }
    throw new Error(`Not implemented`);
  }

  /// ----------------------------------------------------------------------
  /// ---   Circle CI Workflows
  /// ----------------------------------------------------------------------


  /**
   *
   **/
  private reportWorkflowsState(pipeline_guid: string, next_page_token: string): void {
    console.log( `[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] - value of Pipeline GUID : [${pipeline_guid}]`);
    /*
    if (process.argv["dry-run"]) {
     console.log( '[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is true');
    } else {
     console.log( '[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is false');
   }*/

    let reportWorklowsExecStateSubscription = this.circleci_client.inspectPipelineWorkflowsExecState(pipeline_guid, next_page_token).subscribe({
      next: this.reportWorflowStateResponseDataHandler.bind(this),
      complete: data => {
         console.log( `[{PipelineExecSetReportLogger}] - Inspecting Pipeline of GUID [${pipeline_guid}] Execution state completed! :) ]`)
      },
      error: this.reportWorflowStateErrorHandler.bind(this)
    });
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
    console.info( '[{PipelineExecSetReportLogger}] - [reportWorflowStateResponseDataHandler] Processing Circle CI API Response [data] is : ', circleCiJsonResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )

    let pipeline_guid = circleCiJsonResponse.items[0].pipeline_id;


    let pipelineStateIndexInReport = this.getIndexOfPipelineStateInReport(pipeline_guid);
    /// we push each entires,to be able topaginate when necessary because [next_page_token] is null
    circleCiJsonResponse.items.forEach((wflowstate) => {
      this.report.pipelines_states[pipelineStateIndexInReport].workflows_states.push(wflowstate);
    });

    /// let next_page_token = circleCiJsonResponse.next_page_token;
    if (circleCiJsonResponse.next_page_token === null) {
      this.workflowReportingNotifier.next({
        cci_project_slug: `${circleCiJsonResponse.items[0].project_slug}`,
        pipeline_number: parseInt(`${circleCiJsonResponse.items[0].pipeline_number}`)
      });
    } else {
      this.workflowPaginationNotifier.next(circleCiJsonResponse.next_page_token)
    }

  }

  private reportWorflowStateErrorHandler(error: any) : void {
    console.info( '[{PipelineExecSetReportLogger}] - [reportWorflowStateErrorHandler] - Reporting Circle CI pipeline failed Circle CI API Response [data] => ', error )

    console.info('');
    console.info( '[{PipelineExecSetReportLogger}] - [reportWorflowStateErrorHandler] Report is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info(this.report);
    console.info('')
    throw new Error('[{PipelineExecSetReportLogger}] - [reportWorflowStateErrorHandler] CICD PROCESS INTERRUPTED BECAUSE INSPECTING PIPELINE WORKFLOW EXEC STATE FAILED with error : [' + error + '] '+ '. Note that When failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
  }
  private getIndexOfPipelineStateInReport(ofGuid: string): number {
    let indexToReturn: number = -1;
     for (let k = 0; k < this.report.pipelines_states.length; k++) {
       if (this.report.pipelines_states[k].pipeline_guid === ofGuid) {
         console.log(`[{PipelineExecSetReportLogger}] - [getIndexOfPipelineStateInReport] - Pipeline of GUID [${ofGuid}] was found in progressMatrix, its index is : [${k}]`);
         indexToReturn = k;
         break;
       }
     }
    if (indexToReturn == -1) {
      throw new Error(`[{PipelineExecSetReportLogger}] - [getIndexOfPipelineStateInReport] - Pipeline of GUID [${ofGuid}] was not found in report : [${this.report}], So this CICD Stage is now stopping execution of the whole ${process.argv["cicd-stage"]} CI CD Process`);
    }
    return indexToReturn;
  }

  /// ----------------------------------------------------------------------
  /// ---   Circle CI Pipelines
  /// ----------------------------------------------------------------------

  /// [CircleCIClient]:
  private reportPipelinesState(pipeline_ref: CciPipelineRef): void {

  }

  /// ----------------------------------------------------------------------
  /// ---   Circle CI Jobs
  /// ----------------------------------------------------------------------


  /// [CircleCIClient]: curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID}/job
  private reportJobsState(wf_guid: string): void {

  }

  ///

}
