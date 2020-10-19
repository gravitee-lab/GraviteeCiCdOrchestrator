# Circle CI Orbs for the Gravitee.io Team


## A First simple Orb

First, I will try and make a simple `Orb`, including the `.circleci/config.yml` defined for
all Gravitee "dev repos", cf. :

* `src/modules/circleci/status/tests/.circleci/config-full.yml` (actually deployed by scripts)
* `documentation/cci-pipelines-commons/.circleci/config-full.yml` : should always be the same as `src/modules/circleci/status/tests/.circleci/config.yml`

To do that, I will follow steps in https://circleci.com/docs/2.0/orb-author-intro/

Note that I developed small Utility to manage an Orb devops cycle, called `orbinoid`, which :
* I first developed in a subfolder here,
* and is now versioned in https://github.com/gravitee-io/gravitee-circleci-orbinoid


## How to pass values to Orbs

In this section, I will describe the different techniques I explored, to pass on values to Orbs, at runtime



### Commands parameters

Here I will explain how to pass on values at runtime to Orbs, using Orbs commands parameters.

* On the `Orb` source code side, in the `commands` folder, we have a `my_command.yml` file, defining a _command_ for the `Orb`. Defining a parameter `myparameter` in an `Orb` command, is done using the following syntax :

```Yaml
description: >
  This command was deigned by Jean-Baptiste Lasselle to demo use of Orb commands parameters.
# What will this command do?
# Descriptions should be short, simple, and clear.
parameters:
  myparameter:
    type: string
    default: "World of Orbs"
    description: "Hello to whom?"
steps:
  - run:
      environment:
        PARAM_TO: <<parameters.to>>
      name: Hello Greeting
      command: <<include(scripts/greet.sh)>>

```


* test I used to confirm this : https://app.circleci.com/pipelines/github/gravitee-lab/testrepo3/24/workflows/7039fb09-5a5b-470b-832f-3602f17ee507/jobs/24

### How to create namespace, orb in remote registry, and then publish orb

To publish my orb, without using `circleci orb init` command, The following process worked.

Note that in the process, I never created any git repo on github.com, allthat is important, istaht I have enough Github.com user permissions on the `gravitee-lab` Github Org, used in the below example (or creating the namespace will be unautorized)

* create namespace in remote registry on https://circle.com :

```bash
export ORB_NAMESPACE=orbinoid
export VCS_TYPE=github
export VCS_ORG_NAME=gravitee-lab
circleci namespace create ${NAMESPACE_TO_CREATE} ${VCS_TYPE} ${VCS_ORG_NAME} --no-prompt
```

* output :

```bash
You are creating a namespace called "orbinoid".

This is the only namespace permitted for your github organization, gravitee-lab.

To change the namespace, you will have to contact CircleCI customer support.

✔ Are you sure you wish to create the namespace: `orbinoid`: y
Namespace `orbinoid` created.
Please note that any orbs you publish in this namespace are open orbs and are world-readable.
```

* create orb in remote registry on https://circle.com

```bash
export ORB_NAMESPACE=orbinoid
export ORB_NAME=ubitetorbi
circleci orb create ${ORB_NAMESPACE}/${ORB_NAME} --no-prompt
```
* sample output :

```bash
You are creating an orb called "orbinoid/ubitetorbi".

You will not be able to change the name of this orb.

If you change your mind about the name, you will have to create a new orb with the new name.

✔ Are you sure you wish to create the orb: `orbinoid/ubitetorbi`: y
Orb `orbinoid/ubitetorbi` created.
Please note that any versions you publish of this orb are world-readable.
You can now register versions of `orbinoid/ubitetorbi` using `circleci orb publish`.
```

* and publish the orb to remote registry on https://circle.com :


```bash
export ORB_NAMESPACE=orbinoid
export ORB_NAME=ubitetorbi
export ORB_VERSION=0.0.1
circleci orb publish orb/src/@orb.yml orbinoid/ubitetorbi@0.0.1

```

* sample output :

```bash
Orb `orbinoid/ubitetorbi@0.0.1` was published.
Please note that this is an open orb and is world-readable.
```


Finally, I could find my orb on https://circleci.com at https://circleci.com/developer/orbs/orb/orbinoid/ubitetorbi

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

For the record, when I wrote this `README.md`, and installed Circle CI CLI, I downloaded the installation script to `documentation/circleci-orbs/circleci-installation.sh` in this repo.

* Now, we need a Circle CI Personal Access Token, to use the Circle CI CLI. Go to Web UI on https://app.circleci.com to create that, the the User Settings menu
* then :

```bash
export CCI_TOKEN=<very long value of yur personal access token>
# circleci setup : is interactive
circleci setup --token "${CCI_TOKEN}" --host https://circleci.com --no-prompt
```

* after that, your configuration including your secret, is saved to `~/.circleci/cli.yml`
* the form of that Yaml file is :

```Yaml
host: https://circleci.com
endpoint: graphql-unstable
token: <very long value of yur personal access token>
rest_endpoint: api/v2
orb_publishing:
    default_namespace: ""
    default_vcs_provider: ""
    default_owner: ""
```

* Ok, so we will publish our Orbs using this `Circle CI` CLI, and its configuration determines to which server the Orb will be published.
* The Circle CI CLI can be used to validate Yaml syntax of :
  * the `~/.circleci/cli.yml` above mentioned config file
  * and the `Yaml` of an orb

```bash
# validate the Yaml Syntax of `~/.circleci/cli.yml`
circleci config validate
# validate the Yaml Syntax of an orb
circleci orb validate /tmp/my_orb.yml

```

* Given the fact that there are many configurations and commands to run, to manage the development cyle of a Cicle CI `Orb`, I factorized all those commands in a tiny `nodejs` / `typescript` utility, which :
  * I named `orbinoid` and you will find in the `documentation/circleci-orbs/orbinoid` folder
  * I duplicated in the `documentation/circleci-orbs/examples/1` to develop a first `Orb` example.
  * I will duplicate in the `documentation/circleci-orbs/examples/${EXAMPLE_NUMBER}` folders to develop other `Orb` examples.






## Ref. Documentation

* https://circleci.com/docs/2.0/orb-intro/
* https://circleci.com/docs/2.0/orb-author-intro/
* https://circleci.com/docs/2.0/creating-orbs/
