#!/bin/sh

# ---
echo ''
echo 'Content of DOTENV [./.env] file'
echo ''
ls -allh ./.env
cat ./.env
echo ''
echo ''
echo "Starting Orchestrator on [${PRODUCT}]"
echo ''
npm start
