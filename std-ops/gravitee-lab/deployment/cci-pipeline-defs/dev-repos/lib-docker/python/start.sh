#!/bin/bash

export FOLDER_FOR_ALL_DOWNLOADED_FILES=/usr/src/gio_files

mkdir -p /usr/src/gio_files/tmp/3.4.3/portals/
chmod a+rw /usr/src/gio_files/tmp/3.4.3/portals/
touch /usr/src/gio_files/tmp/3.4.3/portals/gravitee-portal-webui-3.4.3.zip

# export PATH="$PATH:/usr/src/app:/usr/src/app/tmp/${RELEASE_VERSION}/portals/"
export PATH="$PATH:$FOLDER_FOR_ALL_DOWNLOADED_FILES:$FOLDER_FOR_ALL_DOWNLOADED_FILES/tmp/${RELEASE_VERSION}/portals/"

echo "# ------------------------------------------------------------ #"
echo "Juste avant de démarrer le script python : "
echo "# ------------------------------------------------------------ #"
echo "  PWD = [${PWD}]"
echo "# ------------------------------------------------------------ #"
echo "  existence du répertoire [/usr/src/gio_files/tmp/3.4.3/portals/] : "
ls -allh /usr/src/gio_files/tmp/3.4.3/portals/
echo "# ------------------------------------------------------------ #"
echo "  existence du fichier [/usr/src/gio_files/tmp/3.4.3/portals/gravitee-portal-webui-3.4.3.zip] : "
ls -allh /usr/src/gio_files/tmp/3.4.3/portals/gravitee-portal-webui-3.4.3.zip
echo "# ------------------------------------------------------------ #"
echo "   identité du user linux : "
id
echo "# ------------------------------------------------------------ #"

python ./package_bundles.py
