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
import * as shelljs from 'shelljs';
import * as fs from 'fs';
import * as arrayUtils from 'util';
import * as bom from '../../modules/slack/templates/process.bom'; //src/modules/slack/templates/process.bom.ts

export const manifestPath : string = process.env.CICD_PROCESS_MANIFEST_PATH;

/**
 * Filters Gravitee components for which to execute the CI/CD Pipelines, and builds an Execution Plan.
 * @comment All methods are synchronous
 **/
export class SingleExecutionManifestFilter {
    processManifest: any;
    selectedComponents : any;
    parallelizationMatrix: any[][];
    executionPlan : any [][];
    constructor() {
        this.loadProcessManifest();
        this.loadParallelizationMatrix();
        // console.debug("{[SingleExecutionManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.processManifest, null, "  ")}` + "]");

        this.selectedComponents = { "components" : []};
        this.initializeExecutionPlan();
        /// throw new Error('DEBUG POINT to reove asap');
    }
    /**
     * initializes the execution plan, to :
     * <ul>
     * <li> an emply execution plan, </li>
     * <li> which is an array of arrays, </li>
     * <li> which is not an empty array, but an array of <pre>N</pre> empty arrays, where <pre>N</pre> is the length of {@see this.parallelizationMatrix} </li>
     * </ul>
     **/
    initializeExecutionPlan () : void {
      this.executionPlan = [];
      console.debug("{[SingleExecutionManifestFilter]} - Initializing Empty Execution Plan from Parallelization Constraints Matrix... ");
      for (let i = 0; i < this.parallelizationMatrix.length; i++) {
        let newEntry = [ ];
        this.executionPlan.push(newEntry);
      }
      console.debug("{[SingleExecutionManifestFilter]} - Initialized Empty Execution Plan with " + `${this.executionPlan.length}` + " empty arrays : ");
      console.log('[');
      this.executionPlan.forEach(executionSet => {
        console.log('  [');
        console.log('    ' + arrayUtils.inspect(`${executionSet}`, { maxArrayLength: null }));
        console.log('  ],');
      });
      console.log(']');
    }
    loadParallelizationMatrix() : void {
      /// When Triggering a Single Execution Set of Pipelines, build dependencies
      let mergedBuildDependencies = [
        [

        ]
      ];
      this.processManifest.components.forEach(component => {
        if (!component.hasOwnProperty('version')) {
          throw new Error(`One component in [${manifestPath}] has no [name] JSON property`)
        }
        mergedBuildDependencies[0].push(`${component.name}`);
      });
      console.debug("{[SingleExecutionManifestFilter]} - Loading Parallelization Constraints Matrix from Release Manifest... ");
      /// this.parallelizationMatrix = this.processManifest.buildDependencies
      this.parallelizationMatrix = mergedBuildDependencies
      console.debug("{[SingleExecutionManifestFilter]} - Loaded Parallelization Constraints Matrix from Release Manifest : ");
      // console.debug(`${this.parallelizationMatrix}`);
      console.log('[');

      this.parallelizationMatrix.forEach(executionSet => {
        console.log('  [');
        console.log('    ' + arrayUtils.inspect(`${executionSet}`, { maxArrayLength: null }));
        console.log('  ],');
      });
      console.log(']');
    }
    /**
     * Filters the processManifest Release manifest file to
     * Populate [this.selectedComponents] with all the components
     **/
    filter() : void {
      console.debug("{[SingleExecutionManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.processManifest, null, "  ")}` + "]");

      this.processManifest.components.forEach(component => {
        if (!component.hasOwnProperty('pipeline_params')) { // pipeline parameters may be set through this JSON property
          component.pipeline_params = {}; // infer version from release manifest top level version JSON Property, as of [https://github.com/gravitee-lab/GraviteeCiCdOrchestrator/issues/26]
        }
        this.selectedComponents.components.push(component);
      });
      console.debug("{[SingleExecutionManifestFilter]} - Selected components are [" + `${JSON.stringify(this.selectedComponents, null, "  ")}` + "]");
    }
    /**
     * <p>
     * Generates the Execution plan using [this.selectedComponents()] with the components that should be included in the release :
     * <p>
     * <ul>
     * <li>The 2-dim. Array of raw strings, the exact same structure as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git)</li>
     * <ul>
     *
     * Example Execution Plan :
     * -----
     * <pre>
     *      [
     *          [
     *              "gravitee-common"
     *          ],
     *          [
     *          ],
     *          [
     *              "gravitee-repository-test"
     *          ],
     *          [
     *              "gravitee-reporter-api",
     *              "gravitee-notifier-email"
     *          ],
     *          [
     *          ],
     *          [
     *          ],
     *          [
     *          ],
     *          [
     *          ],
     *          [
     *              "gravitee-resource-oauth2-provider-api"
     *          ],
     *          [
     *              "gravitee-resource-cache"
     *          ],
     *          [
     *              "gravitee-policy-apikey",
     *              "gravitee-policy-ratelimit",
     *              "gravitee-policy-dynamic-routing",
     *              "gravitee-fetcher-bitbucket",
     *              "gravitee-fetcher-github"
     *          ],
     *          [
     *              "gravitee-management-rest-api",
     *              "gravitee-management-webui"
     *          ]
     *      ]
     * </pre>
     *
     *
     * @returns A 2-dimensional JSon array, which is the execution plan, that will be executed by the {@see CircleCiOrchestrator}
     *
     **/
    buildExecutionPlan()  : string [][] {

      this.filter(); /// populates the [this.selectedComponents] Class member

      this.selectedComponents.components.forEach(component => {
        let parallelExecutionSetIndex = this.getParallelExecutionSetIndex(component);
        this.executionPlan[parallelExecutionSetIndex].push(component);
      });
      console.info("");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[SingleExecutionManifestFilter]} - EXECUTION PLAN is the value of the 'built_execution_plan_is' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ built_execution_plan_is: this.executionPlan}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");
      return this.executionPlan
    }
    generateExecutionPlanBomFile()  : void {

      this.filter(); /// populates the [this.selectedComponents] Class member

      this.selectedComponents.components.forEach(component => {
        let parallelExecutionSetIndex = this.getParallelExecutionSetIndex(component);
        this.executionPlan[parallelExecutionSetIndex].push(component);
      });
      console.info("");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("{[SingleExecutionManifestFilter]} - EXECUTION PLAN is the value of the 'built_execution_plan_is' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ built_execution_plan_is: this.executionPlan}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");

      try {
        // in the ./pipeline folder, because the ./pipeline folder is a docke rmapped volume
        fs.writeFileSync(`./pipeline/.circleci/process.bom`, `${JSON.stringify({ built_execution_plan_is: this.executionPlan}, null, " ")}`, {}); // no options
        console.log(`{[SingleExecutionManifestFilter]} - successfully generated [./pipeline/.circleci/process.bom]`);
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log(`{[SingleExecutionManifestFilter]} - An Error occurred writing to [.circleci/process.bom] to generate the Process BOM`);
        console.error(err);
        throw err;
      }
      /// return this.executionPlan


      /// ---
      /// Generate Slack Template
      /// ---
      ///
      let bomDivider: bom.SlackBomDivider = {
      	type: "divider"
      }
      let bomHeader: bom.SlackBomHeader = {
      	type: "section",
      	text: {
      		type: "mrkdwn",
      		text: `You have triggered a CI/CD Process. Here below is the B.O.M. (Bill of Material) of that CI/CD Process.\n\n *Please check that the B.O.M. (Bill of Material) is Ok, and in Circle CI Web UI, Approve or Cancel The Job on hold :*`
      	}
      }
      let releaseBomSlackTemplate: bom.GraviteeBOMSlackTemplate = {
        blocks: [
      		  bomHeader,
            bomDivider
        ]
      }
      // And now we loop over execution plan entries
      for (let i: number = 0; i < this.executionPlan.length; i++) {
        if (this.executionPlan[i].length != 0) {
          releaseBomSlackTemplate.blocks.push(bomDivider);
        }
        this.executionPlan[i].forEach(component => {
          let currentBomEntry: bom.SlackBomEntry = {
          	type: "section",
          	text: {
          		type: "mrkdwn",
          		text: `*${component.name}*\n:star::star::star::star: 1528 reviews\n *version: ${component.version}*`
          	},
          	accessory: {
          		type: "image",
          		image_url: "https://download.gravitee.io/logo.png",
          		alt_text: `${component.name}`
          	}
          }
          releaseBomSlackTemplate.blocks.push(currentBomEntry);
        });
      }
      let actions = 		{
      			type: "actions",
      			elements: [
      				{
      					type: "button",
      					text: {
      						type: "plain_text",
      						text: "Go to Circle CI to Approve / Disappprove the Job",
      						emoji: true
      					},
      					value: "goToCircleCIJob",
      					url: `${process.env.CIRCLE_BUILD_URL}`
      				}
      			]
      		} // process.env.CIRCLE_BUILD_URL
      releaseBomSlackTemplate.blocks.push(actions);
      try {
        // in the ./pipeline folder, because the ./pipeline folder is a docke rmapped volume
        fs.writeFileSync(`./pipeline/.circleci/process.bom.slack`, `${JSON.stringify(releaseBomSlackTemplate)}`, {}); // no options
        fs.writeFileSync(`./pipeline/.circleci/process.bom.slack.beautified`, `${JSON.stringify(releaseBomSlackTemplate, null, " ")}`, {}); // no options
        console.log(``);
        console.log(`{[SingleExecutionManifestFilter]} - Here is the formatted Slack Template for the Gravitee BOM :`);
        console.log(``);
        console.log(JSON.stringify(releaseBomSlackTemplate, null, " "));
        console.log(``);
        console.log(`Copy the above JSON, ans Go and Check how this Slack Template`);
        console.log(`renders in Slack, at https://app.slack.com/block-kit-builder/`);
        console.log(``);
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log(`{[SingleExecutionManifestFilter]} - An Error occurred writing either to [.circleci/process.bom.slack] or to [.circleci/process.bom.slack.beautified] to generate the Process BOM`);
        console.error(err);
        throw err;
      }
    }
    /**
     * This method lokks up the [this.parallelizationMatrix] ("Parallelization Constraints Matrix") to determine what is the Parallelization Execution Set Index of {@argument component}
     *
     * @argument component must be a JSon Object, with only two properties : "name", and "version", just like in the [release.json]
     * @returns number a positive integer, between zero and length of the [this.parallelizationConstraint] array
     *
     **/
    getParallelExecutionSetIndex (component: any) : number {

      /// First, let's check the provided argument actually is a component :
      /// is a JSON Object with only two properties, 'name', and 'version', jsut like in the 'components' array in [release.json] Release manifest file.
      /// .keys(obj).length
      console.debug('');
      console.debug('--- ');
      console.debug('');
      if (!(Object.keys(component).length == 2 || Object.keys(component).length == 3)) {
        let errMsg = "{[SingleExecutionManifestFilter]} - The component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += "{[SingleExecutionManifestFilter]} - has a total of " + `${Object.keys(component).length}` +" [JSon] properties.";
        errMsg += "{[SingleExecutionManifestFilter]} - whil components are exepected to have exactly 2 properties [JSon] properties.";
        throw new Error(errMsg);
      }
      if (component.name === undefined || component.name === "") {
        let errMsg = "{[SingleExecutionManifestFilter]} - The component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += "{[SingleExecutionManifestFilter]} - 'name' [JSon] property is undefined, while Gravitee [components] are exepected to";
        errMsg += "{[SingleExecutionManifestFilter]} - have a 'name' [JSon] property that neither is undefined, nor an empty string.";
        throw new Error(errMsg);
      }
      if (component.version === undefined || component.name === "") {
        let errMsg = "{[SingleExecutionManifestFilter]} - The component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += "{[SingleExecutionManifestFilter]} - 'version' [JSon] property is undefined, while Gravitee [components] are exepected to";
        errMsg += "{[SingleExecutionManifestFilter]} - have a 'version' [JSon] property that neither is undefined, nor an empty string.";
        throw new Error(errMsg);
      }

      /// now we know we have available properties 'name' and 'version' into 'component'
      let parallelExecutionSetIndexToReturn = -1;
      /// component.name

      /// double loop search into [Parallelization Constraints Matrix]
      for (let i = 0; i < this.parallelizationMatrix.length; i++) {

        this.parallelizationMatrix[i].forEach(componentName => {
          if (component.name === componentName) {
            console.debug("{[SingleExecutionManifestFilter]} - Gravitee Release Orchestrator searches for " + `${componentName}` + " into Parallel Execution Set no. ["+ `${i}` + "] : ");
            console.debug('');
            console.debug(`${JSON.stringify(component, null, "  ")}`);
            console.debug('');
            console.debug('--- ');
            console.debug('');
            parallelExecutionSetIndexToReturn = i;
            let foundMsg = "{[SingleExecutionManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [" + `${parallelExecutionSetIndexToReturn}` + "] for the following component : \n";
            foundMsg += `${JSON.stringify(component, null, "  ")}`;
            foundMsg += " ";
            console.info(foundMsg);
          }
        });
      }

      /// Index must not be out of bounds of the [parallelizationMatrix]
      /// Index must not be negative
      if (parallelExecutionSetIndexToReturn < 0) {
        let errMsg = `{[SingleExecutionManifestFilter]} - Gravitee Release Orchestrator could not determine which Parallel Execution Set Index for the following component (do they appear in the [buildDependencies] in the [${manifestPath}] ? ) : `;
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += " ";
        throw new Error(errMsg)
      }
      /// Index must not be strictly less than the [this.parallelizationMatrix] array length
      if (parallelExecutionSetIndexToReturn > this.parallelizationMatrix.length - 1) {

        let errMsg = "{[SingleExecutionManifestFilter]} - [Parallel Execution Set Index] out of bounds Exception"
        errMsg += "{[SingleExecutionManifestFilter]} - Gravitee Release Orchestrator determined the Parallel Execution Set Index of the following component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += " is [" + `${parallelExecutionSetIndexToReturn}` + "] ";
        errMsg += " while the [Parallelization Constraints Matrix] defines the highest index to  [" + `${this.parallelizationMatrix.length - 1}` + "] ";

        throw new Error(errMsg)
      }
      return parallelExecutionSetIndexToReturn;
    }
    /**
     * Loads the Release Manifest from the filesystem
     * Checks :
     * => if the file exists,
     * => if it contains a valid JSON,
     *
     **/
    loadProcessManifest()  : void {
      if (!fs.existsSync(manifestPath)) {
        throw new Error("{[SingleExecutionManifestFilter]} - [" + `${manifestPath}` + "] does not exists, stopping the CICD process");
      } else {
        console.log("{[SingleExecutionManifestFilter]} - found Process manifest located at [" + manifestPath + "]");
      }
      console.info("{[SingleExecutionManifestFilter]} - Parsing Process Manifest file located at [" + manifestPath + "]");
      console.debug("{[SingleExecutionManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.processManifest, null, "  ")}` + "]");
      let manifestAsString: string = fs.readFileSync(`${manifestPath}`,'utf8');
      this.processManifest = JSON.parse(manifestAsString);
    }

}
export let companyName:string = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
