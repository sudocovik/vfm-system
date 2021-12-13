# IMAGE_VERSION should be set by CI
IMAGE_NAME=ghcr.io/covik/vfm-frontend:$(IMAGE_VERSION)

.PHONY: build
build:
	DOCKER_BUILDKIT=1 docker build . --target=production-server --tag=$(IMAGE_NAME)

.PHONY: lint
lint:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run lint -- --no-fix"

.PHONY: test
test:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run test:unit"

.PHONY: push
push:
	docker push $(IMAGE_NAME)

.PHONY: e2e-dev
e2e-dev:
	# run "xhost +" if errors with X server authorization occur (ie. Authorization required, but no authorization protocol specified)
	docker run -it \
		--rm \
    -v $$(pwd):/e2e \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket \
    -w /e2e \
    -e DISPLAY=unix$(DISPLAY) \
    -e QT_X11_NO_MITSHM=1 \
    -e _X11_NO_MITSHM=1 \
    -e _MITSHM=0 \
    --network host \
    --entrypoint cypress \
    cypress/included:9.1.0 open --project .

.PHONY: ct-dev
ct-dev:
	# run "xhost +" if errors with X server authorization occur (ie. Authorization required, but no authorization protocol specified)
	docker run -it \
		--rm \
    -v $$(pwd):/ct \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket \
    -w /ct \
    -e DISPLAY=unix$(DISPLAY) \
    -e QT_X11_NO_MITSHM=1 \
    -e _X11_NO_MITSHM=1 \
    -e _MITSHM=0 \
    --network host \
    --entrypoint cypress \
    cypress/included:9.1.0 open-ct --project .
