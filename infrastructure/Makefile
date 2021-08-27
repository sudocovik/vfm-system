.PHONY: dev
dev:
	docker run -it \
		--rm \
		--user $$(id -u):$$(id -g) \
		-v $$(pwd):/app \
	  $$(docker build --target=development --rm -q .) \
	  npm run dev