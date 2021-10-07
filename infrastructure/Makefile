DOCKER_GROUP_ID=$$(getent group docker | cut -d: -f3)

.PHONY: dev
dev:
	docker run -it \
		--rm \
		--network host \
		-v $$(pwd):/app \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-e PULUMI_CONFIG_PASSPHRASE='' \
	  $$(docker build --target=development --build-arg HOST_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID) --rm -q .) \
	  /bin/bash

.PHONY: production
production:
	docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
		-e CLUSTER_TOKEN=$(CLUSTER_TOKEN) \
	  $$(DOCKER_BUILDKIT=1 docker build --target=production --rm -q .)

.PHONY: local-launch
local-launch:
	docker run -it \
		--rm \
		--network host \
		-v $$(pwd):/app \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-e PULUMI_CONFIG_PASSPHRASE='' \
	  $$(docker build --target=development --build-arg HOST_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID) --rm -q .) \
	  npm run local:launch