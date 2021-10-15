# IMAGE_VERSION should be set by CI
IMAGE_NAME=ghcr.io/covik/vfm-frontend:$(IMAGE_VERSION)

.PHONY: build
build:
	DOCKER_BUILDKIT=1 docker build . --tag=$(IMAGE_NAME)

.PHONY: lint
lint:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run lint -- --no-fix"

.PHONY: test
test:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run test:unit -- --colors"