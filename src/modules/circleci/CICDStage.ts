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
       this.circleci_client = new CircleCIClient(this.secrets);
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
