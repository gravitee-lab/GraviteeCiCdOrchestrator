# Bash CircleCI Cheatsheet


## Trigger a pipeline

* With parameters :

```bash
export CCI_TOKEN="<token vaue>"
export ORG_NAME="gravitee-lab"
export REPO_NAME="testrepo3"
export BRANCH="dependabot/npm_and_yarn/handlebars-4.5.3"
export JSON_PAYLOAD="{

    \"branch\": \"${BRANCH}\",
    \"parameters\":

    {
        \"to\": \"Gravitee.io Team!\"
    }

}"

curl -X POST -d "${JSON_PAYLOAD}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Circle-Token: ${CCI_TOKEN}" https://circleci.com/api/v2/project/gh/${ORG_NAME}/${REPO_NAME}/pipeline

```

* resume work on a test repo :

```bash
git config --global commit.gpgsign true
git config --global user.name "Jean-Baptiste-Lasselle"
git config --global user.email jean.baptiste.lasselle.pegasus@gmail.com
git config --global user.signingkey 7B19A8E1574C2883

git config --global --list
user.name=Jean-Baptiste-Lasselle
user.signingkey=7B19A8E1574C2883
user.email=jean.baptiste.lasselle.pegasus@gmail.com
commit.gpgsign=true

# will re-define the default identity in use
# https://docstore.mik.ua/orelly/networking_2ndEd/ssh/ch06_04.htm
ssh-add ~/.ssh.perso.backed/id_rsa

export GIT_SSH_COMMAND='ssh -i ~/.ssh.perso.backed/id_rsa'
ssh -Ti ~/.ssh.perso.backed/id_rsa git@github.com

atom .
export BRANCH="dependabot/npm_and_yarn/handlebars-4.5.3"
git checkout ${BRANCH}
export FEATURE_ALIAS="orbs_tests"
export COMMIT_MESSAGE="feat.(${FEATURE_ALIAS}): trying to use orbs parameters"
git add --all && git commit -m "${COMMIT_MESSAGE}" && git push -u origin HEAD
```
