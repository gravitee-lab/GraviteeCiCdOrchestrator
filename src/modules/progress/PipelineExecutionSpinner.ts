import * as ora from 'ora';
// import * as chalk from 'chalk';

import * as logSymbols from 'log-symbols';
import * as shelljs from 'shelljs';


export interface IPipelineWorkflowRef {
      name: string,
      spinner: ora.Ora
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
export class CciWorkflowExecutionSpinner {
  /**
   * Timeout for the execution of this module
   **/
  public readonly workflow: IPipelineWorkflowRef;

  constructor (
    name: string,
  ) {
      this.workflow = {
        name: name,
        spinner: ora(` Workflow (${this.workflow.name}) Running`)
      };
      this.workflow.spinner.color = 'yellow'
      this.workflow.spinner.indent = 5;
  }

  public start (): void {
    this.workflow.spinner.start();

    if (shelljs.exec('sleep 3s').code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
      shelljs.echo('Error: sleep command failed for [CciWorkflowExecutionSpinner]');
      shelljs.exit(1);
    }
    /// so Stop and persist Will have to be executed on RXJS 'next'
    this.workflow.spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.workflow.name}) Completed !`});
    console.log('')
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')
  }
}

/**
 *
 *
 **/
export class PipelineExecutionSpinner {
  /**
   * Timeout for the execution of this module
   **/
  public readonly workflowSpinners: CciWorkflowExecutionSpinner[];
  public readonly pipelineRef: IPipelineRef;

  constructor (
    pipelineRef: IPipelineRef
  ) {
      this.pipelineRef = pipelineRef;
      this.workflowSpinners = [];
      for (let j = 0; j < this.pipelineRef.workflows.length ; j++) {
        this.addCciWorkflow(this.pipelineRef.workflows[j].name);
      }
  }

  public start (): void {
    for (let k = 0; k < this.workflowSpinners.length ; k++) {
      this.workflowSpinners[k].start();
    }
  }
  private addCciWorkflow(cciWorkflowName: string): void {
    this.workflowSpinners .push(new CciWorkflowExecutionSpinner(cciWorkflowName));
  }
}


/**
 *
 * A Class there to just Demo how {@link ora} works
 **/
export class OraDemo {
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
    console.log(`Circle CI Pipeline execution :`);
    console.log(`   - number : [${this.pipeline1.number}]`);
    console.log(`   - uuid : [${this.pipeline1.uuid}]`);
    console.log('')
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')

    this.pipeline1.workflows[0].spinner = ora(` Workflow (${this.pipeline1.workflows[0].name}) Running`);
    this.pipeline1.workflows[0].spinner.color = 'yellow'
    this.pipeline1.workflows[0].spinner.indent = 5;
    this.pipeline1.workflows[0].spinner.start();
    setTimeout(() => { /// does absolutely nothing, just to wait
      /// in case of error:  /// someSpinner.stopAndPersist({symbol: logSymbols.error, text: ` Workflow (${this.pipeline1.workflows[i].name}) Failed !`});
      /// in case of success:  /// this.pipeline1.workflows[i].spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.pipeline1.workflows[i].name}) Completed !`});
      this.pipeline1.workflows[0].spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.pipeline1.workflows[0].name}) Completed !`});
      this.pipeline1.workflows[1].spinner = ora(` Workflow (${this.pipeline1.workflows[1].name}) Running`);
      this.pipeline1.workflows[1].spinner.color = 'yellow'
      this.pipeline1.workflows[1].spinner.indent = 5;
      this.pipeline1.workflows[1].spinner.start();
      setTimeout(() => {
        this.pipeline1.workflows[1].spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.pipeline1.workflows[1].name}) Completed !`});
        this.pipeline1.workflows[2].spinner = ora(` Workflow (${this.pipeline1.workflows[2].name}) Running`);
        this.pipeline1.workflows[2].spinner.color = 'yellow'
        this.pipeline1.workflows[2].spinner.indent = 5;
        this.pipeline1.workflows[2].spinner.start();
        setTimeout(() => {
          this.pipeline1.workflows[2].spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.pipeline1.workflows[2].name}) Completed !`});
          console.log('')
          console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
          console.log('')
        }, 3000);
      }, 3000);
    }, 3000);


  }
}
