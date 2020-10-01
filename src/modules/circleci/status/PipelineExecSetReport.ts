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
  private report: PipelineExecSetReport;
  /**
   * An array, in which for each entry has  a JSOn Property named 'id',which is the GUID of a Circle CI Pipeline execution
   *
   *
   **/
  private progressMatrix: any[];

  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for all pipeline executions state
   **/
  pipelineInspectionNotifier: rxjs.Subject<any>;
  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for all workflows state
   **/
  workflowInspectionNotifier: rxjs.Subject<any>;
  /**
   * An RxJS Subject which notifies when all JSON HTTP Responses have been received, when querying Circle CI API v2 for pipeline jobs state
   **/
  jobsInspectionNotifier: rxjs.Subject<any>;


  constructor(progressMatrix: any[], circleci_client: CircleCIClient) {
    this.progressMatrix = progressMatrix;
    this.report = {
      pipelines_states: []
    }
  }

  /**
   *
   * We inspect Workflows state, then, with [pipeline_number], Pipelines state, and finally Jobs state
   *
   **/
  public build(): PipelineExecSetReport {

    return this.report;
  }


  private wageWorkflowInspection():void {

  }
  private wagePipelineInspection():void {

  }
  private wageJobsInspection():void {

  }

  ///

}
