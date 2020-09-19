import * as ora from 'ora';
import * as chalk from 'chalk';

export interface IPipelineWorkflowRef {
      name: string,
      spinner: any
    }

export interface IPipelineRef {
  number: number,
  uuid: string,
  workflows: IPipelineWorkflowRef[]
}
/** -+-+- for example :
    const pipeline2: progress.IPipelineRef = {
        number: 2467,
        uuid: 'ea73741d-0493-4b00-b7ba-9ebefbb87c25',
        workflows: [
        {
          name: 'tests_without_deployment',
          spinner: null
        },
        {
          name: 'setup_integ_deployment_target',
          spinner: null
        },
        {
          name: 'integration_tests',
          spinner: null
        },
        {
          name: 'docker_build_n_push',
          spinner: null
        }
      ]
    };

**/

/**
 *
 *
 **/
export class PipelineExecutionMonitor {
  /**
   * Timeout for the execution of this module
   **/
  public readonly pipelineRef: IPipelineRef;

  constructor (
    pipelineRef: IPipelineRef
  ) {
      this.pipelineRef = pipelineRef;
  }

  public start (): void {

  }
}
