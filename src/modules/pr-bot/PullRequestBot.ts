import * as shelljs from 'shelljs';
import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import { CircleCIClient } from '../../modules/circleci/CircleCIClient'
import * as fs from 'fs';
import { CICDStage } from '../../modules/circleci/CICDStage'

export enum PR_BOT_MODE {
  DEV,
  SUPPORT,
  SECOPS,
  AUTO_DEP_UPDATES
}

/**
 *  CICD Stage : Represents the Pull Request Bot managing the Pull Request CICD Stage
 *  [--cicd-stage pull_req] GNU Option to activate
 *
 **/
export class PullRequestBot /* extends CICDStage */{

   private mode: PR_BOT_MODE;
   private circleci_client: CircleCIClient;
   private gh_org: string;
   private repo_name: string;
   private git_branch: string;
   private secrets: CircleCISecrets;

   contructor() {
     console.log('');
     console.log(`[{PullRequestBot}] - constructor begins `);
     console.log('');
     /*super.contructor();*/
     this.loadCircleCISecrets();
     this.circleci_client = new CircleCIClient(this.secrets);
     this.resolveCciSlug();
     if (this.git_branch.startsWith('support-') || this.git_branch.startsWith('lts-') || this.git_branch.startsWith('sts-')) {
       this.mode = PR_BOT_MODE.SUPPORT;
     } else if (this.git_branch.startsWith('issue-') || this.git_branch.startsWith('fix-') || this.git_branch.startsWith('feat-') || this.git_branch.startsWith('feature-')) {
       this.mode = PR_BOT_MODE.DEV
     } else if (this.git_branch.startsWith('snyk-')) {
       this.mode = PR_BOT_MODE.SECOPS
     } else if (this.git_branch.startsWith('dependabot-')) {
       this.mode = PR_BOT_MODE.AUTO_DEP_UPDATES
     }




   }

   public getMode(): PR_BOT_MODE {
     return this.mode;
   }

   /**
    * Will trigger two workflows, in workflows :
    * for both dev and suppport,startsby invoking build
    * then, will trigger SUPPORT PR REVIEW if in support mode, DEVPR REVIEW otherwise
    **/
   public execute (): void {
     ///
     /// +++ first trigger 'build' [Circle Ci] Pipeline Workflow
     /// -> (build is intended for Release Dry runs ? see
     ///    https://github.com/gravitee-io/release/issues/126#issuecomment-698026077 )
     ///

     let gio_cicd_action = 'build';
     let pipelineConfig = {
       parameters: {
          gio_action: `${gio_cicd_action}`
        },
        branch: `${this.git_branch}`
      }
      this.circleci_client.triggerCciPipeline('Jean-Baptiste-Lasselle', this.gh_org, this.repo_name, this.git_branch, pipelineConfig);

      ///
      /// +++ then trigger a different Circle CI Pipeline workflow for dev orsupport sprints.
      ///
       switch (this.getMode()) {
         case PR_BOT_MODE.DEV: {
           this.executeInDevMode();
           break;
         }
         case PR_BOT_MODE.SUPPORT: {
           this.executeInSupportMode();
           break;
         }
         default: /// PR_BOT_MODE.AUTO_DEP_UPDATES && PR_BOT_MODE.SECOPS : do nothing for the moment
           break;
       }
   }
   public executeDry() {
     console.log('Pull Request Bot Dry Run')
   }
   private executeInDevMode(): void {
     /// All I need to do here is to send one CircleCI API v2 query, to trigger the desired Circle CI Pipeline Workflow
     let gio_cicd_action = 'dev_pr_review';
     let pipelineConfig = {
       parameters: {
          gio_action: `${gio_cicd_action}`
        },
        branch: `${this.git_branch}`
      }
      this.circleci_client.triggerCciPipeline('Jean-Baptiste-Lasselle', this.gh_org, this.repo_name, this.git_branch, pipelineConfig);


   }
   private executeInSupportMode(): void {
     let gio_cicd_action = 'support_pr_review';
     let pipelineConfig = {
       parameters: {
          gio_action: `${gio_cicd_action}`
        },
        branch: `${this.git_branch}`
      }
      this.circleci_client.triggerCciPipeline('Jean-Baptiste-Lasselle', this.gh_org, this.repo_name, this.git_branch, pipelineConfig);

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

   private loadCircleCISecrets() : void { ///     private secrets: CircleCISecrets;
     /// first load the secretfile
     console.log('');
     console.log(`[{PullRequestBot}] - loading secrets file  :[${process.env.SECRETS_FILE_PATH}] `);
     console.log('');
     let secretFileAsString: string = fs.readFileSync(process.env.SECRETS_FILE_PATH,'utf8');
     this.secrets = JSON.parse(secretFileAsString);
     console.log('');
     console.log("[{PullRequestBot}] - secrets file content :");
     console.log('');
     console.log(this.secrets)
     console.log('');

   }
}
/**
 * About string Git URI String parsing :
 ----------------------------------------------
 Note: .split('.git')[0] allowstrimming the [.git] suffix if it's there
 ----------------------------------------------

 let GIT_REPO_SSH_OR_HTTP_URI1: string = 'git@github.com:gravitee-lab/poc_cci_api_one_wlfow.git'
 let GIT_REPO_SSH_OR_HTTP_URI2: string = 'https://github.com/gravitee-lab/poc_cci_api_one_wlfow.git'
 let GIT_REPO_SSH_OR_HTTP_URI3: string = 'https://github.com/gravitee-lab/poc_cci_api_one_wlfow'



 console.log(`SSH GIT_REPO_SSH_OR_HTTP_URI1 / GH_ORG => ${GIT_REPO_SSH_OR_HTTP_URI1.split(':')[1].split('/')[0]}`);
 console.log(`SSH GIT_REPO_SSH_OR_HTTP_URI1 / REPO_NAME => ${GIT_REPO_SSH_OR_HTTP_URI1.split(':')[1].split('/')[1].split('.git')[0]}`);


 console.log(`HTTP GIT_REPO_SSH_OR_HTTP_URI2 / GH_ORG => ${GIT_REPO_SSH_OR_HTTP_URI2.split('/')[3]}`);
 console.log(`HTTP GIT_REPO_SSH_OR_HTTP_URI2 / REPO_NAME => ${GIT_REPO_SSH_OR_HTTP_URI2.split('/')[4].split('.git')[0]}`);

 console.log(`HTTP GIT_REPO_SSH_OR_HTTP_URI3 / GH_ORG => ${GIT_REPO_SSH_OR_HTTP_URI3.split('/')[3]}`);
 console.log(`HTTP GIT_REPO_SSH_OR_HTTP_URI3 / REPO_NAME => ${GIT_REPO_SSH_OR_HTTP_URI3.split('/')[4].split('.git')[0]}`);

 **/
