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
// export const manifestPath : string = "release-data/apim/1.30.x/tests/release.json";
export const manifestPath : string = process.env.RELEASE_MANIFEST_PATH;

/**
 * Filters Gravitee components to release and builds an Execution Plan.
 * @comment All methods are synchronous
 **/
export class ReleaseManifestFilter {
    /**
     * [gravitee_release_branch] must match one the of the existing branch on
     **/
    gravitee_release_branch: string;
    gravitee_release_version: string;
    releaseManifest: any;
    selectedComponents : any;
    parallelizationConstraintsMatrix: any[][];
    executionPlan : any [][];
    constructor(release_version: string, release_branch: string) {
        this.loadReleaseManifest();
        this.loadParallelizationContraints();
        // console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");

        this.gravitee_release_version = release_version;
        this.gravitee_release_branch = release_branch;
        this.selectedComponents = { "components" : []};
        this.initializeExecutionPlan();
        /// throw new Error('DEBUG POINT to reove asap');
    }
    /**
     * initializes the execution plan, to :
     * <ul>
     * <li> an emply execution plan, </li>
     * <li> which is an array of arrays, </li>
     * <li> which is not an empty array, but an array of <pre>N</pre> empty arrays, where <pre>N</pre> is the length of {@see this.parallelizationConstraintsMatrix} </li>
     * </ul>
     **/
    initializeExecutionPlan () : void {
      this.executionPlan = [];
      console.debug("{[ReleaseManifestFilter]} - Initializing Empty Execution Plan from Parallelization Constraints Matrix... ");
      for (let i = 0; i < this.parallelizationConstraintsMatrix.length; i++) {
        let newEntry = [ ];
        this.executionPlan.push(newEntry);
      }
      console.debug("{[ReleaseManifestFilter]} - Initialized Empty Execution Plan with " + `${this.executionPlan.length}` + " empty arrays : ");
      console.log('[');
      this.executionPlan.forEach(executionSet => {
        console.log('  [');
        console.log('    ' + arrayUtils.inspect(`${executionSet}`, { maxArrayLength: null }));
        console.log('  ],');
      });
      console.log(']');
    }
    loadParallelizationContraints() : void {
      console.debug("{[ReleaseManifestFilter]} - Loading Parallelization Constraints Matrix from Release Manifest... ");
      this.parallelizationConstraintsMatrix = this.releaseManifest.buildDependencies
      console.debug("{[ReleaseManifestFilter]} - Loaded Parallelization Constraints Matrix from Release Manifest : ");
      // console.debug(`${this.parallelizationConstraintsMatrix}`);
      console.log('[');

      this.parallelizationConstraintsMatrix.forEach(executionSet => {
        console.log('  [');
        console.log('    ' + arrayUtils.inspect(`${executionSet}`, { maxArrayLength: null }));
        console.log('  ],');
      });
      console.log(']');
    }
    /**
     * Filters the releaseManifest Release manifest file to
     * Populate [this.selectedComponents] with the components that should be included in the release
     **/
    filter() : void {
      console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");
      if (!this.releaseManifest.hasOwnProperty('version')) {
        throw new Error("The [release.json] file does not have a 'version' JSON property. It should, cannot proceed with CI CD Release Process.");
      }
      this.releaseManifest.components.forEach(component => {
        if (!component.hasOwnProperty('version')) {
          component.version = this.releaseManifest.version; // infer version from release manifest top level version JSON Property, as of [https://github.com/gravitee-lab/GraviteeCiCdOrchestrator/issues/26]
        }
        if (component.version.includes('-SNAPSHOT')) {
          console.info('');
          /// console.debug("[{CircleCiOrchestrator}] - processing filter selected component : ");
          /// console.debug(`${JSON.stringify(component, null, "  ")}`);
          /// selectedComponents.push(component);
          this.selectedComponents.components.push(component);
          console.info('');
        }
      });
      console.debug("{[ReleaseManifestFilter]} - Selected components are [" + `${JSON.stringify(this.selectedComponents, null, "  ")}` + "]");
    }
    /**
     * <p>
     * Generates the Execution plan using [this.selectedComponents()] with the components that should be included in the release :
     * <p>
     * <ul>
     * <li>The 2-dim. Array has the exact same structure as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git)</li>
     * <li>The 2-dim. Array has the exact same entries than the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git), only  structure as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git), only all dependencies that do not require processing release, were removed as Array entries.</li>
     * <li>The 2-dim. Array has the exact same length as the 'buildDependencies' JSON property in the release.json (from https://github.com/gravitee-io/release.git), only some entries are empty arrays (not undefined, but of length zero)</li>
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
      console.info("{[ReleaseManifestFilter]} - EXECUTION PLAN is the value of the 'built_execution_plan_is' below : ");
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
      console.info("{[ReleaseManifestFilter]} - EXECUTION PLAN is the value of the 'built_execution_plan_is' below : ");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info(" ---");
      console.info(JSON.stringify({ built_execution_plan_is: this.executionPlan}, null, " "));
      console.info(" ---");
      console.info('+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x')
      console.info("");

      try {
        // in the ./pipeline folder, because the ./pipeline folder is a docke rmapped volume
        fs.writeFileSync(`./pipeline/.circleci/release.bom`, `${JSON.stringify({ built_execution_plan_is: this.executionPlan}, null, " ")}`, {}); // no options
        console.log(`{[ReleaseManifestFilter]} - successfully generated [./pipeline/.circleci/release.bom]`);
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log(`{[ReleaseManifestFilter]} - An Error occurred writing to [.circleci/release.bom] to generate the release BOM`);
        console.error(err);
        throw err;
      }
      /// return this.executionPlan
    }
    /**
     * This method lokks up the [this.parallelizationConstraintsMatrix] ("Parallelization Constraints Matrix") to determine what is the Parallelization Execution Set Index of {@argument component}
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
        let errMsg = "{[ReleaseManifestFilter]} - The component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += "{[ReleaseManifestFilter]} - has a total of " + `${Object.keys(component).length}` +" [JSon] properties.";
        errMsg += "{[ReleaseManifestFilter]} - whil components are exepected to have exactly 2 properties [JSon] properties.";
        throw new Error(errMsg);
      }
      if (component.name === undefined || component.name === "") {
        let errMsg = "{[ReleaseManifestFilter]} - The component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += "{[ReleaseManifestFilter]} - 'name' [JSon] property is undefined, while Gravitee [components] are exepected to";
        errMsg += "{[ReleaseManifestFilter]} - have a 'name' [JSon] property that neither is undefined, nor an empty string.";
        throw new Error(errMsg);
      }
      if (component.version === undefined || component.name === "") {
        let errMsg = "{[ReleaseManifestFilter]} - The component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += "{[ReleaseManifestFilter]} - 'version' [JSon] property is undefined, while Gravitee [components] are exepected to";
        errMsg += "{[ReleaseManifestFilter]} - have a 'version' [JSon] property that neither is undefined, nor an empty string.";
        throw new Error(errMsg);
      }

      /// now we know we have available properties 'name' and 'version' into 'component'
      let parallelExecutionSetIndexToReturn = -1;
      /// component.name

      /// double loop search into [Parallelization Constraints Matrix]
      for (let i = 0; i < this.parallelizationConstraintsMatrix.length; i++) {

        this.parallelizationConstraintsMatrix[i].forEach(componentName => {
          if (component.name === componentName) {
            console.debug("{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for " + `${componentName}` + " into Parallel Execution Set no. ["+ `${i}` + "] : ");
            console.debug('');
            console.debug(`${JSON.stringify(component, null, "  ")}`);
            console.debug('');
            console.debug('--- ');
            console.debug('');
            parallelExecutionSetIndexToReturn = i;
            let foundMsg = "{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [" + `${parallelExecutionSetIndexToReturn}` + "] for the following component : \n";
            foundMsg += `${JSON.stringify(component, null, "  ")}`;
            foundMsg += " ";
            console.info(foundMsg);
          }
        });
      }

      /// Index must not be out of bounds of the [parallelizationConstraintsMatrix]
      /// Index must not be negative
      if (parallelExecutionSetIndexToReturn < 0) {
        let errMsg = "{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could not determine which Parallel Execution Set Index for the following component (do they appear in the [buildDependencies] in the [release.json] ? ) : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += " ";
        throw new Error(errMsg)
      }
      /// Index must not be strictly less than the [this.parallelizationConstraintsMatrix] array length
      if (parallelExecutionSetIndexToReturn > this.parallelizationConstraintsMatrix.length - 1) {

        let errMsg = "{[ReleaseManifestFilter]} - [Parallel Execution Set Index] out of bounds Exception"
        errMsg += "{[ReleaseManifestFilter]} - Gravitee Release Orchestrator determined the Parallel Execution Set Index of the following component : ";
        errMsg += `${JSON.stringify(component, null, "  ")}`;
        errMsg += " is [" + `${parallelExecutionSetIndexToReturn}` + "] ";
        errMsg += " while the [Parallelization Constraints Matrix] defines the highest index to  [" + `${this.parallelizationConstraintsMatrix.length - 1}` + "] ";

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
    loadReleaseManifest()  : void {
      if (!fs.existsSync(manifestPath)) {
        throw new Error("{[ReleaseManifestFilter]} - [" + `${manifestPath}` + "] does not exists, stopping release process");
      } else {
        console.log("{[ReleaseManifestFilter]} - found release.json release manifest located at [" + manifestPath + "]");
      }
      console.info("{[ReleaseManifestFilter]} - Parsing release.json Release Manifest file located at [" + manifestPath + "]");
      console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");
      let manifestAsString: string = fs.readFileSync(`${manifestPath}`,'utf8');
      this.releaseManifest = JSON.parse(manifestAsString);

      /**
       * If the Stage is nexus staging, then we add again the [-SNAPSHOT] suffixes
       *
       *
       **/
       /*
       if (process.argv["cicd-stage"] === 'mvn_nexus_staging') {
         console.log(`{[ReleaseManifestFilter]} - [loadReleaseManifest(): void] adding again [-SNAPSHOT] suffix for components to deploy to Nexus Staging.`)
         this.prepareManifestForNexusStaging();
         console.debug("{[ReleaseManifestFilter]} - Prepared Manifest is : ");
         console.debug(this.releaseManifest);
       }
       */

       if (process.argv["cicd-stage"] === 'mvn_nexus_staging') {
         /// -- add again the [-SNAPSHOT] suffix go rallmaven released dev repos.
         let releaseForNexusStaging = `${this.removeSnapshotSuffix(this.releaseManifest.version)}`
         for (let currComponentIndex = 0; currComponentIndex < this.releaseManifest.components.length; currComponentIndex++) {
           if (`${this.releaseManifest.components[currComponentIndex].since}` === `${releaseForNexusStaging}`) {
             console.log(`{[ReleaseManifestFilter]} - [prepareManifestForNexusStaging(): void] adding again [-SNAPSHOT] suffix for componentsto deploy to Nexus Staging.`)
             ///
             this.releaseManifest.components[currComponentIndex].version = `${this.releaseManifest.components[currComponentIndex].version}-SNAPSHOT`;
           }
         }
         /// -- merge all buildDependencies
         let mergedBuildDependencies = []
         for (let i = 0; i < this.releaseManifest.buildDependencies.length; i++) {
           console.log(`{[ReleaseManifestFilter]} - [prepareManifestForNexusStaging(): void] mergng all [buildDependencies].`)
           mergedBuildDependencies = mergedBuildDependencies.concat(this.releaseManifest.buildDependencies[i]);

         }
         this.releaseManifest.buildDependencies = [ mergedBuildDependencies ];
         console.debug("{[ReleaseManifestFilter]} - {Nexus Staging} - Loaded in RAM Manifest is : ");
         console.debug(this.releaseManifest);
       }
    }

    prepareManifestForNexusStaging() {
      /// -- add again the [-SNAPSHOT] suffix go rallmaven released dev repos.
      let releaseForNexusStaging = `${this.removeSnapshotSuffix(this.releaseManifest.version)}`
      for (let currComponentIndex = 0; currComponentIndex < this.releaseManifest.components.length; currComponentIndex++) {
        if (`${this.releaseManifest.components[currComponentIndex].since}` === `${releaseForNexusStaging}`) {
          console.log(`{[ReleaseManifestFilter]} - [prepareManifestForNexusStaging(): void] adding again [-SNAPSHOT] suffix for componentsto deploy to Nexus Staging.`)
          ///
          this.releaseManifest.components[currComponentIndex].version = `${this.releaseManifest.components[currComponentIndex].version}-SNAPSHOT`;
        }
      }
      if (process.argv["cicd-stage"] === 'mvn_nexus_staging') {

        /// -- merge all buildDependencies
        let mergedBuildDependencies = []
        for (let i = 0; i < this.releaseManifest.buildDependencies.length; i++) {
          console.log(`{[ReleaseManifestFilter]} - [prepareManifestForNexusStaging(): void] mergng all [buildDependencies].`)
          mergedBuildDependencies = mergedBuildDependencies.concat(this.releaseManifest.buildDependencies[i]);

        }
        this.releaseManifest.buildDependencies = [ mergedBuildDependencies ];
      }
      /// ---
      this.commitAndPushReleaseResult("{[Nexus Staging]} - adding again [-SNAPSHOT] suffix for component to deploy to Nexus Staging")
    }

    removeSnapshotSuffix(maven_version_number: string): string {
      let toReturn: string = null;
      if (maven_version_number.endsWith('-SNAPSHOT')) {
        toReturn = maven_version_number.substr(0, maven_version_number.length - 9 );
      } else {
        /// toReturn = maven_version_number;
        if (process.argv["cicd-stage"] === 'mvn_nexus_staging') {
          return maven_version_number;
        }
        let errMsg = `{[ReleaseManifestFilter]} - Provided maven version number does not end with the [-SNAPSHOT] suffix, but was expected to`;
        console.log(errMsg);
        throw new Error(errMsg);
      }
      return toReturn;
    }

    /**
     * call this method, to commit all added changes to the release repo (to the release.json), and git push
     * <code>hasThereBeenErrors</code> : if there has been no errors in the release process, this method will also reset the top version of the release manifest, to remove the [-SNAPSHOT] suffix
     **/
    commitAndPushReleaseResult(commit_message: string): void {
      /// ---                                                                 --- ///
      /// --- FIRST GIT ADD RELEASE VERSION (iff no errorsin release process) --- ///
      /// ---                                                                 --- ///

      console.log(`{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] persist [this.releaseManifest] to file`)

      // persist [this.releaseManifest] to file

      try {
        fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, {}); // no options
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log('{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] - An Error occurred writing to ' + `${manifestPath} the prepared release version`);
        console.error(err);
        throw err;
      }

      let gitADDCommandResult = shelljs.exec(`cd pipeline/ && git add ./release.json ./.gitignore`);
      if (gitADDCommandResult.code !== 0) {
        console.log(gitADDCommandResult.stdout);
        throw new Error("{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] - An Error occurred executing the [git add ./release.json ./.gitignore ] shell command. Shell error was [" + gitADDCommandResult.stderr + "] ")
      } else {
        // gitCommandStdOUT = gitADDCommandResult.stdout; // former persistSuccessStateOf
        console.log(`{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] successfully git added : `);
        console.log(gitADDCommandResult.stdout);
      }
      /// ---                                                --- ///
      /// --- NOW COMMIT AND PUSH                            --- ///
      /// ---                                                --- ///
      /// -
      console.log(`{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] Before commit and push, content of the [release.json] on filessytem, and git status are : `);
      /// -
      let shellCommandResult = shelljs.exec("cd pipeline/  && pwd && ls -allh && cat ./release.json && git status && git remote -v && git status");
      if (shellCommandResult.code !== 0) {
        let shellCommandStdOUTforErr = shellCommandResult.stdout;
        console.log(shellCommandStdOUTforErr);
        throw new Error("{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] - An Error occurred executing the [pwd && ls -allh] shell command. Shell error was [" + shellCommandResult.stderr + "] ")
      } else {
        let shellCommandStdOUT = shellCommandResult.stdout;
        console.log(shellCommandStdOUT);
      }

      // let commit_message: string = `CI CD Orchestrator Release process state update of successfullly released components`

      let gitCOMMITCommandResult = shelljs.exec(`cd pipeline/ && git commit -m \"Prepare Release (${this.releaseManifest.version}): ${commit_message}\"`);
      if (gitCOMMITCommandResult.code !== 0) {
        throw new Error("{[ReleaseManifestFilter]} - An Error occurred executing the [git add ./release.json ./.gitignore && git commit -m '${commit_message}'] shell command. Shell error was [" + gitCOMMITCommandResult.stderr + "] ")
      } else {
        // gitCOMMITCommandStdOUT = gitCOMMITCommandResult.stdout;
        console.log(`{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] successfully git commited with commit message [${commit_message}] : `);
        console.log(gitCOMMITCommandResult.stdout)
      }

      /// pushing to git if and only if  DRY RUN MODE is off (if this is a "fully fledged" release, not a dry run)
      if (`${process.argv["dry-run"]}` === 'false') {
        let gitPUSHCommandResult = shelljs.exec(`cd pipeline/ && git push -u origin HEAD`);
        if (gitPUSHCommandResult.code !== 0) {
          throw new Error("{[ReleaseManifestFilter]} - An Error occurred executing the [git push -u origin HEAD] shell command. Shell error was [" + gitPUSHCommandResult.stderr + "] ")
        } else {
          let gitPUSHCommandStdOUT: string = gitPUSHCommandResult.stdout;
          console.log(gitPUSHCommandStdOUT);
          console.log(`{[ReleaseManifestFilter]} - [commitAndPush(commit_message: string): void] successfully pushed to remote git repo with commit message [${commit_message}] : `);

        }
      }

    }
}
export let companyName:string = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
