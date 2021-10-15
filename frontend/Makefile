.PHONY: lint
lint:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run lint -- --no-fix"