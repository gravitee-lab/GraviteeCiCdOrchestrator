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

/**
 *
 * A Class there to just Demo how {@link PipelineExecutionMonitor} works
 **/
export class PipelineExecutionMonitorDemo {
  private pipeline1: IPipelineRef;
  private pipeline2: IPipelineRef;

  constructor (
  ) {

        this.pipeline1 = {
          number: 2458,
          uuid: 'fe08c622-a779-45ee-aa0b-672c2d4fedea',
          workflows: [
          {
            name: 'tests_without_deployment',
            spinner: null
          },
          {
            name: 'docker_build',
            spinner: null
          },
          {
            name: 'docker_push',
            spinner: null
          }
        ]};

        this.pipeline2 = {
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
        ]};
  }

  public start (): void {


    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')
    console.log(`Pipeline execution (Circle CI pipeline #[${this.pipeline1.number}] / pipeline uuid[${this.pipeline1.uuid}])`);
    console.log('')
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')


    for (let i = 0; i < this.pipeline1.workflows.length; i++) {
      this.pipeline1.workflows[i].spinner = ora(` Workflow (${this.pipeline1.workflows[i].name}) Running`).start();
      console.log('')
      this.pipeline1.workflows[i].spinner.color = 'yellow'; // running
    }

    for (let i = 0; i < this.pipeline1.workflows.length; i++) {
      setTimeout(() => {
          this.pipeline1.workflows[i].spinner.color = 'red'; // errored
          this.pipeline1.workflows[i].spinner.color = 'green'; // completed
          this.pipeline1.workflows[i].spinner.text = 'Completed !';
          console.log('')
          console.log(`debug [i+1]=[${i + 1}]`);
          console.log(`debug [pipeline1.workflows.length]=[${this.pipeline1.workflows.length}]`);
          if ((i + 1) == this.pipeline1.workflows.length) {
            console.log(`throwing Error debug [i+1]=[${i + 1}]`);
            throw new Error("DEBUG STOP POINT");
          }
      }, (i + 1) * 3000);
    }
  }
}
