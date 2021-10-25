IMAGE_NAME=covik/vfm-infrastructure:local
CONTAINER_NAME=vfm-infrastructure
DOCKER_GROUP_ID=$$(getent group docker | cut -d: -f3)

.PHONY: build
build:
	@docker buildx build ./infrastructure \
		--build-arg HOST_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID) \
 		--target=local \
 		--tag=$(IMAGE_NAME)

.PHONY: dev
dev:
	@docker run -it \
			--rm \
			--network host \
			--name $(CONTAINER_NAME) \
			-v $$(pwd)/infrastructure:/app \
			-v /var/run/docker.sock:/var/run/docker.sock \
		$(IMAGE_NAME)
