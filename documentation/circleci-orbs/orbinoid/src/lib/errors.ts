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

  constructor(cci_cli_binary: string, cci_server: string, cci_secrets_file_path: string, orb_git_repo: string, orb_namespace: string, vcs_type: string, vcs_org_name: string, orb_name: string, orb_version: string) {

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
  }

  report(err: Error) {
    // could use [this.release_manifest_path], [this.product], etc... here to send error somewhere
    console.error(err.message);
    /// console.error(err.stack);
  }
}

export default new ErrorReporter(process.env.CCI_CLI_BINARY, process.env.CCI_SERVER, process.env.CCI_SECRETS_FILE_PATH, process.env.ORB_GIT_REPO, process.env.ORB_NAMESPACE, process.env.VCS_TYPE, process.env.VCS_ORG_NAME, process.env.ORB_NAME, process.env.ORB_VERSION);
