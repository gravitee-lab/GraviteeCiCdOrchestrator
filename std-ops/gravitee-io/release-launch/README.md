# Trigger Release and Dry Run Release with a `curl`

* Trigger a dry run :

```bash
# It should be SECRETHUB_ORG=graviteeio, but Cirlce CI token is related to
# a Circle CI User, not an Org, so jsut reusing the same than for Gravtiee-Lab here, to work faster
# ---
SECRETHUB_ORG=gravitee-lab
SECRETHUB_REPO=cicd
# Nevertheless, I today think :
# Each team member should have his own personal secrethub repo in the [graviteeio] secrethub org.
# like this :
# a [graviteeio/${TEAM_MEMBER_NAME}] secrethub repo for each team member
# and the Circle CI Personal Access token stored with [graviteeio/${TEAM_MEMBER_NAME}/circleci/token]
# ---
export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")
export CCI_TOKEN=<you circle ci personal access token>
export ORG_NAME="gravitee-io"
export REPO_NAME="release"
export BRANCH="3.0.0-beta"
export BRANCH="3.4.x"
# testing 3.5.0
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"dry_release\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```

* Here is the execution plan for the `3.5.0` release :

```bash
{
 "execution_plan_is": [
  [],
  [
   {
    "name": "gravitee-repository",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-notifier-api",fff
    "version": "1.4.0-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-repository-test",
    "version": "3.5.0-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-definition",
    "version": "1.25.0-SNAPSHOT"
   },
   {
    "name": "gravitee-repository-mongodb",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-repository-jdbc",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-repository-gateway-bridge-http",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-alert-api",
    "version": "1.6.0-SNAPSHOT"
   }
  ],
  [],
  [],
  [],
  [],
  [
   {
    "name": "gravitee-gateway",
    "version": "3.5.0-SNAPSHOT"
   }
  ],
  [],
  [
   {
    "name": "gravitee-policy-ratelimit",
    "version": "1.11.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-jwt",
    "version": "1.16.0-SNAPSHOT"
   },
   {
    "name": "gravitee-elasticsearch",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-json-validation",
    "version": "1.6.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-xml-validation",
    "version": "1.1.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-ssl-enforcement",
    "version": "1.2.0-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-management-rest-api",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-management-webui",
    "version": "3.5.0-SNAPSHOT"
   },
   {
    "name": "gravitee-portal-webui",
    "version": "3.5.0-SNAPSHOT"
   }
  ]
 ]
}
 ---
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
```

* prepared reference data list :

* [x] Fork of https://github.com/gravitee-io/release when release 3.5.0 was made
* [x] Fork of https://github.com/gravitee-io/gravitee-portal-webui when release 3.5.0 was made    gravitee-portal-webui-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-management-webui when release 3.5.0 was made    gravitee-management-webui-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-management-rest-api when release 3.5.0 was made    gravitee-management-rest-api-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-policy-ssl-enforcement when release 3.5.0 was made    gravitee-policy-ssl-enforcement-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-policy-xml-validation when release 3.5.0 was made    gravitee-policy-xml-validation-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-policy-json-validation when release 3.5.0 was made    gravitee-policy-json-validation-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-elasticsearch when release 3.5.0 was made    gravitee-elasticsearch-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-policy-jwt when release 3.5.0 was made    gravitee-policy-jwt-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-policy-ratelimit when release 3.5.0 was made    gravitee-policy-ratelimit-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-gateway when release 3.5.0 was made    gravitee-gateway-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-alert-api when release 3.5.0 was made    gravitee-alert-api-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-repository-gateway-bridge-http when release 3.5.0 was made    gravitee-repository-gateway-bridge-http-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-repository-jdbc when release 3.5.0 was made    gravitee-repository-jdbc-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-repository-mongodb when release 3.5.0 was made    gravitee-repository-mongodb-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-definition when release 3.5.0 was made    gravitee-definition-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-repository-test when release 3.5.0 was made    gravitee-repository-test-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-notifier-api when release 3.5.0 was made    gravitee-notifier-api-release-3-5-0
* [x] Fork of https://github.com/gravitee-io/gravitee-repository when release 3.5.0 was made    gravitee-repository-release-3-5-0









* Trigger a release :

```bash
SECRETHUB_ORG=graviteeio
SECRETHUB_REPO=cicd

export HUMAN_NAME=jblasselle
export CCI_TOKEN=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/humans/${HUMAN_NAME}/circleci/token")

export ORG_NAME="gravitee-io"
export REPO_NAME="release"
export BRANCH="3.0.x"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .

```
