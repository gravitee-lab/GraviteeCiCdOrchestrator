#!/bin/bash
export INSTALL_OPS_HOME=$(mktemp -d -t "s3cmd_install_ops-XXXXXXXXXX")
export FOLDER_FOR_ALL_DOWNLOADED_FILES=/usr/src/gio_files
# export PATH="$PATH:/usr/src/app:/usr/src/app/tmp/${RELEASE_VERSION}/portals/"
export PATH="$PATH:$FOLDER_FOR_ALL_DOWNLOADED_FILES:$FOLDER_FOR_ALL_DOWNLOADED_FILES/tmp/${RELEASE_VERSION}/portals/"

python ./package_bundles.py
