.PHONY: production
production:
	docker run \
		-e PULUMI_ACCESS_TOKEN=$(PULUMI_ACCESS_TOKEN) \
		-e DIGITALOCEAN_TOKEN=$(DIGITALOCEAN_TOKEN) \
		-e CLUSTER_TOKEN=$(CLUSTER_TOKEN) \
	  $$(DOCKER_BUILDKIT=1 docker build --target=production --rm -q .)
