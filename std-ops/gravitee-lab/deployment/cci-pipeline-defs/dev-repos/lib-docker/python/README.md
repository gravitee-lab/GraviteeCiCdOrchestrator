# The `python`


## Why a `python` image

`python` is used in the Gravitee CI CD System to prepare all zips to publish to the S3 bucket


```bash
docker build -t py-bundler .

export SECRETHUB_ORG="gravitee-lab"
export SECRETHUB_REPO="cicd"
export ARTIFACTORY_BOT_USER_NAME=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/user-name")
export ARTIFACTORY_BOT_USER_PWD=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/user-pwd")

echo "export ARTIFACTORY_BOT_USER_NAME=${ARTIFACTORY_BOT_USER_NAME}"
echo "export ARTIFACTORY_BOT_USER_PWD=${ARTIFACTORY_BOT_USER_PWD}"

export ARTIFACTORY_REPO_NAME=nexus-and-non-dry-run-releases
export ARTIFACTORY_REPO_NAME=gravitee-releases
export HTTPS_DEBUG_LEVEL=1
export HTTPS_DEBUG_LEVEL=10

export BUNDLER_ENV_ARGS="-e RELEASE_VERSION=3.4.3 -e ARTIFACTORY_REPO_NAME=${ARTIFACTORY_REPO_NAME} -e ARTIFACTORY_USERNAME=${ARTIFACTORY_BOT_USER_NAME} -e ARTIFACTORY_PASSWORD=${ARTIFACTORY_BOT_USER_PWD} -e HTTPS_DEBUG_LEVEL=${HTTPS_DEBUG_LEVEL}"

docker run ${BUNDLER_ENV_ARGS} -v $PWD:/usr/src/app -it --rm --name my-running-py-bundler py-bundler
```

## Meta data of the image : Labels

When you use the `cicd-python` Gravitee CICD Sysem contianer image, always use the `stable-latest`, tag, and then you can get the following metadata(e.g.the version of `python` in the container), like this :

```bash

export CICD_LIB_OCI_REPOSITORY_ORG=${CICD_LIB_OCI_REPOSITORY_ORG:-"quay.io/gravitee-lab"}
export CICD_LIB_OCI_REPOSITORY_NAME=${CICD_LIB_OCI_REPOSITORY_NAME:-"cicd-python"}
export PYTHON_CONTAINER_IMAGE_TAG=${PYTHON_CONTAINER_IMAGE_TAG:-"stable-latest"}
export PYTHON_DOCKER="${CICD_LIB_OCI_REPOSITORY_ORG}/${CICD_LIB_OCI_REPOSITORY_NAME}:${PYTHON_CONTAINER_IMAGE_TAG}"

docker pull "${PYTHON_DOCKER}"

# ---
# Now getting the image metadata fromthe stable latest 'cicd-python' container image :
# ---

export IMAGE_TAG_LABEL=$(docker inspect --format '{{ index .Config.Labels "oci.image.tag"}}' "${PYTHON_DOCKER}")
export GH_ORG_LABEL=$(docker inspect --format '{{ index .Config.Labels "cicd.github.org"}}' "${PYTHON_DOCKER}")
export OCI_VENDOR=$(docker inspect --format '{{ index .Config.Labels "vendor"}}' "${PYTHON_DOCKER}")
export MAINTAINER=$(docker inspect --format '{{ index .Config.Labels "maintainer"}}' "${PYTHON_DOCKER}")
# export PYTHON_VERSION=$(docker inspect --format '{{ index .Config.Labels "cicd.python.version"}}' "${PYTHON_DOCKER}")
export ORCHESTRATOR_GIT_COMMIT_ID=$(docker inspect --format '{{ index .Config.Labels "cicd.orchestrator.git.commit.id"}}' "${PYTHON_DOCKER}")

echo " Container image tag (underlying container image tag) is = [${IMAGE_TAG_LABEL}]"
echo " Gravitee CI CD Orchestrator Git Commit ID is = [${ORCHESTRATOR_GIT_COMMIT_ID}]"
echo " 'python' verson in container is = [${PYTHON_VERSION}]"
echo " The Github Org for which this image is designed for, is =[${GH_ORG_LABEL}]"
echo " Vendor name of the image is =[${OCI_VENDOR}]"
echo " the maintainer email address of the image is =[${MAINTAINER}]"

```
