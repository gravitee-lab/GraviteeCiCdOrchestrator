#!/bin/bash

Usage () {
  echo "---"
  echo " The [$0] script will commit and push the [.circleci/config.yml] on every [*.*.x] git branch of every git repo    "  
  echo "---"
  echo "Usage :"
  echo "---"
  echo "  $0 <REPOS_URL_LIST_FILE>"
  echo "---"
}

export REPOS_URL_LIST_FILE=$1

if [ "x${REPOS_URL_LIST_FILE}" == "x" ]; then
  echo
  Usage
  exit 2
fi;



echo "---"
echo "---"
echo "  REPOS_URL_LIST_FILE=[${REPOS_URL_LIST_FILE}]"
echo "---"
