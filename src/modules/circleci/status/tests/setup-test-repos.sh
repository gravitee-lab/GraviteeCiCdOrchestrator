#!/bin/bash

Usage () {
  echo "---"
  echo "Usage :"
  echo "---"
  echo "  $0 <REPOS_URL_LIST_FILE>"
  echo "---"
}

if [ "x${REPOS_URL_LIST_FILE}" == "x" ]; then
  echo
  Usage
  exit 2
fi;

export REPOS_URL_LIST_FILE=$1


echo "---"
echo "---"
echo "  REPOS_URL_LIST_FILE=[${REPOS_URL_LIST_FILE}]"
echo "---"
