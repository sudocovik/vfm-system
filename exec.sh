#!/usr/bin/env bash
set -e
IMAGE_NAME="$1"
CONTAINER_NAME="$2"
if [[ ! $(docker ps -a | grep "$CONTAINER_NAME") ]] ; then
  docker run -it \
  		--rm \
  		--network host \
  		-v "$(pwd)/infrastructure:/app" \
  		-v "$(pwd)/frontend:/frontend" \
  		-v /var/run/docker.sock:/var/run/docker.sock \
  		--name "$CONTAINER_NAME" \
  	"$IMAGE_NAME" \
  	bash
else
  docker exec -it "$CONTAINER_NAME" bash
fi
