IMAGE_NAME=covik/vfm-infrastructure:local
CONTAINER_NAME=vfm-infrastructure
DOCKER_GROUP_ID=$$(getent group docker | cut -d: -f3)

.PHONY: build
build:
	@docker buildx build ./infrastructure \
		--build-arg HOST_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID) \
 		--target=local \
 		--tag=$(IMAGE_NAME)
	@$(eval CONTAINER_ID := $(shell docker create $(IMAGE_NAME)))
	@docker cp $(CONTAINER_ID):/app/node_modules ./infrastructure/.
	@docker rm $(CONTAINER_ID) > /dev/null

.PHONY: dev
dev:
	@docker run -it \
			--rm \
			--network host \
			--name $(CONTAINER_NAME) \
			-v $$(pwd)/infrastructure:/app \
			-v $$(pwd)/frontend:/frontend \
			-v /var/run/docker.sock:/var/run/docker.sock \
		$(IMAGE_NAME)

.PHONY: exec
exec:
	@docker exec -it $(CONTAINER_NAME) bash
