# Deployment : dev repos Pipeline Definition

In this folder, is versioned the standard operation which consists in
deploying the `.circleci/config.yml` Circle CI Pipeline Definition to all
Gravitee Software Development git repositories.


## How to use

* First, you need to generate the "scope files" (a file per branch on the https://github.com/gravitee-io/realease git repo) :

```bash
export GITHUB_ORG="gravitee-io"
./shell/consolidate-dev-repos-inventory.sh

```
