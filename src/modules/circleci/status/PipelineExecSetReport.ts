


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
}
