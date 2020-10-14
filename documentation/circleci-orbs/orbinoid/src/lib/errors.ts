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


/**
 * DOTENV Configuration Loader Module
 *
 * PRODUCT env. var is optional and defaults to "Gravitee APIM"
 * RETRIES_BEFORE_FAILURE env. var is optional and defaults to "Gravitee APIM"
 *
 * SSH_RELEASE_GIT_REPO is required
 * HTTP_RELEASE_GIT_REPO is required
 * RELEASE_BRANCHES is required
 **/
class ErrorReporter {
  // the full path to the Circle CI CLI binary
  private cci_cli_binary: string;
  // the circle ci server
  private cci_server: string;
  // the path to the local Circle CI secrets file
  private cci_secrets_file_path: string;
  //
  private orb_git_repo: string;
  private orb_namespace: string;
  private vcs_type: string;
  private vcs_org_name: string;
  private orb_name: string;
  private orb_version: string;

  private orb_starter: string;
  private orb_starter_version: string;
  private git_user_name: string;
  private git_user_email: string;
  private git_gpg_signing_key: string;
  private git_ssh_priv_key: string;

  /**
   * SSH URI for the git repository to use to run Orb Integration tests
   **/
   private orb_tests_git_repo: string;
   private orb_tests_git_branch: string;

/*
  GIT_USER_NAME=Jean-Baptiste-Lasselle
  GIT_USER_EMAIL=jean.baptiste.lasselle.pegasus@gmail.com
  GIT_GPG_SINGING_KEY=7B19A8E1574C2883
  GIT_SSH_PRIV_KEY=~/.ssh.perso.backed/id_rsa





*/
  constructor(cci_cli_binary: string, cci_server: string, cci_secrets_file_path: string, orb_git_repo: string, orb_namespace: string, vcs_type: string, vcs_org_name: string, orb_name: string, orb_version: string, orb_starter: string, orb_starter_version: string, git_user_name: string, git_user_email: string, git_gpg_signing_key: string, git_ssh_priv_key: string, orb_tests_git_repo: string, orb_tests_git_branch: string) {

    const package_json: any = JSON.parse(fs.readFileSync('./package.json','utf8'));
    console.log(`{[.DOTENV]} =================== `);
    console.log(`{[.DOTENV]} - package.json is : `);
    console.log(`{[.DOTENV]} =================== `);
    console.log(package_json);
    console.log(`{[.DOTENV]} =================== `);

    if (cci_cli_binary === undefined || cci_cli_binary === "") {
      throw new Error("{[.DOTENV]} - [CCI_CLI_BINARY] is undefined, or an empty string, but is required. Value should be set to the full path to the Circle CI CLI binary of your local Circle CI CLI installation.")
    } else {
      this.cci_cli_binary = cci_cli_binary;
      if (shelljs.exec("ls -allh " + `${this.cci_cli_binary}`).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
        throw new Error("Circle CI CLI binary path [" + `${this.cci_cli_binary}` + "] does not exist on this machine. Please set [CCI_CLI_BINARY]  to the full path to the Circle CI CLI binary of your local Circle CI CLI installation.");
        /// shelljs.exit(1);
      }
    }

    if (cci_server === undefined || cci_server === "") {
      console.warn("{[.DOTENV]} - [CCI_SERVER] is undefined, defaulting value to 'https://circleci.com'")
      process.env.CCI_SERVER = 'https://circleci.com';
    } else {
      this.cci_server = cci_server;
    }
    if (cci_secrets_file_path === undefined || cci_secrets_file_path === "") {
      console.warn("{[.DOTENV]} - [CCI_SECRETS_FILE_PATH] is undefined, defaulting value to './.secrets.json'")
      process.env.CCI_SECRETS_FILE_PATH = './.secrets.json';
    } else {
      this.cci_secrets_file_path = cci_secrets_file_path;
    }
    if (orb_git_repo === undefined || orb_git_repo === "") {
      throw new Error("{[.DOTENV]} - [ORB_GIT_REPO] is undefined, or an empty string, but is required. Value should be set to the URI of the git repo versioning this Circle CI Orb's source code.")
    } else {
      this.orb_git_repo = orb_git_repo;
    }
    if (orb_namespace === undefined || orb_namespace === "") {
      throw new Error("{[.DOTENV]} - [ORB_NAMESPACE] is undefined, or an empty string, but is required. Value should be set to the desired Orb namespace for this Circle CI Orb.")
    } else {
      this.orb_namespace = orb_namespace;
    }
    if (vcs_type === undefined || vcs_type === "") {
      throw new Error("{[.DOTENV]} - [VCS_TYPE] is undefined, or an empty string, but is required. Value should be set to 'github' or 'bitbucket' to configure the git service of the git repo versioning this Circle CI Orb's source code.")
    } else {
      this.vcs_type = vcs_type;
    }

    if (vcs_org_name === undefined || vcs_org_name === "") {
      throw new Error(`{[.DOTENV]} - [VCS_ORG_NAME] is undefined, or an empty string, but is required. Value should be the nameofthe organization to which the git repo versioning this Circle CI Orb's source code, belongs, in the ${this.vcs_type} git service provider.`)
    } else {
      this.vcs_org_name = vcs_org_name;
    }

    if (orb_name === undefined || orb_name === "") {
      console.warn(`{[.DOTENV]} - [ORB_NAME] is undefined, defaulting value to [package.json] project name [${package_json.name}]`)
      let project_name: string = package_json.name;
      /// let project_version: string = package_json.version;
      process.env.ORB_NAME = project_name;
    } else {
      this.orb_name = orb_name;
    }

    if (orb_version === undefined || orb_version === "") {
      console.warn(`{[.DOTENV]} - [ORB_VERSION] is undefined, defaulting value to [package.json] project version [${package_json.version}]`)
      /// let project_name: string = package_json.name;
      let project_version: string = package_json.version;
      // this.orb_version = project_version;
      process.env.ORB_VERSION = project_version;
    } else {
      this.orb_version = orb_version;
    }

    if (orb_starter === undefined || orb_starter === "") {
      console.warn(`{[.DOTENV]} - [ORB_STARTER] is undefined, defaulting value to [https://github.com/gravitee-lab/orb-starter]`)
      process.env.ORB_STARTER = 'https://github.com/gravitee-lab/orb-starter';
    } else {
      this.orb_starter = orb_starter;
    }

    if (orb_starter_version === undefined || orb_starter_version === "") {
      console.warn(`{[.DOTENV]} - [ORB_STARTER_VERSION] is undefined, defaulting value to [https://github.com/gravitee-lab/orb-starter]`)
      process.env.ORB_STARTER_VERSION = 'HEAD';
    } else {
      this.orb_starter_version = orb_starter_version;
    }

    /// git_user_name: string, git_user_email: string, git_gpg_signing_key: string, git_ssh_priv_key: string
    if (git_user_name === undefined || git_user_name === "") {
      throw new Error("{[.DOTENV]} - [GIT_USER_NAME] is undefined, or an empty string, but is required. Value should be set to your 'github' or 'bitbucket' git username to configure your local git.")
    } else {
      this.git_user_name = git_user_name;
    }
    if (git_user_email === undefined || git_user_email === "") {
      throw new Error("{[.DOTENV]} - [GIT_USER_EMAIL] is undefined, or an empty string, but is required. Value should be set to your git user email to configure your local git.")
    } else {
      this.git_user_email = git_user_email;
    }

    if (git_gpg_signing_key === undefined || git_gpg_signing_key === "") {
      throw new Error("{[.DOTENV]} - [GIT_GPG_SIGNING_KEY] is undefined, or an empty string, but is required. Value should be set to your GPG PUBLIC KEY to sign  SIGNING to configure your local git.")
    } else {
      this.git_gpg_signing_key = git_gpg_signing_key;
    }
    if (git_ssh_priv_key === undefined || git_ssh_priv_key === "") {
      throw new Error("{[.DOTENV]} - [GIT_SSH_PRIV_KEY] is undefined, or an empty string, but is required. Value should be set to the path of your local SSH PRIVATE KEY to configure your local git.")
    } else {
      this.git_ssh_priv_key = git_ssh_priv_key;
    }

    if (orb_tests_git_repo === undefined || orb_tests_git_repo === "") { // Tests are not an option, they are mandatory, when developing a Circle CI Orb .
      throw new Error("{[.DOTENV]} - [ORB_TESTS_GIT_REPO] is undefined, or an empty string, but is required. Value should be set to the git ssh URI of the git repo you want to use for running integrations tests on your Orb.")
    } else {
      this.orb_tests_git_repo = orb_tests_git_repo;
    }
    if (orb_tests_git_branch === undefined || orb_tests_git_branch === "") {
      console.warn(`{[.DOTENV]} - [orb_tests_git_branch] is undefined, defaulting value to [master]`)
      process.env.ORB_TESTS_GIT_BRANCH = 'master';
    } else {
      this.orb_tests_git_branch = orb_tests_git_branch;
    }

  }

  report(err: Error) {
    // could use [this.release_manifest_path], [this.product], etc... here to send error somewhere
    console.error(err.message);
    /// console.error(err.stack);
  }
}

export default new ErrorReporter(process.env.CCI_CLI_BINARY, process.env.CCI_SERVER, process.env.CCI_SECRETS_FILE_PATH, process.env.ORB_GIT_REPO, process.env.ORB_NAMESPACE, process.env.VCS_TYPE, process.env.VCS_ORG_NAME, process.env.ORB_NAME, process.env.ORB_VERSION, process.env.ORB_STARTER, process.env.ORB_STARTER_VERSION, process.env.GIT_USER_NAME, process.env.GIT_USER_EMAIL, process.env.GIT_GPG_SIGNING_KEY, process.env.GIT_SSH_PRIV_KEY, process.env.ORB_TESTS_GIT_REPO, process.env.ORB_TESTS_GIT_BRANCH);
