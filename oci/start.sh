#!/bin/sh

# ---
echo ''
echo 'Content of DOTENV [./.env] file'
echo ''
ls -allh ./.env
cat ./.env
source ./.env
echo ''
echo ''
echo "Starting Orchestrator on [${PRODUCT}]"
echo ''
echo 'Script invocation passed arguments are :'
for var in "$@"
do
    echo "$var"
done
echo ''
echo 'Start command is :'
echo ''
echo "[npm start $@]"
echo ''
npm start $@
