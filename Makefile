IMAGE_NAME=covik/vfm-infrastructure:local

.PHONY: build
build:
	@set -e ; \
	DOCKER_GROUP_ID=$$(getent group docker | cut -d: -f3) && \
	DOCKER_BUILDKIT=1 docker build ./infrastructure \
		--build-arg HOST_DOCKER_GROUP_ID=$$DOCKER_GROUP_ID \
 		--target=development \
 		--tag=$(IMAGE_NAME)

.PHONY: dev
dev:
	docker run -it \
			--rm \
			--network host \
			-v $$(pwd)/infrastructure:/app \
			-v /var/run/docker.sock:/var/run/docker.sock \
		$(IMAGE_NAME) \
		bash -c "tsc && node dist/local-environment/index.js"
