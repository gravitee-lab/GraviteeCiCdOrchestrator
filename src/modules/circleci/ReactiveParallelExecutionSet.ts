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
import * as rxjs from 'rxjs';
import * as fs from 'fs';
import { CircleCIClient, WorkflowsData, WorkflowJobsData } from '../../modules/circleci/CircleCIClient';
import { PipelineExecSetStatusWatcher, PipeExecSetStatusNotification } from '../../modules/circleci/status/PipelineExecSetStatusWatcher';

import { releaseManifest, gioReleaseVersion } from '../../modules/circleci/ReleaseManifest'


export class ReactiveParallelExecutionSet {

  releaseManifest: any;
  /**
   * This is the progress matrix for all pipeline executions
   * in one {Parallel Execution Set}, the <code>this.parallelExecutionSet</code>, not
   * the whole execution plan, as understood by the {@link CircleCiOrchestrator} class.
   * --
   * Will be filled with JSON responses of Circle CI API calls to trigger pipelines.
   * ---
   * Each entry of the array has the following JSON properties :
   *
   *  {
   *     pipeline_exec_number: `${circleCiJsonResponse.number}`,
   *     id : `${circleCiJsonResponse.id}`,
   *     created_at: `${circleCiJsonResponse.created_at}`,
   *     exec_state: `${circleCiJsonResponse.state}`,
   *     project_slug: `${circleCiJsonResponse.project_slug}`
   *  }
   * ---
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
  private pipeExecStatusWatcher: PipelineExecSetStatusWatcher;
  private isLast: boolean; // true if and only if the Parallel execution set of index [parallelExecutionSetIndex] is the last non empty [ParallelExecutionSet] in [execution_plan]

  /**
   * Instantiate a new {@link ReactiveParallelExecutionSet}
   * [isLast] : msut be set to true, if this is the last non empty Parallel Execution Set
   **/
  constructor(parallelExecutionSet: any[], parallelExecutionSetIndex: number, circleci_client: CircleCIClient, orchestratorNotifier: rxjs.Subject<number>, isLast: boolean) {
    this.parallelExecutionSetIndex = parallelExecutionSetIndex;
    this.parallelExecutionSet = parallelExecutionSet;
    this.circleci_client = circleci_client;
    this.pipelines_nb = this.parallelExecutionSet.length;
    this.progressMatrix = [];
    this.orchestratorNotifier = orchestratorNotifier;
    this.isLast = isLast;
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
         console.log(`[ --- [{ReactiveParallelExecutionSet}] - progress Matrix Observer: NEXT  `);
         console.log(`[ --- [{ReactiveParallelExecutionSet}] - All Pipelines have been triggered !   `);
         console.log("[-----------------------------------------------]");

         this.pipeExecStatusWatcher = new PipelineExecSetStatusWatcher(this.progressMatrix, this.circleci_client, this.isLast);
         this.pipeExecStatusWatcher.finalStateNotifier.subscribe({ // Subsciption to An RxJS Subject, so this subscription doesnot trigger anything.
           next: this.notifyExecCompleted.bind(this),
           complete: () => {
             console.log('[{ReactiveParallelExecutionSet}] - Just Completed Watching Pipeline Execution Status!');
           }
         });
         try {
           this.pipeExecStatusWatcher.start(); // will invoke next() method on subject only after start() is invoked
           /// I tested it, this does not catch anything at all
         } catch (error) {
           console.log(`# ----------------------------------------------------`)
           console.log(`Catched pipeExecStatusWatcher error : `)
           console.log(error)
           console.log(`# ----------------------------------------------------`)
           throw error;
           // throw new Error(`Stopping Orchestrator because an error occured during the execution ofthe CI CD Process`)
         }


         console.log(`[{ReactiveParallelExecutionSet}] Now verifying that If I do not invoke [this.orchestratorNotifier.next(${this.parallelExecutionSetIndex});] then nothing happens at all`)
         /*
         console.log("[-----------------------------------------------]");
         console.log(`[ --- notifier call to proceed with next Parallel Execution Set :  `);
         this.orchestratorNotifier.next(this.parallelExecutionSetIndex);
         console.log("[-----------------------------------------------]");
         console.log("[-----------------------------------------------]");
         */
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
   *
   * Notifies the {@link CircleCiOrchestrator} that all pipelines in
   * this {@link ReactiveParallelExecutionSet} have reached a final execution state
   *
   **/
  private notifyExecCompleted(execStatusNotification: PipeExecSetStatusNotification) {

    if (execStatusNotification.is_errored) {
      console.log("[-----------------------------------------------]");
      console.log(`A Pipeline has reached an execution status with errors, or Pipeline Execution timeout has been reached, So the {@link PipelineExecSetReportLogger} will build and log an Execution Report, and then stop the execution of the whole ${process.argv["cicd-stage"]} CI CD Stage.`);
      console.log("[-----------------------------------------------]");
      /**
       * The {@link PipelineExecSetReportLogger} will stop all CI CD Operations : Anyway,
       * since no [this.orchestratorNotifier.next(parallelExecutionSetIndex)] call is made here, the
       * [CircleCiOrchestrator] will not ever take back the Execution flow control.
       * That's why no [throw new Error(`blablah`)] is done here :
       *  A./ We need to let the {@link PipelineExecSetReportLogger} build and log the Execution report
       *  B./ The {@link PipelineExecSetReportLogger} will stop all CI CD Operations.
       **/

    } else {
      console.log("[-----------------------------------------------]");
      console.log(`[ --- All pipelines in the ParallelExecutionSet of index [${this.parallelExecutionSetIndex}] have succesfully completed their execution`);
      console.log(`[ --- The ParallelExecutionSet is :`);
      console.log(this.parallelExecutionSet);
      console.log("[-----------------------------------------------]");
      console.log(`[ --- Now notifying the [CircleCiOrchestrator] to proceed with next Parallel Execution Set`);
      this.orchestratorNotifier.next(this.parallelExecutionSetIndex);
      console.log("[-----------------------------------------------]");
    }

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
      let pipelineTargetBranch: string = null;

      if (theSplitVersionArr.length != 3) {
        throw new Error(`The Gravitee component [${component.name}] has a non-semver compliant version number : [${component.version}]`)
      } else if (!`${component.version}`.endsWith('-SNAPSHOT')) {
        throw new Error(`The Gravitee component [${component.name}] has a version number which does not end with the '-SNAPSHOT' suffix (but it should, since filtered from the 'release.json') : [${component.version}]`)
      } else {
        if (theSplitVersionArr[2] === '0-SNAPSHOT') {
          /// if the patch version number is zero, then
          /// Gravitee Team Git workflow rule is that
          /// the ${component.version} is on the [master] git branch of the
          ///  git repo versioning the component
          pipelineTargetBranch = 'master'
        } else {
          pipelineTargetBranch = `${theSplitVersionArr[0]}.${theSplitVersionArr[1]}.x`
        }


      }

      console.log( `[{[ReactiveParallelExecutionSet # triggerPipelines()]} - so component git branch to trigger pipeline on is : [${pipelineTargetBranch}]`);
      console.log( `[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of process.argv["dry-run"] : [${process.argv["dry-run"]}]`);

      /// pipeline execution parameters, same as [Jenkins] build parameters
      /// ---

      let pipelineConfig = {
        parameters: {
         gio_action: `release`, // should be releated to cicd_stage...? mvn_release ?
         dry_run: process.argv["dry-run"],
         secrethub_org: process.env.SECRETHUB_ORG,
         secrethub_repo: process.env.SECRETHUB_REPO,
         maven_profile_id: process.env.MAVEN_PROFILE_ID,
         s3_bucket_name: `prepared-nexus-staging-gravitee-apim-${gioReleaseVersion}`
        },
        branch: `${pipelineTargetBranch}`
      }
      /// if (process.argv["dry-run"] === 'true') {
      /* // thanks to the new  'dry_run' pipeline parameter, this "if"statement is no logner useful !
      if (process.argv["dry-run"]) {
       console.log( '[{[ReactiveParallelExecutionSet]} - (process.argv["dry-run"] === \'true\') condition is true');
       pipelineConfig.parameters.gio_action = `product_release_dry_run`;
      } else {
       console.log( '[{[ReactiveParallelExecutionSet]} - (process.argv["dry-run"] === \'true\') condition is false');
       pipelineConfig.parameters.gio_action = `product_release`;
      }
      */
      /// let pipelineConfig = { parameters: {},branch : 'dependabot/npm_and_yarn/handlebars-4.5.3'};

      let triggerPipelineSubscription = this.circleci_client.triggerCciPipeline(process.env.GH_ORG, `${component.name}`, `${pipelineTargetBranch}`, pipelineConfig).subscribe({
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
      exec_state: `${circleCiJsonResponse.state}`,
      project_slug: `${circleCiJsonResponse.project_slug}`
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
