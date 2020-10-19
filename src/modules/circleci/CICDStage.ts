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
import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import { CircleCIClient } from '../../modules/circleci/CircleCIClient'
import * as fs from 'fs';

/**
 * Factorizes what is common to all CI CD Process Stages
 **/
export class CICDStage {

     circleci_client: CircleCIClient;
     secrets: CircleCISecrets;
     /// 2 following properties so that every stage is "aware of the git context where it runs"
     gh_org: string;
     repo_name: string;
     git_branch: string;

     contructor() {
       this.loadCircleCISecrets();
       this.circleci_client = new CircleCIClient();
       this.resolveCciSlug();
     }


     /**
      * Wet-Executes this CI CD Process stage
      **/
     public execute (): void {

     }

     /**
      * Dry Run Executes this CI CD Process stage
      * See GNU Option [--dry-run]
      **/
     public executeDry(): void {

     }


     /**
      *
      * Will use [shelljs] and git commands to determine the [gh_org],the git [repo_name], and
      * the [git_branch], which the Pull Request Bot will use to trigger workflows in the
      * current pipeline Git Context, from Zero Configuration.
      *
      **/
     resolveCciSlug() {

       let GIT_REPO_SSH_OR_HTTP_URI: string = null;
       let gitRemoteCommandResult = shelljs.exec("git remote -v |grep '(fetch)' | awk '{print $2}'");
       if (gitRemoteCommandResult.code !== 0) {
         throw new Error("An Error occurred executing the [git remote -v |grep '(fetch)' | awk '{print $2}'] shell command. Shell error was [" + gitRemoteCommandResult.stderr + "] ")
       } else {
         GIT_REPO_SSH_OR_HTTP_URI = gitRemoteCommandResult.stdout;
       }
       if (GIT_REPO_SSH_OR_HTTP_URI.startsWith('git@')) {
         GIT_REPO_SSH_OR_HTTP_URI.split(':')[1]
         this.gh_org = GIT_REPO_SSH_OR_HTTP_URI.split(':')[1].split('/')[0];
         this.repo_name = GIT_REPO_SSH_OR_HTTP_URI.split(':')[1].split('/')[1].split('.git')[0];
       } else { /// Then the GIT URI is an HTTPS URI
         this.gh_org = GIT_REPO_SSH_OR_HTTP_URI.split('/')[3]
         this.repo_name = GIT_REPO_SSH_OR_HTTP_URI.split('/')[4].split('.git')[0];
       }

       let gitBranchCommandResult = shelljs.exec("git branch -a |grep '*' | awk '{print $2}'");
       if (gitBranchCommandResult.code !== 0) {
         throw new Error("An Error occurred executing the [git branch -a |grep '*' | awk '{print $2}'] Shell command. Shell error was [" + gitBranchCommandResult.stderr + "] ")
       } else {
         this.git_branch = gitBranchCommandResult.stdout;
       }

     }

     loadCircleCISecrets () : void { ///     private secrets: CircleCISecrets;
       /// first load the secretfile

       let secretFileAsString: string = fs.readFileSync(process.env.SECRETS_FILE_PATH,'utf8');
       this.secrets = JSON.parse(secretFileAsString);
       console.debug('');
       console.debug("[{CircleCiOrchestrator}] - secrets file content :");
       console.debug('');
       console.debug(this.secrets)
       console.debug('');

     }
}
