IMAGE_NAME=covik/vfm-infrastructure:latest

.PHONY: build
build:
	@docker buildx build --target=production --tag=$(IMAGE_NAME) .

.PHONY: test
test:
	@docker run $(IMAGE_NAME) jest --colors

.PHONY: deploy
deploy:
	@docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
		-e CLUSTER_TOKEN=$(CLUSTER_TOKEN) \
	  $(IMAGE_NAME)
