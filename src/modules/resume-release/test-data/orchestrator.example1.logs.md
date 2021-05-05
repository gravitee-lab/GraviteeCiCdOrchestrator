# Example logs of the Circle CI Orchestrator

Below, the logs of the orachestrator, in the following case :
* I started a release in dry run mode
* A first Gravitee Component was successfully released,
* a second Gravitee Component began its release in dry run mode,
* and I cancelled the second Gravitee Component release process, on purpose, to trigger an orchestrator error.

Purpose :
* have reference data to design the resume release feature as efficiently as possible
* The quesiton is : How to detect the event "A pipeline seccessfully completed its execution"

Note that the Orchestrator :
* triggers pipelines, and detects when triggering a Pipeline succedded
* detects the Event "a pipeline execution failed",
* but does not detect the event "A pipeline seccessfully completed its execution"

```bash
Checking pipeline env. :
total 60K
drwxrwxr-x  5 circleci circleci 4.0K Dec  9 11:31 .
drwxr-xr-x 16 circleci circleci 4.0K Dec  9 11:31 ..
drwxrwxr-x  2 circleci circleci 4.0K Dec  9 11:31 .circleci
-rw-rw-r--  1 circleci circleci 3.3K Dec  9 11:31 CONTRIBUTING.adoc
drwxrwxr-x  8 circleci circleci 4.0K Dec  9 11:31 .git
-rw-rw-r--  1 circleci circleci   19 Dec  9 11:31 .gitignore
-rw-rw-r--  1 circleci circleci  12K Dec  9 11:31 LICENSE.txt
-rw-rw-r--  1 circleci circleci  134 Dec  9 11:31 README.md
-rw-rw-r--  1 circleci circleci  335 Dec  9 11:31 release.iml
-rw-rw-r--  1 circleci circleci  12K Dec  9 11:31 release.json
drwxrwxr-x  4 circleci circleci 4.0K Dec  9 11:31 upgrades
GITHUB_ORG=************
SECRETHUB_ORG=************
SECRETHUB_REPO=****
REPOSITORY                               TAG                 IMAGE ID            CREATED             SIZE
quay.io/************/****-orchestrator   stable-latest       c60f314326e8        28 minutes ago      276MB
-rw------- 1 circleci circleci 143 Dec  9 11:31 /home/circleci/project/.secrets.json
^@^@
Content of DOTENV [./.env] file

-rw-rw-r--    1 root     root        2.3K Dec  9 11:31 ./.env
PRODUCT='Gravitee APIM'
# Soon ? :
# Community Edition
# LICENCE=CE
# Entreprise Edition
# LICENCE=EE

# CICD_PROCESS_MANIFEST_PATH=release-data/apim/1.30.x/tests/tests/release.test1.json
CICD_PROCESS_MANIFEST_PATH=release-data/apim/1.30.x/tests/tests/release.test2.json
CICD_PROCESS_MANIFEST_PATH=graviteeio/****/pipeline/release.json
CICD_PROCESS_MANIFEST_PATH=release-data/apim/1.30.x/tests/release.test4-20-conccurrent.json
CICD_PROCESS_MANIFEST_PATH=release-data/apim/3.1.x/tests/release.test5-25-conccurrent.json
CICD_PROCESS_MANIFEST_PATH=/graviteeio/****/pipeline/release.json

RETRIES_BEFORE_FAILURE=2
# SSH_RELEASE_GIT_REPO='git@github.com:gravitee-io/release.git'
HTTP_RELEASE_GIT_REPO='https://github.com/gravitee-io/release.git'
# String.split()
RELEASE_BRANCHES="master, 3.1.x, 3.0.x, 1.30.x, 1.29.x, 1.25.x, 1.20.x"
SECRETS_FILE_PATH=./.secrets.json
# ---
# ---
# The Gravitee Release Orchestrator must eventually timeout :
# it must stop trying to trigger Circle CI pipelines
# It must stop fetching the Circle CI API for Pipeline status.
# ---
# Time Outs Expressed in seconds only, for first release :
# ++ timeout to trigger a pipeline (defaults to 360)
TRIGGER_TIMEOUT=360
# ++
# timeout for a Parallel Execution Set, before which all pipelines must
# reach a final execution state, with or without errors. (decidable before...).
# Regardless of how many Pipelines a Parallel execution Set may have. Because
# the execution is Parallel, it is less or more, a timeout for any Pipeline Execution to
# reach final execution state.
PIPELINE_COMPLETION_TIMEOUT=360
# ---
# In future releases, support for Time Outs Expressed in seconds, or minutes :
# XXX_TIMEOUT=360s # defaults to 360s
# in minutes :
# XXX_TIMEOUT=10m
# ---

# ---
# The time interval, in milliseconds, between 2 "Watch rounds", of
# the {@link PipelineExecSetStatusWatcher}
EXEC_STATUS_WATCH_INTERVAL=7000
# ---
# Note that `EXEC_STATUS_WATCH_INTERVAL` and `PIPELINE_COMPLETION_TIMEOUT`, together
# determine the maximum _"watch rounds number"_ (roof approximation of the ratio is
# the determined max watch round)


# +++ GITHUB
# +
# + Git Service Provider Organization in which all
#   the https://github.com Git repos live.
#
# GH_ORG=************
GH_ORG=************

# +++ SECRETHUB
# The secrethub org and repo from which to featch all CI CD Secrets
SECRETHUB_ORG=************
SECRETHUB_REPO=****


Starting Orchestrator on [Gravitee APIM]

Script invocation passed arguments are :
--
-s
mvn_release
--dry-run

Start command is :

[npm start -- -s mvn_release --dry-run]


> GraviteeReleaseOrchestrator@0.0.3 start /graviteeio/****
> node ./dist/index.js "-s" "mvn_release" "--dry-run"

{[.DOTENV]} - validating [release_manifest_path]
{[.DOTENV]} - validating [release_manifest_path] NO error should be thrown

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
I am the Gravitee CI CD Orchestrator !
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

{[ index.ts ]} --- valeur yargs de l'option YARGS 'dry-run' : true
{[ index.ts ]} --- valeur yargs de l'option YARGS '****-stage' : mvn_release
{[ index.ts / process.argv ]} --- valeur yargs de l'option YARGS 'dry-run' : true
{[ index.ts / process.argv ]} --- valeur yargs de l'option YARGS '****-stage' : mvn_release
{[ReleaseManifestFilter]} - found release.json release manifest located at [/graviteeio/****/pipeline/release.json]
{[ReleaseManifestFilter]} - Parsing release.json Release Manifest file located at [/graviteeio/****/pipeline/release.json]
{[ReleaseManifestFilter]} - Parsed Manifest is [undefined]
{[ReleaseManifestFilter]} - found release.json release manifest located at [/graviteeio/****/pipeline/release.json]
{[ReleaseManifestFilter]} - Parsing release.json Release Manifest file located at [/graviteeio/****/pipeline/release.json]
{[ReleaseManifestFilter]} - Parsed Manifest is [{
  "name": "Gravitee.io",
  "version": "3.1.5-SNAPSHOT",
  "buildTimestamp": "2020-09-16T15:58:08+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "components": [
    {
      "name": "gravitee-common",
      "version": "1.18.0"
    },
    {
      "name": "gravitee-definition",
      "version": "1.23.2-SNAPSHOT"
    },
    {
      "name": "gravitee-gateway",
      "version": "3.1.4"
    },
    {
      "name": "gravitee-gateway-api",
      "version": "1.21.1"
    },
    {
      "name": "gravitee-management-rest-api",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-management-webui",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-portal-webui",
      "version": "3.1.4"
    },
    {
      "name": "gravitee-plugin",
      "version": "1.13.0"
    },
    {
      "name": "gravitee-policy-api",
      "version": "1.9.0-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-apikey",
      "version": "2.0.0"
    },
    {
      "name": "gravitee-policy-ratelimit",
      "version": "1.8.1"
    },
    {
      "name": "gravitee-policy-request-content-limit",
      "version": "1.5.0"
    },
    {
      "name": "gravitee-policy-transformheaders",
      "version": "1.6.1"
    },
    {
      "name": "gravitee-policy-rest-to-soap",
      "version": "1.6.0"
    },
    {
      "name": "gravitee-policy-transformqueryparams",
      "version": "1.4.1"
    },
    {
      "name": "gravitee-policy-ipfiltering",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-mock",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-cache",
      "version": "1.6.0"
    },
    {
      "name": "gravitee-policy-xslt",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-xml-json",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-oauth2",
      "version": "1.12.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-html-json",
      "version": "1.4.0-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-groovy",
      "version": "1.11.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-dynamic-routing",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-jwt",
      "version": "1.14.4-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-override-http-method",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-policy-request-validation",
      "version": "1.8.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-resource-filtering",
      "version": "1.5.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-json-to-json",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-keyless",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-openid-connect-userinfo",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-latency",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-policy-assign-content",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-jws",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-policy-callout-http",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-assign-attributes",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-reporter-api",
      "version": "1.18.0"
    },
    {
      "name": "gravitee-reporter-file",
      "version": "1.6.2-SNAPSHOT"
    },
    {
      "name": "gravitee-repository",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-test",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-mongodb",
      "version": "3.1.4"
    },
    {
      "name": "gravitee-repository-redis",
      "version": "3.1.1"
    },
    {
      "name": "gravitee-elasticsearch",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-jdbc",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-resource-api",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-resource-cache",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-api",
      "version": "1.3.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-generic",
      "version": "1.13.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-am",
      "version": "1.10.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-keycloak",
      "version": "1.7.0"
    },
    {
      "name": "gravitee-fetcher-api",
      "version": "1.3.0"
    },
    {
      "name": "gravitee-fetcher-http",
      "version": "1.10.1"
    },
    {
      "name": "gravitee-fetcher-git",
      "version": "1.6.0"
    },
    {
      "name": "gravitee-fetcher-gitlab",
      "version": "1.9.3"
    },
    {
      "name": "gravitee-fetcher-bitbucket",
      "version": "1.5.1"
    },
    {
      "name": "gravitee-fetcher-github",
      "version": "1.4.1"
    },
    {
      "name": "gravitee-expression-language",
      "version": "1.4.1"
    },
    {
      "name": "gravitee-repository-gateway-bridge-http",
      "version": "3.1.1"
    },
    {
      "name": "gravitee-policy-url-rewriting",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-json-validation",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-reporter-kafka",
      "version": "1.2.0"
    },
    {
      "name": "graviteeio-node",
      "version": "1.6.6"
    },
    {
      "name": "gravitee-notifier-api",
      "version": "1.2.1"
    },
    {
      "name": "gravitee-notifier-email",
      "version": "1.2.3"
    },
    {
      "name": "gravitee-alert-api",
      "version": "1.5.0-SNAPSHOT"
    },
    {
      "name": "gravitee-service-discovery-api",
      "version": "1.1.1"
    },
    {
      "name": "gravitee-service-discovery-consul",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-generate-jwt",
      "version": "1.3.0"
    },
    {
      "name": "gravitee-service-discovery-eureka",
      "version": "1.1.1"
    },
    {
      "name": "gravitee-policy-role-based-access-control",
      "version": "1.0.2"
    },
    {
      "name": "gravitee-policy-ssl-enforcement",
      "version": "1.0.1"
    },
    {
      "name": "gravitee-policy-json-threat-protection",
      "version": "1.0.0"
    },
    {
      "name": "gravitee-policy-regex-threat-protection",
      "version": "1.0.0"
    },
    {
      "name": "gravitee-policy-xml-threat-protection",
      "version": "1.0.0"
    }
  ],
  "buildDependencies": [
    [
      "gravitee-common"
    ],
    [
      "gravitee-repository",
      "gravitee-expression-language",
      "gravitee-service-discovery-api",
      "gravitee-notifier-api"
    ],
    [
      "gravitee-repository-test",
      "gravitee-service-discovery-consul",
      "gravitee-service-discovery-eureka"
    ],
    [
      "gravitee-reporter-api",
      "gravitee-resource-api",
      "gravitee-definition",
      "gravitee-repository-mongodb",
      "gravitee-repository-redis",
      "gravitee-repository-jdbc",
      "gravitee-repository-gateway-bridge-http",
      "gravitee-fetcher-api",
      "gravitee-alert-api",
      "gravitee-notifier-email"
    ],
    [
      "gravitee-gateway-api"
    ],
    [
      "gravitee-policy-api"
    ],
    [
      "gravitee-plugin"
    ],
    [
      "graviteeio-node"
    ],
    [
      "gravitee-gateway",
      "gravitee-resource-oauth2-provider-api"
    ],
    [
      "gravitee-resource-cache",
      "gravitee-resource-oauth2-provider-generic",
      "gravitee-resource-oauth2-provider-am",
      "gravitee-resource-oauth2-provider-keycloak"
    ],
    [
      "gravitee-policy-apikey",
      "gravitee-policy-ratelimit",
      "gravitee-policy-request-content-limit",
      "gravitee-policy-transformheaders",
      "gravitee-policy-rest-to-soap",
      "gravitee-policy-transformqueryparams",
      "gravitee-policy-ipfiltering",
      "gravitee-policy-mock",
      "gravitee-policy-cache",
      "gravitee-policy-xslt",
      "gravitee-policy-xml-json",
      "gravitee-policy-oauth2",
      "gravitee-policy-html-json",
      "gravitee-policy-groovy",
      "gravitee-policy-dynamic-routing",
      "gravitee-policy-jwt",
      "gravitee-policy-resource-filtering",
      "gravitee-policy-json-to-json",
      "gravitee-policy-keyless",
      "gravitee-policy-override-http-method",
      "gravitee-policy-request-validation",
      "gravitee-policy-openid-connect-userinfo",
      "gravitee-policy-latency",
      "gravitee-policy-assign-content",
      "gravitee-policy-jws",
      "gravitee-policy-url-rewriting",
      "gravitee-policy-json-validation",
      "gravitee-policy-callout-http",
      "gravitee-policy-generate-jwt",
      "gravitee-policy-assign-attributes",
      "gravitee-policy-role-based-access-control",
      "gravitee-policy-ssl-enforcement",
      "gravitee-policy-json-threat-protection",
      "gravitee-policy-regex-threat-protection",
      "gravitee-policy-xml-threat-protection",
      "gravitee-elasticsearch",
      "gravitee-reporter-file",
      "gravitee-reporter-kafka",
      "gravitee-fetcher-http",
      "gravitee-fetcher-git",
      "gravitee-fetcher-gitlab",
      "gravitee-fetcher-bitbucket",
      "gravitee-fetcher-github"
    ],
    [
      "gravitee-management-rest-api",
      "gravitee-management-webui",
      "gravitee-portal-webui"
    ]
  ]
}]
{[ReleaseManifestFilter]} - Loading Parallelization Constraints Matrix from Release Manifest...
{[ReleaseManifestFilter]} - Loaded Parallelization Constraints Matrix from Release Manifest :
[
  [
    'gravitee-common'
  ],
  [
    'gravitee-repository,gravitee-expression-language,gravitee-service-discovery-api,gravitee-notifier-api'
  ],
  [
    'gravitee-repository-test,gravitee-service-discovery-consul,gravitee-service-discovery-eureka'
  ],
  [
    'gravitee-reporter-api,gravitee-resource-api,gravitee-definition,gravitee-repository-mongodb,gravitee-repository-redis,gravitee-repository-jdbc,gravitee-repository-gateway-bridge-http,gravitee-fetcher-api,gravitee-alert-api,gravitee-notifier-email'
  ],
  [
    'gravitee-gateway-api'
  ],
  [
    'gravitee-policy-api'
  ],
  [
    'gravitee-plugin'
  ],
  [
    'graviteeio-node'
  ],
  [
    'gravitee-gateway,gravitee-resource-oauth2-provider-api'
  ],
  [
    'gravitee-resource-cache,gravitee-resource-oauth2-provider-generic,gravitee-resource-oauth2-provider-am,gravitee-resource-oauth2-provider-keycloak'
  ],
  [
    'gravitee-policy-apikey,gravitee-policy-ratelimit,gravitee-policy-request-content-limit,gravitee-policy-transformheaders,gravitee-policy-rest-to-soap,gravitee-policy-transformqueryparams,gravitee-policy-ipfiltering,gravitee-policy-mock,gravitee-policy-cache,gravitee-policy-xslt,gravitee-policy-xml-json,gravitee-policy-oauth2,gravitee-policy-html-json,gravitee-policy-groovy,gravitee-policy-dynamic-routing,gravitee-policy-jwt,gravitee-policy-resource-filtering,gravitee-policy-json-to-json,gravitee-policy-keyless,gravitee-policy-override-http-method,gravitee-policy-request-validation,gravitee-policy-openid-connect-userinfo,gravitee-policy-latency,gravitee-policy-assign-content,gravitee-policy-jws,gravitee-policy-url-rewriting,gravitee-policy-json-validation,gravitee-policy-callout-http,gravitee-policy-generate-jwt,gravitee-policy-assign-attributes,gravitee-policy-role-based-access-control,gravitee-policy-ssl-enforcement,gravitee-policy-json-threat-protection,gravitee-policy-regex-threat-protection,gravitee-policy-xml-threat-protection,gravitee-elasticsearch,gravitee-reporter-file,gravitee-reporter-kafka,gravitee-fetcher-http,gravitee-fetcher-git,gravitee-fetcher-gitlab,gravitee-fetcher-bitbucket,gravitee-fetcher-github'
  ],
  [
    'gravitee-management-rest-api,gravitee-management-webui,gravitee-portal-webui'
  ],
]
{[ReleaseManifestFilter]} - Initializing Empty Execution Plan from Parallelization Constraints Matrix...
{[ReleaseManifestFilter]} - Initialized Empty Execution Plan with 12 empty arrays :
[
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
  [
    ''
  ],
]
{[ReleaseManifestFilter]} - Parsed Manifest is [{
  "name": "Gravitee.io",
  "version": "3.1.5-SNAPSHOT",
  "buildTimestamp": "2020-09-16T15:58:08+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "components": [
    {
      "name": "gravitee-common",
      "version": "1.18.0"
    },
    {
      "name": "gravitee-definition",
      "version": "1.23.2-SNAPSHOT"
    },
    {
      "name": "gravitee-gateway",
      "version": "3.1.4"
    },
    {
      "name": "gravitee-gateway-api",
      "version": "1.21.1"
    },
    {
      "name": "gravitee-management-rest-api",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-management-webui",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-portal-webui",
      "version": "3.1.4"
    },
    {
      "name": "gravitee-plugin",
      "version": "1.13.0"
    },
    {
      "name": "gravitee-policy-api",
      "version": "1.9.0-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-apikey",
      "version": "2.0.0"
    },
    {
      "name": "gravitee-policy-ratelimit",
      "version": "1.8.1"
    },
    {
      "name": "gravitee-policy-request-content-limit",
      "version": "1.5.0"
    },
    {
      "name": "gravitee-policy-transformheaders",
      "version": "1.6.1"
    },
    {
      "name": "gravitee-policy-rest-to-soap",
      "version": "1.6.0"
    },
    {
      "name": "gravitee-policy-transformqueryparams",
      "version": "1.4.1"
    },
    {
      "name": "gravitee-policy-ipfiltering",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-mock",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-cache",
      "version": "1.6.0"
    },
    {
      "name": "gravitee-policy-xslt",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-xml-json",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-oauth2",
      "version": "1.12.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-html-json",
      "version": "1.4.0-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-groovy",
      "version": "1.11.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-dynamic-routing",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-jwt",
      "version": "1.14.4-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-override-http-method",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-policy-request-validation",
      "version": "1.8.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-resource-filtering",
      "version": "1.5.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-json-to-json",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-keyless",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-openid-connect-userinfo",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-latency",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-policy-assign-content",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-policy-jws",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-policy-callout-http",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-assign-attributes",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-reporter-api",
      "version": "1.18.0"
    },
    {
      "name": "gravitee-reporter-file",
      "version": "1.6.2-SNAPSHOT"
    },
    {
      "name": "gravitee-repository",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-test",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-mongodb",
      "version": "3.1.4"
    },
    {
      "name": "gravitee-repository-redis",
      "version": "3.1.1"
    },
    {
      "name": "gravitee-elasticsearch",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-jdbc",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-resource-api",
      "version": "1.1.0"
    },
    {
      "name": "gravitee-resource-cache",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-api",
      "version": "1.3.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-generic",
      "version": "1.13.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-am",
      "version": "1.10.0"
    },
    {
      "name": "gravitee-resource-oauth2-provider-keycloak",
      "version": "1.7.0"
    },
    {
      "name": "gravitee-fetcher-api",
      "version": "1.3.0"
    },
    {
      "name": "gravitee-fetcher-http",
      "version": "1.10.1"
    },
    {
      "name": "gravitee-fetcher-git",
      "version": "1.6.0"
    },
    {
      "name": "gravitee-fetcher-gitlab",
      "version": "1.9.3"
    },
    {
      "name": "gravitee-fetcher-bitbucket",
      "version": "1.5.1"
    },
    {
      "name": "gravitee-fetcher-github",
      "version": "1.4.1"
    },
    {
      "name": "gravitee-expression-language",
      "version": "1.4.1"
    },
    {
      "name": "gravitee-repository-gateway-bridge-http",
      "version": "3.1.1"
    },
    {
      "name": "gravitee-policy-url-rewriting",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-json-validation",
      "version": "1.4.0"
    },
    {
      "name": "gravitee-reporter-kafka",
      "version": "1.2.0"
    },
    {
      "name": "graviteeio-node",
      "version": "1.6.6"
    },
    {
      "name": "gravitee-notifier-api",
      "version": "1.2.1"
    },
    {
      "name": "gravitee-notifier-email",
      "version": "1.2.3"
    },
    {
      "name": "gravitee-alert-api",
      "version": "1.5.0-SNAPSHOT"
    },
    {
      "name": "gravitee-service-discovery-api",
      "version": "1.1.1"
    },
    {
      "name": "gravitee-service-discovery-consul",
      "version": "1.2.0"
    },
    {
      "name": "gravitee-policy-generate-jwt",
      "version": "1.3.0"
    },
    {
      "name": "gravitee-service-discovery-eureka",
      "version": "1.1.1"
    },
    {
      "name": "gravitee-policy-role-based-access-control",
      "version": "1.0.2"
    },
    {
      "name": "gravitee-policy-ssl-enforcement",
      "version": "1.0.1"
    },
    {
      "name": "gravitee-policy-json-threat-protection",
      "version": "1.0.0"
    },
    {
      "name": "gravitee-policy-regex-threat-protection",
      "version": "1.0.0"
    },
    {
      "name": "gravitee-policy-xml-threat-protection",
      "version": "1.0.0"
    }
  ],
  "buildDependencies": [
    [
      "gravitee-common"
    ],
    [
      "gravitee-repository",
      "gravitee-expression-language",
      "gravitee-service-discovery-api",
      "gravitee-notifier-api"
    ],
    [
      "gravitee-repository-test",
      "gravitee-service-discovery-consul",
      "gravitee-service-discovery-eureka"
    ],
    [
      "gravitee-reporter-api",
      "gravitee-resource-api",
      "gravitee-definition",
      "gravitee-repository-mongodb",
      "gravitee-repository-redis",
      "gravitee-repository-jdbc",
      "gravitee-repository-gateway-bridge-http",
      "gravitee-fetcher-api",
      "gravitee-alert-api",
      "gravitee-notifier-email"
    ],
    [
      "gravitee-gateway-api"
    ],
    [
      "gravitee-policy-api"
    ],
    [
      "gravitee-plugin"
    ],
    [
      "graviteeio-node"
    ],
    [
      "gravitee-gateway",
      "gravitee-resource-oauth2-provider-api"
    ],
    [
      "gravitee-resource-cache",
      "gravitee-resource-oauth2-provider-generic",
      "gravitee-resource-oauth2-provider-am",
      "gravitee-resource-oauth2-provider-keycloak"
    ],
    [
      "gravitee-policy-apikey",
      "gravitee-policy-ratelimit",
      "gravitee-policy-request-content-limit",
      "gravitee-policy-transformheaders",
      "gravitee-policy-rest-to-soap",
      "gravitee-policy-transformqueryparams",
      "gravitee-policy-ipfiltering",
      "gravitee-policy-mock",
      "gravitee-policy-cache",
      "gravitee-policy-xslt",
      "gravitee-policy-xml-json",
      "gravitee-policy-oauth2",
      "gravitee-policy-html-json",
      "gravitee-policy-groovy",
      "gravitee-policy-dynamic-routing",
      "gravitee-policy-jwt",
      "gravitee-policy-resource-filtering",
      "gravitee-policy-json-to-json",
      "gravitee-policy-keyless",
      "gravitee-policy-override-http-method",
      "gravitee-policy-request-validation",
      "gravitee-policy-openid-connect-userinfo",
      "gravitee-policy-latency",
      "gravitee-policy-assign-content",
      "gravitee-policy-jws",
      "gravitee-policy-url-rewriting",
      "gravitee-policy-json-validation",
      "gravitee-policy-callout-http",
      "gravitee-policy-generate-jwt",
      "gravitee-policy-assign-attributes",
      "gravitee-policy-role-based-access-control",
      "gravitee-policy-ssl-enforcement",
      "gravitee-policy-json-threat-protection",
      "gravitee-policy-regex-threat-protection",
      "gravitee-policy-xml-threat-protection",
      "gravitee-elasticsearch",
      "gravitee-reporter-file",
      "gravitee-reporter-kafka",
      "gravitee-fetcher-http",
      "gravitee-fetcher-git",
      "gravitee-fetcher-gitlab",
      "gravitee-fetcher-bitbucket",
      "gravitee-fetcher-github"
    ],
    [
      "gravitee-management-rest-api",
      "gravitee-management-webui",
      "gravitee-portal-webui"
    ]
  ]
}]






































{[ReleaseManifestFilter]} - Selected components are [{
  "components": [
    {
      "name": "gravitee-definition",
      "version": "1.23.2-SNAPSHOT"
    },
    {
      "name": "gravitee-management-rest-api",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-management-webui",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-api",
      "version": "1.9.0-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-mock",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-oauth2",
      "version": "1.12.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-html-json",
      "version": "1.4.0-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-groovy",
      "version": "1.11.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-dynamic-routing",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-jwt",
      "version": "1.14.4-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-request-validation",
      "version": "1.8.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-resource-filtering",
      "version": "1.5.1-SNAPSHOT"
    },
    {
      "name": "gravitee-policy-callout-http",
      "version": "1.9.1-SNAPSHOT"
    },
    {
      "name": "gravitee-reporter-file",
      "version": "1.6.2-SNAPSHOT"
    },
    {
      "name": "gravitee-repository",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-test",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-elasticsearch",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-repository-jdbc",
      "version": "3.1.4-SNAPSHOT"
    },
    {
      "name": "gravitee-alert-api",
      "version": "1.5.0-SNAPSHOT"
    }
  ]
}]

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-definition into Parallel Execution Set no. [3] :

{
  "name": "gravitee-definition",
  "version": "1.23.2-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [3] for the following component :
{
  "name": "gravitee-definition",
  "version": "1.23.2-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-management-rest-api into Parallel Execution Set no. [11] :

{
  "name": "gravitee-management-rest-api",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [11] for the following component :
{
  "name": "gravitee-management-rest-api",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-management-webui into Parallel Execution Set no. [11] :

{
  "name": "gravitee-management-webui",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [11] for the following component :
{
  "name": "gravitee-management-webui",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-api into Parallel Execution Set no. [5] :

{
  "name": "gravitee-policy-api",
  "version": "1.9.0-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [5] for the following component :
{
  "name": "gravitee-policy-api",
  "version": "1.9.0-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-mock into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-mock",
  "version": "1.9.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-mock",
  "version": "1.9.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-oauth2 into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-oauth2",
  "version": "1.12.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-oauth2",
  "version": "1.12.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-html-json into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-html-json",
  "version": "1.4.0-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-html-json",
  "version": "1.4.0-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-groovy into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-groovy",
  "version": "1.11.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-groovy",
  "version": "1.11.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-dynamic-routing into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-dynamic-routing",
  "version": "1.9.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-dynamic-routing",
  "version": "1.9.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-jwt into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-jwt",
  "version": "1.14.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-jwt",
  "version": "1.14.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-request-validation into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-request-validation",
  "version": "1.8.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-request-validation",
  "version": "1.8.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-resource-filtering into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-resource-filtering",
  "version": "1.5.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-resource-filtering",
  "version": "1.5.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-policy-callout-http into Parallel Execution Set no. [10] :

{
  "name": "gravitee-policy-callout-http",
  "version": "1.9.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-policy-callout-http",
  "version": "1.9.1-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-reporter-file into Parallel Execution Set no. [10] :

{
  "name": "gravitee-reporter-file",
  "version": "1.6.2-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-reporter-file",
  "version": "1.6.2-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-repository into Parallel Execution Set no. [1] :

{
  "name": "gravitee-repository",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [1] for the following component :
{
  "name": "gravitee-repository",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-repository-test into Parallel Execution Set no. [2] :

{
  "name": "gravitee-repository-test",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [2] for the following component :
{
  "name": "gravitee-repository-test",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-elasticsearch into Parallel Execution Set no. [10] :

{
  "name": "gravitee-elasticsearch",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [10] for the following component :
{
  "name": "gravitee-elasticsearch",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-repository-jdbc into Parallel Execution Set no. [3] :

{
  "name": "gravitee-repository-jdbc",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [3] for the following component :
{
  "name": "gravitee-repository-jdbc",
  "version": "3.1.4-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator searches for gravitee-alert-api into Parallel Execution Set no. [3] :

{
  "name": "gravitee-alert-api",
  "version": "1.5.0-SNAPSHOT"
}

---

{[ReleaseManifestFilter]} - Gravitee Release Orchestrator could determine Parallel Execution Set Index is [3] for the following component :
{
  "name": "gravitee-alert-api",
  "version": "1.5.0-SNAPSHOT"
}

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[ReleaseManifestFilter]} - EXECUTION PLAN is the value of the 'built_execution_plan_is' below :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
 "built_execution_plan_is": [
  [],
  [
   {
    "name": "gravitee-repository",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-repository-test",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-definition",
    "version": "1.23.2-SNAPSHOT"
   },
   {
    "name": "gravitee-repository-jdbc",
    "version": "3.1.4-SNAPSHOT"
   },
   {
    "name": "gravitee-alert-api",
    "version": "1.5.0-SNAPSHOT"
   }
  ],
  [],
  [
   {
    "name": "gravitee-policy-api",
    "version": "1.9.0-SNAPSHOT"
   }
  ],
  [],
  [],
  [],
  [],
  [
   {
    "name": "gravitee-policy-mock",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-oauth2",
    "version": "1.12.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-html-json",
    "version": "1.4.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-groovy",
    "version": "1.11.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-dynamic-routing",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-jwt",
    "version": "1.14.4-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-request-validation",
    "version": "1.8.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-resource-filtering",
    "version": "1.5.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-callout-http",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-reporter-file",
    "version": "1.6.2-SNAPSHOT"
   },
   {
    "name": "gravitee-elasticsearch",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-management-rest-api",
    "version": "3.1.4-SNAPSHOT"
   },
   {
    "name": "gravitee-management-webui",
    "version": "3.1.4-SNAPSHOT"
   }
  ]
 ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x


[{CircleCIClient}] - loaded secrets file content :

{
  circleci: {
    auth: {
      username: 'Gravitee.io Lab Bot',
      token: '12a53887ba0e1a98eb2b81ae505b2a9b97164e16'
    }
  }
}


+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[CircleCiOrchestrator]} - STARTING PROCESSING EXECUTION PLAN -
[{CircleCiOrchestrator}] - will retry 5 times triggering a [Circle CI] pipeline before giving up.
{[CircleCiOrchestrator]} - Execution plan is the value of the 'execution_plan_is' below :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
 "execution_plan_is": [
  [],
  [
   {
    "name": "gravitee-repository",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-repository-test",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-definition",
    "version": "1.23.2-SNAPSHOT"
   },
   {
    "name": "gravitee-repository-jdbc",
    "version": "3.1.4-SNAPSHOT"
   },
   {
    "name": "gravitee-alert-api",
    "version": "1.5.0-SNAPSHOT"
   }
  ],
  [],
  [
   {
    "name": "gravitee-policy-api",
    "version": "1.9.0-SNAPSHOT"
   }
  ],
  [],
  [],
  [],
  [],
  [
   {
    "name": "gravitee-policy-mock",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-oauth2",
    "version": "1.12.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-html-json",
    "version": "1.4.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-groovy",
    "version": "1.11.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-dynamic-routing",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-jwt",
    "version": "1.14.4-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-request-validation",
    "version": "1.8.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-resource-filtering",
    "version": "1.5.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-callout-http",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-reporter-file",
    "version": "1.6.2-SNAPSHOT"
   },
   {
    "name": "gravitee-elasticsearch",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-management-rest-api",
    "version": "3.1.4-SNAPSHOT"
   },
   {
    "name": "gravitee-management-webui",
    "version": "3.1.4-SNAPSHOT"
   }
  ]
 ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{CircleCiOrchestrator}] - processing Parallel Execution Set no. [0] will trigger the following [Circle CI] pipelines :
[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. [0] because it is empty, proceed with next
[{CircleCiOrchestrator}] - processing Parallel Execution Set no. [1] will trigger the following [Circle CI] pipelines :

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[ReactiveParallelExecutionSet]} - Processing Parallel Executions Set : the set under processing is the value of the 'parallelExecutionsSet' below :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
 "parallelExecutionsSet": [
  {
   "name": "gravitee-repository",
   "version": "3.1.4-SNAPSHOT"
  }
 ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.name : [gravitee-repository]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.version : [3.1.4-SNAPSHOT]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - so component git branch to trigger pipeline on is : [3.1.x]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of process.argv["dry-run"] : [true]
curl -X POST -d {"parameters":{"gio_action":"release","dry_run":true,"secrethub_org":"************","secrethub_repo":"****"},"branch":"3.1.x"} -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: 12a53887ba0e1a98eb2b81ae505b2a9b97164e16' https://circleci.com/api/v2/project/gh/************/gravitee-repository/pipeline
[{ReactiveParallelExecutionSet}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] =>  {
  number: 100,
  state: 'pending',
  id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
  created_at: '2020-12-09T11:31:35.607Z',
  project_slug: 'gh/************/gravitee-repository'
}
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], Progress Matrix is now  :
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '100',
    id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
    created_at: '2020-12-09T11:31:35.607Z',
    exec_state: 'pending',
    project_slug: 'gh/************/gravitee-repository'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], this.pipelines_nb : [1]
[ --- [ReactiveParallelExecutionSet], triggerProgress.length : [1]
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '100',
    id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
    created_at: '2020-12-09T11:31:35.607Z',
    exec_state: 'pending',
    project_slug: 'gh/************/gravitee-repository'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [{ReactiveParallelExecutionSet}] - progress Matrix Observer: NEXT
[ --- [{ReactiveParallelExecutionSet}] - All Pipelines have been triggered !
[-----------------------------------------------]
DEBUG [{PipelineExecSetStatusWatcher}] - [constructor] - I am the constructor, I actually am called
DEBUG [{PipelineExecSetStatusWatcher}] - [constructor] - Inspecting object [ this.progressMatrix[0] ] :
----
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 0,
      workflows_exec_state: []
    }
  ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [constructor] - AFTER FOR LOOP - Inspecting Array [ this.progressMatrix ] :
----
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 0,
      workflows_exec_state: []
    }
  ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [start()] - actually starting in  [14000] milliseconds.
[{ReactiveParallelExecutionSet}] Now verifying that If I do not invoke [this.orchestratorNotifier.next(1);] then nothing happens at all
[{[ReactiveParallelExecutionSet]} - triggering Circle CI Build completed! :)]

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 0,
      workflows_exec_state: []
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 0,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [0] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 1,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 1,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 1]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 1,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 1,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [1] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 2,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 2,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 2]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 2,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 2,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [2] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 3,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 3,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 3]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 3,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 3,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [3] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 4,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 4,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 4]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 4,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 4,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [4] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 5,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 5,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 5]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 5,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 5,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [5] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 6,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 6,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 6]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 6,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 6,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [6] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 7,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 7,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 7]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 7,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 7,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [7] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 8,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 8,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 8]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 8,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 8,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [8] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 9,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 9,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 9]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 9,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 9,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [9] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 10,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 10,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 10]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 10,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 10,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [10] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 11,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 11,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 11]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 11,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 11,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [11] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 12,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 12,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 12]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 12,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 12,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [12] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 13,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 13,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 13]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 13,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 13,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [13] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 14,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 14,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 14]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 14,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 14,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [14] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 15,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 15,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 15]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 15,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 15,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [15] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 16,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 16,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 16]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 16,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 16,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [16] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 17,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 17,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 17]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 17,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 17,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [17] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 18,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 18,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 18]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 18,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 18,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [18] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 19,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 19,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 19]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 19,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 19,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [19] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 20,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 20,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 20]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 20,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 20,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [20] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 21,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 21,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 21]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 21,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 21,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [21] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 22,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 22,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 22]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 22,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 22,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [22] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 23,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 23,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 23]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 23,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 23,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [23] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 24,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 24,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 24]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 24,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 24,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [24] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 25,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 25,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 25]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 25,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 25,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [25] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 26,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 26,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 26]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 26,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 26,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [26] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 27,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 27,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 27]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 27,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 27,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [27] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 28,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 28,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 28]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 28,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 28,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [28] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 29,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 29,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 29]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 29,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 29,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [29] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 30,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 30,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 30]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 30,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 30,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [30] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 31,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 31,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 31]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 31,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 31,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [31] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 32,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 32,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 32]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 32,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 32,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [32] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 33,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 33,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 33]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 33,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 33,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [33] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 34,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 34,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 34]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 34,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 34,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [34] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 35,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 35,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 35]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 35,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 35,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [35] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 36,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 36,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 36]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 36,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 36,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [36] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 37,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 37,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 37]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 37,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 37,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [37] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 38,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 38,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 38]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 38,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 38,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [38] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 39,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 39,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 39]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 39,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 39,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [39] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 40,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 40,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 40]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 40,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 40,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [40] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 41,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 41,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 41]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 41,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 41,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [41] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 42,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 42,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 42]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 42,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 42,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [42] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 43,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 43,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 43]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 43,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 43,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [43] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 44,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 44,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 44]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 44,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 44,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [44] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 45,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 45,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 45]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '100',
      id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      created_at: '2020-12-09T11:31:35.607Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository',
      watch_round: 45,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [a525dfb1-8b84-4645-8e44-7972c26aeec7]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/a525dfb1-8b84-4645-8e44-7972c26aeec7/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: 'a525dfb1-8b84-4645-8e44-7972c26aeec7',
      id: 'c2abcb97-ec23-47ef-9666-a9f34ac24501',
      name: 'release_dry_run',
      project_slug: 'gh/************/gravitee-repository',
      status: 'success',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 100,
      created_at: '2020-12-09T11:31:36Z',
      stopped_at: '2020-12-09T11:37:13Z'
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "100",
 "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
 "created_at": "2020-12-09T11:31:35.607Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository",
 "watch_round": 45,
 "workflows_exec_state": [
  {
   "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
   "name": "release_dry_run",
   "project_slug": "gh/************/gravitee-repository",
   "status": "success",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 100,
   "created_at": "2020-12-09T11:31:36Z",
   "stopped_at": "2020-12-09T11:37:13Z"
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [45] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 46,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "success",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": "2020-12-09T11:37:13Z"
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [a525dfb1-8b84-4645-8e44-7972c26aeec7] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 46,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "success",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": "2020-12-09T11:37:13Z"
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 46]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - All Workflows ofall Pipelines in [this.progressMatrix] have reached 'success' execution status ! :D
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - [this.progressMatrix] finally is  :
----
{
 "finalProgressMatrix": [
  {
   "pipeline_exec_number": "100",
   "id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
   "created_at": "2020-12-09T11:31:35.607Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository",
   "watch_round": 46,
   "workflows_exec_state": [
    {
     "pipeline_id": "a525dfb1-8b84-4645-8e44-7972c26aeec7",
     "id": "c2abcb97-ec23-47ef-9666-a9f34ac24501",
     "name": "release_dry_run",
     "project_slug": "gh/************/gravitee-repository",
     "status": "success",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 100,
     "created_at": "2020-12-09T11:31:36Z",
     "stopped_at": "2020-12-09T11:37:13Z"
    }
   ]
  }
 ]
}
----
[-----------------------------------------------]
[ --- All pipelines in the ParallelExecutionSet of index [1] have succesfully completed their execution
[ --- The ParallelExecutionSet is :
[ { name: 'gravitee-repository', version: '3.1.4-SNAPSHOT' } ]
[-----------------------------------------------]
[ --- Now notifying the [CircleCiOrchestrator] to proceed with next Parallel Execution Set
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x
{[CircleCiOrchestrator]} - PARALLEL EXECUTION SET NO.[1] JUST COMPLETED TRIGGERING [CIRCLE CI] PIPELINES -
{[CircleCiOrchestrator]} - NOW EXECUTING NEXT PARALLEL EXECUTION SET NO.[2]  -
[{CircleCiOrchestrator}] - processing Parallel Execution Set no. [2] will trigger the following [Circle CI] pipelines :

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[ReactiveParallelExecutionSet]} - Processing Parallel Executions Set : the set under processing is the value of the 'parallelExecutionsSet' below :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
 "parallelExecutionsSet": [
  {
   "name": "gravitee-repository-test",
   "version": "3.1.4-SNAPSHOT"
  }
 ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.name : [gravitee-repository-test]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.version : [3.1.4-SNAPSHOT]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - so component git branch to trigger pipeline on is : [3.1.x]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of process.argv["dry-run"] : [true]
curl -X POST -d {"parameters":{"gio_action":"release","dry_run":true,"secrethub_org":"************","secrethub_repo":"****"},"branch":"3.1.x"} -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: 12a53887ba0e1a98eb2b81ae505b2a9b97164e16' https://circleci.com/api/v2/project/gh/************/gravitee-repository-test/pipeline
{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
[-----------------------------------------------]
[{ReactiveParallelExecutionSet}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] =>  {
  number: 80,
  state: 'pending',
  id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
  created_at: '2020-12-09T11:37:15.034Z',
  project_slug: 'gh/************/gravitee-repository-test'
}
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], Progress Matrix is now  :
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '80',
    id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
    created_at: '2020-12-09T11:37:15.034Z',
    exec_state: 'pending',
    project_slug: 'gh/************/gravitee-repository-test'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], this.pipelines_nb : [1]
[ --- [ReactiveParallelExecutionSet], triggerProgress.length : [1]
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '80',
    id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
    created_at: '2020-12-09T11:37:15.034Z',
    exec_state: 'pending',
    project_slug: 'gh/************/gravitee-repository-test'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [{ReactiveParallelExecutionSet}] - progress Matrix Observer: NEXT
[ --- [{ReactiveParallelExecutionSet}] - All Pipelines have been triggered !
[-----------------------------------------------]
DEBUG [{PipelineExecSetStatusWatcher}] - [constructor] - I am the constructor, I actually am called
DEBUG [{PipelineExecSetStatusWatcher}] - [constructor] - Inspecting object [ this.progressMatrix[0] ] :
----
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 0,
      workflows_exec_state: []
    }
  ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [constructor] - AFTER FOR LOOP - Inspecting Array [ this.progressMatrix ] :
----
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 0,
      workflows_exec_state: []
    }
  ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [start()] - actually starting in  [14000] milliseconds.
[{ReactiveParallelExecutionSet}] Now verifying that If I do not invoke [this.orchestratorNotifier.next(2);] then nothing happens at all
[{[ReactiveParallelExecutionSet]} - triggering Circle CI Build completed! :)]

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 0,
      workflows_exec_state: []
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 0,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [0] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 1,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 1,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 1]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 1,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 1,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [1] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 2,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 2,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 2]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 2,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 2,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [2] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 3,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 3,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 3]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 3,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 3,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [3] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 4,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 4,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 4]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 4,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 4,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [4] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 5,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 5,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 5]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 5,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 5,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [5] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 6,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 6,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 6]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 6,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 6,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [6] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 7,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 7,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 7]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 7,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 7,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [7] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 8,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 8,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 8]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 8,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 8,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [8] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 9,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 9,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 9]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 9,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 9,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [9] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 10,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 10,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 10]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 10,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 10,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [10] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 11,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 11,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 11]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 11,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 11,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [11] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 12,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 12,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 12]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 12,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 12,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [12] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 13,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 13,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 13]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 13,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 13,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [13] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 14,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 14,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 14]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 14,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 14,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [14] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 15,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 15,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 15]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 15,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 15,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [15] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 16,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 16,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 16]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 16,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 16,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [16] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 17,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 17,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 17]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 17,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 17,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [17] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 18,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 18,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 18]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 18,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 18,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [18] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 19,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 19,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 19]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 19,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 19,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [19] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 20,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 20,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 20]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 20,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 20,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [20] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 21,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 21,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 21]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 21,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 21,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [21] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 22,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 22,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 22]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 22,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 22,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [22] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 23,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 23,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 23]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 23,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 23,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [23] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 24,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 24,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 24]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 24,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 24,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [24] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 25,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 25,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 25]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 25,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 25,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [25] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 26,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 26,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 26]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 26,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 26,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [26] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 27,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 27,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 27]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 27,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 27,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [27] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 28,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 28,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 28]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 28,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 28,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [28] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 29,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 29,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 29]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 29,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 29,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [29] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 30,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 30,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 30]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 30,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'running',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: null
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 30,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "running",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": null
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] before pagination mgmt
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null] insid (if) for pagination management
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] finished workflow pagination to update [progressMatrix], so now incrementing [watch_round]
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] before incrementing [ this.progressMatrix[0].watch_round = [30] ]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - AFTER PUSHING RETRIEVED WORKFLOW STATES - Inspecting Array [ this.progressMatrix ] :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 31,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
[{PipelineExecSetStatusWatcher}] - Inspecting Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] Workflows Execution state, in Circle CI Page [next_page_token=null]  completed! :) ]
[{PipelineExecSetStatusWatcher}] - and now, using the RxJS Subject to check if current watch_round is over
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - this.progressMatrix is :
----
{
 "inspectedArray": [
  {
   "pipeline_exec_number": "80",
   "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "created_at": "2020-12-09T11:37:15.034Z",
   "exec_state": "pending",
   "project_slug": "gh/************/gravitee-repository-test",
   "watch_round": 31,
   "workflows_exec_state": [
    {
     "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
     "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
     "name": "release",
     "project_slug": "gh/************/gravitee-repository-test",
     "status": "running",
     "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
     "pipeline_number": 80,
     "created_at": "2020-12-09T11:37:15Z",
     "stopped_at": null
    }
   ]
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [isWatchRoundOver] Current Watch Round is [this.watch_round = 31]
DEBUG [{PipelineExecSetStatusWatcher}] - [this.progressMatrixUpdatesNotifier SUBSCRIPTION] - laucnching a new watch round in [7000] milliseconds.

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[PipelineExecSetStatusWatcher]} - [{updateProgressMatrixWithAllWorkflowsExecStatus}] Updating Progress Matrix Execution state of each Pipeline :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
 ---
{
  progressMatrix: [
    {
      pipeline_exec_number: '80',
      id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      created_at: '2020-12-09T11:37:15.034Z',
      exec_state: 'pending',
      project_slug: 'gh/************/gravitee-repository-test',
      watch_round: 31,
      workflows_exec_state: [Array]
    }
  ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{PipelineExecSetStatusWatcher}] - [updateProgressMatrixWorkflowsExecStatus(parent_pipeline_guid: string)] - value of Pipeline GUID : [63abb1eb-b82f-4184-9af6-ae523bacb36f]
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <secret token value>' https://circleci.com/api/v2/pipeline/63abb1eb-b82f-4184-9af6-ae523bacb36f/workflow
[{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] Processing Circle CI API Response [data] is :  {
  next_page_token: null,
  items: [
    {
      pipeline_id: '63abb1eb-b82f-4184-9af6-ae523bacb36f',
      canceled_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      id: '734c1398-b672-45da-aeae-b17dc0f61ab4',
      name: 'release',
      project_slug: 'gh/************/gravitee-repository-test',
      status: 'canceled',
      started_by: 'a159e94e-3763-474d-8c51-d1ea6ed602d4',
      pipeline_number: 80,
      created_at: '2020-12-09T11:37:15Z',
      stopped_at: '2020-12-09T11:41:10Z'
    }
  ]
}
[{PipelineExecSetStatusWatcher}] - [getIndexInProgresMatrixOfPipeline] - Pipeline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f] was found in progressMatrix, its index is : [0]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = null]
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - In FOR LOOP Inspecting object [ this.progressMatrix[0] ] :
----
{
 "pipeline_exec_number": "80",
 "id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
 "created_at": "2020-12-09T11:37:15.034Z",
 "exec_state": "pending",
 "project_slug": "gh/************/gravitee-repository-test",
 "watch_round": 31,
 "workflows_exec_state": [
  {
   "pipeline_id": "63abb1eb-b82f-4184-9af6-ae523bacb36f",
   "canceled_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "id": "734c1398-b672-45da-aeae-b17dc0f61ab4",
   "name": "release",
   "project_slug": "gh/************/gravitee-repository-test",
   "status": "canceled",
   "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
   "pipeline_number": 80,
   "created_at": "2020-12-09T11:37:15Z",
   "stopped_at": "2020-12-09T11:41:10Z"
  }
 ]
}
----
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] [occuredProblem = Error: For Circle CI Pipline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f], the [release] workflow of GUID [734c1398-b672-45da-aeae-b17dc0f61ab4]  has failed to complete its execution, because some human canceled the Pipeline execution] inside wfstate loop
DEBUG [{PipelineExecSetStatusWatcher}] - [handleInspectPipelineExecStateResponseData] - inside if where [PipelineExecSetReportLogger] is instantitated, passing to constructor the Error : [occuredProblem = Error: For Circle CI Pipline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f], the [release] workflow of GUID [734c1398-b672-45da-aeae-b17dc0f61ab4]  has failed to complete its execution, because some human canceled the Pipeline execution]
/graviteeio/****/node_modules/rxjs/internal/util/hostReportError.js:4
    setTimeout(function () { throw err; }, 0);
                             ^

Error: For Circle CI Pipline of GUID [63abb1eb-b82f-4184-9af6-ae523bacb36f], the [release] workflow of GUID [734c1398-b672-45da-aeae-b17dc0f61ab4]  has failed to complete its execution, because some human canceled the Pipeline execution
    at PipelineExecSetStatusWatcher.handleInspectPipelineExecStateResponseData (/graviteeio/****/dist/modules/circleci/status/PipelineExecSetStatusWatcher.js:366:34)
    at SafeSubscriber.__tryOrUnsub (/graviteeio/****/node_modules/rxjs/internal/Subscriber.js:205:16)
    at SafeSubscriber.next (/graviteeio/****/node_modules/rxjs/internal/Subscriber.js:143:22)
    at Subscriber._next (/graviteeio/****/node_modules/rxjs/internal/Subscriber.js:89:26)
    at Subscriber.next (/graviteeio/****/node_modules/rxjs/internal/Subscriber.js:66:18)
    at /graviteeio/****/dist/modules/circleci/CircleCIClient.js:254:26
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! GraviteeReleaseOrchestrator@0.0.3 start: `node ./dist/index.js "-s" "mvn_release" "--dry-run"`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the GraviteeReleaseOrchestrator@0.0.3 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2020-12-09T11_41_12_634Z-debug.log

Exited with code exit status 1
```
