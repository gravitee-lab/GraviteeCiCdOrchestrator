# Pipeline defintion


## Secrethub

### Simple String secrets

```bash
~$ secrethub account inspect
{
    "Username": "pokusbot",
    "FullName": "pokusbot",
    "Email": "jean.baptiste.lasselle.pokus@gmail.com",
    "CreatedAt": "2020-08-08T22:16:41+02:00",
    "PublicAccountKey": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBd0pzM0tzMlJBZzBoS0dIbW5ocWIKa01iVjNyZm53VDVzRWlZdlhWcldrTFFjcit4dERwQTFCaGlCS2xuUERYRFVJbldKNWNMQitrUHoxWmcxUU1MaAp0WUl5UUZpOFd0ZVV1N2d4ZFk4dFp5Q1lpSERzSDVzWVNDQ25tZUxhTmc1bDMyNUtCbWNBZHVsc3Jnc2UvQ2lyCjZMV3VITGJzRTBlTXBRaEdmYzEvTlZTZG1EejRiQkUwQ0lDMWU0Y1crSmJWREEzMWhhUnRDYUc5emxVLzBlY1kKczNFWGt5QzB0b3c3eVhCMHorYUFrMzZqNGNXVGpSaFZIbEt6Y1gxL1V1akVtL3drVkZ0ODBMazBLUGtiVk1NMQpPeWFsNHFsejlKeXVxOXZMNzdicElhUnV3bE1IUXVrdHQrai8vZjNEYkpYc2J3N041ODVxYmtYT1JkMUVDYlNFCmhSWnlRY2tESU9sVll6ZHpITXd2MThOamlCZVJYNDBPTjh4ZTJvM2FrVXVwQW5UMzlPZVdEd1YxK1pZRjlWRTQKZnNBd25NNUpNcnMwTUNiV1lJRWc4U014QVUyejk3dEd4MWZqK3E4VjJNVjNRT2FPS3hGUTRHYU54SnFyZTRaVApyOTByWE9pcHRPaDNPeVEzKytsajlONzB4alFpZDdEVmF2elUyTERyR1kvUU40cVQzc3IreW11UWJ0RUxuUGlUClJoRVNOelRqT3pYclRqbk5RMkRxSmJMSFcyZTBSOEc4eFRvRWk2MWl6dmV1U0FVMnRxcjhORXREQ3FrelRwbDIKalRHd0oxRWNsKzFiMVJyQUN3eGFIYmF5Ui9jR1gvUGduamxTN3Nsc0xYYVlhRi8rVUwwR2lSeXMyaFJ5VG9ROApGdnVLVGsxbERCSjk2NFZnSjhqWjdsY0NBd0VBQVE9PQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tCg=="
}
~$ ls -allh ~/.secrethub
total 24K
drwx------   2 jibl jibl 4.0K Aug  8 22:43 .
drwxr-xr-x 243 jibl jibl  16K Aug 31 10:44 ..
-rw-r--r--   1 jibl jibl 3.1K Aug  8 22:53 credential
~$ ls -allh ~/.secrethub/credential
-rw-r--r-- 1 jibl jibl 3.1K Aug  8 22:53 /home/jbl/.secrethub/credential
```

* content of `~/.secrethub/credential` is the value of the Secrethub token :
  * for a `Circle CI` project, or Organization Context, create the `SECRETHUB_CREDENTIAL` env. variable, and set its value to the secrethub token : then `secrethub cli` will be able to auth. against secrethub SAAS service.


* Now we need to create the secrets :

```bash

echo "Implementation not finished TODO"
exit 1
# ---> [gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/username]
# secrethub repo init to create a repository
secrethub repo init gravitee-lab/cicd-orchestrator
secrethub repo inspect gravitee-lab/cicd-orchestrator
secrethub repo ls gravitee-lab/cicd-orchestrator

# secrethub mkdir to create a directory
secrethub mkdir gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/
secrethub repo ls gravitee-lab/cicd-orchestrator/staging/
secrethub repo ls gravitee-lab/cicd-orchestrator/staging/docker
secrethub repo ls gravitee-lab/cicd-orchestrator/staging/docker/quay

# secrethub write to write some secrets
secrethub write username
# ---> [gravitee-lab/cicd-orchestrator/staging/docker/quay/botuser/token]

```


_**Reference Documentation**_ :

* https://secrethub.io/docs/guides/circleci/



### Secret files

_Could be used for TLS/SSL Certificates, KUBECONFIG, for example_


* On one machine :

```bash
# Example with kubeconfig
export FILE_LOCAL_PATH=${HOME}/.kube/config

# store the file to secrethub (from pipeline provisining the cluster)
secrethub write --in-file ${FILE_LOCAL_PATH} gravitee-io/cicd/envs/staging/k8s/kubeconfig
secrethub write --in-file ${FILE_LOCAL_PATH} gravitee-io/cicd/envs/integration/k8s/kubeconfig
```

* On the other machine :

```bash
# retrieve the file (on another machine)
# Example with kubeconfig
export KUBECONFIG=${HOME}/.kube/config

secrethub read --out-file ${KUBECONFIG} gravitee-io/cicd/envs/integration/k8s/kubeconfig

```

_**Reference Documentation**_ :

https://secrethub.io/docs/guides/key-files/#store


## Circle CI

### Circle CI Workflow level filtering

https://discuss.circleci.com/t/can-you-filter-on-a-workflow-level/30624/4

Use Yaml References
