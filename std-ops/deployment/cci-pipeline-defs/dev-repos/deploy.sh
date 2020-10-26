#!/bin/bash

export GITHUB_ORG="gravitee-io"
# on gavitee-lab org, for tests
# comment the line below, to consolidate from "gavitee-io" org
# export GITHUB_ORG="gravitee-lab"

./shell/consolidate-dev-repos-inventory.sh

# Once execution has completed, all inventory files will be in
# the "./inventory" folder.
# that is, the "std-ops/deployment/cci-pipeline-defs/dev-repos/inventory" folder.

export GITHUB_ORG="gravitee-io"
# on "gavitee-lab" org, for tests
# comment the line below, to deploy to "gavitee-io" org
export GITHUB_ORG="gravitee-lab"

./shell/deploy-all-pipeline-defs.sh
