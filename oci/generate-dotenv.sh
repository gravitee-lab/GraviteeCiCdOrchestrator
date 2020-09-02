#!/bin/sh

# --- First , interpolate .env file
echo "Generate .env file From Docker Environment"
ls -allh ./.env

# ---

# ---

# PRODUCT='Gravitee APIM'
PRODUCT=${PRODUCT}

# RELEASE_MANIFEST_PATH=tests-data/apim/1.30.x/release.test1.json
# RELEASE_MANIFEST_PATH=tests-data/apim/1.30.x/release.test4-20-conccurrent.json
RELEASE_MANIFEST_PATH=${RELEASE_MANIFEST_PATH}
RETRIES_BEFORE_FAILURE=${RETRIES_BEFORE_FAILURE}
# SSH_RELEASE_GIT_REPO='git@github.com:gravitee-io/release.git'
# HTTP_RELEASE_GIT_REPO='https://github.com/gravitee-io/release.git'
HTTP_RELEASE_GIT_REPO=${HTTP_RELEASE_GIT_REPO}
# String.split()
# RELEASE_BRANCHES="master, 3.1.x, 3.0.x, 1.30.x, 1.29.x, 1.25.x, 1.20.x"
RELEASE_BRANCHES=${RELEASE_BRANCHES}

# SECRETS_FILE_PATH=./.secrets.json
SECRETS_FILE_PATH=${SECRETS_FILE_PATH}
# The Gravitee Release Orchestrator must eventually timeout :
# It must stop fetching the Circle CI API
# Expressed in seconds :
# PIPELINES_TIMEOUT=360s # defaults to 360s
# Or minutes
# PIPELINES_TIMEOUT=10m
# Or hours
# PIPELINES_TIMEOUT=1h

# +++ GITHUB
# +
# + Git Service Provider Organization in which all
#   the https://github.com Git repos live.
#
# GH_ORG=gravitee-io
# GH_ORG=gravitee-lab
GH_ORG=${GH_ORG}

echo ''
echo 'Generated DOTENV [./.env] file : '
echo ''
cat ./.env
