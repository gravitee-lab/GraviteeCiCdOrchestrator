import * as rxjs from 'rxjs';
import { CircleCIClient, WorkflowsData, WorkflowJobsData, WfPaginationRef, JobPaginationRef } from '../../../modules/circleci/CircleCIClient';
import * as Collections from 'typescript-collections';

export enum VCS_TYPE {
  GITHUB,
  GITLAB,
  BITBUCKET
}





/**
 * --------------------------------------------------------------
 * --------------------------------------------------------------
 * ------- NEW DESIGN OF REPORT
 * --------------------------------------------------------------
 * --------------------------------------------------------------
 *
 **/

export interface CciPipelineState {
  number: number,
  state: string,
  id: string,
  created_at: string
}

export interface CciWorkflowState {
  pipeline_id: string,
  id: string,
  name: string,
  project_slug: string,
  status: string,
  started_by: string,
  pipeline_number: number,
  created_at: string,
  stopped_at: string
}

/**
 *
 **/
export interface CciJobState {
  /**
   * Array of job names of all job names that are 'required' in the '.circleci/config.yml' version 2
   **/
  dependencies: string[],
  /**
   * A number, which is the job execution number, as understood by the Circle CI API v2
   **/
  job_number: number,
  /**
   * The Circle CI Job GUID
   **/
  id: string,
  /**
   * example : "2020-09-12T17:44:51Z"
   **/
  started_at: string,
  /**
   * The Job name, defined in the '.circleci/config.yml' version 2
   **/
  name: string,
  /**
   * example : "gh/gravitee-lab/GraviteeCiCdOrchestrator"
   **/
  project_slug: string,
  /**
   * example : "failed"
   **/
  status: string,
  /**
   * example : "build"
   **/
  type: string,
  /**
   * example : "2020-09-12T17:48:26Z"
   **/
  stopped_at: string
}

export class PipelineExecSetReport {

  /**
   * The id (a GUID) of the Circle CI Pipeline , is the key
   **/
  private pipelines_states: Collections.Dictionary<string, CciPipelineState>;
  /**
   * The id (a GUID) of the Circle CI Pipeline, is the root key :
   *
   *                         <pipeline_guid_1> => <worklflow_guid_1, workflow_state_1>
   *                                               <worklflow_guid_2, workflow_state_2>
   *                                                           ...
   *                                               <worklflow_guid_N_1, workflow_state_N_1>
   *
   *                                ...
   *
   *                          <pipeline_guid_1> => <worklflow_guid_1, workflow_state_1>
   *                                               <worklflow_guid_2, workflow_state_2>
   *                                                           ...
   *                                               <worklflow_guid_N_2, workflow_state_N_2>
   *
   **/
  private workflow_states: Collections.Dictionary<string, Collections.Dictionary<string, CciWorkflowState>>;

  /**
   * The id (a GUID) of the Circle CI Workflow, is the root key :
   *
   *             <worklflow_guid_1> => <job_guid_1, job_state_1>
   *                                   <job_guid_2, job_state_2>
   *                                                ...
   *                                   <job_guid_N_1, job_state_N_1>
   *
   *                                ...
   *
   *             <worklflow_guid_2> => <job_guid_1, job_state_1>
   *                                   <job_guid_2, job_state_2>
   *                                                ...
   *                                   <job_guid_N_2, job_state_N_2>
   *
   *                   ...
   *
   **/
  private jobs_states: Collections.Dictionary<string, Collections.Dictionary<string, CciJobState>>;

  constructor() {
    this.pipelines_states = new Collections.Dictionary<string, CciPipelineState>();
    this.workflow_states = new Collections.Dictionary<string, Collections.Dictionary<string, CciWorkflowState>>();
    this.jobs_states = new Collections.Dictionary<string, Collections.Dictionary<string, CciJobState>>();
  }

  /**
   *
   **/
  public addPipelineState(pipeline_guid: string, state: CciPipelineState) {
    this.pipelines_states.setValue(pipeline_guid, state);
  }
  /**
   *
   **/
  public addWorkflowState(state: CciWorkflowState) {
    if (this.workflow_states.containsKey(state.pipeline_id)) {
      this.workflow_states.getValue(state.pipeline_id).setValue(state.id, state);
    } else {
      let newDict: Collections.Dictionary<string, CciWorkflowState> = new Collections.Dictionary<string, CciWorkflowState>();
      newDict.setValue(state.id, state);
      this.workflow_states.setValue(state.pipeline_id, newDict);
    }
  }
  /**
   *
   **/
  public addJobState(workflow_guid: string, state: CciJobState) {

    if (this.jobs_states.containsKey(workflow_guid)) {
      this.jobs_states.getValue(workflow_guid).setValue(state.id, state);
    } else {
      let newDict: Collections.Dictionary<string, CciJobState> = new Collections.Dictionary<string, CciJobState>();
      newDict.setValue(state.id, state);
      this.jobs_states.setValue(workflow_guid, newDict);
    }

  }
  /**
   *
   **/
  public getPipelinesStates(): Collections.Dictionary<string, CciPipelineState> {
    return this.pipelines_states;
  }
  /**
   *
   **/
  public getWorkflowsStates(): Collections.Dictionary<string, Collections.Dictionary<string, CciWorkflowState>> {
    return this.workflow_states;
  }
  /**
   *
   **/
   public getJobsStates(): Collections.Dictionary<string, Collections.Dictionary<string, CciJobState>> {
     return this.jobs_states;
   }

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
   * When all workflows, of all Pipelines, have been reported in <code>this.report</code>
   **/
  private allWorkflowsReportingCompleted: boolean;
  /**
   *      <worklflow_guid_1> =>  <true|false> ("completed")
   *      <worklflow_guid_2> =>  <true|false> ("completed")
   *                         ...
   *      <worklflow_guid_N> =>  <true|false> ("completed")
   *
   **/
  private workflowsReportingCompleted: Collections.Dictionary<string, boolean>;

  /**
   * When all jobs, of all workflows, of all Pipelines, have been reported in <code>this.report</code>
   **/
  private allJobsReportingCompleted: boolean;
  /**
   *
   *      <job_guid_1> =>  <true|false> ("completed")
   *      <job_guid_2> =>  <true|false> ("completed")
   *                         ...
   *      <job_guid_N> =>  <true|false> ("completed")
   *
   **/
  private jobsReportingCompleted: Collections.Dictionary<string, boolean>;


  /**
   * An array, in which for each entry has  a JSon Property named 'id', which is the GUID of a Circle CI Pipeline execution
   *
   * Each entry of the array has the following JSON properties :
   *
   *  {
   *     pipeline_exec_number: `${circleCiJsonResponse.number}`,
   *     id : `${circleCiJsonResponse.id}`,
   *     created_at: `${circleCiJsonResponse.created_at}`,
   *     exec_state: `${circleCiJsonResponse.state}`,
   *     project_slug: `${circleCiJsonResponse.project_slug}`
   *  }
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
   private cicd_error: Error;

  /**
   * @parameters progressMatrix The progress matrix provided by the {@link ReactiveParallelExecutionSet}, which defines the Pipeline Executions Set for which to build the report
   * @parameters circleci_client The {@link CircleCIClient} service to use to query the Circle CI API
   * @parameters error pass a non null Error instance to throw after the report is completely built and logged, to stop the whole CI CD Process. If set to null, then no Error will be thrown, and the CI CD Process can proceeed afterthe report is logged. The Error message should contain the Workflow GUID which was detected as errored.
   **/
  constructor(progressMatrix: any[], circleci_client: CircleCIClient, cicd_error: Error) {
    this.circleci_client = circleci_client;
    this.progressMatrix = progressMatrix;
    this.cicd_error = cicd_error;

    this.allWorkflowsReportingCompleted = false;
    this.workflowsReportingCompleted = new Collections.Dictionary<string, boolean>();

    this.allJobsReportingCompleted = false;
    this.jobsReportingCompleted = new Collections.Dictionary<string, boolean>();


    this.initReport();
    this.initNotifersSubscriptions();
    this.buildReport();
  }
  private initReport(): void {
    this.report = new PipelineExecSetReport();
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
    });

    let wfReportingNotifierSubsciption = this.workflowReportingNotifier.subscribe({
      next: this.reportPipelinesState/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    });

    let jobReportingNotifierSubsciption = this.reportingCompletionNotifier.subscribe({
      next: ((report) => {
        ///
        console.log(`Now checking if all workflows, jobs and pipeline execution states have been reported`);
        if (this.isReportCompleted()) {
          report.cicd_error = this.cicd_error;
          console.log(report);
          // and unsubscribe ?
          if(this.cicd_error === null) {
            console.log(`[{PipelineExecSetReportLogger}] - [reportingCompletionNotifier] - reporting completed, and no Pipeline Execution Error was reported`);
          } else {
            console.log(`[{PipelineExecSetReportLogger}] - [reportingCompletionNotifier] - reporting completed, and a Pipeline Execution Error was reported. Now stopping execution of the whole ${process.argv["cicd-stage"]} CI CD Process`);
            throw this.cicd_error;
          }
        } else {
          /// else we just let the reporting job complete
          console.log(`[{PipelineExecSetReportLogger}] - [reportingCompletionNotifier] - reporting not completed yet, more [reportingCompletionNotifier] notifications will occur while reporting more Circle CI Jobs Execution States`);
        }
        throw new Error('Implementation Not finished : will log the report if and only if All Pipeline, Workflows, and Jobs execution states have been added to the report. If not,thjen will emit the GUID of the next pipeline')
      }).bind(this)/*(pipeline_guid: string) => {
        // So workflows states have been reported for pipeline of GUID [pipeline_guid]
        // Now we can report Pipeline state itself, using the 'pipeline_number' in the workflow states
      }*/
    });

    this.rxSubscriptions.push(pipelineReportingNotifierSubsciption);
    this.rxSubscriptions.push(wfReportingNotifierSubsciption);
    this.rxSubscriptions.push(jobReportingNotifierSubsciption);
    this.rxSubscriptions.push(wfPaginationSubscription);
    this.rxSubscriptions.push(jobPaginationSubscription);



  }
  private isReportCompleted(): boolean {
    let allPipelineStatesReported = false;
    this.report.getPipelinesStates().size()

    for(let k: number; k < this.progressMatrix.length; k++) {
      this.progressMatrix[k].id
    }
    this.report.getPipelinesStates().keys().length


    return allPipelineStatesReported && this.allWorkflowsReportingCompleted && this.allJobsReportingCompleted;
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
    for (let k = 0; k < this.progressMatrix.length; k++) {
      this.reportWorkflowsState(this.progressMatrix[k].id, null)
    }
    throw new Error(`Implementation not finished`);
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


    /// we push each entires,to be able to paginate when necessary because [next_page_token] is null

    /*
    observedResponse.cci_json_response.items.forEach((wflowstate) => {
      this.report.pipelines_states[pipelineStateIndexInReport].workflows_states.states.push(wflowstate);
    }); */

    for (let k:number= 0; k < observedResponse.cci_json_response.items.length; k++) {
      let wflowstate = observedResponse.cci_json_response.items[k];


      /// this.progressMatrix[pipelineStateIndexInReport].workflows_states.states.push(wflowstate);
      this.updateWflowstateIn(wflowstate,this.progressMatrix[pipelineStateIndexInReport].workflows_states.states.cci_api_infos.items)
      console.log(`DEBUG [{PipelineExecSetReport}] - [reportWorflowStateCCIResponseHandler] - In FOR LOOP Inspecting object [ this.progressMatrix[${pipelineStateIndexInReport}] ] : `);
      console.log(`----`);
      console.log(`${JSON.stringify(this.progressMatrix[pipelineStateIndexInReport], null, " ")}`);
      /// console.log({progressMatrix: this.progressMatrix});
      console.log(`----`);

    }


    /// let next_page_token = circleCiJsonResponse.next_page_token;
    if (observedResponse.cci_json_response.next_page_token === null) {
      /// this.report.pipelines_states[pipelineStateIndexInReport].workflows_states.completed = true;
      this.workflowsReportingCompleted = true;
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
      /// we push each entries,to be able to paginate when necessary because [next_page_token] is null
      observedResponse.cci_json_response.items.forEach((jobstate: any) => {
        this.report.pipelines_states[workflowIndexInReport.pipeline_index].workflows_states.states[workflowIndexInReport.workflow_index].jobs_states.states.cci_api_infos.items.push(jobstate);
      });

      /// let next_page_token = circleCiJsonResponse.next_page_token;
      if (observedResponse.cci_json_response.next_page_token === null) {

        /// this.report.pipelines_states[workflowIndexInReport.pipeline_index].workflows_states.states[workflowIndexInReport.workflow_index].jobs_states.completed = true;
        this.jobsReportingCompleted = true;

        this.reportingCompletionNotifier.next(this.report);

      } else {
        let paginator: JobPaginationRef = {
          next_page_token: observedResponse.cci_json_response.next_page_token,
          workflow_guid: observedResponse.parent_workflow_guid
        }
        this.jobPaginationNotifier.next(paginator)
      }

    }

    private updateJobsStateIn(jobstate: any, jobs_items: any[] ) {
        ///
        let isTheWorkflowIDalreadyReferenced: boolean = false;
        let wfIndexInarray: number = null;

        if(!jobstate.hasOwnProperty('id')) {
          throw new Error(`[{PipelineExecSetStatusWatcher}] - [{updateJobsStateIn(jobstate: any, jobs_items: any[])}] provided [${jobstate}] has no [id] property, while it is expected to have one, as a Workflow State CircleCI API JSON Response...`)
        }

        for (let k: number = 0; k < jobs_items.length; k++) {
          if (jobs_items[k].id === jobstate.id) {
            isTheWorkflowIDalreadyReferenced = true;
            wfIndexInarray = k;
            break;
          }
        }
        if (isTheWorkflowIDalreadyReferenced) { /// then it's an update case
          jobs_items[wfIndexInarray] = jobstate /// (replaces the entry in array)
        } else { // then case when we just have to add it
          jobs_items.push(jobstate) // adds a new entry in array, aka [jobstate]
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

}
