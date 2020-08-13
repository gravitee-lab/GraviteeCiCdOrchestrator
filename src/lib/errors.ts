
/**
 *
 * SSH_RELEASE_GIT_REPO is required
 * HTTP_RELEASE_GIT_REPO is required
 * RELEASE_BRANCHES is required
 * two other env. var are optional and have default values
 **/
class ErrorReporter {
  private product: string
  private retries_before_failure: number
  private ssh_release_git_repo: string
  private http_release_git_repo: string
  private release_branches: string


  constructor(product: string, retries_before_failure: number, ssh_release_git_repo: string, http_release_git_repo: string, release_branches: string) {
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
    if (retries_before_failure === undefined || retries_before_failure < 0) {
      console.warn("[RETRY_BEFORE_FAILURE] is undefined, defaulting value to [3]")
      this.retries_before_failure = 3;
    } else {
      this.retries_before_failure = retries_before_failure;
    }
  }

  report(err: Error) {
    // could use apiKey here to send error somewhere
  }
}

export default new ErrorReporter(process.env.ERR_API_KEY)
