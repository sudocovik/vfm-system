# IMAGE_VERSION should be set by CI
IMAGE_NAME=ghcr.io/covik/vfm-infrastructure:$(IMAGE_VERSION)

.PHONY: build
build:
	@docker buildx build --target=production --tag=$(IMAGE_NAME) .

.PHONY: test
test:
	@docker run $(IMAGE_NAME) vfm test

.PHONY: push
push:
	docker push $(IMAGE_NAME)
