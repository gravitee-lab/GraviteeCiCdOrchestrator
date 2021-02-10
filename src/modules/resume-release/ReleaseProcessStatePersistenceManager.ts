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
/// import axios from 'axios';
/// import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import * as fs from 'fs';
export const manifestPath : string = process.env.RELEASE_MANIFEST_PATH;
const semver = require('semver');
/**
 *
 * Responsible to persist the state of the Release CI CD Process
 * by commit and push to the https://github.com/${GITHUB_ORG}/release.git Github Git Repo
 *
 * Idea : I might rename this guy "GitOperator", it would have an interface an a different implementation for each Cicd Process : a Cicd release, or any other Cicd Process....
 **/
export class ReleaseProcessStatePersistenceManager {

  private successfullyReleasedComponents: string[];

  releaseManifest: any;
  constructor() {
    this.loadReleaseJSon();
    this.successfullyReleasedComponents = []
  }

  /**
   * Checks :
   * => if the file exists,
   * => if it contains a valid JSON,
   *
   **/
  loadReleaseJSon()  : void {
    if (!fs.existsSync(manifestPath)) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - [" + `${manifestPath}` + "] does not exists, stopping release process");
    } else {
      console.log("{[ReleaseProcessStatePersistenceManager]} - found release.json release manifest located at [" + manifestPath + "]");
    }
    // console.info("{[ReleaseProcessStatePersistenceManager]} - Parsing release.json Release Manifest file located at [" + manifestPath + "]");
    // console.debug("{[ReleaseProcessStatePersistenceManager]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");
    let manifestAsString: string = fs.readFileSync(`${manifestPath}`,'utf8');
    this.releaseManifest = JSON.parse(manifestAsString);
  }

  tagReleaseStart(tag_message: string): void {
    /// let tag_id = `RELEASE_${this.removeSnapshotSuffix(this.releaseManifest.version)}_START`
    let tag_id = `${this.removeSnapshotSuffix(this.releaseManifest.version)}_START` /// when sorting tags, the start tag and its associated release tag, will be next to each other.

    /// In case oof a resume release, we first check if the tag already exists on the release repo
    let isThisAResumeRelease: boolean = false;

    let isThisAResumeReleaseCmdResult = shelljs.exec(`cd pipeline/ && git tag -l | grep ${tag_id}`);
    if (isThisAResumeReleaseCmdResult.code !== 0) {
      // throw new Error(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] - An Error occurred executing the [git tag -l | grep ${tag_id}] shell command. Shell error was [` + isThisAResumeReleaseCmdResult.stderr + "] ")
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] - the [${tag_id}] git tag does not exists, so this is not a resume release`)
    } else {
      let isThisAResumeReleaseCmdStdOUT: string = isThisAResumeReleaseCmdResult.stdout;
      isThisAResumeReleaseCmdStdOUT = isThisAResumeReleaseCmdStdOUT.trim();
      isThisAResumeRelease = ( tag_id === isThisAResumeReleaseCmdStdOUT);
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] - QUICK DEBUG : [tag_id=[${tag_id}]] [isThisAResumeReleaseCmdStdOUT=[${isThisAResumeReleaseCmdStdOUT}]] and [isThisAResumeReleaseCmdResult.stdout=[${isThisAResumeReleaseCmdResult.stdout}]]`)
    }
    if (!isThisAResumeRelease) {

      console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] Marking Release start with tag [${tag_id}] - [tag_message="${tag_message}"] `)
      /// -
      let gitCommandResult = shelljs.exec(`cd pipeline/ && git remote -v && git tag ${tag_id} -m "${tag_message}"`);
      if (gitCommandResult.code !== 0) {
        throw new Error(`{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git remote -v && git tag -m "${tag_message}"] shell command. Shell error was [` + gitCommandResult.stderr + "] ")
      } else {
        let gitCommandStdOUT: string = gitCommandResult.stdout;
        console.log(gitCommandStdOUT);
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] Sucessfully tagged [${tag_id}] with [tag_message="${tag_message}"] `);
      }

      /// pushing tags to git repo if and only if  DRY RUN MODE is off (if this is a "fully fledged" release, not a dry run)
      if (`${process.argv["dry-run"]}` === 'false') {
        let gitPUSHCommandResult = shelljs.exec(`cd pipeline/ && git push -u origin --tags`);
        if (gitPUSHCommandResult.code !== 0) {
          throw new Error("{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] - An Error occurred executing the [git push -u origin --tags] shell command. Shell error was [" + gitPUSHCommandResult.stderr + "] ")
        } else {
          let gitPUSHCommandStdOUT: string = gitPUSHCommandResult.stdout;
          console.log(gitPUSHCommandStdOUT);
          console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] Sucessfully pushed Release start tag [${tag_id}] - [tag_message="${tag_message}"] `)
        }
      } else {
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] dry run is TRUE`);
      }
    } else {
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] This is a resume release tag [${tag_id}] - already exiwsts on repo `)
    }
  }
  tagReleaseFinish(tag_message: string): void {
    let tag_id = `${this.releaseManifest.version}`
    console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseFinish(tag_message: string): void] Marking Release start with tag [${tag_id}] - [tag_message="${tag_message}"] `)
    /// -
    let gitCommandResult = shelljs.exec(`cd pipeline/ && git remote -v && git tag ${tag_id} -m "Release (${tag_id}): ${tag_message}"`);
    if (gitCommandResult.code !== 0) {
      throw new Error(`{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git remote -v && git tag -m "${tag_message}"] shell command. Shell error was [` + gitCommandResult.stderr + "] ")
    } else {
      let gitCommandStdOUT: string = gitCommandResult.stdout;
      console.log(gitCommandStdOUT);
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseFinish(tag_message: string): void] Sucessfully tagged [${tag_id}] with [tag_message="${tag_message}"] `);
    }

    /// pushing tags to git repo if and only if  DRY RUN MODE is off (if this is a "fully fledged" release, not a dry run)
    if (`${process.argv["dry-run"]}` === 'false') {
      let gitPUSHCommandResult = shelljs.exec(`cd pipeline/ && git push -u origin --tags`);
      if (gitPUSHCommandResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - [tagReleaseStart(tag_message: string): void] - An Error occurred executing the [git push -u origin --tags] shell command. Shell error was [" + gitPUSHCommandResult.stderr + "] ")
      } else {
        let gitPUSHCommandStdOUT: string = gitPUSHCommandResult.stdout;
        console.log(gitPUSHCommandStdOUT);
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseFinish(tag_message: string): void] Sucessfully pushed Release tag [${tag_id}] - [tag_message="${tag_message}"] `)
      }
    } else {
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [tagReleaseFinish(tag_message: string): void] dry run is TRUE`);
    }
  }

  /**
   * Invoke this method after you have invoked the following two methods :
   * => commitAndPushRelease(`Release finished`) : to commit and push all changes to [release.json] file
   * => tagReleaseFinish(`Release published`) : to tag the release
   *
   **/
  prepareNextVersion(): void {

    /// ---                                                --- ///
    /// --- FIRST DETERMINE WHAT IS THE CURRENT GIT BRANCH --- ///
    /// ---                                                --- ///

    let gitBranchCommandResult = shelljs.exec(`cd pipeline/ && git branch -a | grep '*' | awk '{print $2}'`);
    let currentBranch = null;
    if (gitBranchCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git add --all ] shell command. Shell error was [" + gitBranchCommandResult.stderr + "] ")
    } else {
      // gitCommandStdOUT = gitADDCommandResult.stdout; // former persistSuccessStateOf
      currentBranch = `${gitBranchCommandResult.stdout}`;
      currentBranch = currentBranch.trim();
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] currentBranch is : [${currentBranch}] `);
    }

    /// --- --- --- --- --- --- --- --- --- --- --- --- --- --- ///
    /// ---                                                 --- ///
    /// --- + If this is a minor version :
    /// ---   => on master branch, we create a new support branch, and we prepare the nextPatchVersion on support Branch
    /// ---   => then, we go back to master branch, and prepare nextMinorVersion
    /// --- + If this is a patch version :
    /// ---   => then we already are on the support branch, and we prepare the nextPatchVersion on support Branch
    /// ---                                                 --- ///
    /// --- --- --- --- --- --- --- --- --- --- --- --- --- --- ///
    // we reload the [release.json] which was modified, and git commited and pushed
    this.loadReleaseJSon();
    if ( `${currentBranch}` === 'master' ) { // then this is a minor release
      // -- 1. create new support branch
      let nextSupportBranch = `${semver.major(this.releaseManifest.version)}.${semver.minor(this.releaseManifest.version)}.x`;
      let gitCreateSupportBranchCmdResult = shelljs.exec(`cd pipeline/ && git checkout -b ${nextSupportBranch} && git push -u origin --all`);
      if (gitCreateSupportBranchCmdResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred executing the [git checkout -b ${nextSupportBranch} && git push -u origin --all] shell command. Shell error was [" + gitCreateSupportBranchCmdResult.stderr + "] ")
      } else {
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] successfully created the nex support branch [${nextSupportBranch}] : `);
        console.log(gitCreateSupportBranchCmdResult.stdout);
      }
      // git commit and push next Patch Version on the new support branch
      let nextPatchVersion = `${semver.major(this.releaseManifest.version)}.${semver.minor(this.releaseManifest.version)}.1-SNAPSHOT`;
      this.releaseManifest.version = nextPatchVersion;
      try {
        fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, {}); // no options
        console.log('{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - Successfully wrote to ' + `[${manifestPath}] to prepare next patch version on [${nextSupportBranch}] new support branch  `);
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log('{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred writing to ' + `[${manifestPath}] to prepare next patch version on [${nextSupportBranch}] new support branch  `);
        console.error(err);
        throw err;
      }
      // git add, commit and push the next patch version
      let prepareNextPatchVersionCmdResult = shelljs.exec(`cd pipeline/ && git add --all && git commit -m "prepare next patch version" && git push -u origin HEAD`);
      if (prepareNextPatchVersionCmdResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git checkout -b ${nextSupportBranch} && git push -u origin --all] shell command. Shell error was [" + prepareNextPatchVersionCmdResult.stderr + "] ")
      } else {
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] successfully prepared the next patch version on the new support branch [${nextSupportBranch}] : `);
        console.log(prepareNextPatchVersionCmdResult.stdout);
      }
      // -- 2. go back to master branch to prepare next Minor Version
      // go back to master branch
      let goBackToMasterBranchCmdResult = shelljs.exec(`cd pipeline/ && git checkout master`);
      if (prepareNextPatchVersionCmdResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred executing the [git checkout -b ${nextSupportBranch} && git push -u origin --all] shell command. Shell error was [" + goBackToMasterBranchCmdResult.stderr + "] ")
      } else {
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] successfully switched backto master branch`);
        console.log(goBackToMasterBranchCmdResult.stdout);
      }
      this.loadReleaseJSon(); // reload the [release.json], as it is on master
      let nextMinorVersion = `${semver.inc(`${this.releaseManifest.version}`, 'minor')}-SNAPSHOT`;
      this.releaseManifest.version = nextMinorVersion;
      try {
        fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, {}); // no options
        console.log('{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - Successfully wrote to ' + `[${manifestPath}] to prepare next minor version [${nextMinorVersion}] on [master] branch`);
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log('{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred writing to ' + `[${manifestPath}] to prepare next minor version [${nextMinorVersion}] on [master] branch`);
        console.error(err);
        throw err;
      }
      // git add, commit and push the next minor version
      let prepareNextMinorVersionCmdResult = shelljs.exec(`cd pipeline/ && git add --all && git commit -m "prepare next minor version" && git push -u origin HEAD`);
      if (prepareNextMinorVersionCmdResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred executing the [git add --all && git commit -m \"prepare next minor version\" && git push -u origin HEAD] shell command. Shell error was [" + prepareNextMinorVersionCmdResult.stderr + "] ")
      } else {
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] successfully prepared the next minor version [${nextMinorVersion}] on the [master] branch : `);
        console.log(prepareNextMinorVersionCmdResult.stdout);
      }

    } else { // then this is a patch release
      // this.loadReleaseJSon(); // already reloaded the [release.json], as it was modified, git commit and pushed by the release process

      // git commit and push next Patch Version on the new support branch
      let nextPatchVersion = `${semver.inc(`${this.releaseManifest.version}`, 'patch')}-SNAPSHOT`;
      this.releaseManifest.version = nextPatchVersion;
      try {
        fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, {}); // no options
        console.log('{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - Successfully wrote to ' + `[${manifestPath}] to prepare next patch version [${nextPatchVersion}] on [${currentBranch}] new support branch  `);
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log('{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred writing to ' + `[${manifestPath}] to prepare next patch version [${nextPatchVersion}] on [${currentBranch}] new support branch  `);
        console.error(err);
        throw err;
      }
      // git add, commit and push the next patch version
      let prepareNextPatchVersionCmdResult = shelljs.exec(`cd pipeline/ && git add --all && git commit -m "prepare next patch version" && git push -u origin HEAD`);
      if (prepareNextPatchVersionCmdResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] - An Error occurred executing the [git checkout -b ${nextSupportBranch} && git push -u origin --all] shell command. Shell error was [" + prepareNextPatchVersionCmdResult.stderr + "] ")
      } else {
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [prepareNextVersion(): void] successfully prepared the next patch version on the new support branch [${currentBranch}] : `);
        console.log(prepareNextPatchVersionCmdResult.stdout);
      }
    }

  }
  /**
   * This method removes the `-SNAPSHOT` suffix for each of the <code>component_name</code>, in the  [release.json], for the component names array provided, on the current git branch, of the https://github.com/${GITHUB_ORG}/release.git Github Git Repo
   * TODO : Implementation à terminer :ajouter les execptions pour lecas oùlesnoms de components ne soient pas retrouvés dans le [release.json]
   *
   * @argument component_names  {@type string[]} Anarray of strings, each string being the name of one component which release has sucessfully completed
   * -----
   * -----
   *
   *
   * @returns void
   **/
  /// The git branch of the release repo is un-necessary, it is assumed to
  /// already be (git) checked out in the PWD where the Orchestrator runs.
  /// ---
  persistSuccessStateOf(component_names: string[]): void {
    console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf] components array passed is: `)
    console.log(component_names);
    for(let i=0; i < component_names.length; i++) {
      this.successfullyReleasedComponents.push(component_names[i])
    }
    /// -

    /// modify loaded JSON  for each component (remove the -SNAPSHOT suffix for
    /// version property of each of those components)
    for (let i = 0; i < component_names.length; i++) {
      let currComponentIndex = this.getComponentIndex(component_names[i]);
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf(component_names: string[]): void] removing [-SNAPSHOT] suffix for component :`)
      console.log(this.releaseManifest.components[currComponentIndex]);
      this.releaseManifest.components[currComponentIndex].version = this.removeSnapshotSuffix(this.releaseManifest.components[currComponentIndex].version);
      // add the [since] JSon property
      this.releaseManifest.components[currComponentIndex].since = this.removeSnapshotSuffix(this.releaseManifest.version);
    }
    /// and write the modified JSON back to the file
    console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf(commit_message: string): void] after removing [-SNAPSHOT] suffix release manifest is now :`)
    console.log(JSON.stringify(this.releaseManifest, null, 4));
    /*
    fs.writeFile(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, ((err) => {
      if (err) return console.log(err);
      console.log(JSON.stringify(this.releaseManifest, null, 4));
      console.log('{[ReleaseProcessStatePersistenceManager]} - An Error occurred writing to ' + `${manifestPath}`);
      throw err;
    }).bind(this));
    */
    // Write synchronously
    /*  */
    try {
      fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, {}); // no options
    } catch(err) {
      // An error occurred // former persistSuccessStateOf
      console.log('{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf(commit_message: string): void] - An Error occurred writing to ' + `${manifestPath}`);
      console.error(err);
      throw err;
    }

    let gitADDCommandResult = shelljs.exec(`cd pipeline/ && git add --all`);
    if (gitADDCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git add --all ] shell command. Shell error was [" + gitADDCommandResult.stderr + "] ")
    } else {
      // gitCommandStdOUT = gitADDCommandResult.stdout; // former persistSuccessStateOf
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf(commit_message: string): void] successfully git added : `);
      console.log(gitADDCommandResult.stdout);
    }

  }
  /**
   * call this method, to commit all added changes to the release repo (to the release.json), and git push
   * <code>hasThereBeenErrors</code> : if there has been no errors in the release process, this method will also reset the top version of the release manifest, to remove the [-SNAPSHOT] suffix
   **/
  commitAndPushReleaseResult(hasThereBeenErrors: boolean, commit_message: string): void {
    /// ---                                                                 --- ///
    /// --- FIRST GIT ADD RELEASE VERSION (iff no errorsin release process) --- ///
    /// ---                                                                 --- ///

    if (!hasThereBeenErrors) {
      /// ---
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] prepare release version by removing [-SNAPSHOT] suffix to the top version property in the release manifest`)

      this.releaseManifest.version = this.removeSnapshotSuffix(this.releaseManifest.version);

      try {
        fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(this.releaseManifest, null, 4)}`, {}); // no options
      } catch(err) {
        // An error occurred // former persistSuccessStateOf
        console.log('{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] - An Error occurred writing to ' + `${manifestPath} the prepared release version`);
        console.error(err);
        throw err;
      }

      let gitADDCommandResult = shelljs.exec(`cd pipeline/ && git add --all`);
      if (gitADDCommandResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] - An Error occurred executing the [git add --all ] shell command. Shell error was [" + gitADDCommandResult.stderr + "] ")
      } else {
        // gitCommandStdOUT = gitADDCommandResult.stdout; // former persistSuccessStateOf
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] successfully git added : `);
        console.log(gitADDCommandResult.stdout);
      }
    }
    /// ---                                                --- ///
    /// --- NOW COMMIT AND PUSH                            --- ///
    /// ---                                                --- ///
    /// -
    console.log(`{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] Before commit and push, content of the [release.json] on filessytem, and git status are : `);
    /// -
    let shellCommandResult = shelljs.exec("cd pipeline/  && pwd && ls -allh && cat ./release.json && git status && git remote -v && git status");
    if (shellCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] - An Error occurred executing the [pwd && ls -allh] shell command. Shell error was [" + shellCommandResult.stderr + "] ")
    } else {
      let shellCommandStdOUT = shellCommandResult.stdout;
      console.log(shellCommandStdOUT);
    }

    // let commit_message: string = `CI CD Orchestrator Release process state update of successfullly released components`

    let gitCOMMITCommandResult = shelljs.exec(`cd pipeline/ && git commit -m \"Prepare Release (${this.releaseManifest.version}): ${commit_message}\"`);
    if (gitCOMMITCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git add --all && git commit -m '${commit_message}'] shell command. Shell error was [" + gitCOMMITCommandResult.stderr + "] ")
    } else {
      // gitCOMMITCommandStdOUT = gitCOMMITCommandResult.stdout;
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] successfully git commited with commit message [${commit_message}] : `);
      console.log(gitCOMMITCommandResult.stdout)
    }

    /// pushing to git if and only if  DRY RUN MODE is off (if this is a "fully fledged" release, not a dry run)
    if (`${process.argv["dry-run"]}` === 'false') {
      let gitPUSHCommandResult = shelljs.exec(`cd pipeline/ && git push -u origin HEAD`);
      if (gitPUSHCommandResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git push -u origin HEAD] shell command. Shell error was [" + gitPUSHCommandResult.stderr + "] ")
      } else {
        let gitPUSHCommandStdOUT: string = gitPUSHCommandResult.stdout;
        console.log(gitPUSHCommandStdOUT);
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [commitAndPush(commit_message: string): void] successfully pushed to remote git repo with commit message [${commit_message}] : `);
        console.log(this.successfullyReleasedComponents);
      }
    }

  }
    /**
     * This method removes the `-SNAPSHOT` suffix for the <code>component_name</code>, in the [release.json], on the <code>git_branch</code> git branch, of the https://github.com/${GITHUB_ORG}/release.git Github Git Repo
     *
     * @argument component_name  {@type string} Blablabla
     * -----
     * -----
     *
     *
     * @returns void
     **/

    /**
     * Returns the index, in the components array in the release.json, of the component of name
     **/
    getComponentIndex(component_name: string): number {
      let indexToReturn: number = -1;
      for (let i = 0; i < this.releaseManifest.components.length; i++) {
        if ( this.releaseManifest.components[i].name == component_name ) {
          indexToReturn = i;
          break;
        }
      }
      if (indexToReturn == -1) {
        throw new Error(`{[ReleaseProcessStatePersistenceManager]} - Component of name [${component_name}] was not found in the [release.json] file at [${manifestPath}]`);
      }
      return indexToReturn;
    }
    removeSnapshotSuffix(maven_version_number: string): string {
      let toReturn: string = null;
      if (maven_version_number.endsWith('-SNAPSHOT')) {
        toReturn = maven_version_number.substr(0, maven_version_number.length - 9 );
      } else {
        /// toReturn = maven_version_number;
        let errMsg = `{[ReleaseProcessStatePersistenceManager]} - Provided maven version number does not end with the [-SNAPSHOT] suffix, but was expected to`;
        console.log(errMsg);
        throw new Error(errMsg);
      }
      return toReturn;
    }
    /**
     * This method just runs the [git remote -v] and [git status] shell commands to check the git context
     *
     * @argument arg_one  {@type string} Blablabla
     * @argument arg_two {@type string} Blablabla
     * -----
     * -----
     *
     *
     * @returns any Something
     **/
     gitTest(): void {
       /// -
       let shellCommandResult = shelljs.exec("pwd && ls -allh");
       if (shellCommandResult.code !== 0) {
         throw new Error("An Error occurred executing the [pwd && ls -allh] shell command. Shell error was [" + shellCommandResult.stderr + "] ")
       } else {
         // shellCommandStdOUT = shellCommandResult.stdout;
       }
       let gitTestCommandResult = shelljs.exec("git remote -v && git status");
       if (gitTestCommandResult.code !== 0) {
         throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git remote -v && git status] shell command. Shell error was [" + gitTestCommandResult.stderr + "] ")
       } else {
         // gitCommandStdOUT = gitCOMMIT_AND_PUSHCommandResult.stdout;
       }
     }
     /**
      * This method runs shell and git commands just to check everyhting is there (the  [release.json], the <code>git_branch</code> git branch, of the https://github.com/${GITHUB_ORG}/release.git Github Git Repo etc..)
      *
      * -----
      * -----
      *
      *
      * @returns void
      **/
     whereAmI(): void {
       console.log(`# ------------------------------------------------------`)
       console.log(`# --- [{ReleaseProcessStatePersistenceManager}]  WHERE AM I ?`)
       console.log(`# ------------------------------------------------------`)
       /// -
       let shellCommandResult = shelljs.exec("pwd && ls -allh");
       if (shellCommandResult.code !== 0) {
         throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [pwd && ls -allh] shell command. Shell error was [" + shellCommandResult.stderr + "] ")
       } else {
         // shellCommandStdOUT = shellCommandResult.stdout;
       }
       /// -
       let gitCommandResult = shelljs.exec("git remote -v && git status");
       if (gitCommandResult.code !== 0) {
         throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git remote -v && git status] shell command. Shell error was [" + gitCommandResult.stderr + "] ")
       } else {
         // gitCommandStdOUT = gitCommandResult.stdout;
       }

     }


}
