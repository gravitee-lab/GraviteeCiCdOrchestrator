/*
Author (Copyright) 2020 <Jean-Baptiste-Lasselle>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

If your software can interact with users remotely through a computer
network, you should also make sure that it provides a way for users to
get its source.  For example, if your program is a web application, its
interface could display a "Source" link that leads users to an archive
of the code.  There are many ways you could offer source, and different
solutions will be better for different programs; see section 13 for the
specific requirements.

You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU AGPL, see
<https://www.gnu.org/licenses/>.
*/
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
        spinner: ora(`Workflow (${name}) Running`)
      };
      this.workflow.spinner.color = 'yellow'
      this.workflow.spinner.indent = 5;
  }

  public start (): void {

    this.workflow.spinner.start();

    /// Ce qui est là bête; c'est que le "sleep", détruit l'animation Ora Spinner

    /**
    if (shelljs.exec('sleep 3s').code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
      shelljs.echo('Error: sleep command failed for [CciWorkflowExecutionSpinner]');
      shelljs.exit(1);
    }
    **/

  }
  public stopWithSuccess(): void {
    this.workflow.spinner.stopAndPersist({symbol: logSymbols.success, text: ` Workflow (${this.workflow.name}) Completed !`});
  }
  public stopWithFailure(): void {
    this.workflow.spinner.stopAndPersist({symbol: logSymbols.error, text: ` Workflow (${this.workflow.name}) Failed !`});
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
    public readonly pipelineRef: IPipelineRef;

    constructor (
      pipelineRef: IPipelineRef
    ) {
        this.pipelineRef = pipelineRef;
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
      this.reccRun(0);
    }
    /**
     * * reccRun(wfIndex: number)
     **/
    private reccRun(wfIndex: number) : void {

        this.pipelineRef.workflows[wfIndex].spinner = ora(`Workflow (${this.pipelineRef.workflows[wfIndex].name}) Running`);
        this.pipelineRef.workflows[wfIndex].spinner.color = 'yellow'
        this.pipelineRef.workflows[wfIndex].spinner.indent = 5;
        this.pipelineRef.workflows[wfIndex].spinner.start();
        setTimeout(() => { /// the setTimeout is there just to simulates any non blocking processing, like an HTTP call and its response inspection
          this.pipelineRef.workflows[wfIndex].spinner.stopAndPersist({
            symbol: logSymbols.success,
            text: `Workflow (${this.pipelineRef.workflows[wfIndex].name}) Completed !`
          });
          if ((wfIndex + 1) == this.pipelineRef.workflows.length) { // stop condition or this recurrent function
            console.log('')
            console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
            console.log('')
          } else {
             this.reccRun(wfIndex + 1);
          }
        }, 3000);

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
          this.pipeline1.workflows[2].spinner = ora(`Workflow (${this.pipeline1.workflows[2].name}) Running`);
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


  public startRecc (): void {
    this.reccRun(0);
  }
  /**
   * * reccRun(wfIndex: number)
   **/
  private reccRun(wfIndex: number) : void {
    this.pipeline1.workflows[wfIndex].spinner = ora(`Workflow (${this.pipeline1.workflows[wfIndex].name}) Running`);
    this.pipeline1.workflows[wfIndex].spinner.color = 'yellow'
    this.pipeline1.workflows[wfIndex].spinner.indent = 5;
    this.pipeline1.workflows[wfIndex].spinner.start();
    setTimeout(() => {
      this.pipeline1.workflows[wfIndex].spinner.stopAndPersist({
        symbol: logSymbols.success,
        text: `Workflow (${this.pipeline1.workflows[wfIndex].name}) Completed !`
      });
      if ((wfIndex + 1) == this.pipeline1.workflows.length) { // stop condition
        console.log('')
        console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
        console.log('')
      } else {
         this.reccRun(wfIndex + 1);
      }
    }, 3000);
  }
}



/// ---
/// PipelineExecutionSpinner Test
/// ---
/*

let pipeRefZero: cicd_spinner.IPipelineRef = {
  number: 2467,
  uuid: 'ea78881d-0493-4b00-b7ba-9ebfssdb87c',
  workflows: [
  {
    name: 'workf1',
    spinner: null
  },
  {
    name: 'workf2',
    spinner: null
  },
  {
    name: 'workf3',
    spinner: null
  },
  {
    name: 'workf4',
    spinner: null
  }
]};



let pipeRef1: cicd_spinner.IPipelineRef = {
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


let pipeRef2: cicd_spinner.IPipelineRef = {
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


/// ---
/// PipelineExecutionProgress Test
/// ---

let pExecSpinner = new cicd_spinner.PipelineExecutionSpinner(pipeRef1);

pExecSpinner.start();


*/
