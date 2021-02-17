# Gravitee Release RoadMap

## Gravitee APIM Release

### Maven and git Release (with release.json)

Secrethub and config.yml setup new Secrets creation and update all config.yml

### Package bundle https://download.gravitee.io

APIM v3 for Community Edition (Publish to Bintray in Jenkins) :

* Secrethub and config.yml setup new Secrets creation and update all config.yml
* Basic Web UI customization, (Gravitee Logo)
* migration of existing files,
* and DNS configuration

APIM v3 for Entreprise Edition :

Ci dessous , cela fait le job uniquement pour APIM :

* package bundle (zip) pour la version Entreprise Edition V3 :
  * c'est des instructions Docker
  * toutes les instructions docker sont dans : https://ci2.gravitee.io/view/Gravitee.io%20EE/job/Build%20V3%20full-ee.zip/configure
  * à noter : dans le docker volume `-v "/opt/dist/dist.gravitee.io/graviteeio-ee/apim/distributions:/opt/dist"` sont générés les fichiers qui doivent être installés dans https://download.gravitee.io, dans le répertoire `graviteeio-ee/apim/distributions`.

* package bundle (zip) pour la version Entreprise Edition V1 :
  * c'est des instructions Docker
  * toutes les instructions docker sont dans : https://ci2.gravitee.io/view/Gravitee.io%20EE/job/Build%20V1%20full-ee.zip/configure
  * à noter : dans le docker volume `-v "/opt/dist/dist.gravitee.io/graviteeio-ee/apim/distributions:/opt/dist"` sont générés les fichiers qui doivent être installés dans https://download.gravitee.io, dans le répertoire `graviteeio-ee/apim/distributions`.


### Publish to Public Sonatype for Community Edition (“Nexus Staging”)

* Secrethub and `config.yml` setup : new Secrets creation and update all `.circleci/config.yml`

### Changelog Generation

* Génération du ChangeLog :
  * https://ci2.gravitee.io/view/Release/job/Docker%20graviteeio-changelog/configure
  * https://ci2.gravitee.io/job/Generate%20Changelog/configure exécute un script groovy qui fait un docker run de l'image construite avec https://ci2.gravitee.io/view/Release/job/Docker%20graviteeio-changelog/configure
  * dans Circle CI , celui s'exécutera dans le `config.yml` du repo de release, comme le nexus staging.


### Publish to Public Sonatype for Entreprise Edition (Nexus Staging) : should be merged in same job than Community Edition

Do not publish to NExus Sonatype for Entreprise Edition

### Docker images : Build and push Entreprise & Community Edition

#### Community Edition

* One Workflow, 4 Jobs, all same pipeline parameters
  * APIM v3 Gateway :
    * https://ci2.gravitee.io/view/Docker/job/APIM%20-%20V3%20-%20Docker%20API%20Gateway/configure
    * https://ci2.gravitee.io/view/Platform%20v3/job/APIM%20-%20V3%20-%20Docker%20API%20Gateway/configure
  * APIM v3 Management API:
    * https://ci2.gravitee.io/view/Docker/job/APIM%20-%20V3%20-%20Docker%20Management%20API/configure
    * https://ci2.gravitee.io/view/Platform%20v3/job/APIM%20-%20V3%20-%20Docker%20Management%20API/configure
  * APIM v3 Management UI:
    * https://ci2.gravitee.io/view/Docker/job/APIM%20-%20V3%20-%20Docker%20Management%20UI/configure
    * https://ci2.gravitee.io/view/Platform%20v3/job/APIM%20-%20V3%20-%20Docker%20Management%20UI/configure
  * APIM v3 Portal UI :
    * https://ci2.gravitee.io/view/Docker/job/APIM%20-%20V3%20-%20Docker%20Portal%20UI/configure
    * https://ci2.gravitee.io/view/Platform%20v3/job/APIM%20-%20V3%20-%20Docker%20Portal%20UI/configure

* One Workflow, 3 Jobs, all same pipeline parameters
  * APIM v1 gateway : https://ci2.gravitee.io/view/Docker/job/Docker%20graviteeio-gateway/configure
  * APIM v1 Management API : https://ci2.gravitee.io/view/Docker/job/Docker%20graviteeio-management-api/configure
  * APIM v1 Management UI : https://ci2.gravitee.io/view/Docker/job/Docker%20graviteeio-management-ui/configure


Indication pourles paramètres de pipeline pour la release des iamges Dockers V3 :
* si on lui dit que c'est une release `3.0.15`  :
  * il fera un tag (et le push) `latest`, si un param `boolean` de est à `true` (et à true par défaut)
  * il fera un tag (et le push)  `3`, si et ssi ...
  * il fera un tag (et le push) `3.0`, si et ssi ...
  * et il fera toujours un tag `3.0.15`  (et le push)
  * à retrouver dans la définition du pipeline jenkins

#### Entreprise Edition

Exact Same as community, but Docker images are here : https://github.com/gravitee-io/gravitee-docker/tree/master/enterprise


### Docker nightly images : hrs release; mais ...

2 APIM v3 nightly, pour
* tester les builds docker à la fois dans chaque repo, et dans le https://github.com/gravitee-io/gravitee-docker
* et à partir du release.json, pour en gros savoir de quelle version de gravitee "c'est la nightly".


* APIM v 3 nightly, les 4 images des 4 composants sont faites en un seul job Jenkins :
  * dans le repo `release.json`
  * par git clone des 4 repos git, dernière version sur `master`, et lancement du build sur les 4 repos
  * https://ci2.gravitee.io/view/Docker/job/APIM%20-%20v3%20-%20Docker%20nightly/configure

* APIM v 3 nightly "gravitee-docker", mais cette fois les 4 images des 4 composants sont faites en un seul job Jenkins :
  * dans le repo `release.json`
  * les 4 par git clone du même repo git `git@github.com:gravitee-io/gravitee-docker.git`, dernière version sur `master`, et lancement du build n push Docker
  * https://ci2.gravitee.io/view/Docker/job/APIM%20-%20v3%20-%20Docker%20nightly/configure



### RPMs : Generate and publish

Deux workflow Circle CI, et des pipeline parameters, ainsi qu'un token secret pour le publish des RPM vers le service digital ocean

* APIM v3 : https://ci2.gravitee.io/view/Packages/job/RPM%20for%20Gravitee.io%20APIM%203.x/configure
* APIM v1 : https://ci2.gravitee.io/view/Packages/job/RPM%20for%20Gravitee.io%20APIM%201.x/configure


### Build n Deploy the https://docs.gravitee.io with every APIM Release (update _config.yml + a git commit on master => deploys)

* Release et déploiement du https://docs.gravitee.io vers clever cloud :
  * https://www.clever-cloud.com/doc/deploy/application/docker/docker/
  * https://console.clever-cloud.com/organisations/orga_ba284152-8da9-4e8f-b32f-21d86100cac1/applications/app_5f58775b-2ac9-4b33-8ad4-7fcfcb16a02d
  * https://app-5f58775b-2ac9-4b33-8ad4-7fcfcb16a02d.cleverapps.io/
  * ok à priori, la seule chose qu'il faut faire pour déclencher le déploiement, c'est de faire un commit sur `master`, et ça déploie directement. See https://console.clever-cloud.com/organisations/orga_ba284152-8da9-4e8f-b32f-21d86100cac1/applications/app_5f58775b-2ac9-4b33-8ad4-7fcfcb16a02d/information
  * ok j'ai trouvé ce qu'il faut faire :
    * dans https://github.com/gravitee-io/gravitee-docs/blob/master/_config.yml
    * changer la valeur de `products.apim._3x.version` https://github.com/gravitee-io/gravitee-docs/blob/master/_config.yml#L122
    * puis faire le git commit and push sur master, avec un git tag en incrémentant le numéro de version, mode semver.






## Gravitee AM Release


### Maven and git Release (with release.json)

Since it is a mono-repo :
* The release will be done without artifactory, like it is done on JEnkins, with the `gravitee-release` profile, So the publish to nexus will be done by the release process
* all I will need is the settings.xml used to perform Gravitee AM Release
* I will have to configure the GPG to sign artifacts


### Package bundle (Publish to Bintray in Jenkins) https://download.gravitee.io

For Community edition and Entreprise Edition, will reproduce what is done for APIM :
* I did not find any job that does this

### Publish to Public Sonatype for Community Edition (“Nexus Staging”)

Since it is a mono-repo :
* The release will be done without artifactory, like it is done on JEnkins, with the `gravitee-release` profile, So the publish to nexus will be done by the release process
* all I will need is the settings.xml used to perform Gravitee AM Release
* I will have to configure the GPG to sign artifacts


### Changelog Generation

I did not find any ChangeLog specific to Gravitee AM, So maybe same as APIM

* Génération du ChangeLog :
  * https://ci2.gravitee.io/view/Release/job/Docker%20graviteeio-changelog/configure
  * https://ci2.gravitee.io/job/Generate%20Changelog/configure exécute un script groovy qui fait un docker run de l'image construite avec https://ci2.gravitee.io/view/Release/job/Docker%20graviteeio-changelog/configure
  * dans Circle CI , celui s'exécutera dans le `config.yml` du repo de release, comme le nexus staging.


### Publish to Public Sonatype for Entreprise Edition (Nexus Staging) : should be merged in same job than Community Edition

We do not publish to public Sonatype for Entreprise Version ?


### Docker images : Build and push Entreprise & Community Edition

* One Workflow, building and pushing all Gravitee AM components, with pipeline parameters
  * https://ci2.gravitee.io/view/Release/job/Docker%20Gravitee.io%20AM%20-%20Release/configure
  * no option about docker tags : always the version and that's it.

But we could add those paramters about tagging :

Indication pourles paramètres de pipeline pour la release des iamges Dockers V3 :
* si on lui dit que c'est une release `3.0.15`  :
  * il fera un tag (et le push) `latest`, si un param `boolean` de est à `true` (et à true par défaut)
  * il fera un tag (et le push)  `3`, si et ssi ...
  * il fera un tag (et le push) `3.0`, si et ssi ...
  * et il fera toujours un tag `3.0.15`  (et le push)
  * à retrouver dans la définition du pipeline jenkins

Entrerprise Edtion :
* Exact Same as community,
* but Docker images are here : https://github.com/gravitee-io/gravitee-docker/tree/master/enterprise/am


### RPMs : Generate and publish

Deux workflow Circle CI, et des pipeline parameters, ainsi qu'un token secret pour le publish des RPM vers le service digital ocean

* AM v2 : https://ci2.gravitee.io/view/Packages/job/RPM%20for%20Gravitee.io%20AM%202.x/configure
* AM v3 : https://ci2.gravitee.io/view/Packages/job/RPM%20for%20Gravitee.io%20AM%203.x/configure

### Build n Deploy the https://docs.gravitee.io with every APIM Release (update _config.yml + a git commit on master => deploys)

Un seul `Circle CI` Workflow ou Job, pour faire :
* un git commit poussé sur la branche `master` de https://github.com/gravitee-io/gravitee-docs
* le git tag de release dans https://github.com/gravitee-io/gravitee-docs (incrémenter le dernier git tag de release)


* Release et déploiement du https://docs.gravitee.io vers clever cloud :
  * https://www.clever-cloud.com/doc/deploy/application/docker/docker/
  * https://console.clever-cloud.com/organisations/orga_ba284152-8da9-4e8f-b32f-21d86100cac1/applications/app_5f58775b-2ac9-4b33-8ad4-7fcfcb16a02d
  * https://app-5f58775b-2ac9-4b33-8ad4-7fcfcb16a02d.cleverapps.io/
  * ok à priori, la seule chose qu'il faut faire pour déclencher le déploiement, c'est de faire un commit sur `master`, et ça déploie directement. See https://console.clever-cloud.com/organisations/orga_ba284152-8da9-4e8f-b32f-21d86100cac1/applications/app_5f58775b-2ac9-4b33-8ad4-7fcfcb16a02d/information
  * ok j'ai trouvé ce qu'il faut faire :
    * dans https://github.com/gravitee-io/gravitee-docs/blob/master/_config.yml
    * changer la valeur de `products.apim._3x.version` https://github.com/gravitee-io/gravitee-docs/blob/master/_config.yml#L122
    * puis faire le git commit and push sur master, avec un git tag en incrémentant le numéro de version, mode semver.











### RPM for AE

https://ci2.gravitee.io/view/Packages/job/RPM%20for%20Gravitee.io%20AE/configure





























  * Release AM :
    * pas de `release.json` existant, donc on reprend ce qui est fait côté cockpit pour la faire la release
    * comment faire la publication des zip sur https://download.gravitee.io :
      * devra être fait dans le `config.yml` du repo gravitee-am
    * comment on fait le nexus staging ?
      * dans le `config.yml` de `Gravitee AM`,
      * on fait la poussée sur un bucket S3 de tout le projet en l'état,
      * et on fait ensuite le nexus staging
      * à note que leJob JEnkins qui fait ce travail, est le "`Publish to Bintray`"
  * Release AE :
    * super proche de cockpit, appliquer la même recette


Next steps :

* Faire une release APIM `1.25.x` :
  * pour support
  * pour les issues :
    * https://github.com/gravitee-io/issues/milestone/132?closed=1
    * 3 repos gateway reat-api ui (à )
