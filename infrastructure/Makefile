# IMAGE_VERSION should be set by CI
IMAGE_NAME=ghcr.io/covik/vfm-infrastructure:$(IMAGE_VERSION)

.PHONY: build
build:
	@docker buildx build --target=production --tag=$(IMAGE_NAME) .

.PHONY: lint
lint:
	@docker run $(IMAGE_NAME) yarn lint

.PHONY: unit-test
unit-test:
	@docker run $(IMAGE_NAME) vfm test:unit

.PHONY: integration-test
integration-test:
	@docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
 		$(IMAGE_NAME) vfm test:integration

.PHONY: push
push:
	docker push $(IMAGE_NAME)
