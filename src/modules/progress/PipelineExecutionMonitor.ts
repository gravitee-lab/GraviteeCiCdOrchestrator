import * as ora from 'ora';
// import * as chalk from 'chalk';
import * as Listr from 'listr';

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

  }
}


/**
 *
 * A Class there to just Demo how {@link PipelineExecutionSpinner} works, using 'listr' npm package
 **/
export class PipelineExecutionListrDemo {
  private pipeline1: IPipelineRef;
  private pipeline2: IPipelineRef;
  private tasks: any;
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
    console.log(`Starting Pipeline execution status of (Circle CI pipeline #[${this.pipeline1.number}] / pipeline uuid[${this.pipeline1.uuid}])`);
    console.log('')
    console.log('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.log('')

    const tasks = new Listr([
    	{
    		title: `Running Pipeline number [${this.pipeline1.number}] of UUID=[${this.pipeline1.uuid}]`,
    		task: () => {
    			return new Listr([
    				{
    					title: `Workflow [${this.pipeline1.workflows[0].name}]`,
    					task: () => {
                /// do what you gotta do :  calling the CircleCI API v2 with RxJS [retryWhen], and
                /// RETRIES configuration, in case of error, throw new Error(`Stopping CI CD Process [${process.env.CICD_PROCESS_NAME}] for [${process.env.PRODUCT_NAME}] `)
                /// Also even better : See if I can subscribe to RXJS Observable Stream here... don't think so exactly this process must be synchronous
                /// Oh yeah I know, this method should be ivoked when catching an RxJS "next"... have to work on this one

                /// finish this task when Workflow execution has completed : verified with Circle CI API v2

                /// The {setTimeout} invocation here is just to simulate 3 seconds execution
                console.log('');
                setTimeout(() => {
                  console.log(`Workflow [${this.pipeline1.workflows[0].name}] completed!`);
                  console.log('');
                }, 3000);

              }
    				},
    				{
    					title: `Workflow [${this.pipeline1.workflows[1].name}]`,
    					task: () => {

                /// finish this task when Workflow execution has completed : verified with Circle CI API v2
                /// The {setTimeout} invocation here is just to simulate 3 seconds execution
                console.log('');
                setTimeout(() => {
                  console.log(`Workflow [${this.pipeline1.workflows[1].name}] completed!`);
                  console.log('');
                }, 3000);
              }
    				},
    				{
    					title: `Workflow [${this.pipeline1.workflows[2].name}]`,
    					task: () => {
                /// finish this task when Workflow execution has completed : verified with Circle CI API v2
                /// The {setTimeout} invocation here is just to simulate 3 seconds execution
                console.log('');
                setTimeout(() => {
                  console.log(`Workflow [${this.pipeline1.workflows[2].name}] completed!`);
                  console.log('');
                }, 3000);
              }
    				}
    			], {concurrent: true});
    		}
    	},
    	{
    		title: 'Happens After Pipeline execution completion',
    		task: ((ctx, task) => {
              console.log('');
              console.log("Something I do After conccurrent executions for each pipeline has completed without error");
              console.log('');
              setTimeout(() => {
                console.log(`Here is the context of a Listr Task :`)
                console.log('');
                console.log(`${JSON.stringify(ctx, null, " ")}`);
                console.log('');
                console.log(`Now skipping a Listr Task :`)
                console.log('');
                task.skip('Changed my mind, won\'t do it, skipping task');
                console.log('');
              }, 3000);

           })
    	},
    	{
    		title: 'Also Happens After Pipeline execution completion',
    		enabled: ctx => ctx.yarn === false,
    		task: () => {
          console.log('');
          console.log("Something which Also Happens After conccurrent executions for each pipeline has completed without error");
          console.log('');
          setTimeout(() => {
            console.log('');
          }, 3000);
        }
    	}
    ]);

    tasks.run().catch(err => {
    	console.error(err);
    });
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
