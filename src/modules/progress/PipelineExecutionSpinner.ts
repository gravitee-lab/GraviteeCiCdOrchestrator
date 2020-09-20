import * as ora from 'ora';
// import * as chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import * as shelljs from 'shelljs';
// RxJS v6+
import * as rxjs from 'rxjs';
import { map, tap, retryWhen, delay, take } from 'rxjs/operators';
import axios from 'axios';
import { AxiosResponse } from 'axios';

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
        spinner: ora(` Workflow (${name}) Running`)
      };
      this.workflow.spinner.color = 'yellow'
      this.workflow.spinner.indent = 5;
  }

  public start (): void {

    this.workflow.spinner.start();

    ///ce qui est là bête; c'est que le "sleep", détruit l'animation Ora Spinner

    if (shelljs.exec('sleep 3s').code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
      shelljs.echo('Error: sleep command failed for [CciWorkflowExecutionSpinner]');
      shelljs.exit(1);
    }

    /// this.retryWhen(this.workflow.spinner); /// ne marche absolument pas, évidemment, puis squ'asynchrone

    /// so Stop and persist Will have to be executed on RXJS 'next'
    this.stopWithSuccess();
    //// this.workflow.spinner

  }
  public stopWithSuccess(): void {
    this.workflow.spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.workflow.name}) Completed !`});
  }
  public stopWithFailure(): void {
    this.workflow.spinner.stopAndPersist({symbol: logSymbols.error, text: ` Workflow (${this.workflow.name}) Failed !`});
  }


  // perfect test is :
  // curl -X DELETE https://auth-nightly.gravitee.io/management/organizations/DEFAULT/environments/DEFAULT/domains/dine
  // {"message":"No JWT token found","http_status":401}
  private retryWhen (aSpinner: ora.Ora): rxjs.Observable<AxiosResponse<any>> {
          const some_rest_endpoint = `https://randomuser.me/api`;
          const source = rxjs.from(axios.delete(`${some_rest_endpoint}`)).pipe(
          tap(val => {}))
          const response$ = source.pipe(
            map(axiosResponse => {
              if (!(axiosResponse.status == 200 || axiosResponse.status == 201 || axiosResponse.status == 203)) {
                //error will be picked up by retryWhen
                // console.log(` Fetch Response' request is : [${axiosResponse.request}], `);
                // console.log(` HTTP status is : [${axiosResponse.statusText}], `);
                // console.log(` AxiosResponse config is [${axiosResponse.config}]`);

                throw new Error(`error querying [${some_rest_endpoint}] : [${JSON.stringify(axiosResponse, null, " ")}]`);
              }
              return axiosResponse; /// return value  HTTP Response Code si 200
            }),
            retryWhen(errors =>
              errors.pipe(
                //log error message
                tap(axiosResponse => {
                  // console.log(`What is passed on to tap >>  [${JSON.stringify(axiosResponse,null,2)}],`);
                  // console.log(`now retrying`);
                  /// so stops the spinner when Axios response is received
                  aSpinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.workflow.name}) Completed !`});
                }),
                //restart in 5 seconds
                delay(2000), /// wait 2 seconds before retrying
                /// delayWhen(val => timer(val * 1000)),
                /// delayWhen(val => rxjs.timer(7 * 1000)), /// wait 7 seconds before retrying
                take(5)
              )
            )
          );

          return response$;

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
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')
    console.log(`Circle CI Pipeline execution :`);
    console.log(`   - number : [${this.pipelineRef.number}]`);
    console.log(`   - uuid : [${this.pipelineRef.uuid}]`);
    console.log('')
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')
    for (let m: number = 0; m < this.workflowSpinners.length ; m++) {
      this.workflowSpinners[m].start();
    }
    console.log('')
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')
  }
  public startWorkflowSpinner(ofIndex: number): void { /// nope reccurrent functions will also kill [Ora]
    this.workflowSpinners[ofIndex].start();
    setTimeout(() => {
      this.workflowSpinners[ofIndex].stopWithSuccess();
       if((ofIndex+1) == this.workflowSpinners.length) {
         // then this is the lastSpinner
         return;
       } else { // else we get reccurrent setTimeOuts
         this.startWorkflowSpinner(ofIndex+1);
       }

    }, 3000);
  }

  private addCciWorkflow(cciWorkflowName: string): void {
    console.log(` >> debug [private addCciWorkflow(cciWorkflowName: string): void] : cciWorkflowName=[${cciWorkflowName}]`)
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
