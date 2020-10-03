import * as rxjs from 'rxjs';
import { CircleCIClient, WorkflowsData, WorkflowJobsData } from '../../../modules/circleci/CircleCIClient';

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
 pipeline_number: number,
 exec_state: string,
 /**
  * The JSON Object returned from the Circle CI API Endpoint :
  *
  * curl -X GET https://circleci.com/api/v2/project/gh/gravitee-lab/GraviteeCiCdOrchestrator/pipeline/$PIPELINE_NUMBER -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}"
  *
  **/
 cci_api_infos: any
 workflows_states: {
   completed: boolean
   states:CciWorkflowState[]
 };
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
 jobs_states: {
   completed: boolean
   states: CciJobState[]
 }
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
export interface CCiJobRequestRef {
  wf_guid: string,
  next_page_token: string
}
export interface WfPaginationRef {
  next_page_token: string,
  pipeline_guid: string
}
export interface JobPaginationRef {
  next_page_token: string,
  workflow_guid: string
}

/**
 * A {@link PipelineExecSetReport} is made of one array of {@link CciPipelineState}
 * A {@link CciPipelineState} is made of an array of {@link CciWorkflowState}
 * So we need 2 array indexes to locate a Workflow in a {@link PipelineExecSetReport}
 * It's like a 2-Dim Matrix
 **/
export interface Workflow2DimIndex {
  pipeline_index: number,
  workflow_index: number,
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
  pipelineReportingNotifier: rxjs.Subject<CciPipelineRef>;
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
   private jobsReportingNotifier: rxjs.Subject<CCiJobRequestRef>;

   /**
    * There will always be more Jobs than Workflows
    * There will always be more Workflows than Pipelines
    *
    * So this notifier will emit stream events everytime a new Circle CI Job is reported, to check for report Completion.
    * This design might be a bit dangerous,and needs future serious testing : just imagine that a Circle CI API, somtetime, happens to have
    * a Workflow Endpoint that is very slow, while Job Endpoint is very fast, then, what will happen ? I'd say we aregood, because to
    * complete the last job execution state reporting,we need to complete the last Workflow ExecutionState Reporting : In a word, because
    * Workflow reporting triggers jobs reporting.
    **/
   private reportingCompletionNotifier: rxjs.Subject<PipelineExecSetReport>;


  /**
   * This RxJS is used to paginate the Circle CI API v2 for Workflows
   *
   **/
   private workflowPaginationNotifier: rxjs.Subject<WfPaginationRef>;
   private jobPaginationNotifier: rxjs.Subject<JobPaginationRef>;

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
        pipeline_number: this.progressMatrix[k].pipeline_exec_number,
        exec_state: this.progressMatrix[k].exec_state,
        cci_api_infos: null,
        workflows_states: {
          completed:false,
          states: [],
        }
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
    let jobPaginationSubscription = this.jobPaginationNotifier.subscribe({
        next: (paginator) => {
          this.reportJobsState({
            wf_guid: paginator.workflow_guid,
            next_page_token:paginator.next_page_token
          });
        }
    });

    let pipelineReportingNotifierSubsciption = this.pipelineReportingNotifier.subscribe({
      next: this.reportPipelinesState
    })
    let wfReportingNotifierSubsciption = this.workflowReportingNotifier.subscribe({
      next: this.reportPipelinesState/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    })
    let jobReportingNotifierSubsciption = this.reportingCompletionNotifier.subscribe({
      next: ((report) => {
        ///
        console.log(`Now checking if all workflows, jobs and pipeline execution states have been reported`);
        if (this.isReportCompleted()) {
          console.log(`[{PipelineExecSetReportLogger}] - [reportingCompletionNotifier] - reporting completed!`);
          console.log(report);
          // and unsubscribe
        } else {
          /// else we just let the reporting job complete
          console.log(`[{PipelineExecSetReportLogger}] - [reportingCompletionNotifier] - reporting not completed yet, more [reportingCompletionNotifier] notifications will occur while reporting more Circle CI Jobs Execution States`);
        }
        throw new Error('Implementation Not finished : will log the report if and only if All Pipeline, Workflows, and Jobs execution states have been added to the report. If not,thjen will emit the GUID of the next pipeline')
      }).bind(this)/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    })

    this.rxSubscriptions.push(pipelineReportingNotifierSubsciption);
    this.rxSubscriptions.push(wfReportingNotifierSubsciption);
    this.rxSubscriptions.push(jobReportingNotifierSubsciption);
    this.rxSubscriptions.push(wfPaginationSubscription);
    this.rxSubscriptions.push(jobPaginationSubscription);



  }
  private isReportCompleted(): boolean {

    let allPipelineStatesReported: boolean = true;
    let allWorkflowStatesReported: boolean = true;
    let allJobStatesReported: boolean = true;

    /// checking pipeline exec states presence in report

    for(let m: number = 0; m < this.report.pipelines_states.length; m++) {
      if ((!allPipelineStatesReported) || this.report.pipelines_states[m].cci_api_infos === null) { //as soon as one of them is null, no need to keep on looping, reporting Pipeline Execution States has not completed.
        allPipelineStatesReported = false;
        break;
      }
      allPipelineStatesReported = allPipelineStatesReported && (!(this.report.pipelines_states[m].cci_api_infos === null)); /// if [cci_api_infos] entr is not null anymore (as initialized), then we know for sure pipeline exec state has been reported
    }
    /// checking workflow exec states completed updates (with pagination) in report
    for(let m: number = 0; m < this.report.pipelines_states.length; m++) {
      if ((!allWorkflowStatesReported)) { //as soon as one is not completed, no need to keep on looping, reporting Workflow Execution States has not completed.
        break;
      }
      allWorkflowStatesReported = allWorkflowStatesReported && this.report.pipelines_states[m].workflows_states.completed;
    }

    /// checking jobs exec states completed updates (with pagination) in report
    if (allWorkflowStatesReported) { // then we knowwe won'thave undefined JSON properties trying to fetch each [workflows_states] for a [jobs_states] JSON Property
      for(let m: number = 0; m < this.report.pipelines_states.length; m++) {
        if ((!allJobStatesReported)) { //as soon as one is not completed, no need to keep on looping, reporting Workflow Execution States has not completed.
          break;
        }
        for(let k: number = 0; k < this.report.pipelines_states[m].workflows_states.states.length; k++) {
          allJobStatesReported = allJobStatesReported && this.report.pipelines_states[m].workflows_states.states[k].jobs_states.completed
        }
      }
    } else { /// reporting jobs execution state is not considered completed before workflows' are.
       allJobStatesReported = false;
    }

    return allPipelineStatesReported && allWorkflowStatesReported && allJobStatesReported;
  }
  /**
   *
   * We inspect Workflows state, then, with [pipeline_number], Pipelines state, and finally Jobs state
   *
   **/
  private buildReport(): void {
    /// reporting a workflow execution state triggers reporting the parent Pipeline 's execution states (because the workflow execution state holds the Pipeline [project_slug])
    /// reporting a workflow execution state triggers reporting the worklow's jobs execution states
    /// reporting a workflow job execution state trigger checking for report completion ( using RxJS Subject)
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
      next: this.reportWorflowStateCCIResponseHandler.bind(this),
      complete: data => {
         console.log( `[{PipelineExecSetReportLogger}] - Inspecting Pipeline of GUID [${pipeline_guid}] Execution state completed! :) ]`)
      },
      error: this.reportWorflowStateCCIErrorHandler.bind(this)
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
  private reportWorflowStateCCIResponseHandler (observedResponse: WorkflowsData) : void {
    console.info( '[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIResponseHandler] Processing Circle CI API Response [data] is : ', observedResponse.cci_json_response  /* circleCiJsonResponse.data // when retryWhen is used*/ )

    if (observedResponse.cci_json_response.items.length == 0) {
      // if response does not include any workkflow, we have a problem in the pipeline.
      // Should not ever happen, because Circle CI guarantees there always is at least one Workflow, the default one, but just in case...
      throw new Error(`[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIResponseHandler] the Circle Ci API response does not mention any workflow. Circie CI JSON Response is [${observedResponse.cci_json_response}]`)
    }

    let pipelineStateIndexInReport = this.getIndexOfPipelineStateInReport(observedResponse.parent_pipeline_guid);
    /// we push each entires,to be able topaginate when necessary because [next_page_token] is null
    observedResponse.cci_json_response.items.forEach((wflowstate) => {
      this.report.pipelines_states[pipelineStateIndexInReport].workflows_states.states.push(wflowstate);
    });

    /// let next_page_token = circleCiJsonResponse.next_page_token;
    if (observedResponse.cci_json_response.next_page_token === null) {
      this.report.pipelines_states[pipelineStateIndexInReport].workflows_states.completed = true;
      this.pipelineReportingNotifier.next({ // triggers [reportPipelinesState]
        cci_project_slug: `${observedResponse.cci_json_response.items[0].project_slug}`,
        pipeline_number: parseInt(`${observedResponse.cci_json_response.items[0].pipeline_number}`)
      });

      for (let k: number; k < observedResponse.cci_json_response.items; k++) { // triggers [reportJobsState] for each workflow
        this.jobsReportingNotifier.next({
          wf_guid: observedResponse.cci_json_response.items[k].id,
          next_page_token: null
        });
      }
    } else {
      let paginator: WfPaginationRef = {
         next_page_token: observedResponse.cci_json_response.next_page_token,
         pipeline_guid: observedResponse.parent_pipeline_guid
      }
      this.workflowPaginationNotifier.next(paginator);
    }

  }

  private reportWorflowStateCCIErrorHandler(error: any) : void {
    console.info('[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIErrorHandler] - Reporting Circle CI pipeline failed Circle CI API Response [data] => ', error )
    console.info('');
    console.info('[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIErrorHandler] Report is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info(this.report);
    console.info('')
    throw new Error('[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIErrorHandler] CICD PROCESS INTERRUPTED BECAUSE INSPECTING PIPELINE WORKFLOW EXEC STATE FAILED with error : [' + error + '] '+ '. Note that When failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
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
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------
  /// ---   Circle CI Pipelines
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------

  /// [CircleCIClient]:
  private reportPipelinesState(pipeline_ref: CciPipelineRef): void {
    console.log( `[{PipelineExecSetReportLogger}] - [reportPipelinesState()] - Pipeline Execution of project slug [${pipeline_ref.cci_project_slug}] and pipeline execution number [${pipeline_ref.pipeline_number}] `);
    /*
    if (process.argv["dry-run"]) {
     console.log( '[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is true');
    } else {
     console.log( '[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is false');
   }*/

    let reportJobsExecStateSubscription = this.circleci_client.inspectPipelineExecState(pipeline_ref.cci_project_slug, pipeline_ref.pipeline_number).subscribe({
      next: this.reportPipelineExecStateCCIResponseHandler.bind(this),
      complete: data => {
         console.log( `[{PipelineExecSetReportLogger}] - Inspecting Pipeline Execution of project slug [${pipeline_ref.cci_project_slug}] and pipeline execution number [${pipeline_ref.pipeline_number}] completed! :) ]`)
      },
      error: this.reportPipelineExecStateCCIErrorHandler.bind(this)
    });
  }

  private reportPipelineExecStateCCIResponseHandler (circleCiJsonResponse: any) : void {
    console.info( '[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIResponseHandler] Processing Circle CI API Response [data] is : ', circleCiJsonResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )
    let pipelineStateIndexInReport = this.getIndexOfPipelineStateInReport(circleCiJsonResponse.id);
    this.report.pipelines_states[pipelineStateIndexInReport].cci_api_infos = circleCiJsonResponse;
  }
  private reportPipelineExecStateCCIErrorHandler(error: any) : void {
    console.info('[{PipelineExecSetReportLogger}] - [reportPipelineExecStateCCIErrorHandler] - Reporting Circle CI pipeline excution state failed ', error )
    console.info('');
    console.info('[{PipelineExecSetReportLogger}] - [reportPipelineExecStateCCIErrorHandler] Report is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info(this.report);
    console.info('')
    throw new Error('[{PipelineExecSetReportLogger}] - [reportPipelineExecStateCCIErrorHandler] CICD PROCESS INTERRUPTED BECAUSE INSPECTING PIPELINE EXEC STATE FAILED with error : [' + error + '] '+ '. Note that When failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
  }
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------
  /// ---   Circle CI Jobs
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------
  /// ----------------------------------------------------------------------



    /// [CircleCIClient]: curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID}/job
    private reportJobsState(wf_ref: CCiJobRequestRef): void {
      console.log( `[{PipelineExecSetReportLogger}] - [reportJobsState()] - value of Workflow GUID : [${wf_ref.wf_guid}]`);
      /*
      if (process.argv["dry-run"]) {
       console.log( '[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is true');
      } else {
       console.log( '[{PipelineExecSetReportLogger}] - [reportWorkflowsState()] (process.argv["dry-run"] === \'true\') condition is false');
     }*/

      let reportJobsExecStateSubscription = this.circleci_client.inspectWorkflowJobsExecState(wf_ref.wf_guid, wf_ref.next_page_token).subscribe({
        next: this.reportJobsExecStateCCIResponseHandler.bind(this),
        complete: data => {
           console.log( `[{PipelineExecSetReportLogger}] - Inspecting Jobs in Workflow of GUID [${wf_ref.wf_guid}] Execution state completed! :) ]`)
        },
        error: this.reportJobsExecStateCCIErrorHandler.bind(this)
      });
    }

   /**
    *
    * This method inspects the execution status of all Jobs in a given Workflow
    *
    *
    * @parameters workflow_guid The GUID of the Circle CI workflow execution
    * @parameters next_page_token set <code>next_page_token</code> to null if no pagination desired
    * @returns any But it actually is an Observable Stream of the HTTP response you can subscribe to.
    *
    * curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID}/job -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}"
    *
    * Note that the HTTP JSON Response will be of the following form :
    *
    * {
    *  "next_page_token": null,
    *  "items": [
    *    {
    *      "dependencies": [],
    *      "job_number": 127,
    *      "id": "fc2332c9-ce54-405b-8b4f-d5af38210627",
    *      "started_at": "2020-09-12T17:47:25Z",
    *      "name": "build",
    *      "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
    *      "status": "failed",
    *      "type": "build",
    *      "stopped_at": "2020-09-12T17:48:26Z"
    *    }
    *  ]
    * }
    *
    *
    **/
    private reportJobsExecStateCCIResponseHandler (observedResponse: WorkflowJobsData) : void {
      console.info( '[{PipelineExecSetReportLogger}] - [reportJobsExecStateCCIResponseHandler] Processing Circle CI API Response [data] is : ', observedResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )
      ///let observedResponse: WorkflowJobsData  = circleCiJsonResponse;
      if (observedResponse.cci_json_response.items.length == 0) {
        // if response does not include any jobs, we have a problem in the pipeline.
        // Should not ever happen, because Circle CI guarantees there always is at least a job in one Workflow, but just in case...
        throw new Error(`[{PipelineExecSetReportLogger}] - [reportJobsExecStateCCIResponseHandler] the Circle Ci API response does not mention any job. Circle CI Response is [${observedResponse.cci_json_response}]`)
      }

      let workflowIndexInReport = this.get2DimIndexOfWorkflowInReport(observedResponse.parent_workflow_guid);
      /// we push each entries,to be able topaginate when necessary because [next_page_token] is null
      observedResponse.cci_json_response.items.forEach((jobstate: any) => {
        this.report.pipelines_states[workflowIndexInReport.pipeline_index].workflows_states.states[workflowIndexInReport.workflow_index].jobs_states.states.push(jobstate);
      });

      /// let next_page_token = circleCiJsonResponse.next_page_token;
      if (observedResponse.cci_json_response.next_page_token === null) {

        this.report.pipelines_states[workflowIndexInReport.pipeline_index].workflows_states.states[workflowIndexInReport.workflow_index].jobs_states.completed = true;

        this.reportingCompletionNotifier.next(this.report);

      } else {
        let paginator: JobPaginationRef = {
          next_page_token: observedResponse.cci_json_response.next_page_token,
          workflow_guid: observedResponse.parent_workflow_guid
        }
        this.jobPaginationNotifier.next(paginator)
      }

    }


    private reportJobsExecStateCCIErrorHandler(error: any) : void {
      console.info('[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIErrorHandler] - Reporting Circle CI pipeline failed Circle CI API Response [data] => ', error )
      console.info('');
      console.info('[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIErrorHandler] Report is now :  ');
      // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
      console.info(this.report);
      console.info('')
      throw new Error('[{PipelineExecSetReportLogger}] - [reportWorflowStateCCIErrorHandler] CICD PROCESS INTERRUPTED BECAUSE INSPECTING PIPELINE WORKFLOW EXEC STATE FAILED with error : [' + error + '] '+ '. Note that When failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
    }

    /**
     * returns a {@link Workflow2DimIndex} which basically is a 2 -dimensional index, made of the pipeline index, and the workflow index
     **/
    private get2DimIndexOfWorkflowInReport(wf_guid: string): Workflow2DimIndex {
      let indexToReturn: Workflow2DimIndex = null;
       for (let k = 0; k < this.report.pipelines_states.length; k++) {
         if (!(indexToReturn === null)) { // then index wasfound, no need to trigger any other loop (Euler triangle)
           break;
         }
         for (let j = 0; j < this.report.pipelines_states[k].workflows_states.states.length; j++) {
           if (this.report.pipelines_states[k].workflows_states.states[j].workflow_guid === wf_guid) {
             indexToReturn = {
               pipeline_index:k,
               workflow_index: j
             };
             console.log(`[{PipelineExecSetReportLogger}] - [get2DimIndexOfWorkflowInReport] - Workflow of GUID [${wf_guid}] was found in report, its 2-Dim index is : [${indexToReturn}]`);
             break;
           }
         }
       }

      if (indexToReturn === null) {
        throw new Error(`[{PipelineExecSetReportLogger}] - [get2DimIndexOfWorkflowInReport] - Workflow of GUID [${wf_guid}] was not found in report : [${this.report}], So this CICD Stage is now stopping execution of the whole ${process.argv["cicd-stage"]} CI CD Process`);
      }
      return indexToReturn;
    }

}
