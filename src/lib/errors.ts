
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
  // number of retries, to successfully complete all Circle CI Pipeline, after which [GraviteeReleaseOrchestrator] stops execution and exits with error return code,
  private retries_before_failure: string
  // SSH URI to the git rpo versioning the release.json
  private ssh_release_git_repo: string
  private http_release_git_repo: string
  private release_branches: string


  constructor(product: string, retries_before_failure: string, ssh_release_git_repo: string, http_release_git_repo: string, release_branches: string) {
    if ((ssh_release_git_repo === undefined || ssh_release_git_repo === "") && (http_release_git_repo === undefined || http_release_git_repo === "")) {
      throw new Error("Both [HTTP_RELEASE_GIT_REPO] and [SSH_RELEASE_GIT_REPO] are undefined, at least either of them is required. Value should respectively be the SSH URI and the HTTP URI to the git repo versioning the [release.json] file.")
    }

    if (release_branches === undefined || release_branches === "") {
      throw new Error("[RELEASE_BRANCHES] is undefined, and is required. Its value should be a string, with comma-separated version tags. E.g. : \"master, 3.1.x, 3.0.x, 1.30.x, 1.29.x, 1.25.x, 1.20.x\"");
    }
    this.ssh_release_git_repo = ssh_release_git_repo;
    this.http_release_git_repo = http_release_git_repo;
    this.release_branches = release_branches;

    if (product === undefined || product === "") {
      console.warn("[HTTP_RELEASE_GIT_REPO] is undefined, defaulting value to 'Gravitee APIM'")
      this.product = "Gravitee APIM";
    } else {
      this.product = product;
    }
    if (retries_before_failure === undefined) {
      console.warn("[RETRY_BEFORE_FAILURE] is undefined, defaulting value to '3'")
      this.retries_before_failure = "3";
    } else {
      if (Number.isNaN(retries_before_failure)) {
        throw new Error("[RETRY_BEFORE_FAILURE] is defined, but is not a Number. Example value : '7'");
      }
      this.retries_before_failure = retries_before_failure;
    }
  }

  report(err: Error) {
    // could use apiKey here to send error somewhere
    console.error(err.message);
    console.error(err.stack);
  }
}

export default new ErrorReporter(process.env.PRODUCT, process.env.RETRIES_BEFORE_FAILURE, process.env.SSH_RELEASE_GIT_REPO, process.env.HTTP_RELEASE_GIT_REPO, process.env.RELEASE_BRANCHES);
