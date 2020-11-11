install:
	npm install

clearall:
	rm -rf node_modules dist src/frontend/dist

refresh:
	make clearall install

lint:
	npx eslint .

front_dev:
	export NODE_ENV=development; \
	npx webpack-dev-server --open --config src/frontend/configs/webpack.config.js

front_build:
	export NODE_ENV=production; \
	npx webpack --config src/frontend/configs/webpack.config.js

.PHONY: test