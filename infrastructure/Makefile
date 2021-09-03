.PHONY: dev
dev:
	docker run -it \
		--rm \
		--user $$(id -u):$$(id -g) \
		-v $$(pwd):/app \
		-v /var/run/docker.sock:/var/run/docker.sock:ro \
	  $$(docker build --target=development --rm -q .) \
	  npm run dev

.PHONY: production
production:
	docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
	  $$(docker build --target=production --rm -q .)