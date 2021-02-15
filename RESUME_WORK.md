# The Gravitee Release Orchestrator

This markdown file is a utility I use to quickly resume work on my last task, on this repo.

Change this for yoru own needs when you fork this repo.

# To resume work

* copy/paster :

```bash

git config --global commit.gpgsign true
git config --global user.name "Jean-Baptiste-Lasselle"
git config --global user.email jean.baptiste.lasselle.pegasus@gmail.com
git config --global user.signingkey 7B19A8E1574C2883

git config --global --list

# will re-define the default identity in use
# https://docstore.mik.ua/orelly/networking_2ndEd/ssh/ch06_04.htm
ssh-add ~/.ssh.perso.backed/id_rsa

export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
ssh -Ti ~/.ssh.perso.backed/id_rsa git@github.com


export LOCAL_WORKSPACE=~/gravitee-orchestra
cd ${LOCAL_WORKSPACE}
export FEATURE_ALIAS="cicd_modularization"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): [documentation/circleci-orbs/orbinoid/orb] contains a much better orb starter, added orbinoid integration tests feature, orbinoid orb publishing process now also git flow releases the orb source code,  working on https://github.com/gravitee-io/release/issues/145"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): finishing Implementation of [cc], for Error Management, in case of a Pipeline execution failure detection,  "

export FEATURE_ALIAS="pipelines_autodeploy"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): adding automation main structure in [std-ops/deployment/cci-pipeline-defs/dev-repos],  working on https://github.com/gravitee-io/release/issues/145"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): re-implementation of automation of pipelines defintion in [std-ops/deployment/cci-pipeline-defs/dev-repos],  working on https://github.com/gravitee-io/release/issues/155"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): automation of pipelines defintion, adding optimization avoiding repository redundancy,  working on https://github.com/gravitee-io/release/issues/155"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): automation of pipelines defintion, finishing docuementation and SSH key setup automation, working on https://github.com/gravitee-io/release/issues/155"

export FEATURE_ALIAS="std-ops-gravitee-lab"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): updated deployment of pipeline defintion for all dev repos, to use [gravitee-io/gravitee@dev:1.0.2] Circle CI Orb"

export FEATURE_ALIAS="std-ops-gravitee-lab"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): working on installing GPG Bot identity, to use for signing GRavitee java artifacts with [gravitee-io/gravitee@dev:1.0.2] Circle CI Orb"

export FEATURE_ALIAS="resume_release"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): implementing resume feature in dry run mode to ease testability as of https://github.com/gravitee-io/release/issues/130#issuecomment-740240754"
# git add --all && git commit -m "${COMMIT_MESSAGE}" && git push -u origin HEAD

atom .

```

* trigger a dry run :

```bash
export CCI_TOKEN="<token value>"
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

curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline
```

* trigger a release :

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

curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline

```

## Current squash

```bash
export SQUASH_ORIGIN="1b1488c98556575c8e153beed20a6133fe4248cc"
git rebase --interactive "${SQUASH_ORIGIN}"
