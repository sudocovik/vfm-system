.PHONY: dev
dev:
	docker run -it \
		--rm \
		--user $$(id -u):$$(id -g) \
		-v $$(pwd):/app \
	  $$(docker build --target=development --rm -q .) \
	  npm run dev

.PHONY: production
production:
	docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_ACCESS_TOKEN=$(DIGITALOCEAN_ACCESS_TOKEN) \
	  $$(docker build --target=production --rm -q .)