#!/bin/bash

command -v foo >/dev/null 2>&1 || { echo >&2 "Cound not find npm."; exit 1; }

( cd Backend/ && npm install )
( cd Frontend/ && npm install )