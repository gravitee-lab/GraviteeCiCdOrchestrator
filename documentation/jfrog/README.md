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


# Comment sont résolus les maven repo distants
 
* set up de https://gravitee.jfrog.io comme maven repo distant pour un composant java `Gravitee` :
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

`JFrog` Docs reference :

* https://www.jfrog.com/confluence/display/JFROG/Get+Started%3A+Cloud
* https://www.jfrog.com/confluence/display/JFROG/Maven+Repository
