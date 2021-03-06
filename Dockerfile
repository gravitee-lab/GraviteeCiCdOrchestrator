#
# ---- Base Node ----
FROM node:14.9.0-alpine3.10 AS base
# -- add a few utils:
# the [PullRequestBot], among other
# CICD Stages, need the git
RUN apk update && apk add tree git bash curl tar iputils && apk --update add openssh-client
# --- Install TypeScript
RUN npm install -g typescript @types/node
# --- create and set working directory
RUN mkdir -p /graviteeio/cicd
WORKDIR /graviteeio/cicd
# --- add entrypoint
COPY oci/start.sh /graviteeio/cicd
COPY oci/git_config.sh /graviteeio/cicd
COPY oci/install-secrethub-cli.sh /graviteeio/cicd
# COPY oci/generate-dotenv.sh /graviteeio/cicd
RUN chmod +x /graviteeio/cicd/*.sh
RUN /graviteeio/cicd/install-secrethub-cli.sh
# Set [start.sh] as entrypoint
ENTRYPOINT ["/graviteeio/cicd/start.sh", "--"]
# Copy project file
COPY package.json /graviteeio/cicd
COPY tsconfig*.json /graviteeio/cicd
#
# ---- Resolve Dependencies and Build ----
FROM base AS dependencies
# --- Resolve project dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# --- copy production node_modules aside
RUN cp -R node_modules prod_node_modules
RUN echo "Content [prod_node_modules/] in PWD=[$(pwd)/prod_node_modules]"
# --- Install ALL node_modules, including 'devDependencies'
RUN npm install
RUN mkdir -p /graviteeio/cicd/src
COPY src/ ./src
RUN echo "Before npm run compile, Is [src/] in PWD=[$(pwd)] ? " && ls -allh && ls -allh src/ && tree src/
RUN npm run compile
RUN echo "After npm run compile, Is [dist/] in PWD=[$(pwd)] ? " && ls -allh && ls -allh dist/ && tree dist/

#
# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
# RUN  npm run lint && npm run setup && npm run test
# RUN  npm run lint && npm run setup && npm run test
RUN npm run test

#
# ---- Release ----
FROM base AS release
# --
# GIT COMMIT ID
ARG GIT_COMMIT=unspecified
LABEL git.commit.id=$GIT_COMMIT
LABEL vendor=gravitee.io
LABEL maintainer=jean-baptiste.lasselle@graviteesource.com
# Define General Docker environment
# --- DEFINE DOTENV Environment
# PRODUCT='Gravitee APIM'
ARG PRODUCT='Gravitee APIM'
ENV PRODUCT=${PRODUCT}

# CICD_PROCESS_MANIFEST_PATH=release-data/apim/1.30.x/tests/release.test1.json
# CICD_PROCESS_MANIFEST_PATH=release-data/apim/1.30.x/tests/release.test4-20-conccurrent.json
# ARG CICD_PROCESS_MANIFEST_PATH=/path/to/release.json
ARG CICD_PROCESS_MANIFEST_PATH=/graviteeio/cicd/pipeline/release.json
ENV CICD_PROCESS_MANIFEST_PATH=${CICD_PROCESS_MANIFEST_PATH}

ENV RETRIES_BEFORE_FAILURE=${RETRIES_BEFORE_FAILURE}
# SSH_RELEASE_GIT_REPO='git@github.com:gravitee-io/release.git'
# HTTP_RELEASE_GIT_REPO='https://github.com/gravitee-io/release.git'
ENV HTTP_RELEASE_GIT_REPO=${HTTP_RELEASE_GIT_REPO}
# String.split()
# RELEASE_BRANCHES="master, 3.1.x, 3.0.x, 1.30.x, 1.29.x, 1.25.x, 1.20.x"
ENV RELEASE_BRANCHES=${RELEASE_BRANCHES}

# SECRETS_FILE_PATH=./.secrets.json
ENV SECRETS_FILE_PATH=${SECRETS_FILE_PATH}
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
ENV GH_ORG=${GH_ORG}

# +++ SECRETHUB
# The secrethub org and repo from which to featch all CI CD Secrets
# GH_ORG=gravitee-lab
ARG SECRETHUB_ORG
ENV SECRETHUB_ORG=${SECRETHUB_ORG}

ARG SECRETHUB_REPO
ENV SECRETHUB_REPO=${SECRETHUB_REPO}

ARG MAVEN_PROFILE_ID
ENV MAVEN_PROFILE_ID=${MAVEN_PROFILE_ID}

# --- CI CD Env
ARG CIRCLE_BUILD_URL
ENV CIRCLE_BUILD_URL=${CIRCLE_BUILD_URL}

# --- copy production node_modules
COPY --from=dependencies /graviteeio/cicd/prod_node_modules ./node_modules
# --- Copy built TypeScript app
COPY --from=dependencies /graviteeio/cicd/dist ./dist
# --- Do not Copy Environment file, it is generated on the fly, based on environment variables
#
COPY .env /graviteeio/cicd
RUN echo "quick check peek [PWD=$(pwd)]" && ls -allh .
RUN echo "quick check peek [PWD/dist=$(pwd)/dist]" && ls -allh ./dist
RUN echo "Inside [FROM base AS release] npm run compile, Is [dist/] in PWD=[$(pwd)] ? (and what is its content ?)" && ls -allh && ls -allh dist/
RUN echo "Inside [FROM base AS release] npm run compile, Is [node_modules/] in PWD=[$(pwd)] ? (and what is its content ?)" && ls -allh && ls -allh node_modules/

# ---
# Inside pipeline, is checked-out the github repo which triggered the pipeline
# So docker volume mapping [-v $PWD/graviteeio/cicd/pipeline]
RUN mkdir -p /graviteeio/cicd/pipeline
VOLUME [ "/graviteeio/cicd/pipeline" ]
WORKDIR /graviteeio/cicd
# Set [start.sh] as entrypoint
# CMD ["/graviteeio/cicd/start.sh"]
