# Orbinoid : A utility to managea proper development Cycle for CircleCI Orbs

`Orbinoïd` is a utility designed to manage a proper development Cycle for CircleCI Orbs :

* packing,
* validating,
* testing,
* deploying to Orb repositry

The Circle CI CLI is a rather dumb utility, and wrapping its command in a
proper `Nodejs` / `Typescript` brings in the whole dev Cycle engineering features along.

## The dev Cycle of an Orb

![the Circle CI Orb dev cycle](docs/images/orb-publishing-process.png)


#### How to publish an Orb from local

### Update  : how t create namspace, etc... until publishing orb

Trying to publish my orb, without using `circleci orb init` command :

* create namespace :

```bash
$ circleci namespace create orbinoid github gravitee-lab --no-prompt
You are creating a namespace called "orbinoid".

This is the only namespace permitted for your github organization, gravitee-lab.

To change the namespace, you will have to contact CircleCI customer support.

✔ Are you sure you wish to create the namespace: `orbinoid`: y
Namespace `orbinoid` created.
Please note that any orbs you publish in this namespace are open orbs and are world-readable.
```
* create orb in registry on https://circle.com

```bash
$ circleci orb create orbinoid/ubitetorbi --no-prompt
You are creating an orb called "orbinoid/ubitetorbi".

You will not be able to change the name of this orb.

If you change your mind about the name, you will have to create a new orb with the new name.

✔ Are you sure you wish to create the orb: `orbinoid/ubitetorbi`: y
Orb `orbinoid/ubitetorbi` created.
Please note that any versions you publish of this orb are world-readable.
You can now register versions of `orbinoid/ubitetorbi` using `circleci orb publish`.
```
* and publish the orb to registry on https://circleci.com :


```bash
$ circleci orb publish orb/src/@orb.yml orbinoid/ubitetorbi@0.0.1
Orb `orbinoid/ubitetorbi@0.0.1` was published.
Please note that this is an open orb and is world-readable.

```

## How to use

* Fork the `Orbinoid` (later, astarter, project generator)
* place your Circle CI `Orb` `Yaml` files into the `src/orb` Folder
* And then :
  * run `npm run build`, to run the following Orb development Operations :
    * packing,
    * validating,
  * run the `npm run test` to test your Orb (it will be tested with the `./test/.circleci/config.yml`)
  * run the `npm run share` to deploy your Orb to the Orb repository of your Circle CI Server (private or the default public https://circleci.com)


## Install the Circle CI CLI

See `utils/circleci-installation.sh` : an installation script to help / show you how to install the Circle CI CLI.
