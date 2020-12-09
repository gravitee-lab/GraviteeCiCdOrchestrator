# Trigger Release and Dry Run Release with a `curl`

* Trigger a dry run :

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
export REPO_NAME="release"
export BRANCH="3.1.x"
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

* Trigger a release :

```bash
export CCI_TOKEN="<token value>"
export ORG_NAME="gravitee-lab"
export REPO_NAME="release"
export BRANCH="3.1.x"
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
