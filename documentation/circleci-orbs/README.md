# Circle CI Orbs for the Gravitee.io Team


## A First simple Orb

First, I will try and make a simple `Orb`, including the `.circleci/config.yml` defined for
all Gravitee "dev repos", cf. :
* `src/modules/circleci/status/tests/.circleci/config.yml` (actually deployed by scripts)
* `documentation/cci-pipelines-commons/.circleci/config.yml` : should always be the same as `src/modules/circleci/status/tests/.circleci/config.yml`

To do that, I will follow steps in https://circleci.com/docs/2.0/orb-author-intro/

#### Step 1 : Installing the Circle CI CLI

Installation for both `GNU/Linux` distributions, and `Mac OS` `Darwin` :

```bash
# curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash

# ---
# CCI_CLI_FOLDER : the path to the folder to which you want to install Circle CI CLI
# You (the Linux user executing the downloaded bash script) need(s) to
# have write permissions to that folder.
# ---
# The version to install and the binary location can be passed in via VERSION and DESTDIR respectively.
#
export CCI_CLI_FOLDER=/opt/local/bin/circleci
export MYUSER=$(whoami)
echo "MYUSER=[${MYUSER}]"
sudo mkdir -p ${CCI_CLI_FOLDER}
sudo chown -R ${MYUSER}:${MYUSER} ${CCI_CLI_FOLDER}

curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | DESTDIR=${CCI_CLI_FOLDER} bash

# If you get an error, just read the output, fixing installation won't be hard :
# The [circleci] executable file will be found installed into an mktemp created dir, : a Folder of path '/tmp/tmp.<RANDOM STRING>'
# To fix installation, all you will have to do is to run :
# mv /tmp/tmp.<RANDOM STRING>/* ${CCI_CLI_FOLDER}
# 
export PATH="${PATH}:${CCI_CLI_FOLDER}"
circleci version
circleci --help
```





## Ref. Documentation

* https://circleci.com/docs/2.0/orb-intro/
* https://circleci.com/docs/2.0/orb-author-intro/
* https://circleci.com/docs/2.0/creating-orbs/
