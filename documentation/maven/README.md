# Gravitee Maven Central Repository


## Current configuration

* All Gravitee components which are maven projects, use :
  * a `settings.xml`, stored in the OVH VM , and saved [in this repo](./current-config/settings.xml)
  * a `pom.xml`, versioned in each component `git` repo
  * a parent `pom.xml`, is `parent` for all gravitee components `pom` projects, and versioned in https://github.com/gravitee-io/gravitee-parent
