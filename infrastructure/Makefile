IMAGE_NAME=covik/vfm-infrastructure:latest

.PHONY: build
build:
	@DOCKER_BUILDKIT=1 docker build --target=production --tag=$(IMAGE_NAME) .

.PHONY: test
test:
	@docker run \
	  $$(DOCKER_BUILDKIT=1 docker build --target=test -q .)

.PHONY: deploy
deploy:
	@docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
		-e CLUSTER_TOKEN=$(CLUSTER_TOKEN) \
	  $(IMAGE_NAME)
