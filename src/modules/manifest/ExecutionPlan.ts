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
import * as executionsets from './ParallelExecutionSet';
import * as giocomponents from './GraviteeComponent';

  /**
   * An Execution Plan represents an ordered set of {@see executionsets.ParallelExecutionSet}s :
   * they are executed in the order defined by the index of
   * the [public readonly parallelExecutionSets: executionsets.ParallelExecutionSet[];] Array
   *
   **/
  export class ExecutionPlan {

    public readonly parallelExecutionSets: executionsets.ParallelExecutionSet[];

    constructor () {
      /// super(`valueofContructorParamOne`, args)
      this.parallelExecutionSets = [];
    }
    /**
     * Returns the {@see executionsets.ParallelExecutionSet} which will be executed as <code>ofIndex</code>-th place :
     *
     * It will be executed after the <code>ofIndex - 1</code> previous ones have completed their execution
     *
     * @argument <code>ofIndex</code> the execution index of the {@see ParallelExecutionSet}
     * @returns the {@see executionsets.ParallelExecutionSet} which will be executed as <code>ofIndex</code>-th
     *
     **/
    getParallelExecutionSet(ofIndex: number): executionsets.ParallelExecutionSet {
      return this.parallelExecutionSets[ofIndex];
    }
    /**
     * Returns a positive integer, which can be zero, of the number of  {@see ParallelExecutionSet}s in this {@see ExecutionPlan}
     *
     * @returns the number of  {@see ParallelExecutionSet}s in this {@see ExecutionPlan}
     **/
    getPlanLength() : number {
      return this.parallelExecutionSets.length;
    }
    /**
     * Returns a JSON Object with only one JSON property, named 'components' which is an array of {@see giocomponents.GraviteeComponents}s.
     * the 'components' array lists all components which will be invovled in /impacted by this {@see ExecutionPlan} :
     * The Gravitee Components for which this {@see ExecutionPlan} will trigger a 'Circle CI' Pipeline
     *
     * The returned JSON Object will look like this :
     *
     * <code>
     * {
     *   components: [
     *                  {name: 'policy'}
     *                  {
     *                     "name": "gravitee-common",
     *                     "version": "1.17.2",
     *                     "repo_http_uri": "https://github.com/gravitee-io/ccc",
     *                     "repo_ssh_uri": "git@github.com:gravitee-io/ccc",
     *                  },
     *                  {
     *                     "name": "gravitee-definition",
     *                     "version": "1.20.3",
     *                     "repo_http_uri": "https://github.com/gravitee-io/gravitee-definition",
     *                     "repo_ssh_uri": "git@github.com:gravitee-io/gravitee-definition",
     *                  },
     *                  {
     *                     "name": "gravitee-gateway",
     *                     "version": "1.30.19",
     *                     "repo_http_uri": "https://github.com/gravitee-io/gravitee-gateway",
     *                     "repo_ssh_uri": "git@github.com:gravitee-io/gravitee-gateway",
     *                  },
     *                  {
     *                     "name": "gravitee-gateway-api",
     *                     "version": "1.20.0",
     *                     "repo_http_uri": "https://github.com/gravitee-io/gravitee-gateway-api",
     *                     "repo_ssh_uri": "git@github.com:gravitee-io/gravitee-gateway-api",
     *                  }
     *               ]
     * }
     * </code>
     *
     * @returns  a JSON Object with only one JSON property, named 'components', array which lists all {@see giocomponents.GraviteeComponents}s for which this {@see ExecutionPlan} will trigger a 'Circle CI' Pipeline.
     **/
    getPlanImpact() : giocomponents.GraviteeComponent[] {
      let toReturn: any = {
        components: []
      };
      let execPlanLentgh = this.getPlanLength();
      for (let i: number = 0; i < execPlanLentgh; i++) {
        let currentExecSet: executionsets.ParallelExecutionSet = this.getParallelExecutionSet(i);
        let currentExecSetLength: number = currentExecSet.getComponents().length;
        if (currentExecSetLength != 0) {
           for (let j: number = 0; j < currentExecSetLength; j++) {
             toReturn.components.push({
               name: currentExecSetLength[j].name,
               version: currentExecSetLength[j].version,
               repo_http_uri: currentExecSetLength[j].repo_http_uri,
               repo_ssh_uri: currentExecSetLength[j].repo_ssh_uri,
             })
           }
        }
      }
      return toReturn;
    }
    /**
     * Pushes the {@see ParallelExecutionSet} provided as argument, on top of this {@see ExecutionPlan}
     *
     * @argument <code>execSet</code> the {@see ParallelExecutionSet} to push on top of this {@see ExecutionPlan}
     * @returns the execution index assigned to the pushed {@see ParallelExecutionSet} <code>execSet</code>
     **/
    addParallelExecutionSet(execSet: executionsets.ParallelExecutionSet): number {
      return this.parallelExecutionSets.push(execSet);
    }

  }
