/**
 * Executes the parallelized execution plan which launches all Circle CI Pipelines as distributed build across repos.
 *
 * @comment All methods are asynchronous, RxJS or at least Promises, cf. https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues/9
 **/
export class CircleCiOrchestrator {
    /**
     * [gravitee_release_branch] must match one the of the existing branch on
     **/
    private execution_plan: string [][];
    private retries: number;

    constructor(execution_plan: string [][], retries: number) {
        this.execution_plan = execution_plan;
        this.retries = retries;
    }
    /**
     * returning an A 2-dimensional array
     **/
    start()  : void {
      console.info("[{CircleCiOrchestrator}] - started processing execution plan, and will retry " + this.retries + " times executing a [Circle CI] pipeline before giving up.")
      this.execution_plan.forEach((parallelExecutionsSet, index) => {
        console.info("[{CircleCiOrchestrator}] - processing Parallel Execution Set no. ["+`${index}`+"] will trigger the following [Circle CI] pipelines : ");
        if (parallelExecutionsSet.length == 0) {
          console.info("[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. ["+`${index}`+"] because it is empty");
        } else {
          console.info(parallelExecutionsSet);
          processExecutionSet(parallelExecutionsSet); /// must be synchronous
        }
      });
      console.warn("[{CircleCiOrchestrator}] - Processing of the execution plan is not implemented yet.");
    }
    processExecutionSet (parallelExecutionsSet: string[]) : void {

    }
    giveup()  : void {
      console.log("[{CircleCiOrchestrator}] - giveup() method is not implemented yet.");
    }
}
