# About the `release.json` and how to resolve version numbers
La toute premère de l'ensemble du process, consiste à demander en entrée 3 paramètres, une version de RELEASE ${GRAVITEEIO_RELEASE_VERSION},  et une référence vers une Milestone Github.com, ${GRAVITEEIO_GH_MILESTONE} . Cette étape va scanner la milestone pour retrouver toutes les issues embarquées, et déterminer l'ensemble des repos git concernés par la Release. Cette étape sera exécutée par le circle ci pipeline du repo versionant le  *Gravitee Release Orchestrator*  https://github.com/gravitee-io/GraviteeReleaseOrchestrator.git dont le .circleci/config.yml exécute un conteneur docker, avec pour image celle du  *Gravitee Release Orchestrator* .  npm start - --stage=prepare-release --params="{release_version: '${GRAVITEEIO_RELEASE_VERSION}', gh_milestone: { uri: '${GRAVITEEIO_GH_MILESTONE}' } }"   où  export GRAVITEEIO_RELEASE_VERSION=3.4.7 && export GRAVITEEIO_GH_MILESTONE=https://github.com/gravitee-lab/issues/milestone/1  . On déclenchera ce pipeline du repo  https://github.com/gravitee-io/GraviteeReleaseOrchestrator.git avec un curl  qui passera les paramètres ${GRAVITEEIO_RELEASE_VERSION} et ${GRAVITEEIO_GH_MILESTONE} au pipeline, comme le permet la Circle CI API v2  :

```
export JSON_PAYLOAD="{
\"branch\": \"feature/design-new-api\",
\"tag\": \"v3.1.4159\",
\"parameters\": {
\"GRAVITEEIO_RELEASE_VERSION\": \"3..4.7\",
\"GRAVITEEIO_GH_MILESTONE\": \"https://github.com/gravitee-lab/issues/milestone/1\"
}
}"
curl -X POST https://circleci.com/api/v2/project/gh/gravitee-io/GraviteeReleaseOrchestrator/pipeline \
-d "${JSON_PAYLOAD}" \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'x-attribution-login: string' \
-H 'x-attribution-actor-id: string' \
-H 'Circle-Token: API_KEY'
```

* Suite à quoi cette étape :
  * 1./ créera avec le git flow une branche `feature/prepare_release_${GRAVITEEIO_RELEASE_VERSION}` sur le repo https://github.com/gravitee-io/release.git
  * 2./ `git` commit n push du `release.json` modifié sur la branche `feature/prepare_release_${GRAVITEEIO_RELEASE_VERSION}`
  * 3./ création d'un pull request de la branche `feature/prepare_release_${GRAVITEEIO_RELEASE_VERSION}` vers la branche `master` et envoie une notification slack
  * 4./ un humain chez `Gravitee.io` vérifie que le `release.json` est OK et accepte la pull / merge request
  * 5./ le merge vers master déclenchera le circle ci pipeline du repo https://github.com/gravitee-io/release.git dont le `.circleci/config.yml` exécute un conteneur docker, celui du **Gravitee Release Orchestrator** (le Circle CI pipeline est simplement configuré pour ne se déclencher qu'à chaque nouveau "push de commit" sur la branche master" )

* ensuite intervient l'étape dont je suis en train de finir l'implémention :  "lancer les maven release Circle CI pipeline sur tous les repo des components qui doivent être buildé pour être embarqués dans la release".
* Cette étape,  est donc exécutée par le circle ci pipeline du repo https://github.com/gravitee-io/release.git dont le `.circleci/config.yml` exécute un conteneur docker, avec pour image celle du  **Gravitee Release Orchestrator** .  `npm start - --stage=release`
* l'étape suivante consiste à lancer le pipeline `Circle CI` qui va automatiser "`Release To bintray`", fabrique les `zip` à mettre en ligne sur https://download.gravitee.io/ , et enchaîne en mettant en ligne les zip sur https://download.gravitee.io/ .
* le *Gravitee Release Orchestrator* devra alors aussi utiliser son "monitor", pour déterminer quand cette étape est terminée.
* Le lancement sera effectué par le **Gravitee Release Orchestrator** , par trigger du pipeline d'un nouveau repo `git` https://github.com/gravvtiee-io/apim-binary-releaser.git consacré au versioning de scripts shell (à écrire avec `ssh`, `scp`, `zip`, `tar`, `GPG`, et `maven` image docker maven jdk ), [exemple de "trigger d'un Circle CI Pipeline, From a Circle CI Pipeline"](https://circleci.com/docs/2.0/api-job-trigger/#conditionally-running-jobs-with-the-api) .
* Lorsque l'étape précédente est terminée, alors  le **Gravitee Release Orchestrator** lancera tous en parallèle, les jobs de builds d'image `docker`, avec le no de version indiqué dans le release.json , très exactement celui-ci : `cat release.json | jq.version`
* J'enchaînerai avec le même pattern ensuite, avec le build and publish des RPM, et de la documentation Jekyll , deux étapes très faciles à transfromer en Circle CI .circleci/config.yml : il faudra cependant un repo consacré  la défintion du build des RPM (versionnera des scripts, principalement)
