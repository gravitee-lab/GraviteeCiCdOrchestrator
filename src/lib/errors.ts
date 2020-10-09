
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
  // prodcut name (e.g. Gravitee APIM / Gravitee AM / Gravitee Alert Manager / Gravitee Cockpit)
  private product: string
  private release_manifest_path: string;
  // number of retries, to successfully complete all Circle CI Pipeline, after which [GraviteeReleaseOrchestrator] stops execution and exits with error return code,
  private retries_before_failure: string
  // SSH URI to the git rpo versioning the release.json
  private ssh_release_git_repo: string
  private http_release_git_repo: string
  private release_branches: string
  private secrets_file_path: string
  /// --- time outs
  /// timeout to trigger a pipeline
  /// TRIGGER_TIMEOUT=360s
  private trigger_timeout: string;
  /// timeout to fetch for Build complete status
  /// PIPELINE_COMPLETION_TIMEOUT=360s
  private pipeline_completion_timeout: string;
  /// The Gihub.com Organization where all the git repos live.
  private gh_org: string;
  /// The time interval, in milliseconds, between 2 "Watch rounds", of the {@link PipelineExecSetStatusWatcher}
  private exec_status_watch_interval: string;

  constructor(product: string, release_manifest_path: string, retries_before_failure: string, ssh_release_git_repo: string, http_release_git_repo: string, release_branches: string, secrets_file_path: string, trigger_timeout: string, pipeline_completion_timeout: string, gh_org: string, exec_status_watch_interval: string) {

    console.debug("{[.DOTENV]} - validating [release_manifest_path] ")
    if (release_manifest_path === undefined || release_manifest_path === "") {
      console.debug("{[.DOTENV]} - validating [release_manifest_path] an error should be thrown")
      throw new Error("{[.DOTENV]} - [RELEASE_MANIFEST_PATH] is undefined, or an empty string, at least either of them is required. Value should be set to the local path of the [release.json] manifest file. Gravitee Release Orchestrator will parse this file to determine which " + `${this.product}` + " component to release.")
    } else {
      console.debug("{[.DOTENV]} - validating [release_manifest_path] NO error should be thrown")
    }
    if ((ssh_release_git_repo === undefined || ssh_release_git_repo === "") && (http_release_git_repo === undefined || http_release_git_repo === "")) {
      throw new Error("{[.DOTENV]} - Both [HTTP_RELEASE_GIT_REPO] and [SSH_RELEASE_GIT_REPO] are undefined, or an empty string, but , at least one of them is required to be set to a non empty string. Value should respectively be set to the HTTP and SSH URI of the git repo versioning the [release.json] manifest file.")
    }
    if (release_branches === undefined || release_branches === "") {
      throw new Error("{[.DOTENV]} - [RELEASE_BRANCHES] is undefined, and is required. Its value should be a string, with comma-separated version tags. E.g. : \"master, 3.1.x, 3.0.x, 1.30.x, 1.29.x, 1.25.x, 1.20.x\"");
    }

    this.release_manifest_path = release_manifest_path;
    this.ssh_release_git_repo = ssh_release_git_repo;
    this.http_release_git_repo = http_release_git_repo;
    this.release_branches = release_branches;

    if (product === undefined || product === "") {
      console.warn("{[.DOTENV]} - [SECRETS_FILE_PATH] is undefined, defaulting value to './.secrets.json'")
      this.secrets_file_path = './.secrets.json';
    } else {
      this.secrets_file_path = secrets_file_path;
    }
    if (product === undefined || product === "") {
      console.warn("{[.DOTENV]} - [HTTP_RELEASE_GIT_REPO] is undefined, defaulting value to 'Gravitee APIM'")
      this.product = "Gravitee APIM";
    } else {
      this.product = product;
    }
    if (retries_before_failure === undefined) {
      console.warn("{[.DOTENV]} - [RETRY_BEFORE_FAILURE] is undefined, defaulting value to '3'")
      this.retries_before_failure = "3";
    } else {
      if (Number.isNaN(retries_before_failure)) {
        throw new Error("{[.DOTENV]} - [RETRY_BEFORE_FAILURE] is defined, but is not a Number. Example value : '7'");
      }
      this.retries_before_failure = retries_before_failure;
    }
    if (pipeline_completion_timeout === undefined) {
      console.warn("{[.DOTENV]} - [PIPELINE_COMPLETION_TIMEOUT] is undefined, defaulting value to '360' (seconds)")
      this.pipeline_completion_timeout = "360";
    } else {
      this.pipeline_completion_timeout = pipeline_completion_timeout;
    }
    if (trigger_timeout === undefined) {
      console.warn("{[.DOTENV]} - [TRIGGER_TIMEOUT] is undefined, defaulting value to '360' (seconds)")
      this.trigger_timeout = "360";
    } else {
      this.trigger_timeout = trigger_timeout;
    }
    if (gh_org === undefined || gh_org === "") {
      console.warn("{[.DOTENV]} - [GH_ORG] is undefined, defaulting value to 'graviteeio-lab'")
      this.gh_org = 'graviteeio-lab';
    } else {
      this.gh_org = gh_org;
    }
    if (exec_status_watch_interval === undefined || gh_org === "") {
      console.warn("{[.DOTENV]} - [EXEC_STATUS_WATCH_INTERVAL] is undefined, defaulting value to '7000'")
      this.exec_status_watch_interval = '7000';
    } else {
      let testWatchInterval: number = null;
      try {
        testWatchInterval = parseInt(process.env.EXEC_STATUS_WATCH_INTERVAL);
      } catch (error) {
        console.error(`{[.DOTENV]} - [EXEC_STATUS_WATCH_INTERVAL] value is [${process.env.EXEC_STATUS_WATCH_INTERVAL}], which is not a number, please set its value to an integer that is not zero. Its value is a time period exepresed in milliseconds.`);
      }
      if (testWatchInterval === 0) {
        console.error(`{[.DOTENV]} - [EXEC_STATUS_WATCH_INTERVAL] value is zero [${process.env.EXEC_STATUS_WATCH_INTERVAL}], which is not a number, please set its value to an integer that is not zero. Its value is a time period exepresed in milliseconds.`);
      }
      this.exec_status_watch_interval = exec_status_watch_interval;
    }

  }

  report(err: Error) {
    // could use [this.release_manifest_path], [this.product], etc... here to send error somewhere
    console.error(err.message);
    /// console.error(err.stack);
  }
}

export default new ErrorReporter(process.env.PRODUCT, process.env.RELEASE_MANIFEST_PATH, process.env.RETRIES_BEFORE_FAILURE, process.env.SSH_RELEASE_GIT_REPO, process.env.HTTP_RELEASE_GIT_REPO, process.env.RELEASE_BRANCHES, process.env.SECRETS_FILE_PATH, process.env.TRIGGER_TIMEOUT, process.env.PIPELINE_COMPLETION_TIMEOUT, process.env.GH_ORG, process.env.EXEC_STATUS_WATCH_INTERVAL);
