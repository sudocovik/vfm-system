.PHONY: dev
dev:
	docker run -it \
		--rm \
		--user $$(id -u):$$(id -g) \
		-v $$(pwd):/app \
	  $$(docker build --rm -q .) \
	  /bin/sh