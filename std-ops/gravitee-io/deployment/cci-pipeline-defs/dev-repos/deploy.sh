#!/bin/bash

if [ "x${CCI_TOKEN}" == "x" ]; then
  echo "[$0] You did not set the [CCI_TOKEN] env. var."
  echo "     You must set the [CCI_TOKEN] env. var. to the value of a "
  echo "     valid Circle CI Token, required to setup all Deploy Keys"
  exit 1
fi;

export GITHUB_ORG=${GITHUB_ORG:-"gravitee-io"}
# on gavitee-lab org, for tests
# comment the line below, to consolidate from "gavitee-io" org
# export GITHUB_ORG="gravitee-lab"

./shell/consolidate-dev-repos-inventory.sh

# Once execution has completed, all inventory files will be in
# the "./inventory" folder.
# that is, the "std-ops/deployment/cci-pipeline-defs/dev-repos/inventory" folder.

export GITHUB_ORG=${GITHUB_ORG:-"gravitee-io"}
# on "gavitee-lab" org, for tests
# comment the line below, to deploy to "gavitee-io" org
export GITHUB_ORG=${GITHUB_ORG:-"gravitee-lab"}

./shell/deploy-all-pipeline-defs.sh

# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
#      Deploy Keys for Github SSH Service     #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #
# --- # --- # --- # --- # --- # --- # --- # --- # --- #


export JSON_PAYLOAD="{
    \"type\": \"deploy-key\"
}"


while read REPO_URL; do
  # echo "${REPO_URL}" | awk -F '/' '{print $4}'
  export REPO_NAME=$(echo "${REPO_URL}" | awk -F '/' '{print $5}')
  echo "# ------------------------------------------------------------ #"
  echo "creating checkout key for [${GITHUB_ORG}/${REPO_NAME}]"
  echo "# ------------------------------------------------------------ #"
  # --- First let's delete all previous deploy keys
  curl -d "${JSON_PAYLOAD}" -X GET https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq '.[]' | jq '.[].fingerprint' | awk -F '"' '{print $2}' | tee -a ./${GITHUB_ORG}.${REPO_NAME}.fingerprints.list

  while read FINGERPRINT; do
    curl -d "${JSON_PAYLOAD}" -X DELETE https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key/${FINGERPRINT} -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  done <./${GITHUB_ORG}.${REPO_NAME}.fingerprints.list
  # -- Finally we re-create a  new deploy key
  # curl -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  curl -d "${JSON_PAYLOAD}" -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  echo "# ------------------------------------------------------------ #"
  # cat consolidated-git-repos-uris.list | awk -F '/' '{print $4}'
done <./consolidated-git-repos-uris.list

while read REPO_URL; do
  # echo "${REPO_URL}" | awk -F '/' '{print $4}'
  export REPO_NAME=$(echo "${REPO_URL}" | awk -F '/' '{print $5}')
  echo "# ------------------------------------------------------------ #"
  echo "creating checkout key for [${GITHUB_ORG}/${REPO_NAME}]"
  echo "# ------------------------------------------------------------ #"
  # --- First let's delete all previous deploy keys
  curl -d "${JSON_PAYLOAD}" -X GET https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq '.[]' | jq '.[].fingerprint' | awk -F '"' '{print $2}' | tee -a ./${GITHUB_ORG}.${REPO_NAME}.fingerprints.list

  while read FINGERPRINT; do
    curl -d "${JSON_PAYLOAD}" -X DELETE https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key/${FINGERPRINT} -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  done <./${GITHUB_ORG}.${REPO_NAME}.fingerprints.list
  # -- Finally we re-create a  new deploy key
  # curl -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  curl -d "${JSON_PAYLOAD}" -X POST https://circleci.com/api/v2/project/gh/${GITHUB_ORG}/${REPO_NAME}/checkout-key -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" | jq .
  echo "# ------------------------------------------------------------ #"
  # cat consolidated-git-repos-uris.list | awk -F '/' '{print $4}'
done <./shell/consolidation-diff.list
