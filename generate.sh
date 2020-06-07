#!/bin/bash

if hash web-ext 2>/dev/null
then
  web-ext build --overwrite-dest -i demo
else
  echo "Please install the web-ext Firefox extension tool"
fi