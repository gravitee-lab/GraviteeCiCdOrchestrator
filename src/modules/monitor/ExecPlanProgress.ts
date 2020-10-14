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
import { ParallelExecutionSet } from '../manifest/ParallelExecutionSet';
import { ExecutionPlan } from '../manifest/ExecutionPlan';
import { ParallelExecutionSetProgress } from '../monitor/ParallelExecutionSetProgress';

  /**
   * A ExecPlanProgress represents the progress matrix of all pipeline
   * executions planned by an {@see ExecutionPlan}
   **/
  export interface ExecPlanProgressArgs {
    // allParallelExecutionSetProgress: ParallelExecutionSetProgress;
    executionPlan: ExecutionPlan;
  }

  /**
   *
   *
   **/
  export class ExecPlanProgress {
    /**
     * Not used to run any execution, justy there to keep a
     * refrence on the executionPlan
     **/
    public readonly executionPlan: ExecutionPlan;
    /**
     * Used to follow up progress of each {@see ParallelExecutionSetProgress}
     **/
    public readonly allParallelExecutionSetProgress: ParallelExecutionSetProgress[];
    /**
     * True as soon as all Pipeline execution have completed, regardless of pipeline execution final status (failure/success, etc...)
     **/
    private completed: boolean;

    constructor (
      args: ExecPlanProgressArgs
    ) {
      /// super(`valueofContructorParamOne`, args)
      this.executionPlan = args.executionPlan;
      this.completed = false;

    }
    setCompleted() {
      this.completed = true;
    }
    isCompleted(): boolean {
      return this.completed;
    }
  }
