# JFrog appliance : mvn repo for our tests


* Created free plan SAAS https://gravitee.jfrog.io/
* Note : there can be webhooks on JFrog

## Quick tour

Goal of this quick tour :

* I have a maven java project, and when I `mvn relaease`, it pushes the jar to https://gravitee.jfrog.io
* To test this case, I will use https://github.com/gravitee-lab/gravitee-gateway
* I will also use a [docker container](https://hub.docker.com/_/maven), to run the maven commands from my workstation :

```bash
export MVN_LAB=~/mvn-lab
git clone https://github.com/gravitee-lab/gravitee-gateway ${MVN_LAB}
cd ${MVN_LAB}

# maaping [ -v "$PWD/target:/usr/src/mymaven/target" ] requires to create a docker image to manage UID GID of linux user inside and outside container
# docker run -it --rm -v "$PWD":/usr/src/mymaven -v "$HOME/.m2":/root/.m2 -v "$PWD/target:/usr/src/mymaven/target" -w /usr/src/mymaven maven mvn clean package

# To run mvn clean package:
# [-v "$PWD":/usr/src/mymaven] :  maps the source code inside container
# [-v "$HOME/.m2":/root/.m2] : maps the maven [.m2] on my workstation to the one inside the container. I will ust this one to use settings.xml
docker run -it --rm -v "$PWD":/usr/src/mymaven -v "$HOME/.m2":/root/.m2 -w /usr/src/mymaven maven mvn clean package
# To run mvn clean package release :
# all gravtiee java pom projects are [https://github.com/gravitee-io/gravitee-parent/]


git clone https://github.com/gravitee-io/gravitee-parent

```

* set up de https://gravitee.jfrog.io comme maven repo distant pour un composant java `Gravitee` :

# Comment sont résolus les maven repo distants

* https://github.com/gravitee-io/gravitee-parent contient un `pom.xml` _parent_ qui définit la configuration de 3 repo maven distants :
  * 2 `snapshots` : https://oss.sonatype.org/content/repositories/snapshots et http://oss.sonatype.org/content/repositories/snapshots
  * 1 `staging` : https://oss.sonatype.org/service/local/staging/deploy/maven2/
  * Deux sections du `pom.xml` configurent ces 3 repos :


```Xml
<!-- [...] -->
<distributionManagement>
    <snapshotRepository>
        <id>sonatype-nexus-snapshots</id>
        <url>https://oss.sonatype.org/content/repositories/snapshots</url>
    </snapshotRepository>
    <repository>
        <id>sonatype-nexus-staging</id>
        <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
    </repository>
</distributionManagement>
<!-- [...] -->
<repositories>
    <repository>
        <id>oss.sonatype.org-snapshot</id>
        <url>http://oss.sonatype.org/content/repositories/snapshots</url>
        <releases>
            <enabled>false</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
</repositories>
<!-- [...] -->
```
* En plus de ces deux sections dans le `pom.xml` parent commun à tous les composants Java, certains ont dans leur propre `pom.xml`, une section de configuration de maven repo :

```Xml
<profiles>
    <profile>
        <id>allow-snapshots-for-swagger3</id>
        <activation><activeByDefault>true</activeByDefault></activation>
        <repositories>
            <repository>
                <id>snapshots-repo</id>
                <url>https://oss.sonatype.org/content/repositories/snapshots</url>
                <releases><enabled>false</enabled></releases>
                <snapshots><enabled>true</enabled></snapshots>
            </repository>
        </repositories>
    </profile>
</profiles>
```

* Chaque composant Java référence dans son propre `pom.xml` le https://github.com/gravitee-io/gravitee-parent comme _"`pom parent`"_ :

```Xml
<parent>
    <groupId>io.gravitee</groupId>
    <artifactId>gravitee-parent</artifactId>
    <version>19</version>
</parent>
```

* Dans aucun composant `Java` Gravitee.io, on ne trouve de configuration de remote maven de type 'release' : unqiuement `snapshot` et `staging`
* Examinons plus en détail les scripts `groovy` présents dans https://github.com/gravitee-io/jenkins-scripts.git :
  * `src/main/groovy/release.groovy` : s'exécutant dans le pipeline https://ci.gravitee.io/view/Release/job/Release_Gravitee.io, celui ci invoque `src/main/groovy/releasemaven.groovy`
  * `src/main/groovy/releasemaven.groovy` : contient la procédure de build `maven` de chaque composant, et voici la liste des commandes maven exécutées :
    * `mvn -B versions:set -DnewVersion=${c.version.releaseVersion()} -DgenerateBackupPoms=false` commentaire : `// set version`
    * `mvn -B -U versions:update-properties -Dincludes=io.gravitee.*:* -DallowMajorUpdates=false -DallowMinorUpdates=false -DallowIncrementalUpdates=true -DgenerateBackupPoms=false`,  commentaire : `// use release version of each -SNAPSHOT gravitee artifact`
    * `git rev-parse HEAD > GIT_COMMIT` : génération du GIT_COMMIT_ID (chercher le git comit id maven plugin s'il est utilisé)
    * `mvn -B -U clean install` puis `mvn enforcer:enforce` :  pour faire un dry run. le maven enforcer plugin est là pour une unique contrainte, présente dans le `pom.xml` de chaque composant java `Gravitee.io` : `No Snapshots Allowed!` (le pom parent commun à tous les composant ne comprend que le dépendance qu'est le maven enforcer plugin ). Les contraintes sont exeprimées par les tags `XML` utilisés comme `DSL`.
    * `mvn -B -U -P gravitee-release clean deploy` : lavoilà la release pour envoyer sur `nexus`
    * `git add --update`
    * `git commit -m 'release(${c.version.releaseVersion()})`
    * `git tag ${c.version.releaseVersion()}` : ok, APRES, avoir fait le `maven deploy`, est créée le tag de release : possibilité d'utiliser le git flow ici, sans pousser la branche `develop`.
    *  :

```bash
export SCM_BRANCH=<valeur passée en paramètre ${GRAVITEEIO_VERSION} du pipeline  https://ci.gravitee.io/view/Release/job/Release_Gravitee.io>
export NEXT_BRANCH_NAME=<se déduit de ${SCM_BRANCH} ?>
export NEXT_FIX_SNAPSHOT_VERSION=<se déduit de ${SCM_BRANCH} ?>
export NEW_SNAPSHOT_VERSION_ON_CURRENT_BRANCH=<se déduit de ${SCM_BRANCH} ?>

# https://github.com/gravitee-io/jenkins-scripts/blob/master/src/main/groovy/releasemaven.groovys

# ------------------------------------------------------------
# ==>>> Create the maintenance branch if needed
# ------------------------------------------------------------
# Si dry run :
# create the maintenance branch named '${NEXT_BRANCH_NAME}'"
# ------------------------------------------------------------
git checkout -b "${NEXT_BRANCH_NAME}"
mvn -B versions:set -DnewVersion="${NEXT_FIX_SNAPSHOT_VERSION}" -DgenerateBackupPoms=false
git add --update
git commit -m 'chore(): Prepare next version'
git checkout "${SCM_BRANCH}"
# si ce n'est pas un dry run :
# create the maintenance branch named "${NEXT_BRANCH_NAME}"
git checkout -b ${c.version.getNextBranchName()}
mvn -B versions:set -DnewVersion="${NEXT_FIX_SNAPSHOT_VERSION}" -DgenerateBackupPoms=false
git add --update
git commit -m 'chore(): Prepare next version'
git push --tags origin "${NEXT_BRANCH_NAME}" # seulement si ce n'est PAS un dry run
git checkout "${SCM_BRANCH}"
# update next version
mvn -B versions:set -DnewVersion="${NEW_SNAPSHOT_VERSION_ON_CURRENT_BRANCH}" -DgenerateBackupPoms=false
# commit, tag the snapshot
git add --update
git commit -m 'chore(): Prepare next version'
git push --tags origin "${SCM_BRANCH}"
```

  * `src/main/groovy/updateParentVersion.groovy` agit sur https://github.com/gravitee-io/gravitee-parent
  * `src/main/groovy/releaseParent.groovy` : s'exécute avec le pipeline https://ci.gravitee.io/view/Release/job/Release%20Parent/ agissant sur https://github.com/gravitee-io/gravitee-parent
  * `src/main/groovy/releasejson.groovy` : lorsque l'on a poussé un commit sur https://github.com/gravitee-io/release.git de `relaase.json`, le script créée le tag et pousse sur la "bonne branche" : à l'aide des paramètres du pipeline Jenkins (liste déroulante, no de version)




* Un autre pipeline, https://ci.gravitee.io/view/Release/job/Release_Schema_Generator , exécute le script `groovy` suivant (et cela ressemble fort à l'algoritme d'enchaînement des manven release de chaque repo `mvn install`, n'est invoqué par aucun autre, et  n'est plus utilisé depuis `2017` )  :

```Groovy
def scmUrl = "git@github.com:gravitee-io/json-schema-generator-maven-plugin.git"
def scmBranch = "master"
dryRunAsBool = Boolean.valueOf(dryRun)

if (dryRunAsBool) {
    println("\n    ##################################" +
            "\n    #                                #" +
            "\n    #          DRY RUN MODE          #" +
            "\n    #                                #" +
            "\n    ##################################")
}

node() {
    println("\n    scmUrl         = ${scmUrl}" +
            "\n    scmBranch      = ${scmBranch}" +
            "\n    releaseVersion = ${RELEASE_VERSION}" +
            "\n    nextSnapshot   = ${NEXT_VERSION}")

    sh 'rm -rf *'
    sh 'rm -rf .git'

    def mvnHome = tool 'MVN33'
    def javaHome = tool 'JDK 8'
    withEnv(["PATH+MAVEN=${mvnHome}/bin",
            "M2_HOME=${mvnHome}",
            "JAVA_HOME=${javaHome}"]) {

        checkout([
                $class                           : 'GitSCM',
                branches                         : [[
                                                            name: "${scmBranch}"
                                                    ]],
                doGenerateSubmoduleConfigurations: false,
                extensions                       : [[
                                                            $class     : 'LocalBranch',
                                                            localBranch: "${scmBranch}"
                                                    ]],
                submoduleCfg                     : [],
                userRemoteConfigs                : [[
                                                            credentialsId: 'ce78e461-eab0-44fb-bc8d-15b7159b483d',
                                                            url          : "${scmUrl}"
                                                    ]]
        ])

        // set version
        sh "mvn -B versions:set -DnewVersion=${RELEASE_VERSION} -DgenerateBackupPoms=false"

        // use release version of each -SNAPSHOT gravitee artifact
        sh "mvn -B -U versions:update-properties -Dincludes=io.gravitee.*:* -DgenerateBackupPoms=false"

        sh "cat pom.xml"

        // deploy
        if (dryRunAsBool) {
            sh "mvn -B -U clean install"
            sh "mvn enforcer:enforce"
        } else {
            sh "mvn -B -U -P gravitee-release clean deploy"
        }

        // commit, tag the release
        sh "git add --update"
        sh "git commit -m 'release(${RELEASE_VERSION})'"
        sh "git tag ${RELEASE_VERSION}"

        // update next version
        sh "mvn -B versions:set -DnewVersion=${NEXT_VERSION} -DgenerateBackupPoms=false"

        // commit, tag the snapshot
        sh "git add --update"
        sh "git commit -m 'chore(): Prepare next version'"

        // push
        if ( !dryRun ) {
            sh "git push --tags origin ${scmBranch}"
        }
    }
}
```



# ANNEXE : Doc de ref.

`JFrog` Docs reference :

* https://www.jfrog.com/confluence/display/JFROG/Get+Started%3A+Cloud
* https://www.jfrog.com/confluence/display/JFROG/Maven+Repository
