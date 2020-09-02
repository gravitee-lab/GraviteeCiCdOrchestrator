#!/bin/sh

# --- First , generate .env file
./generate-dotenv.sh
echo ''
echo 'Generated DOTENV [./.env] file'
echo ''
cat ./.env
echo ''
echo ''
echo "Starting Orchestrator on [${PRODUCT}]"
echo ''
npm start
