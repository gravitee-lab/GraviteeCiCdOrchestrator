## Step 1 : Gitops Maven Releases _(Milestone 10 Septembre)

* pour faire une release `3.1.68` :
  * tirer une branche `dry-3.1.68` de la branche `3.1.x`
  * créer une pull request de la branche `dry-3.1.68` vers la branche `3.1.x`
  * la pull request déclenche le pipeline Circle CI **EN DRY RUN** (dry run obligatoire par défaut) => pas envoi sur JFrog des jar
  * Quand dry run terminé, Ajout du rapport de résultat dans les commentaires de la PR : pour chaque pipeline exécuté, affichage du status, et si failed, ajout de quelques détails sur le cause de la `failure`, et pour chaque pipeline, lien https vers la page web `Circle CI`
  * si des pipelines Circle CI ont terminé avec un status `failed`, alors correction par les ingénieurs de dev, et on recommence avec une nouvelle PR de la branche `dry-3.1.68`, vers la branche `3.1.x`.
  * si tous les piplines sont en `success`, alors on accepte la PR de la branche `dry-3.1.68`, vers la branche `3.1.x`
* le fait d'accepter la merge request (filter sur la branche `3.1.x`), déclenche encore le Pipeline Circle CI du repo https://github.com/gravitee-io/release . Dans cette nouvelle exécution :
  * est ajouté le tag `3.1.68` sur la branche `3.1.x`
  * déclenchement du "pipeline suivant"' => _**step 2 : "push to downloads"**_

## Step 2 : "push to public downloads endpoints" _(Milestone 17 Septembre)_

* création des zip : Community et EE,

## Step 3 / 4 : "docker releases" + "`RPM` releases" _(Milestone 22 Septembre)_

* _**Step 3**_ :
 * docker build and push des images Docker `Gravitee Community Edition`  + `Gravitee Entreprise Edition`

* _**Step 4**_ :
 * publish RPM avec l'image docker digital ocean
*
* _**Step 3**_ et _**Step 4**_ peuvent s'exécuter en parallèle.


## Step `4bis` (lancer le pipeline d'un seul composant / repo github)

Cas d'utilisation :
* en cours de sprint de dev, les ingénieurs envoient des pull request, pour validation de leur livrable, et merge.
  * le pipeline doit alors se lancer sans effectuer de release
  * le pipeline dopit alors exécuter les tests nécessaires à la validation du livrable.
  * les résultats des tests doivent être rapportés dans les commentaires de la pull request, au moins :
    * Le lien vers la page `Web UI` `Circle CI` affichant les logs de l'exécution des tests.
    * le statut `failed` ou `success`

## Step 5 : déploiement automatique des env de démo

* À voir le milestone temporel
 * déploiement des démos : ai suggéré possible `pulumi` `EKS` _"non `Fargate`"_, avec lien `Route 53`

## Step 6 (or later) : Global Log collection across pipelines

This proposal about log collection started with :

* We want all pipeline executions logs to be centralized in a logging management system, so that then we can troubleshoot, and analyze all of CICD pipeline executions, to be able to "group" those executions as "a global workflows". Meaning  :
  * Given one `Gravitee APIM Release Process` execution, which ended up publishing release version `X.Y.Z`, we want to be able to retrieve all pipeline executions which occurred during that process execution. The pipeline executions could for example be labelled/indexed/marked `gravitee-apim-release`, `ee` (entrerpise edition) and `X.Y.Z`.
  * Given one `Gravitee AM Release Process` execution, which ended up publishing release version `X.Y.Z`, we want to be able to retrieve all pipeline executions which occurred during that process execution. The pipeline executions could for example be labelled/indexed/marked `gravitee-apim-release`, `ce` (community edition) and `X.Y.Z`.
  * etc...


Considering `Fluentd` instead of winston, would make our CICD Orchectrator, a twelve factor app : https://github.com/cjpark87/fluent-logger-nodejs

Unfortunately, We cannot use `Fluentd` for logging collection, from within a pipeline (Whether Circle CI or any other) : because `Fluentd` would need to reach the Gravitee CICD Orchestrator, inside the pipeline execution over the network , and that is not possible.

#### Winston and Log management : One found solution

* https://circleci.com/orbs/registry/orb/logzio/logzio-orb => ad there you go log collection enabled
*  so ok, then i could also develop an rb fro filebeat
* any way, **important limit to respect is less than 10 Mb of files**
* is there a SAAS for logzio ? yes there is, and I created a free account to start with
* look at this boy : https://github.com/logzio/winston-logzio (perfectly what I need)
* **never the less** To open up to much more SAAS offer :
  * I can write a Circle Ci Orb for `Filebeat` (not restricted to logz.io) .
  * `logz.io` is an ELK Filebeat `SAAS` Offer
  * so I can mimic their code, change it to match just Filebeats requirements, with configuration re-aligned . Orb Source code is : https://github.com/logzio/logzio-orb
  * backed up at https://github.com/gravitee-lab/filebeat-orb
