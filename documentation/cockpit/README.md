# https://github.com/gravitee-io/gravitee-cockpit

## Step 1 : Pipeline Circle CI version 1

### Analyse rapide du besoin

* les jobs à exécuter :
  * flow 1 : maven release
    * maven test
    * maven build (release..? si c'est rapide) oui maven release,
    * trouver où sont tous les trucs générés : artefacs (dans .m2), zip, et packages npm
    * la git release : à mettre à part, job indépendant
  * flow 2 : les pull request (en snapshot)
    * le orb job pull_request pr_build,

* question 1 : comment ils vont déclencher les 2 flows ?
  * pour moi, c'est plus facile de déclencher un flow avec du gitops,plutôtque du Circle CI token (parce qu'alors, ça demande la gestion des secrets).
* question finale : est-ce qu'on veut faire des déploiements pour les 2 flow ci-dessus ? voir après

### Conception

Je teste avec https://github.com/gravitee-lab/gravitee-cockpit

objectif 1 : faire le build sur master, en

#### Test suite 1 : build direct de `gravitee-cockpit`

* Test 1, on branch `master` of the `gravitee-cockpit` repo :

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
export REPO_NAME="gravitee-cockpit"
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": true,
        \"maven_profile_id\": \"gravitee-dry-run\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

# dry_run: << pipeline.parameters.dry_run >>
# maven_container_image_tag: stable-latest
# maven_profile_id: << pipeline.parameters.maven_profile_id>>
# secrethub_org: << pipeline.parameters.secrethub_org >>
# secrethub_repo: << pipeline.parameters.secrethub_repo >>

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```

Résultat : il manque une dépendance, `io.gravitee.cockpit:gravitee-cockpit-api:jar:1.1.0-SNAPSHOT`


#### Essai 2 : orchestration à la main

* Idée :

>
> hum... ok, je peux tester un truc :
> * il y a 3 repos, c'est pas bcp
> * je refais exactement ce que je viens de faire avec gravitee-cockpit, mais "j'orchestre à la main" :
>   * d'abord je fais https://github.com/gravitee-io/gravitee-license ,
>   * ensuite je me fais api ,
>   * et après je re-teste gravitee-cockpit
>

Bon, alors à lamain je lis l'arbre de dépendances :

* `gravitee-cockpit` sur master, est en version `3.0.0-SNAPSHOT`
* `gravitee-cockpit` version `3.0.0-SNAPSHOT`, dépend de `gravitee-cockpit-api` version `1.1.0-SNAPSHOT`
* donc je dois release `gravitee-cockpit-api` en version `1.1.0-SNAPSHOT`, donc sur le `master` de `gravitee-cockpit-api`. `1.1.0-SNAPSHOT` est bien laversion de pom sur `master`
* `gravitee-cockpit` version `3.0.0-SNAPSHOT`, dépend de `gravitee-license` version `1.1.2` (cf. `<gravitee-license-api.version>1.1.2</gravitee-license-api.version>`). Donc ilfaut que je build https://github.com/gravitee-lab/gravitee-license sur la branche `1.1.x`


* Release, on branch `master` of the `gravitee-cockpit` repo :

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
export REPO_NAME="gravitee-cockpit"
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": true,
        \"maven_profile_id\": \"gravitee-dry-run\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

# dry_run: << pipeline.parameters.dry_run >>
# maven_container_image_tag: stable-latest
# maven_profile_id: << pipeline.parameters.maven_profile_id>>
# secrethub_org: << pipeline.parameters.secrethub_org >>
# secrethub_repo: << pipeline.parameters.secrethub_repo >>

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```


* Release, on branch `master` of the `gravitee-cockpit-api` repo :

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
export REPO_NAME="gravitee-cockpit-api"
export BRANCH="master"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": true,
        \"maven_profile_id\": \"gravitee-dry-run\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

# dry_run: << pipeline.parameters.dry_run >>
# maven_container_image_tag: stable-latest
# maven_profile_id: << pipeline.parameters.maven_profile_id>>
# secrethub_org: << pipeline.parameters.secrethub_org >>
# secrethub_repo: << pipeline.parameters.secrethub_repo >>

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```


* Release, on branch `1.1.x` of the `gravitee-license` repo :

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
export REPO_NAME="gravitee-license"
export BRANCH="1.1.x"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"gio_action\": \"release\",
        \"dry_run\": true,
        \"maven_profile_id\": \"gravitee-dry-run\",
        \"secrethub_org\": \"gravitee-lab\",
        \"secrethub_repo\": \"cicd\"
    }

}"

# dry_run: << pipeline.parameters.dry_run >>
# maven_container_image_tag: stable-latest
# maven_profile_id: << pipeline.parameters.maven_profile_id>>
# secrethub_org: << pipeline.parameters.secrethub_org >>
# secrethub_repo: << pipeline.parameters.secrethub_repo >>

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/me | jq .
curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline | jq .
```
