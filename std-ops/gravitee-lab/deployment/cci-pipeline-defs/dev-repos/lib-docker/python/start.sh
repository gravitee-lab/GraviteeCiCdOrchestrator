#!/bin/bash
export INSTALL_OPS_HOME=$(mktemp -d -t "s3cmd_install_ops-XXXXXXXXXX")
export PATH="$PATH:/usr/src/app:/usr/src/app/tmp/${RELEASE_VERSION}/portals/"

python ./package_bundles.py
