#!/bin/bash

export FOLDER_FOR_ALL_DOWNLOADED_FILES=/usr/src/gio_files

mkdir -p /usr/src/gio_files/tmp/3.4.3/portals/
touch /usr/src/gio_files/tmp/3.4.3/portals/gravitee-portal-webui-3.4.3.zip

# export PATH="$PATH:/usr/src/app:/usr/src/app/tmp/${RELEASE_VERSION}/portals/"
export PATH="$PATH:$FOLDER_FOR_ALL_DOWNLOADED_FILES:$FOLDER_FOR_ALL_DOWNLOADED_FILES/tmp/${RELEASE_VERSION}/portals/"

python ./package_bundles.py
