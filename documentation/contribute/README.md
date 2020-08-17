# Contribute guide



# IAAC cycle (git flowed, default config)

*  Init of the git flow in repo :

```bash
export WORK_HOME="${HOME}/gravitee-orchestra"

git clone git@github.com:gravitee-lab/GraviteeReleaseOrchestrator.git ${WORK_HOME}

cd ${WORK_HOME}

git flow init --defaults && git push -u origin --all

export FEATURE_ALIAS='basic_source_code'

git flow feature start ${FEATURE_ALIAS} && git push -u origin --all

export COMMIT_MESSAGE="feat(${FEATURE_ALIAS}) : adding README.md and  basic source code for a node / typescript app #1 #2 "

git add --all && git commit -m "${COMMIT_MESSAGE}" && git push -u origin  --all

atom .

```

* Resume work on 'feature/basic_source_code', from an empty directory :

```bash
export WORK_HOME="${HOME}/gravitee-orchestra"
export FEATURE_ALIAS='basic_source_code'

git clone git@github.com:gravitee-lab/GraviteeReleaseOrchestrator.git ${WORK_HOME}

cd ${WORK_HOME}

git flow init --defaults && git push -u origin --all

git checkout "feature/${FEATURE_ALIAS}"

# git flow feature start ${FEATURE_ALIAS} && git push -u origin --all

export COMMIT_MESSAGE="feat(${FEATURE_ALIAS}) : adding README.md and  basic source code for a node / typescript app #1 #2 "

git add --all && git commit -m "${COMMIT_MESSAGE}" && git push -u origin  --all
# git add --all && git commit --amend -m "${COMMIT_MESSAGE}" && git push -u -ff origin  --all
atom .

```

* Resume work on `feature/basic_source_code`, from an already setup directory :

```bash
export WORK_HOME="${HOME}/gravitee-orchestra"
export FEATURE_ALIAS='basic_source_code'

# git clone git@github.com:gravitee-lab/GraviteeReleaseOrchestrator.git ${WORK_HOME}

cd ${WORK_HOME}

git checkout "feature/${FEATURE_ALIAS}"

# git flow feature start ${FEATURE_ALIAS}

export COMMIT_MESSAGE="feat(${FEATURE_ALIAS}) : adding README.md and  basic source code for a node / typescript app #1 #2 "

git add --all && git commit -m "${COMMIT_MESSAGE}" && git push -u origin  --all
# git add --all && git commit --amend -m "${COMMIT_MESSAGE}" && git push -u -ff origin  --all
atom .
```

# `Typescript` project init

```bash
export GIT_REPO_HTTPS_URI=https://github.com/gravitee-lab/GraviteeReleaseOrchestrator.git
export NPM_PROJECT_ISSUES_HTTPS_URI=https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/issues

export NPM_PROJECT_NAME="GraviteeReleaseOrchestrator"
export NPM_PROJECT_VERSION_ZERO="0.0.1"
export NPM_PROJECT_DESC="The Gravitee Release Orchestrator steers Circle CI operations to process a fully automated Release of Gravitee APIM. The Gravitee Devops Team AT github.com/gravitee-lab"
export NPM_PROJECT_HOMEPAGE=https://github.com/gravitee-lab/GraviteeReleaseOrchestrator/README.md
# this nom starter is [git+https://github.com/goldhand/goldhand.git]
export NPM_STARTER_NAME="foo"

sudo npm install -g npm
sudo npm install -g typescript

npm init --yes "${NPM_STARTER_NAME}"

rm foo/README.md
cp -fR foo/* ./
rm -fr foo/

sed -i  "s#\"name\":.*#\"name\": \"${NPM_PROJECT_NAME}\",#g" package.json
sed -i  "s#\"version\":.*#\"version\": \"${NPM_PROJECT_VERSION_ZERO}\",#g" package.json
sed -i  "s#\"url\": \"git.*#\"url\": \"git+${GIT_REPO_HTTPS_URI}\"#g" package.json
sed -i  "s#\"url\": \"https.*#\"url\": \"${NPM_PROJECT_ISSUES_HTTPS_URI}\"#g" package.json
sed -i  "s#\"description\":.*#\"description\": \"${NPM_PROJECT_DESC}\",#g" package.json
sed -i  "s#\"homepage\":.*#\"homepage\": \"${NPM_PROJECT_HOMEPAGE}\"#g" package.json
# done nothing with the keywords : do that manually :)

cat <<EOF > tsconfig.json
{
    "compilerOptions": {
        "target": "es5",
        "sourceMap": true
    }
}
EOF

# -- removing from starter all [*.js]
rm ./index.js

cat <<EOF > index.ts
#!/usr/bin/env node

console.log('I am the Gravitee Release Orchestrator !')
console.log('hey there!')
EOF


# Addin dev and runtime dependencies
npm install --save typescript ts-node
npm install --save-dev @types/node
npm install typedoc --save-dev
# circleci has no @types/circleci types definition, so
# will use an HTTP Client package instead
# npm install circleci --save
npm install rxjs rxjs-compat --save
npm install axios @types/axios --save
npm install cli-progress @types/cli-progress --save



```
