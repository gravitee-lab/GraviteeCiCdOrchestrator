# Resume release feature



## Specs : resume nexus staging

<!-- TO DO -->



## Dev Test suite 1

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




# Test1 : a release which completes successfully

* Test 1, on branch `4.1.x` of [the release repo used for this test](https://github.com/gravitee-lab/release-with-nexus-staging-test1) :

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

* reduced `release.json` :

```JSon
{
    "name": "Gravitee.io",
    "version": "4.1.4-SNAPSHOT",
    "buildTimestamp": "2020-10-15T07:19:32+0000",
    "scmSshUrl": "git@github.com:gravitee-io",
    "scmHttpUrl": "https://github.com/gravitee-io/",
    "components": [
        {
            "name": "graviteek-cicd-test-maven-project-g1",
            "version": "4.1.43-SNAPSHOT"
        },
        {
            "name": "graviteek-cicd-test-maven-project-g2",
            "version": "4.2.70-SNAPSHOT"
        },
    ],
    "buildDependencies": [
        [
            "graviteek-cicd-test-maven-project-g1"
        ],
        [
            "graviteek-cicd-test-maven-project-g2"
        ]
     ]
}
```

#### Expected result

* a s3 bucket is created, with name `prepared-nexus-staging-gravitee-apim-4.1.4`
* the s3 bucket contains 4 subfolders :
  * `graviteek-cicd-test-maven-project-g1/project`
  * `graviteek-cicd-test-maven-project-g1/mavenm2`
  * `graviteek-cicd-test-maven-project-g1/project`
  * `graviteek-cicd-test-maven-project-g1/mavenm2`
* at the end of the release, the package bundle python is triggered
* at the beginning of the 
The https://github.com/gravitee-lab/nexus-staging

# Test 2 : then nexus_staging

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
