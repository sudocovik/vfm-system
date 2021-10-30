IMAGE_NAME=covik/vfm-infrastructure:latest

.PHONY: build
build:
	docker buildx build --target=production --tag=$(IMAGE_NAME) .

.PHONY: test
test:
	docker run $(IMAGE_NAME) vfm test

.PHONY: deploy
deploy:
	@docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
		-e CLUSTER_TOKEN=$(CLUSTER_TOKEN) \
		-e CLUSTER_CONTAINER_REGISTRY_TOKEN=$(CLUSTER_CONTAINER_REGISTRY_TOKEN) \
	  $(IMAGE_NAME) \
	  vfm deploy infrastructure

.PHONY: deploy-frontend
deploy-frontend:
	docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e FRONTEND_VERSION=$(FRONTEND_VERSION) \
	  $(IMAGE_NAME) \
	  vfm deploy frontend

.PHONY: deploy-backend
deploy-backend:
	docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
	  $(IMAGE_NAME) \
	  vfm deploy backend
