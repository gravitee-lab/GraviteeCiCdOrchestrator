import * as shelljs from 'shelljs';



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
  private cci_cli_binary: string

  constructor(cci_cli_binary: string) {

    console.debug("{[.DOTENV]} - validating [release_manifest_path] ")
    if (cci_cli_binary === undefined || cci_cli_binary === "") {
      throw new Error("{[.DOTENV]} - [CCI_CLI_BINARY] is undefined, or an empty string, but is required. Value should be set to the full path to the Circle CI CLI binary of your local Circle CI CLI installation.")
    } else {
      this.cci_cli_binary = cci_cli_binary;
      if (shelljs.exec("ls -allh " + `${this.cci_cli_binary}`).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
        throw new Error("Circle CI CLI binary path [" + `${this.cci_cli_binary}` + "] does not exist on this machine. Please set [CCI_CLI_BINARY]  to the full path to the Circle CI CLI binary of your local Circle CI CLI installation.");
        /// shelljs.exit(1);
      }
    }

  }

  report(err: Error) {
    // could use [this.release_manifest_path], [this.product], etc... here to send error somewhere
    console.error(err.message);
    /// console.error(err.stack);
  }
}

export default new ErrorReporter(process.env.CCI_CLI_BINARY);
