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
import axios from 'axios';
/// import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import * as fs from 'fs';
export const manifestPath : string = process.env.RELEASE_MANIFEST_PATH;
/**
 *
 * Responsible to persist the state of the Release CI CD Process
 * by commit and push to the https://github.com/${GITHUB_ORG}/release.git Github Git Repo
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
    let shellCommandResult = shelljs.exec("pwd && ls -allh");
    if (shellCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [pwd && ls -allh] shell command. Shell error was [" + shellCommandResult.stderr + "] ")
    } else {
      // shellCommandStdOUT = shellCommandResult.stdout;
    }


    /// ---- Now here is how to EDIT THE [release.json] JSON FILE

    /// modify loaded JSON  for each component (remove the -SNAPSHOT suffix for
    /// version property of each of those components)
    for (let i = 0; i < component_names.length; i++) {
      let currCompoenentIndex = this.getComponentIndex(component_names[i]);
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf(component_names: string[]): void] removing [-SNAPSHOT] suffix for component [${this.releaseManifest.components[currCompoenentIndex]}] `)
      this.releaseManifest.components[currCompoenentIndex].version = this.removeSnapshotSuffix(this.releaseManifest.components[currCompoenentIndex].version);
    }
    /// and write the modified JSON back to the file
    /*
    fs.writeFile(`${manifestPath}`, JSON.stringify(this.releaseManifest), function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(this.releaseManifest));
      console.log('{[ReleaseProcessStatePersistenceManager]} - writing to ' + `${manifestPath}`);
    });*/
    fs.writeFile(`${manifestPath}`, JSON.stringify(this.releaseManifest), ((err) => {
      if (err) return console.log(err);
      console.log(JSON.stringify(this.releaseManifest));
      console.log('{[ReleaseProcessStatePersistenceManager]} - writing to ' + `${manifestPath}`);
    }).bind(this));
    
    let commit_message: string = `CI CD Orchestrator Release process state update of [${component_names.length}] successfullly released`
    let gitCOMMITCommandResult = shelljs.exec(`cd pipeline/ && git add --all`);
    if (gitCOMMITCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git add --all && git commit -m '${commit_message}'] shell command. Shell error was [" + gitCOMMITCommandResult.stderr + "] ")
    } else {
      // gitCommandStdOUT = gitCOMMIT_AND_PUSHCommandResult.stdout;
    }
    /// -
    let gitCommandResult = shelljs.exec("cd pipeline/ && git remote -v && git status");
    if (gitCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git remote -v && git status] shell command. Shell error was [" + gitCommandResult.stderr + "] ")
    } else {
      let gitCommandStdOUT: string = gitCommandResult.stdout;
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf] : `);
      console.log(gitCommandStdOUT);
    }
  }
  /**
   * call this method, to commit all added changes to the release repo (to the release.json), and git push
   **/
  commitAndPush(): void {

    /// -
    let shellCommandResult = shelljs.exec("pwd && ls -allh");
    if (shellCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [pwd && ls -allh] shell command. Shell error was [" + shellCommandResult.stderr + "] ")
    } else {
      // shellCommandStdOUT = shellCommandResult.stdout;
    }
    /// -
    let gitCommandResult = shelljs.exec("cd pipeline/ && git remote -v && git status");
    if (gitCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git remote -v && git status] shell command. Shell error was [" + gitCommandResult.stderr + "] ")
    } else {
      let gitCommandStdOUT: string = gitCommandResult.stdout;
      console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf] : `);
      console.log(gitCommandStdOUT);
    }


    let commit_message: string = `CI CD Orchestrator Release process state update of successfullly released components`
    let gitCOMMITCommandResult = shelljs.exec(`cd pipeline/ && git commit -m '${commit_message}'`);
    if (gitCOMMITCommandResult.code !== 0) {
      throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git add --all && git commit -m '${commit_message}'] shell command. Shell error was [" + gitCOMMITCommandResult.stderr + "] ")
    } else {
      // gitCommandStdOUT = gitCOMMIT_AND_PUSHCommandResult.stdout;
    }

    /// pushing to git if and only if  DRY RUN MODE is off (if this is a "fully fledged" release, not a dry run)
    if (process.argv["dry-run"] === 'false') {
      let gitPUSHCommandResult = shelljs.exec(`cd pipeline/ && git push -u origin HEAD`);
      if (gitPUSHCommandResult.code !== 0) {
        throw new Error("{[ReleaseProcessStatePersistenceManager]} - An Error occurred executing the [git push -u origin HEAD] shell command. Shell error was [" + gitPUSHCommandResult.stderr + "] ")
      } else {
        let gitPUSHCommandStdOUT: string = gitPUSHCommandResult.stdout;
        console.log(gitPUSHCommandStdOUT);
        console.log(`{[ReleaseProcessStatePersistenceManager]} - [persistSuccessStateOf] ${commit_message}: `)
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
        throw new Error(`{[ReleaseProcessStatePersistenceManager]} - Provided maven version number does not end wiht the [-SNAPSHOT] suffix, but was expected to`);
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
