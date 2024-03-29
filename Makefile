IMAGE_NAME=covik/vfm-infrastructure:local
CONTAINER_NAME=vfm-infrastructure
DOCKER_GROUP_ID=$$(getent group docker | cut -d: -f3)

.PHONY: build
build:
	@docker buildx build ./infrastructure \
		--build-arg HOST_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID) \
 		--target=local \
 		--tag=$(IMAGE_NAME) &&\
	CONTAINER_ID=$$(docker create $(IMAGE_NAME)) &&\
	docker cp $$CONTAINER_ID:/app/node_modules ./infrastructure/. ;\
	docker rm $$CONTAINER_ID > /dev/null

.PHONY: exec
exec:
	@./exec.sh $(IMAGE_NAME) $(CONTAINER_NAME)
