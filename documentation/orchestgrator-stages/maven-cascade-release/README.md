# About the `release.json` and how to resolve version numbers

* `cat release.json | jq .version` will give the release version number (the one that we are releaseing). This will be the release number for all "root" dependencies in the `maven-cascade-release` stage  : the 3 to 4 Gravitee main components, `gateway`, `management-api`, `management-ui`, `portal-webui`
* For every dependency in the Execution Plan  for the `--stage=maven-cascade-release` stage, the release version number is obtained simply by removing the  `-SNAPHOST` suffix, and that's it !
