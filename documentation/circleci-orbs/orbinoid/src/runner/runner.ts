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

export interface CircleCISecrets {
  circleci: {
    auth: {
      username: string,
      token: string
    }
  }
}

/**
 *
 * Mimics the official Circle CI cLient, only much simpler, and with [RxJS]
 * Circle CI API v2 based
 **/
export class CciCLIRunner {
    private secrets: CircleCISecrets;
    private orb_prj_folder: string;
    private package_json: any;

    constructor() {
      this.checkDependencies();
      const this_package_json: any = JSON.parse(fs.readFileSync('./package.json','utf8'));
      console.log(`{[.CciCLIRunner]} =================== `);
      console.log(`{[.CciCLIRunner]} - package.json is : `);
      console.log(`{[.CciCLIRunner]} =================== `);
      console.log(this_package_json);
      console.log(`{[.CciCLIRunner]} =================== `);
      this.package_json = this_package_json;

      this.orb_prj_folder = './orb';
      this.loadCircleCISecrets();
      let CCI_CLI_CMD: string =`${process.env.CCI_CLI_BINARY} setup --token "${this.secrets.circleci.auth.token}" --host ${process.env.CCI_SERVER} --no-prompt`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
        throw new Error('Error setting up Circle CI CLI Orb ');
        // shelljs.exit(1);
      }
      CCI_CLI_CMD =`${process.env.CCI_CLI_BINARY} diagnostic`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
        throw new Error('Error running [circleci diagnsostic] command ');
        // shelljs.exit(1);
      }

      this.runGitConfig();
    }

    loadCircleCISecrets () : void { ///     private secrets: CircleCISecrets;
      /// first load the secretfile

      let secretFileAsString: string = fs.readFileSync(process.env.CCI_SECRETS_FILE_PATH,'utf8');
      this.secrets = JSON.parse(secretFileAsString);
    }
    private checkDependencies() {
      console.log(` =============================== `);
      console.log(` = Orbinoid Dependencies Check = `);
      console.log(` =============================== `);
      console.log(` =++ [git] `);
      let CHECK_DEPENDENCY_CMD: string =`git --version`
      if (shelljs.exec(CHECK_DEPENDENCY_CMD).code !== 0) {
        shelljs.echo('Error : Orbinoid requires [git] as a dependency, and git is not installed on this system.');
        shelljs.exit(1);
      } else {
        shelljs.echo('Orbinoid [git] dependency found ');
      }
      console.log(` =++ [bash] `);
      CHECK_DEPENDENCY_CMD =`bash --version`
      if (shelljs.exec(CHECK_DEPENDENCY_CMD).code !== 0) {
        shelljs.echo('Error : Orbinoid requires the [bash] as a dependency, and [bash] is not installed on this system.');
        shelljs.exit(1);
      } else {
        shelljs.echo('Orbinoid [bash] dependency found ');
      }
      console.log(` =++ [git flow AVH Edition] `);
      CHECK_DEPENDENCY_CMD =`git flow version`
      if (shelljs.exec(CHECK_DEPENDENCY_CMD).code !== 0) {
        shelljs.echo('Error : Orbinoid requires the [git flow AVH Edition] as a dependency, and [git flow AVH Edition] is not installed on this system.');
        shelljs.exit(1);
      } else {
        shelljs.echo('Orbinoid [git flow AVH Edition] dependency found ');
      }
      console.log(` =++ [tree] `);
      CHECK_DEPENDENCY_CMD =`tree --version`
      if (shelljs.exec(CHECK_DEPENDENCY_CMD).code !== 0) {
        shelljs.echo('Error : Orbinoid requires [tree] as a dependency, and [tree] is not installed on this system.');
        shelljs.exit(1);
      } else {
        shelljs.echo('Orbinoid [tree] dependency found ');
      }
      console.log(` =++ [ssh] `);
      CHECK_DEPENDENCY_CMD =`ssh -V`
      if (shelljs.exec(CHECK_DEPENDENCY_CMD).code !== 0) {
        shelljs.echo('Error : Orbinoid requires [ssh] as a dependency, and [ssh] is not installed on this system.');
        shelljs.exit(1);
      } else {
        shelljs.echo('Orbinoid [ssh] dependency found ');
      }

    }
    /**
     * Runs all Shell commands for the Dev cycle of a Circle CI Orb
     *
     * -----
     *
     *
     * @returns any But it actually is an Observable Stream of the HTTP response you can subscribe to.
     **/
    runCycle(): void {





      if (process.argv["init"]) {
        this.runInitOrb();
      }

      console.log(` === Current Folder `)
      let PRE_CMD: string =`pwd && tree ${this.orb_prj_folder} && ls -allh .`
      if (shelljs.exec(PRE_CMD).code !== 0) {
        shelljs.echo('Error inspecting Circle CI Orb Project workspace tree.');
        shelljs.exit(1);
      }

      console.log(` === Packing the Circle CI Orb`)
      let CCI_CLI_CMD: string=`${process.env.CCI_CLI_BINARY} orb pack ${this.orb_prj_folder}/src | tee ${this.orb_prj_folder}/src/orb.yml`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
        shelljs.echo('Error packing Orb with [FYAML](https://github.com/CircleCI-Public/fyaml) Standard ');
        shelljs.exit(1);
      }

      console.log(` === Validating the packed Circle CI Orb`)
      CCI_CLI_CMD =`${process.env.CCI_CLI_BINARY} orb validate ${this.orb_prj_folder}/src/orb.yml`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
        shelljs.echo('Error validating Orb ');
        shelljs.exit(1);
      } // so if packed orb is validated, then we can (test n) publish

      console.log(` === Creating Circle CI Orb namespace [${process.env.ORB_NAMESPACE}] in remote Orb registry`)
      CCI_CLI_CMD =`${process.env.CCI_CLI_BINARY} namespace create ${process.env.ORB_NAMESPACE} ${process.env.VCS_TYPE} ${process.env.VCS_ORG_NAME} --no-prompt`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
        shelljs.echo(`Error Creating Circle CI Orb namespace [${process.env.ORB_NAMESPACE}]`);
        /// shelljs.exit(1);
      }


      /// === Creating Circle CI Orb in remote Orb registry
      /*
      let this_orb_name:string = null;
      if(process.env.ORB_NAME === undefined) {
        this_orb_name = this.package_json.name;
      } else {
        this_orb_name = process.env.ORB_NAME;
      }*/
      console.log(` === Creating Circle CI Orb [${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME}] in remote Orb registry`)
      CCI_CLI_CMD =`${process.env.CCI_CLI_BINARY} orb create ${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME} --no-prompt`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
        shelljs.echo(`Error Creating Circle CI Orb [${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME}] in remote Orb registry`);
        /// shelljs.exit(1);
      }

      if (process.argv["publish"]) {
        /// circleci orb publish orb/src/@orb.yml orbinoid/ubitetorbi@0.0.1
        /*
        let this_orb_version:string = null;
        if(process.env.ORB_VERSION === undefined) {
          this_orb_version = this.package_json.version;
        } else {
          this_orb_version = process.env.ORB_VERSION;
        }*/
        console.log(` === Publishing Circle CI Orb [${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME}:${process.env.ORB_VERSION}] to remote Orb registry`)

        CCI_CLI_CMD =`${process.env.CCI_CLI_BINARY} orb publish ${this.orb_prj_folder}/src/orb.yml ${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME}@${process.env.ORB_VERSION}`
        if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
          shelljs.echo(`Error Publishing Circle CI Orb [${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME}@${process.env.ORB_VERSION}] in remote Orb registry`);
          shelljs.exit(1);
        }
      }
    }

    private runInitOrb(): void {
      console.log(` === Initializing Orb source code in [${this.orb_prj_folder}] from Orb starter project `)
      console.log(` === Skipped [Initializing Orb] 'circleci orb init' command, because of https://github.com/CircleCI-Public/circleci-cli/issues/491`)
      /*
      let INIT_CMD: string =`${process.env.CCI_CLI_BINARY} orb init ${this.orb_prj_folder} --host ${process.env.CCI_SERVER} --token "${this.secrets.circleci.auth.token}"`
      if (shelljs.exec(INIT_CMD).code !== 0) {
        shelljs.echo('Error initializing Orb ');
        shelljs.exit(1);
      }*/
      /// instead, I will use the [ORB_STARTER] git repo as a starter orb template source code, to initialize content of the [orb/] folder
      /// A./ git clone [ORB_STARTER] into ${this.orb_prj_folder}
      /// A.bis/ git checkout [ORB_STARTER_VERSION], if not set, git checkout latest semver version tag, if none, warn it's not a stablerelease, but later master commit.
      /// B./ Replace [README.md] by [starter.README.md]
      /// C./ run pack and validate, to check generated orb.yml, keep exit code somewhere and remove the generated
      /// D./ based on exit code check if validation passed, console log  instructions "Now run [npm start] to build your Orb"
      /// E./ if validation did not pass, console log the [ORB_STARTER] git uri of the starter and say it has a problem, can't use it,
      let INIT_CMD: string =`git clone ${process.env.ORB_STARTER} ${this.orb_prj_folder}`
      if (shelljs.exec(INIT_CMD).code !== 0) {
        shelljs.echo(`Error git cloning Circle CI Orb Starter Project [${process.env.ORB_STARTER}] in [${this.orb_prj_folder}] workspace.`);
        shelljs.exit(1);
      }
      INIT_CMD =`cd ${this.orb_prj_folder} && git checkout ${process.env.ORB_STARTER_VERSION}`
      if (shelljs.exec(INIT_CMD).code !== 0) {
        shelljs.echo(`Error git checkouting the [${process.env.ORB_STARTER_VERSION}] version ofthe Circle CI Orb Starter Project [${process.env.ORB_STARTER}].`);
        shelljs.exit(1);
      }
      INIT_CMD =`cp -f ${this.orb_prj_folder}/starter.README.md ${this.orb_prj_folder}/README.md && rm ${this.orb_prj_folder}/starter.README.md`
      if (shelljs.exec(INIT_CMD).code !== 0) {
        shelljs.echo(`Error : it seems like [${process.env.ORB_STARTER}] misses a [starter.README.md] on its  [${process.env.ORB_STARTER_VERSION}] git version.`);
        shelljs.exit(1);
      }
      console.log(` === Succesfully initialized Orb Project in [${this.orb_prj_folder}] from Starter [${process.env.ORB_STARTER}]`);
      INIT_CMD =`tree ${this.orb_prj_folder}`
      if (shelljs.exec(INIT_CMD).code !== 0) {
        shelljs.exit(1);
      }
    }


    /**
     * -
     * When we develop a Circle CI Orb,what do we do to test it ?
     * -
     * Well, of course, we :
     * - create a github repo, and add an example application source code, and a `.circleci/config.yml` Pipeline defintion
     * - we setup the project to start building
     * - we commit and push the whole thing, which triggers the Circle CI Pipeline, to make sure the Pipeline works ok without our `Orb`
     * - we add the `orb` ref, and `Orb` command / job usage into the `.circleci/config.yml`
     * - and we git commit and push the whole thing, to test our Orb
     *
     **/
    private runOrbIntegrationTests(): void {
      if (!`${process.env.ORB_TESTS_GIT_REPO}`.startsWith(`git@`)) {
        throw new Error(` In your .env file,  [ORB_TESTS_GIT_REPO] is set to [${process.env.ORB_TESTS_GIT_REPO}], which is not a valid git SSH URI. Set [ORB_TESTS_GIT_REPO] to the git SSH URI of the repo you want to use.`)
      }

      /// * - create a github repo, and add an example application source code, and a `.circleci/config.yml` Pipeline defintion
      console.log(` === Run Orb Integration Test for : []`);
      let INT_TESTS_CMD: string =`cd ${this.orb_prj_folder} && ./tests/run-int-test.sh ${process.env.ORB_TESTS_GIT_REPO} ${process.env.ORB_TESTS_GIT_BRANCH} "${process.env.ORB_NAMESPACE}/${process.env.ORB_NAME}:${process.env.ORB_VERSION}"`
      if (shelljs.exec(INT_TESTS_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runOrbIntegrationTests()] - Error running [${INT_TESTS_CMD}] `);
        shelljs.exit(1);
      }
      INT_TESTS_CMD =`mkdir -p ${this.orb_prj_folder}/tests/temp`
      if (shelljs.exec(INT_TESTS_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runOrbIntegrationTests()] - Error running [${INT_TESTS_CMD}] `);
        shelljs.exit(1);
      }
      INT_TESTS_CMD =`git clone ${this.orb_prj_folder}/src/tests/git-repo/* ${this.orb_prj_folder}/tests/temp `
      if (shelljs.exec(INT_TESTS_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runOrbIntegrationTests()] - Error running [${INT_TESTS_CMD}] `);
        shelljs.exit(1);
      }
      INT_TESTS_CMD =`cp -fR ${this.orb_prj_folder}/src/tests/git-repo/* ${this.orb_prj_folder}/tests/temp `
      if (shelljs.exec(INT_TESTS_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runOrbIntegrationTests()] - Error running [${INT_TESTS_CMD}] `);
        shelljs.exit(1);
      }
      /// * - we setup the project to start building
      /// * - we commit and push the whole thing, which triggers the Circle CI Pipeline, to make sure the Pipeline works ok without our `Orb`
      /// * - we add the `orb` ref, and `Orb` command / job usage into the `.circleci/config.yml`
      /// * - and we git commit and push the whole thing, to test our Orb
    }


    /**
     * WARNING: this method will change yoru local git global config.
     *          This one of the reason why I recommend running orbinoid : into a docker container.
     *
     * This method runs the global git config commands, and saves the SSH config to the SSH AGENT
     * That way, configuration applies in any subsequent shell session run with the shelljs utility
     *
     * git config --global commit.gpgsign true
     * git config --global user.name "Jean-Baptiste-Lasselle"
     * git config --global user.email jean.baptiste.lasselle.pegasus@gmail.com
     * git config --global user.signingkey 7B19A8E1574C2883
     *
     * git config --global --list
     *
     * # will re-define the default identity in use
     * # https://docstore.mik.ua/orelly/networking_2ndEd/ssh/ch06_04.htm
     * ssh-add ~/.ssh.perso.backed/id_rsa
     *
     * export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
     * ssh -Ti ~/.ssh.perso.backed/id_rsa git@github.com
     *
     **/
    private runGitConfig(): void {
      let GIT_CONF_CMD: string =`git config --global commit.gpgsign true`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - Error running [${GIT_CONF_CMD}] `);
        shelljs.exit(1);
      }
      GIT_CONF_CMD =`git config --global user.name "${process.env.GIT_USER_NAME}"`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - Error running [${GIT_CONF_CMD}] `);
        shelljs.exit(1);
      }
      GIT_CONF_CMD =`git config --global user.email "${process.env.GIT_USER_EMAIL}"`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - Error running [${GIT_CONF_CMD}] `);
        shelljs.exit(1);
      }
      GIT_CONF_CMD =`git config --global user.signingkey "${process.env.GIT_GPG_SINGING_KEY}"`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - Error running [${GIT_CONF_CMD}] `);
        shelljs.exit(1);
      }
      GIT_CONF_CMD =`ssh-add ${process.env.GIT_SSH_PRIV_KEY}`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - Error running [${GIT_CONF_CMD}] `);
        shelljs.exit(1);
      }
      GIT_CONF_CMD =`ssh -Ti ${process.env.GIT_SSH_PRIV_KEY} git@${process.env.VCS_TYPE}.com`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - If your GIt config is correct, you should see "Hi ${process.env.GIT_USER_NAME}! You've successfully authenticated, but GitHub does not provide shell access.", in the above std output`);
        /// shelljs.exit(1); ///
        /// This command, when successfully tests your git user, exits with error code 1, but the test still is successful!
        /// When Test is sucessful
      }

      GIT_CONF_CMD =`git config --global --list`
      if (shelljs.exec(GIT_CONF_CMD).code !== 0) {
        shelljs.echo(`[CciCLIRunner] - [runGitConfig()] - Error running [${GIT_CONF_CMD}] `);
        shelljs.exit(1);
      }

    }
}
