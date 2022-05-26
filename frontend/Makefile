# IMAGE_VERSION should be set by CI
IMAGE_NAME=ghcr.io/covik/vfm-frontend:$(IMAGE_VERSION)
TEST_ENVIRONMENT_IMAGE_NAME=ghcr.io/covik/vfm-frontend-testing:$(IMAGE_VERSION)

.PHONY: *

build:
	DOCKER_BUILDKIT=1 docker build . \
		--build-arg google_maps_key=$(VUE_APP_GOOGLE_MAPS_KEY)  \
		--target=production-server \
		--tag=$(IMAGE_NAME)

push:
	docker push $(IMAGE_NAME)

build-test-environment:
	DOCKER_BUILDKIT=1 docker build . --target=test-environment --tag=$(TEST_ENVIRONMENT_IMAGE_NAME)

push-test-environment:
	docker push $(TEST_ENVIRONMENT_IMAGE_NAME)

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
    cypress/included:9.7.0 open --project .

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
    cypress/included:9.7.0 open-ct --project .
