import * as rxjs from 'rxjs';
import { CircleCIClient } from '../../modules/circleci/CircleCIClient';
import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets';
import { PipelineExecSetStatusWatcher } from '../../modules/circleci/status/PipelineExecSetStatusWatcher';


export class ReactiveParallelExecutionSet {

  /**
   * This is the progress matrix for all pipeline executions
   * in one {Parallel Execution Set}, the <code>this.parallelExecutionSet</code>, not
   * the whole execution plan, as understood by the {@link CircleCiOrchestrator} class.
   * --
   * Will be filled with JSON responses of Circle CI API calls to trigger pipelines.
   **/
  private progressMatrix: any[]; //
  /// private pipeExecStatusWatcher: PipelineExecSetStatusWatcher; /// no circular dependencies
  /**
   * This RX JS Subject is used to inspect <code>this.progressMatrix</code> everytime a
   * JSON Response is received from the Circle CI API :
   * why? To check if all pipelines triggers Circle CI API request have receivedheir HTTP Response, with its JSON Response.
   **/
  private progressMatrixSubject = new rxjs.Subject<any[]>();

  /**
   * ---
   * This RX JS Subject is provided by the {@link CircleCiOrchestrator} and is
   * used by this {@link ReactiveParallelExecutionSet} to notify the {@link CircleCiOrchestrator} when
   * all the Pipelines have successfully completed their execution.
   * If either :
   * ---
   * => at least one Pipeline has completed its executions unsuccessfully
   * => or the timeout has been reached
   *
   * Then the CI CD Stage stops its execution (after logging a {@link PipelineExecSetReport})
   *
   **/
  private orchestratorNotifier: rxjs.Subject<number>;
  /**
   * this one has to change type to {src/modules/manifest/ParallelExecutionSet.ts}
   * because for each component, i need both repo name AND version, which contains the info to
   * determine on which git branch the pipeline has to be
   * triggered as of https://github.com/gravitee-lab/GraviteeCiCdOrchestrator/issues/25#issuecomment-696640726
   **/
  private parallelExecutionSet: any[]; // contains all the entires coming from execution_plan
  private parallelExecutionSetIndex: number; // [ParallelExecutionSet] index in execution plan

  private circleci_client: CircleCIClient;
  private pipelines_nb: number;

  /**
   * Instantiate a new {@link ReactiveParallelExecutionSet}
   *
   **/
  constructor(parallelExecutionSet: any[], parallelExecutionSetIndex: number, circleci_client: CircleCIClient, orchestratorNotifier: rxjs.Subject<number>) {
    this.parallelExecutionSetIndex = parallelExecutionSetIndex;
    this.parallelExecutionSet = parallelExecutionSet;
    this.circleci_client = circleci_client;
    this.pipelines_nb = this.parallelExecutionSet.length;
    this.progressMatrix = [];
    this.orchestratorNotifier = orchestratorNotifier;
  }

  /**
   *
   **/
  public doSubscribe() : rxjs.Subscription {

    let toReturn : rxjs.Subscription = this.progressMatrixSubject.subscribe({
     next: ((triggerProgress) => {
       console.log("[-----------------------------------------------]");
       console.log("[-----------------------------------------------]");
       console.log(`[ --- [ReactiveParallelExecutionSet], Progress Matrix is now  : `);
       console.log("[-----------------------------------------------]");
       console.log("[-----------------------------------------------]");
       console.log(triggerProgress);
       console.log("[-----------------------------------------------]");
       console.log("[-----------------------------------------------]");
       console.log(`[ --- [ReactiveParallelExecutionSet], this.pipelines_nb : [` + this.pipelines_nb + `]`);
       console.log(`[ --- [ReactiveParallelExecutionSet], triggerProgress.length : [` + triggerProgress.length + `]`);
       console.log("[-----------------------------------------------]");
       console.log("[-----------------------------------------------]");
       console.log(triggerProgress);
       if (triggerProgress.length == this.pipelines_nb){
         console.log("[-----------------------------------------------]");
         console.log("[-----------------------------------------------]");
         console.log(`[ --- progress Matrix Observer: NEXT  `);
         console.log(`[ --- All Pipelines have been triggered !   `);
         console.log("[-----------------------------------------------]");
         const pipeExecStatusWatcher = new PipelineExecSetStatusWatcher(this.progressMatrix, this.circleci_client);
         pipeExecStatusWatcher.finalStateNotifier.subscribe({
           next: this.notifyExecCompleted,
           error: (error) => {
             console.log('An error occured while watching pipeline execution status on the following triggered pipelines set : ' + triggerProgress);
           },
           complete: () => {
             console.log('Just Completed Pipeline  ')
           }
         })
         pipeExecStatusWatcher.start(); // will invoke next() method on subject only after start() is invoked
         /// let statusWatcherSubscription = pipeExecStatusWatcher.letReactiveExecSetSubscribe();
         /// When subscribing
         /**
         pipeExecStatusWatcher.getFinalStateNotifier().subscribe({

         })
         */
         /// will be replaced by this.notifyExecCompleted()
         console.log("[-----------------------------------------------]");
         console.log(`[ --- notifier call to proceed with next Parallel Execution Set :  `);
         this.orchestratorNotifier.next(this.parallelExecutionSetIndex);
         console.log("[-----------------------------------------------]");
         console.log("[-----------------------------------------------]");
       }

     }).bind(this),
     complete: () => {
       console.log("[-----------------------------------------------]");
       console.log("[-----------------------------------------------]");
       console.log(`[ --- progress Matrix Observer: COMPLETE  `);
       console.log(`[ --- All Pipelines have been triggered !   `);
       console.log(`[ --- [ReactiveParallelExecutionSet], this.pipelines_nb : [` + this.pipelines_nb + `]`);
       console.log(`[ --- [ReactiveParallelExecutionSet], this.parallelExecutionSetIndex : [` + this.parallelExecutionSetIndex + `]`);
       console.log("[-----------------------------------------------]");
       console.log("[-----------------------------------------------]");
       this.orchestratorNotifier.complete();
     }
   })

   return toReturn;
  }
  /**
   * Notifies that all pipelines in this ReactiveParallelExecutionSet have reached a final execution state
   **/
  public notifyExecCompleted(data) {
    console.log("[-----------------------------------------------]");
    console.log(`[ --- notifier call to proceed with next Parallel Execution Set :  `);
    console.log("[-----------------------------------------------]");
    console.log(`[ --- notifier call to proceed with next Parallel Execution Set :  `);
    this.orchestratorNotifier.next(this.parallelExecutionSetIndex);
    console.log("[-----------------------------------------------]");
    console.log("[-----------------------------------------------]");
  }
  triggerPipelines(): void {


    console.info("");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info("{[ReactiveParallelExecutionSet]} - Processing Parallel Executions Set : the set under processing is the value of the 'parallelExecutionsSet' below : ");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info(" ---");
    console.info(JSON.stringify({ parallelExecutionsSet: this.parallelExecutionSet }, null, " "));
    console.info(" ---");
    console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
    console.info("");

    /// First, trigger all pipelines in the parallel execution set
    this.parallelExecutionSet.forEach(((component, index) => {

      console.log( `[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.name : [${component.name}]`);
      console.log( `[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.version : [${component.version}]`);
      let theSplitVersionArr = component.version.split('.');
      console.log( `[{[ReactiveParallelExecutionSet # triggerPipelines()]} - so component git branch to trigger pipeline on is : [${theSplitVersionArr[0]}.${theSplitVersionArr[1]}.x]`);
      console.log( `[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of process.argv["dry-run"] : [${process.argv["dry-run"]}]`);

      /// pipeline execution parameters, same as Jenkins build parameters
      let pipelineConfig = {
        parameters: {
         gio_action: null
        },
        branch: `${theSplitVersionArr[0]}.${theSplitVersionArr[1]}.x`
      }
      /// if (process.argv["dry-run"] === 'true') {
      if (process.argv["dry-run"]) {
       console.log( '[{[ReactiveParallelExecutionSet]} - (process.argv["dry-run"] === \'true\') condition is true');
       pipelineConfig.parameters.gio_action = `product_release_dry_run`;
      } else {
       console.log( '[{[ReactiveParallelExecutionSet]} - (process.argv["dry-run"] === \'true\') condition is false');
       pipelineConfig.parameters.gio_action = `product_release`;
      }
      /// let pipelineConfig = { parameters: {},branch : 'dependabot/npm_and_yarn/handlebars-4.5.3'};

      let triggerPipelineSubscription = this.circleci_client.triggerCciPipeline(process.env.GH_ORG, `${component.name}`, `${theSplitVersionArr[0]}.${theSplitVersionArr[1]}.x`, pipelineConfig).subscribe({
        next: this.handleTriggerPipelineCircleCIResponseData.bind(this),
        complete: data => {
           console.log( '[{[ReactiveParallelExecutionSet]} - triggering Circle CI Build completed! :)]')
        },
        error: this.errorHandlerTriggerCCIPipeline.bind(this)
      });
    }).bind(this));

  }


  /**
   *
   *
   *
   *
   **/
  private handleTriggerPipelineCircleCIResponseData (circleCiJsonResponse: any) : void {
    console.info( '[{ReactiveParallelExecutionSet}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] => ', circleCiJsonResponse  /* circleCiJsonResponse.data // when retryWhen is used*/ )
    let entry: any = {};
    entry.pipeline = {
      /*
      // when retryWhen is used
      pipeline_exec_number: `${circleCiJsonResponse.data.number}`,
      id : `${circleCiJsonResponse.data.id}`,
      created_at: `${circleCiJsonResponse.data.created_at}`,
      exec_state: `${circleCiJsonResponse.data.state}`
      */
      pipeline_exec_number: `${circleCiJsonResponse.number}`,
      id : `${circleCiJsonResponse.id}`,
      created_at: `${circleCiJsonResponse.created_at}`,
      exec_state: `${circleCiJsonResponse.state}`
    }
    this.progressMatrix.push(entry.pipeline);
    /// this.progressMatrixSubject.next(entry.pipeline);
    this.progressMatrixSubject.next(this.progressMatrix);

    /// console.info('')
    /// console.info( '[{ReactiveParallelExecutionSet}] - [handleTriggerPipelineCircleCIResponseData] [this.progressMatrix] is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    /// console.info({progressMatrix: this.progressMatrix});
    /// console.info('')
  }
  private errorHandlerTriggerCCIPipeline (error: any) : void {
    console.info( '[{ReactiveParallelExecutionSet}] - Triggering Circle CI pipeline failed Circle CI API Response [data] => ', error )
    let entry: any = {};
    entry.pipeline = {
      execution_index: null,
      id : null,
      created_at: null,
      exec_state: null,
      error : {message: "[{ReactiveParallelExecutionSet}] - Triggering Circle CI pipeline failed ", cause: error}
    }

    this.progressMatrix.push(entry);

    console.info('')
    console.info( '[{ReactiveParallelExecutionSet}] - [errorHandlerTriggerCCIPipeline] [this.progressMatrix] is now :  ');
    // console.info(JSON.stringify({progressMatrix: this.progressMatrix}, null, " "));
    console.info({progressMatrix: this.progressMatrix});
    console.info('')
    throw new Error('[{ReactiveParallelExecutionSet}] - [errorHandlerTriggerCCIPipeline] CICD PROCESS INTERRUPTED BECAUSE TRIGGERING PIPELINE FAILED with error : [' + error + '] '+ ' and, when failure happened, progress matrix was [' + { progressMatrix: this.progressMatrix } + ']')
  }

  /**
   *
   * Returns the <code>progressMatrix</code> of this {@link ParallelExecutionSet}
   *
   **/
  public getProgressMatrix(): any[] {
    return this.progressMatrix;
  }
}
