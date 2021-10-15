.PHONY: lint
lint:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run lint -- --no-fix"

.PHONY: test
test:
	docker run --rm $$(docker build . --target=source -q) /bin/sh -c "npm run test:unit -- --colors"