# Resume release feature



## Specs : resume release feature

* reprise sur erreur : on persiste chaque succès de pipeline en enlevant un suffixe `-SNAPSHOT`
* Quand la release est terminée, entièrement avec succès :
  * on tag avec le numéro de release, sur la branche du repo https://github.com/${GITHUB_ORG}/release
  * on fait un autre commit pour le "prepare next `-SNAPSHOT` version" sur la branche release pour la "top version" dans le `release.json`


## Dev Test suite 1

The test is simple :

* I create a very simple Java project, that I can succesfully easily release with "almost" the same process that all dev repos:
  * using the same `gio-release` maven profile,
  * using the same Circle CI Orb `gravitee-io/gravitee@dev:1.0.4`,
  * only difference :
    * Instead of using the Circle CI Orb `gravitee-io/gravitee@dev:1.0.4` `release` Orb job, used to release every Gravtiee Components in their Circle CI Pipeline,
    * The Circle CI Pipeline of the simple Java test project will use 3 of the 4 Orb commands, of which the Orb `release` Job is made

  * The Circle CI Orb `gravitee-io/gravitee@dev:1.0.4` `release` Orb job, executes the below Orb commands :
    * `mvn_prepare_release`
    * `mvn_test_release`
    * `mvn_release`
    * `git_release`
  * For this test, the simple Java project's Circle CI pipeline will execute, in the order they are listed, the below  Circle CI Orb `gravitee-io/gravitee@dev:1.0.4` Orb commands :
    * `mvn_prepare_release`
    * `mvn_test_release`
    * `mvn_release`

Note the Orb commands will be invoked with the exact same parameters as they are invoked in the `release` Orb job, but directly valued from the Circle CI Pipeline parameters, instead of Orb Job parameters :

So instead of invoking the `Orb` commands like this :

```Yaml
    - mvn_prepare_release:
        dry_run: << parameters.dry_run >>
        maven_container_image_tag: << parameters.maven_container_image_tag >>
        maven_profile_id: << parameters.maven_profile_id>>
        secrethub_org: << parameters.secrethub_org >>
        secrethub_repo: << parameters.secrethub_repo >>
    - mvn_test_release:
        dry_run: << parameters.dry_run >>
        maven_container_image_tag: << parameters.maven_container_image_tag >>
        maven_profile_id: << parameters.maven_profile_id>>
        secrethub_org: << parameters.secrethub_org >>
        secrethub_repo: << parameters.secrethub_repo >>
    - mvn_release:
        dry_run: << parameters.dry_run >>
        maven_container_image_tag: << parameters.maven_container_image_tag >>
        maven_profile_id: << parameters.maven_profile_id>>
        secrethub_org: << parameters.secrethub_org >>
        secrethub_repo: << parameters.secrethub_repo >>
```

They will be invoked like this :

```Yaml
    - mvn_prepare_release:
        dry_run: << parameters.dry_run >>
        maven_container_image_tag: << pipeline.parameters.maven_container_image_tag >>
        maven_profile_id: << pipeline.parameters.maven_profile_id>>
        secrethub_org: << pipeline.parameters.secrethub_org >>
        secrethub_repo: << pipeline.parameters.secrethub_repo >>
    - mvn_test_release:
        dry_run: << parameters.dry_run >>
        maven_container_image_tag: << pipeline.parameters.maven_container_image_tag >>
        maven_profile_id: << pipeline.parameters.maven_profile_id>>
        secrethub_org: << pipeline.parameters.secrethub_org >>
        secrethub_repo: << pipeline.parameters.secrethub_repo >>
    - mvn_release:
        dry_run: << pipeline.parameters.dry_run >>
        maven_container_image_tag: << pipeline.parameters.maven_container_image_tag >>
        maven_profile_id: << pipeline.parameters.maven_profile_id>>
        secrethub_org: << pipeline.parameters.secrethub_org >>
        secrethub_repo: << pipeline.parameters.secrethub_repo >>
```

The Full Pipeline of the simple Java maven project used for this test, will [look like this](https://github.com/gravitee-lab/graviteek-cicd-test-maven-project/blob/master/.circleci/config.yml)

* https://github.com/gravitee-lab/graviteek-cicd-test-maven-project :
  * has 5 git branches : `master`, `4.1.x`, `4.2.x`, `4.3.x`, `4.4.x`
  * on branch `master`, the last commit has a `pom.xml` with pom project version `4.5.0-SNAPSHOT` (next minor version)
  * on branch `4.1.x`, the last commit has a `pom.xml` with pom project version `4.1.3-SNAPSHOT`
  * on branch `4.2.x`, the last commit has a `pom.xml` with pom project version `4.2.51-SNAPSHOT`
  * on branch `4.3.x`, the last commit has a `pom.xml` with pom project version `4.3.4-SNAPSHOT`
  * on branch `4.4.x`, the last commit has a `pom.xml` with pom project version `4.4.12-SNAPSHOT`
  * On the 5 git branches `master`, `4.1.x`, `4.2.x`, `4.3.x`, and `4.4.x`, the parent maven module, has itself a parent pom defined as being the `gravitee-parent`, in version `19.99.1` :
    * Purpose is to use the same parent pom as all gravitee-io components
    * As defined in https://github.com/gravitee-lab/gravitee-parent-redefinition , on `19.99.x` git branch
    * This exact `gravitee-parent` parent pom is deployed in the 2 artifactory repositories used for releases and dry-run releases


Ok, another thing to prepare :

* 4 repos :
  * all with the same source code, the simple java maven project, forked from https://github.com/gravitee-lab/graviteek-cicd-test-maven-project
  * all repos having no dependencies (we are testing resume release feature, not dependency management) in the "gravitee universe" :no dependency on any maven artifact built from a repo in the https://github.com/gravitee-lab or https://github.com/gravitee-io Github Organizations
  * on each repo, several git branches as mentioned in the `.circleci/config.yml` above
  * in the `pom.xml` :
    * for first repo https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g1, on branch `4.1.x`, the last commit has a `pom.xml` with pom project version `4.1.3-SNAPSHOT`, and same in `release.json`
    * for second repo https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g2, on branch `4.2.x`, the last commit has a `pom.xml` with pom project version `4.2.51-SNAPSHOT`, and same in `release.json`
    * for third repo https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g3, on branch `4.3.x`, the last commit has a `pom.xml` with pom project version `4.3.4-SNAPSHOT`, and same in `release.json`
    * for fourth repo https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-fail, on branch `4.4.x`, the last commit has no `pom.xml`,whileit should have had one, with pom project version `4.4.12-SNAPSHOT`, and same in `release.json` (which will for sure trigger a maven error, and therefore a build failure)
* a release repo with a `release.json` :
  * https://github.com/gravitee-lab/graviteek-release : I fork the existing https://github.com/gravitee-lab/release repo, does not matter its age, just less than 3 month.
  * I create, from the `master` git branch, the git branches  `4.2.x`, `4.3.x`, `4.4.x`, which will alow me to run 3 different release tests, to testthe resume release feature.
  * on branch `4.1.x`, the "top" version is `4.1.3-SNAPSHOT` (next release will be the `4.1.3` release)
  * on branch `4.2.x`, the "top" version is `4.2.78-SNAPSHOT` (next release will be the `4.2.78` release)
  * on branch `4.3.x`, the "top" version is `4.3.79-SNAPSHOT` (next release will be the `4.3.79` release)
  * on branch `4.4.x`, the "top" version is `4.4.80-SNAPSHOT` (next release will be the `4.4.80` release)

I will run 4 tests in parallel :

* test 1 on branch `4.1.x` of the https://github.com/gravitee-lab/graviteek-release release repo :
  * in this test, the release will succeed and the 2 git tags will be added :
    * the git tag marking the version where the release is defined, with the `release.json`. This tag will be `RELEASE_${RELEASE_VERSION}_START`
    * the release `git` tag, marking the released version of the product
* test 2 on branch `4.2.x` of the https://github.com/gravitee-lab/graviteek-release release repo :
  * in this test, the release will fail, and 1 git tag will be added :
    * the git tag marking the version where the release is defined, with the `release.json`
* test 3 on branch `4.3.x` of the https://github.com/gravitee-lab/graviteek-release release repo :
  * in this test, the release will fail, and 1 git tag will be added :
    * the git tag marking the version where the release is defined, with the `release.json`
* test 4 on branch `4.4.x` of the https://github.com/gravitee-lab/graviteek-release release repo :
  * in this test, the release will fail, and 1 git tag will be added :
    * the git tag marking the version where the release is defined, with the `release.json`


#### Test 1: on branch `4.1.x` of the https://github.com/gravitee-lab/graviteek-release


On branch `4.1.x` of the https://github.com/gravitee-lab/graviteek-release release repo, in the `release.json`, will be added :

*  in the `components` :

```JSon

{
  "name": "Gravitee.io",
  "version": "4.1.3-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "components": [

      {
          "name": "graviteek-cicd-test-maven-project-g1",
          "version": "4.1.3-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g2",
          "version": "4.2.51-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g3",
          "version": "4.3.4-SNAPSHOT"
      }
  ]
}
```

*  in the `buildDependencies` :

```JSon
{
  "name": "Gravitee.io",
  "version": "4.1.3-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "buildDependencies": [
      [
          "graviteek-cicd-test-maven-project-g1"
      ],
      [
          "graviteek-cicd-test-maven-project-g2"
      ],
      [
          "graviteek-cicd-test-maven-project-g3"
      ],
      [
          "graviteek-cicd-test-maven-project-fail"
      ]
   ]
}

```


#### Test 2: on branch `4.2.x` of the https://github.com/gravitee-lab/graviteek-release


On branch `4.2.x` of the https://github.com/gravitee-lab/graviteek-release release repo, in the `release.json`, will be added :

*  in the `components` :

```JSon

{
  "name": "Gravitee.io",
  "version": "4.2.78-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "components": [

      {
          "name": "graviteek-cicd-test-maven-project-g1",
          "version": "4.1.3-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g2",
          "version": "4.2.51-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g3",
          "version": "4.3.4-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-fail",
          "version": "4.4.12-SNAPSHOT"
      }
  ]
}
```

*  in the `buildDependencies` :

```JSon
{
  "name": "Gravitee.io",
  "version": "4.2.78-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "buildDependencies": [
      [
          "graviteek-cicd-test-maven-project-g1"
      ],
      [
          "graviteek-cicd-test-maven-project-g2"
      ],
      [
          "graviteek-cicd-test-maven-project-g3"
      ],
      [
          "graviteek-cicd-test-maven-project-fail"
      ]
   ]
}

```


#### Test 3: on branch `4.3.x` of the https://github.com/gravitee-lab/graviteek-release

On branch `4.3.x` of the https://github.com/gravitee-lab/graviteek-release release repo, in the `release.json`, will be added :

*  in the `components` :

```JSon

{
  "name": "Gravitee.io",
  "version": "4.3.79-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "components": [

      {
          "name": "graviteek-cicd-test-maven-project-g1",
          "version": "4.1.3-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g2",
          "version": "4.2.51-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g3",
          "version": "4.3.4-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-fail",
          "version": "4.4.12-SNAPSHOT"
      }
  ]
}
```

*  in the `buildDependencies` :

```JSon
{
  "name": "Gravitee.io",
  "version": "4.3.79-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "buildDependencies": [
      [
          "graviteek-cicd-test-maven-project-g1"
      ],
      [
          "graviteek-cicd-test-maven-project-g2"
      ],
      [
          "graviteek-cicd-test-maven-project-fail"
      ],
      [
          "graviteek-cicd-test-maven-project-g3"
      ]
   ]
}

```

#### Test 4: on branch `4.4.x` of the https://github.com/gravitee-lab/graviteek-release

On branch `4.4.x` of the https://github.com/gravitee-lab/graviteek-release release repo, in the `release.json`, will be added :

*  in the `components` :

```JSon

{
  "name": "Gravitee.io",
  "version": "4.4.80-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "components": [

      {
          "name": "graviteek-cicd-test-maven-project-g1",
          "version": "4.1.3-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g2",
          "version": "4.2.51-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-g3",
          "version": "4.3.4-SNAPSHOT"
      },
      {
          "name": "graviteek-cicd-test-maven-project-fail",
          "version": "4.4.12-SNAPSHOT"
      }
  ]
}
```

*  in the `buildDependencies` :

```JSon
{
  "name": "Gravitee.io",
  "version": "4.4.80-SNAPSHOT",
  "buildTimestamp": "2020-12-13T14:34:16+0000",
  "scmSshUrl": "git@github.com:gravitee-io",
  "scmHttpUrl": "https://github.com/gravitee-io/",
  "buildDependencies": [
      [
          "graviteek-cicd-test-maven-project-g1"
      ],
      [
          "graviteek-cicd-test-maven-project-fail"
      ],
      [
          "graviteek-cicd-test-maven-project-g2"
      ],
      [
          "graviteek-cicd-test-maven-project-g3"
      ]
   ]
}

```


So that the initial state of the test :

* will be defined by 6 repos, and can be re-generated from 2 repos :
  * 3 forks of the https://github.com/gravitee-lab/graviteek-cicd-test-maven-project repo, for which the pipeline execution will succeed :
    * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g1, on branch `4.1.x`, the last commit has a `pom.xml` with pom project version `4.1.3-SNAPSHOT`, and same in `release.json`
    * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g2, on branch `4.2.x`, the last commit has a `pom.xml` with pom project version `4.2.51-SNAPSHOT`, and same in `release.json`
    * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g3, on branch `4.3.x`, the last commit has a `pom.xml` with pom project version `4.3.4-SNAPSHOT`, and same in `release.json`
  * 1 fork of the https://github.com/gravitee-lab/graviteek-cicd-test-maven-project repo, for which the pipeline execution will fail :
    * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-fail, on branch `4.4.x`, the last commit has no `pom.xml` wchi is why the pipeline execution will fail.
  * 1 fork of the https://github.com/gravitee-lab/release git repo, which will be the https://github.com/gravitee-lab/graviteek-release
  * The https://github.com/gravitee-lab/gravitee-parent-redefinition repo defining the `gravitee-parent` parent pom version `19.99.1` used in this  test suite.
* and can be re-generated anytime from 2 repos :
  * the https://github.com/gravitee-lab/release git repo, the so called _"release repo"_
  * the https://github.com/gravitee-lab/graviteek-cicd-test-maven-project , a maven java project, used as the proptotype of a Product Component (of a Gravitee Component)





#### Testing the https://github.com/gravitee-lab/graviteek-cicd-test-maven-project Circle CI Pipeline


* Trigger the blank job (to test that the `.circleci/config.yml` has no syntax or runtime error) :

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
export REPO_NAME="graviteek-cicd-test-maven-project"
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": true,
        \"maven_profile_id\": \"dry-run-release\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```


* Trigger the release job, with dry run mode on or off, (to test that the `.circleci/config.yml` can perform a full release process) :

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
export REPO_NAME="graviteek-cicd-test-maven-project"
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": false,
        \"maven_profile_id\": \"dry-run-release\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```



#### Redifining the `gravitee-parent` version `19.99.1` in artifatory


  * To release the `gravitee-parent` version `19.99.1` in the dry run releases artifatory repository :

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
export REPO_NAME="gravitee-parent-redefinition"
export BRANCH="19.99.x"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": true,
        \"maven_profile_id\": \"blank\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```

* Exact same recipe to release the `gravitee-parent` version `19.99.1` in the "non dry run" releases artifatory repository, only difference is set `dry_run` Pïpeline Parameter to `false`.

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
export PIPELINE_ID=628d5730-e084-4122-a0c8-b6720fbf3716
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/pipeline/${PIPELINE_ID} | jq .
```



## Execution 1 of the Resume Release Feature Test Suite

I use :
* https://github.com/gravitee-lab/graviteek-release-test-suite-1, forked from https://github.com/gravitee-lab/graviteek-release, torun the Gravitee `GraviteeCiCdOrchestrator`
* 3 forks of the https://github.com/gravitee-lab/graviteek-cicd-test-maven-project repo, for which the pipeline execution will succeed :
  * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g1, on branch `4.1.x`, the last commit has a `pom.xml` with pom project version `4.1.3-SNAPSHOT`, and same in `release.json`
  * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g2, on branch `4.2.x`, the last commit has a `pom.xml` with pom project version `4.2.51-SNAPSHOT`, and same in `release.json`
  * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-g3, on branch `4.3.x`, the last commit has a `pom.xml` with pom project version `4.3.4-SNAPSHOT`, and same in `release.json`
* 1 fork of the https://github.com/gravitee-lab/graviteek-cicd-test-maven-project repo, for which the pipeline execution will fail :
  * https://github.com/gravitee-lab/graviteek-cicd-test-maven-project-fail, on branch `4.4.x`, the last commit has no `pom.xml` wchi is why the pipeline execution will fail.

<!--


Fork of https://github.com/gravitee-lab/graviteek-cicd-test-maven-project defining initial state for resume release test suites

https://github.com/gravitee-lab/graviteek-cicd-test-maven-project

-->

Now, to run the tests, I execute :

* Test 1, on branch `4.1.x` of the release repo :

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
export REPO_NAME="graviteek-release-test-suite-1"
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


# DRAFTS

* in the release process, here are a few things that are important :
  * Using the same `settings.xml` and maven profile than all repos on https://github.com/gravitee-io :
    * The `gio-release` maven profile,
    * with the Circle CI Orb `gravitee-io/gravitee@dev:1.0.4`, (which, among many other things, makes use of the appropriate `settings.xml` with `gio-release` maven profiling) :

  * The `gravitee-parent` parent pom defined and released in the private artifactory, with version number `19.99.1` :
    * see https://github.com/gravitee-lab/gravitee-parent-redefinition/blob/19.99.1/.circleci/config.yml
    * note that this gravitee parent pom defines a build process which does not execute any nexus staging , and that's the only difference with the old `gravitee-release` profile.


## Resume Release Feature Test Suite 2 : massive parallelization

Here I need to test one very important test case :
* there is one parallel execution set with many components : 10 for example
* one of the 10 components pipeline fails and, when it failed :
  * 5 have succedded,
  * 4 are still running without error
  * what happens then ?

To design this test, i will :
* again fork 10 times the same prepared repo
* i will prepare 10 git branches on the prepared repo
* I will use the Pipeline Test Phase, to :
  * make some pipeline execution last 3 minutes longer than the others
  * and make one pipeline fail

> all other branches must have an updated `release.json` with same version for all 3 g1 g2 and g3 from tests

* on the test repo definig test initial states :

* `4.1.x` :
* `4.2.x` :
* `4.3.x` :
* `4.4.x` :

* `4.5.x` : don't touch this one with tests ?

* `4.6.x` : ccc
* `4.7.x` : ccc
* `4.8.x` : ccc
* `4.9.x` : ccc
* `4.10.x` : ccc






#### The `finish` mode (for each cicd process)

Ok, and then, what will be the best impelmentation for the resume release feature ?

I first designed it this way :

* The Logs will tell the user which pieplines are still running, and that for thos who succeed, then he must remove the `-SNAPSHOT` suffix manually from the `release.json`

Then, I will implement this :
* The orchestrator must resume watching without triggering any pipeline
* and then, he will modify the release.json accordignly
* ok I know, the orchestrator needs a new option :
  * `--finish`, avec en arguemnt le chemin d'un fichier qui contient les GUID des pipelines à "reprendre"
  * l'orchestrateur doit être relancé, sur "la bonne branche git du release repo " : la même que l'exécution à reprendre.
  * lemode finish commence par rechoper le nom des repo github, en déduit le nom des componsants, et avec le `release.json`, il déduit la version des `components`
  * le mode finish vérifie bien que le `-SNAPSHOT` de chacun des components repris, n'a pas été retiré
  * le mode finish  ensuite le watcher construit ne construit pas un `execution_plan` : quand il y a une erreur de cette sorte, c'est vraiment juste pour terminer **un seul `Parallel Execution Set`**, donc il construit une `progressMatrix`  , et on lance le watcher sur cette `progressMatrix`.
  * Ok, mais donc le plus logqiue, et efficace, c'est de persister en JSON la `progressMatrix`, en lui retirant "tous les pipeliens sauf ceux qui sont en running". Et on reprend là dessus. Ouiiii voilà.
  * Si un pipeline a terminé son execution avant même que le mode finish ait eut le temps de démarrer, alors le watcher va directement passer en mode "ok ça y est c'est fini suivant"
  * et pour le reste, c'est exactment le même taff que pour la release initiale.
  * et s'il y a encore une erreur, et qu'il reste encore des pipelines en running, qui ne sont pas en erreur, on recommence en finish mode : du coup, cette réccurrence pourrait consister à relancer la release en mode finish, en invoquant la Circle CI API depuis le process de relese initial....
  * en tout cas, on relance le "finish mode", tant qu'il reste des pipelines qui ne sont pas arrivés en erreur, et pour lesquels le suffixe `-SNAPSHOT` n'a pas été retiré dans le `release.json`
  * le temps de redémarrer le watch, il se peut que des pipelines aient terminé leur exécution: cela sera repéré dès le départ


I will call this the `finish` mode, which can be implemented  for each cicd process



## Production Test suite 1 (on `3.4.1` maintenance release)

The concept of this test, is to simply run a `3.4.1` maintenance release, cancel one pipeline execution and test if the release resumes from the canceled :
* that way, the resume release feature is tested in an environmenty as close as possible from the target production enironment
* The initial state of the test is generated from a set of git repos in the https://github.com/gravitee-lab Github Org :
  * https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x
  * https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1
  * https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1
  * https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1
To generate the initial state of the test
  * https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x is forked in a new repo https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x-test1
  * https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1 is forked in a new repo https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1-test1
  * https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1 is forked in a new repo https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1-test1
  * https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1 is forked in a new repo https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1-test1

So the initial state of the test consists of the following set of repos, right after tyhe fork operations are completed :
* https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x-test1
* https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1-test1
* https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1-test1
* https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1-test1


In the https://github.com/gravitee-lab Github Org :
* the https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x github repo was forked from the https://github.com/gravitee-io/release just before making the `3.4.1` maintenance release
* On the `3.4.x` git branch of the https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x, I modified the `release.json` file, to add :

```JSon
{
  {
      "name": "gravitee-repository-test",
      "version": "3.4.1"
  },
  {
      "name": "gravitee-repository-test-release-3-4-1",
      "version": "3.4.1-SNAPSHOT"
  },
  {
      "name": "gravitee-repository-mongodb",
      "version": "3.4.1"
  },
  {
      "name": "gravitee-repository-mongodb-release-3-4-1",
      "version": "3.4.1-SNAPSHOT"
  },
  {
      "name": "gravitee-repository-jdbc",
      "version": "3.4.1"
  },
  {
      "name": "gravitee-repository-jdbc-release-3-4-1",
      "version": "3.4.1-SNAPSHOT"
  }
}
```

* On the `3.4.x` git branch of the https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x, I modified the `release.json` file, I also modified the `buildDependencies` JSON array :
  * to include the `gravitee-repository-test-release-3-4-1` at the same dependency level than the `gravitee-repository-test` repo
  * to include the `gravitee-repository-mongodb-release-3-4-1` at the same dependency level than the `gravitee-repository-mongodb` repo
  * to include the `gravitee-repository-jdbc-release-3-4-1` at the same dependency level than the `gravitee-repository-jdbc` repo

* I also, just before making the `3.4.1` maintenance release :
  * created the https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1 git repo, from https://github.com/gravitee-io/gravitee-repository-test
  * created the https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1 git repo, from https://github.com/gravitee-io/gravitee-repository-mongodb
  * created the https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1 git repo, from https://github.com/gravitee-io/gravitee-repository-jdbc
  * because running this test suite will modify the git repos : And I need to keep their initial state, to be able to reproduce the test.
* Finally, to be able to redefine the gravitee parent pom, I :
  * created the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo, forking the https://github.com/gravitee-io/gravitee-parent
  * created a `19.99.x` git branch, from the `19` git tag in the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo
  * on the `19.99.x` git branch of the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo, I modified the `pom.xml`, to set the `19.99.1-SNAPSHOT` pom version, and added the `gio-release` maven profile
  * on the `19.99.x` git branch of the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo, I added [this `.circleci/config.yml`](https://github.com/gravitee-lab/gravitee-parent-redefinition/blob/19.99.1/.circleci/config.yml), which triggered the `Circle CI` pipeline, ending up with releasing the `19.99.1` parent pom verion for gravitee io, in the private artifactory
  * Finally, on the `19.99.x` git branch of the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo, I added the `19.99.1` tag.

Once all this was done, I triggered the following release process :

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
export REPO_NAME="release-state-maintenance-rel-3.4.x"
export BRANCH="3.4.x"
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

* a quick test on master branch (to test prepare next release with minor version/ new support branch creation ) :

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
export REPO_NAME="graviteek-release-test-suite-1"
export BRANCH="master"
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


The result of that first test was this :

* The `gravitee-repository-test-release-3-4-1` git repo  gave a successful `3.4.1` release, with
  * The maven artifact `3.4.1` in the private artifactory
  * The git tag `3.4.1` added to the `gravitee-repository-test-release-3-4-1` git repo
  * the `3.4.2-SNAPSHOT` "next SNAPSHOT version" in the `pom.xml` in a git commit right after the git tag `3.4.1`, on the `3.4.x` git branch of the `gravitee-repository-test-release-3-4-1` git repo
* The  failed :
  * Circle CI pipeline execution is https://app.circleci.com/pipelines/github/gravitee-lab/gravitee-repository-mongodb-release-3-4-1/3/workflows/d2fc6db1-2e49-492f-ab36-0506fc0923b5/jobs/3
  * In the stdout of that pipeline execution, we can spot the `Property ${gravitee-repository-test.version}: Leaving unchanged as 3.4.1-SNAPSHOT`
  * What happened is that the below maven command does not update the `gravitee-repository-test` dependency from `3.4.1-SNAPSHOT` to `3.4.1`, although the private artifactory server does have the `3.4.1` version available :

```bash
mvn -Duser.home=/home/${NON_ROOT_USER_NAME_LABEL}/ -s ./settings.xml -B -U versions:update-properties -Dincludes=io.gravitee.*:* -DallowMajorUpdates=false -DallowMinorUpdates=false -DallowIncrementalUpdates=true -DgenerateBackupPoms=false
```

* finally, the std-out of the execution of the `update-properties` goal of the maven `versions` plugin, can be shortened into this :

```
[INFO] ---------< io.gravitee.repository:gravitee-repository-mongodb >---------
[INFO] Building Gravitee.io APIM - Repository - MongoDB 3.4.1-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- versions-maven-plugin:2.7:update-properties (default-cli) @ gravitee-repository-mongodb ---
[=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HERE A LOT OF DOWNLOADS THAT I STRIPPED OUT, and then :]
[INFO] artifact org.yaml:snakeyaml: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact com.github.dozermapper:dozer-core: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact org.mongodb:mongo-java-driver: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact io.gravitee.repository:gravitee-repository: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact org.mongodb:mongodb-driver-reactivestreams: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact de.flapdoodle.embed:de.flapdoodle.embed.mongo: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact org.springframework.data:spring-data-mongodb: checking for updates from artifactory-gravitee-non-dry-run
[INFO] artifact org.apache.maven.plugins:maven-dependency-plugin: checking for updates from artifactory-gravitee-non-dry-run
[INFO] Not updating the property ${snakeyaml.version} because it is used by artifact org.yaml:snakeyaml:jar:1.21:test and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] Not updating the property ${dozer.version} because it is used by artifact com.github.dozermapper:dozer-core:jar:6.4.1 and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] Incremental version changes allowed
[INFO] Property ${gravitee-repository-test.version}: Leaving unchanged as 3.4.1-SNAPSHOT
[INFO] Not updating the property ${mongo.version} because it is used by artifact org.mongodb:mongo-java-driver:jar:3.12.0 and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] Incremental version changes allowed
[INFO] Property ${gravitee-repository.version}: Leaving unchanged as 3.4.0
[INFO] Not updating the property ${mongodb-driver-reactivestreams.version} because it is used by artifact org.mongodb:mongodb-driver-reactivestreams:jar:1.13.0 and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] Not updating the property ${embed.mongo.version} because it is used by artifact de.flapdoodle.embed:de.flapdoodle.embed.mongo:jar:2.0.0:test and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] Not updating the property ${spring.data.mongodb.version} because it is used by artifact org.springframework.data:spring-data-mongodb:jar:2.1.5.RELEASE and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] Not updating the property ${maven-dependency-plugin.version} because it is used by artifact org.apache.maven.plugins:maven-dependency-plugin:maven-plugin:2.10:runtime and that artifact is not included in the list of  allowed artifacts to be updated.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:45 min
[INFO] Finished at: 2020-12-10T12:32:12Z
[INFO] ------------------------------------------------------------------------
```
* As we can see in htis stdout of the `update-properties` goal of the maven `versions` plugin, the server from which the  dependencies are checked, is of id `artifactory-gravitee-non-dry-run`
  * the server of id `artifactory-gravitee-non-dry-run`, is a server configured in the `settings.xml`, and its URL is http://odbxikk7vo-artifactory.services.clever-cloud.com/nexus-and-non-dry-run-releases/
  * the http://odbxikk7vo-artifactory.services.clever-cloud.com/nexus-and-non-dry-run-releases/ is an artifactory virtual server which references ser https://odbxikk7vo-artifactory.services.clever-cloud.com/webapp/#/artifacts/browse/tree/General/gravitee-releases
* The Documentation of the maven plugin goal is at https://www.mojohaus.org/versions-maven-plugin/update-properties-mojo.html


# Issues stack


### Issue : SSH Key Access rights for Gravitee Lab Bot

Bon , ok j'ai une petite issue là dessus :
* le gravitee-bots était en read only, etj'avais en létat ajouté saclef SSH
* J'ai changé els droits en WRITE permissions, et ai retiré puis ajouté de nouveau le gravitee lab bot dans les membres de l'organisations, avec l'otions "start fresh" : rien à faire la clef SSH est toujours marquée comme étant en READ Only.
* Bref, je vais devoir faire une rotation du secret "parie de clefs SSH du Gavitee Lab Bot" pour que la git release puisse faire des git push sur le repo
* référence de pipeline en erreur pour cette raison : https://app.circleci.com/pipelines/github/gravitee-lab/gravitee-repository-test-release-3-4-1/4/workflows/1e55d217-f4e1-42db-97d7-77b73bcd284b/jobs/4

Réglé :

* La configuration de l'agent SSH était telle que c'était la `Circle CI` Checkout Key qui était utilisé, au lieu de la clef privée SSH pointée par export GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa', clef installée à partir de secrethub, et de la clef privée SSH du Gravitee Bot.
* j'ai donc ajouté `ssh-add -D` pour vider le cache del'agent SSH, et derrière ai ajouté la clef RSA privée voulue, `ssh-add ${CHEMIN_COMPLET_DE_LA_CLEF}`
