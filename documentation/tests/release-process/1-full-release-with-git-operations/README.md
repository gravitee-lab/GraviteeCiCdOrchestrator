# Tests of the release process ( git operations)


# Test suite : testing the 3.4.1  Release in https://github.com/gravitee-lab



## Production Test suite 1 (on `3.4.1` maintenance release)

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
  * From version `17`, in the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo, I created a `17.99.x` git branch, and tried and release to artifactory a `17.99.1` gravitee parent pom, with the same process, this one failed
  * From version `18`, in the https://github.com/gravitee-lab/gravitee-parent-redefinition git repo, I created a `18.99.x` git branch, and trued and release to artifactory a `18.99.1` gravitee parent pom, with the same process, this one failed


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


Enfin :

* [cette exécution](https://app.circleci.com/pipelines/github/gravitee-lab/gravitee-repository-test-release-3-4-1/7/workflows/79b4a7b7-5cfa-4b1f-b727-cd308e9887bd/jobs/7) de pipeline est celle qui utilise tout ça, et fait la signature GPG avec succès
* et au passage on a maintenant deux settings.xml séparés : un pour le dry-run, et un pour la "vraie release" , ce qui m'aamené à faire un nouveau commit sur ma pull request de l'orb, poru leprochain patch 1.0.4

Ok, now I am executing again the same test, but :
* I first manually removed the `3.4.1` tag in the https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1
* I then pushed one more commit on the `3.4.x` git branch of the https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1 repo, to reset the pom version from `3.4.2-SNAPSHOT`, to `3.4.1-SNAPSHOT`
* after that, I fork all involved repos to keep the initial state unchanged :
  * [ ] https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x is forked in a new repo https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x-test-1 :
    * on the `3.4.x` git branch of the new https://github.com/gravitee-lab/release-state-maintenance-rel-3.4.x-test1 git repo, I modifiy the `release.json` to replace, both in `components` and `buildDependencies` :
      * `gravitee-repository-test-release-3-4-1`, by `gravitee-repository-test-release-3-4-1-test-1`
      * `gravitee-repository-mongodb-release-3-4-1`, by `gravitee-repository-mongodb-release-3-4-1-test-1`
      * `gravitee-repository-jdbc-release-3-4-1`, by `gravitee-repository-jdbc-release-3-4-1-test-1`
  * [ ] https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1 is forked in a new repo https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1-test1
  * [ ] https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1 is forked in a new repo https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1-test1
  * [ ] https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1 is forked in a new repo https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1-test1
* I update to latest version the `.circleci/config.yml` of the 3 created git repos
* Last, before triggering the release, In Circle CI Web UI, setup to start building all 4 new repos, with "use existing config" option.

And finally the trigger the test-1 release :


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
export REPO_NAME="release-state-maintenance-rel-3.4.x-test-1"
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

Ok, so with this new test,I could successfully reproduce the issue aboutthe maven versions plugin 's `update-dependencies` goal :
* The [pipeline execution reproducing the issue](https://app.circleci.com/pipelines/github/gravitee-lab/gravitee-repository-mongodb-release-3-4-1-test-1/4/workflows/fc4f2e26-1944-4062-8211-566853670d66/jobs/4)
* Never the less, I this time noticed a warning message, caused by a mistake in my `settings.xml`: `[WARNING] The requested profile "****************" could not be activated because it does not exist.` :
  * The `<activeProfiles>` tag is there where the mistake is.
  * The involved `settings.xml` is the one defined for the release process in secrethub `"${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/settings.xml"` 


# Test suite : testing the 3.5.0 Release in https://github.com/gravitee-lab

* I launched a dry run release on master of the release repo in the gravitee-io Github Org. This allows me to retrieve the Execution plan, listing all Gravitee Components
* Here are lthe "selected components" used to build the executio plan, on December 11 2020 :
  * https://github.com/gravitee-io/gravitee-policy-ssl-enforcement
  * https://github.com/gravitee-io/XXXX
  * https://github.com/gravitee-lab/XXXX-rel-3-5-0
  * https://github.com/gravitee-lab/XXXX-rel-3-5-0-test_1

```bash
"components": [
  {
    "name": "gravitee-gateway",
    "version": "3.5.0-SNAPSHOT"
  },
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
  },
  {
    "name": "gravitee-policy-ratelimit",
    "version": "1.11.0-SNAPSHOT"
  },
  {
    "name": "gravitee-policy-jwt",
    "version": "1.16.0-SNAPSHOT"
  },
  {
    "name": "gravitee-repository",
    "version": "3.5.0-SNAPSHOT"
  },
  {
    "name": "gravitee-repository-test",
    "version": "3.5.0-SNAPSHOT"
  },
  {
    "name": "gravitee-repository-mongodb",
    "version": "3.5.0-SNAPSHOT"
  },
  {
    "name": "gravitee-elasticsearch",
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
    "name": "gravitee-policy-json-validation",
    "version": "1.6.0-SNAPSHOT"
  },
  {
    "name": "gravitee-policy-xml-validation",
    "version": "1.1.0-SNAPSHOT"
  },
  {
    "name": "gravitee-notifier-api",
    "version": "1.4.0-SNAPSHOT"
  },
  {
    "name": "gravitee-alert-api",
    "version": "1.6.0-SNAPSHOT"
  },
  {
    "name": "gravitee-policy-ssl-enforcement",
    "version": "1.2.0-SNAPSHOT"
  }
]
}]
```
* I also, at he sametime fork the release repo https://github.com/gravitee-io/release => https://github.com/gravitee-lab/release-rel-3-5-0

* For each Repo named `XXXXX` I will :
  * Fork it a first time, with same name, but adding `XXXXX-rel-3-5-0` :
  * When I will fork `XXXXX-release-3-5-0` in gavitee-lab and name it `XXXXX-release-3-5-0-test-${TEST_NUMBER}`


# Testing the dry run release for the `3.5.0` release in `gravitee-io`

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
