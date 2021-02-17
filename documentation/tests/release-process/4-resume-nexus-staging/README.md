# Resume release feature


Next steps :

* Faire une release APIM `1.25.x` :
  * pour support
  * pour les issues :
    * https://github.com/gravitee-io/issues/milestone/132?closed=1
    * 3 repos gateway reat-api ui (à )

* pour tester dans gravitee-io, nexus staging après release :
  * se lance par un `curl`
  * 2 secrets : secret s3 , `settings.xml` qui contient les credentials
  * reste à faire : fix la signature GPG pour le maven deploy

* pour tester dans gravitee-io, package bundle :
  * créer le secret s3, (le secret ARTIFACTORY username/password est déjà créé)
  * reste à faire :
    * webui custom pour le package bundle
    * se lance avec un curl
    * synchroniser avec nicolas ce qui existe déjà dans la Apache


## What we need to prepare full release

* Create the https://github.com/gravitee-io/nexus-staging repo
* Update the `.circleci/config.yml` in :
  * dev repos
  * release repo : to add job to prepare S3 bucket for nexus staging, and

* create in secrethub the secret `settings.xml` for the nexus staging :

```bash
export SECRETHUB_ORG=gravitee-lab
export SECRETHUB_REPO=cicd

# secrethub mkdir --parents "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/"

# export NEXUS_STAGING_BOT_USER_NAME=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/nexus_staging_bot_user_name)
# export NEXUS_STAGING_BOT_USER_PWD=$(secrethub read ${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/nexus_staging_bot_user_pwd)

export NEXUS_STAGING_BOT_USER_NAME=jbljbljbl
export NEXUS_STAGING_BOT_USER_PWD=jbljbljbl

# ---
#
cat << EOF >./settings.nexus-staging.xml
<?xml version="1.0" encoding="UTF-8"?>
<!--

    Copyright (C) 2015 The Gravitee team (http://gravitee.io)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <pluginGroups></pluginGroups>
  <proxies></proxies>
  <servers>
    <server>
      <id>sonatype-nexus-staging</id>
      <username>${NEXUS_STAGING_BOT_USER_NAME}</username>
      <password>${NEXUS_STAGING_BOT_USER_PWD}</password>
    </server>
  </servers>
  <!--
  <activeProfiles>
  <activeProfile>gravitee-release</activeProfile>
  </activeProfiles>
  -->
</settings>
EOF

secrethub write --in-file ./settings.nexus-staging.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/settings.nexus-staging.xml"
secrethub read --out-file ./test.settings.nexus-staging.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/settings.nexus-staging.xml"

cat ./test.settings.nexus-staging.xml
rm ./test.settings.nexus-staging.xml

```


## How to run the full release, with nexus-staging (and package bundle)

### Launch a release

* I launch a release, on branch `4.1.x` of [the release repo used for this test](https://github.com/gravitee-lab/release-with-nexus-staging-test1) :

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

export ORG_NAME="gravitee-lab"
export REPO_NAME="release-with-nexus-staging-test1"
export BRANCH="4.1.x"
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


_**Expected result**_

* a s3 bucket is created, with name `prepared-nexus-staging-gravitee-apim-4_1_12`
* the s3 bucket contains 4 subfolders :
  * `graviteek-cicd-test-maven-project-g1/project`
  * `graviteek-cicd-test-maven-project-g1/mavenm2`
  * `graviteek-cicd-test-maven-project-g1/project`
  * `graviteek-cicd-test-maven-project-g1/mavenm2`
* at the end of the release, the package bundle python is triggered
* at the beginning of the https://github.com/gravitee-lab/nexus-staging

### Launch the nexus staging

After the release is successful, I will then execute the Gravitee CI CD Orchestrator in the https://github.com/gravitee-lab/nexus-staging repo :

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

export ORG_NAME="gravitee-lab"
export REPO_NAME="nexus-staging"
export BRANCH="4.1.x"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"nexus_staging\",
        \"gio_product_version\": \"4.1.14\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```

### Launch the package bundle for https://download.gravitee.io

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

export ORG_NAME="gravitee-lab"
export REPO_NAME="release-with-nexus-staging-test1"
export BRANCH="4.1.x"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"publish_bundles\",
        \"gio_release_version\": \"3.3.0\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```



## Test Design notes

The test is similar to the tests of the resume release :
* I launch a release
* It must start by creating a fresh bucket dedicated to the release version
* in each dev repo, the `.circleci/config.yml` :
  * the `gravitee/release` Orb job of the `graviteeio/gravitee@dev:1.0.4` Circle CI Orbis modified :
    * to have a new Orb Job parameter `s3_bucket_name`
    * to execute on more Orb command named `gravitee/nexus_staging_prepare_component`, with provided Orb command Parameters :
      * `s3_bucket_name`
      * and the same other 5 parameters provided to all of the other Orb commands used by the `graivtee/release` Orb Job
  * has a new Circle CI Workflow, named the `nexus_staging`, executing the `gravitee/nexus_staging` Orb Command, which  :
    * is triggered by the Gravitee CI CD Orchestrator with the ` -s mvn_nexus_staging` GNU Option, providing the following pipeline parameters :
      * `s3_bucket_name` : Name of the S3 Bucket used to store and retrieve the state of the maven project, to perform the nexus staging
      *
    * retrieves the maven project and its `̀${HOME}/.m2` folder from the s3 bucket of name provided as Orb command parameter, with a pipeline parameter (comes from the Gravitee Circle CI Orchestrator)
    * runs the maven command `mvn -s ./settings.xml -P gravitee-release deploy` , where the `./settings.xml` holds the credentials to authenticate for nexus staging.
