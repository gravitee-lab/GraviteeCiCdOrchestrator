# Tests of the release process


## Test suite : git operations


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

* I also :
  * created the https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1 git repo, from https://github.com/gravitee-lab/gravitee-repository-test
  * created the https://github.com/gravitee-lab/gravitee-repository-mongodb-release-3-4-1 git repo, from https://github.com/gravitee-lab/gravitee-repository-mongodb
  * created the https://github.com/gravitee-lab/gravitee-repository-jdbc-release-3-4-1 git repo, from https://github.com/gravitee-lab/gravitee-repository-jdbc
  * because running this test suite will modify the git repos : And I needto keeptheir initial state, to be able to reproduce the test.

Another thing todo :

Finish the work on the `~/gravitee-parent-redefinition` :

```bash
cd ~/gravitee-parent-redefinition
atom .
# git add --all && git commit -m "update pipeline definition to create new version of the gravitee parent, in private artifactory" && git push -u origin HEAD
```

* From version `17`, I created a `17.99.x` git branch, and released to artifactory a `17.99.1` gravitee parent pom
* From version `18`, I created a `18.99.x` git branch, and released to artifactory a `18.99.1` gravitee parent pom
* From version `19`, I created a `19.99.x` git branch, and released to artifactory a `19.99.1` gravitee parent pom

And finally trigger the orchestrator in the release pipeline :


```bash
SECRETHUB_ORG=gravitee-lab
# SECRETHUB_ORG=gravitee-io
SECRETHUB_REPO=cicd
# Nevertheless, I today think :
# Each devops team member should have his own personal secrethub repo in the [gravitee-lab] secrethub org.
# like this :
# a [gravitee-lab/${TEAM_MEMBER_NAME}] secrethub repo for each devops team member
# and the Circle CI Personal Access token stored with [gravitee-lab/${TEAM_MEMBER_NAME}/circleci/token]
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

Bon, fin des travaux pour ce soir pour moi :
* j'y suis presque : test sur gravitee-lab, je confirme, la `GPG` signature passe, et cette fois-ci testée avec le maven profile `gio-release`
* j'utilise le maven profile `gio-release`, après avoir fait une release 19.99.1 du gravitee-parent, dans le artifactory private :
* j'ai mis version `19.99.1`  pour version du pom parent pour les 3 repos gravitee-repository-test,  gravitee-repository-mongodb, et  gravitee-repository-jdbc exemple : https://github.com/gravitee-lab/gravitee-repository-test-release-3-4-1/blob/a33c440bada25ec6540b8aa31556d7639debce87/pom.xml#L26
* la version `19.99.1` définit un maven profile gio-release sans nexus staging : https://github.com/gravitee-lab/gravitee-parent-redefinition/blob/72a708f1d23eb1b7836b67d6b02398a9bc86890c/pom.xml#L416
* [cette exécution](https://app.circleci.com/pipelines/github/gravitee-lab/gravitee-repository-test-release-3-4-1/7/workflows/79b4a7b7-5cfa-4b1f-b727-cd308e9887bd/jobs/7) de pipeline est celle qui utilise tout ça, et fait la signature GPG avec succès
* et au passage on a maintenant deux settings.xml séparés : un pour le dry-run, et un pour la "vraie release" , ce qui m'aamené à faire un nouveau commit sur ma pull request de l'orb, poru leprochain patch 1.0.4


## Issue : SSH Key Access rights for Gravitee Lab Bot

Bon , ok j'ai une petite issue là dessus :
* le gravitee-bots était en read only, etj'avais en létat ajouté saclef SSH
* J'ai changé els droits en WRITE permissions, et ai retiré puis ajouté de nouveau le gravitee lab bot dans les membres de l'organisations, avec l'otions "start fresh" : rien à faire la clef SSH est toujours marquée comme étant en READ Only.
* Bref, je vais devoir faire une rotation du secret "parie de clefs SSH du Gavitee Lab Bot" pour que la git release puisse faire des git push sur le repo
* référence de pipeline en erreur pour cette raison : https://app.circleci.com/pipelines/github/gravitee-lab/gravitee-repository-test-release-3-4-1/4/workflows/1e55d217-f4e1-42db-97d7-77b73bcd284b/jobs/4
