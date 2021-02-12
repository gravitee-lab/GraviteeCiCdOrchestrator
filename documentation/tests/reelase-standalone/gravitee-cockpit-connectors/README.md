# Typical SNAPSHOT BUILD AND DEPLOY TO NEXUS


* pipeline executions at : https://app.circleci.com/pipelines/github/gravitee-io/gravitee-cockpit-connectors

the `documentation/tests/reelase-standalone/gravitee-cockpit-connectors/.circleci/config.yml` gives exactly what typically can be a simple process for a gravitee repo :
* To build the maven project in SNAPSHOT version, and maven deploy to nexus
* For a single dev repo


### Secrets


#### `settings.xml`

```bash
export SECRETHUB_ORG=graviteeio
export SECRETHUB_REPO=cicd


cat <<EOF > ./.secret.settings.dev.snaphots.xml
<?xml version="1.0" encoding="UTF-8"?>
<!--

    Copyright (C) 2015 The Gravitee team (http://gravitee.io)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <pluginGroups>
  </pluginGroups>
  <proxies>
  </proxies>
  <servers>
    <server>
      <id>sonatype-nexus-snapshots</id>
      <username>XXXXXXXXXXX</username>
      <password>XXXXXXXXXXX</password>
    </server>
    <server>
      <id>sonatype-nexus-staging</id>
      <username>XXXXXXXXXXX</username>
      <password>XXXXXXXXXXX</password>
    </server>
</servers>
  <mirrors>
  </mirrors>
  <profiles>
     <profile>
      <id>gpg</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <gpg.executable>gpg</gpg.executable>
          <gpg.passphrase><![CDATA[Gravitee.io with <3]]></gpg.passphrase>
      </properties>
    </profile>
    <profile>
	<id>oss-sonatype</id>
	<activation>
           <activeByDefault>false</activeByDefault>
	</activation>
	<repositories>
	  <repository>
	    <id>oss-sonatype</id>
	    <name>oss-sonatype</name>
	    <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
	    <snapshots>
	      <enabled>true</enabled>
	    </snapshots>
	 </repository>
	</repositories>
    </profile>
  </profiles>
</settings>
EOF


# secrethub write --in-file ./.secret.settings.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/settings.xml"
secrethub write --in-file ./.secret.settings.dev.snaphots.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/settings.dev.snaphots.xml"
secrethub read --out-file ./test.retrievieving.settings.dev.snaphots.xml "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/settings.dev.snaphots.xml"
cat ./test.retrievieving.settings.dev.snaphots.xml

rm ./test.retrievieving.settings.dev.snaphots.xml

```
