rm -Rf examples
mkdir examples

###
# default-server-side
###

mkdir examples/default-server-side

npm run start-src \
  -- \
  --project-package-name="create-exposed-app" \
  --project-overview="Default server-side example of create-exposed-app" \
  --side="server" \
  --author-name="Jean-Baptiste Lasselle" \
  --author-email="jean-baptiste.lasselle@graviteesource.com" \
  --author-github="Jean-Baptiste-Lasselle" \
  --author-website="https://github.com/Jean-Baptiste-Lasselle" \
  --setup-semantic-release false \
  --install-dependencies false \
  --destination-path="examples/default-server-side"

rm -Rf \
  examples/default-server-side/.git \
  examples/default-server-side/.eslintcache \
  examples/default-server-side/coverage \
  examples/default-server-side/dist \
  examples/default-server-side/node_modules \
  examples/default-server-side/package-lock.json

###
# default-client-side
###

mkdir examples/default-client-side

npm run start-src \
  -- \
  --project-package-name="create-exposed-app" \
  --project-overview="Default client-side example of create-exposed-app" \
  --side="client" \
  --author-name="Jean-Baptiste Lasselle" \
  --author-email="jean-baptiste.lasselle@graviteesource.com" \
  --author-github="Jean-Baptiste-Lasselle" \
  --author-website="https://github.com/Jean-Baptiste-Lasselle" \
  --setup-semantic-release false \
  --install-dependencies false \
  --destination-path="examples/default-client-side"

rm -Rf \
  examples/default-server-side/.git \
  examples/default-server-side/.eslintcache \
  examples/default-server-side/coverage \
  examples/default-server-side/dist \
  examples/default-server-side/node_modules \
  examples/default-server-side/package-lock.json
