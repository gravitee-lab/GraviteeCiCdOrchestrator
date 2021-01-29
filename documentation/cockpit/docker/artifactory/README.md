# Docker


## docker login artifcatory

* First try :

```bash
jbl@poste-devops-jbl-16gbram:~/someops$ export GIO_BOT_USERNAME=graviteebot
jbl@poste-devops-jbl-16gbram:~/someops$ export GIO_BOT_SECRET=$(secrethub read "${SECRETHUB_ORG}/${SECRETHUB_REPO}/graviteebot/infra/maven/dry-run/artifactory/user-pwd")
jbl@poste-devops-jbl-16gbram:~/someops$ sudo cat /etc/docker/daemon.json
{
  "insecure-registries" : ["odbxikk7vo-artifactory.services.clever-cloud.com"]
}
jibl@poste-devops-jbl-16gbram:~/someops$ docker login -u="${GIO_BOT_USERNAME}" -p="${GIO_BOT_SECRET}" http://odbxikk7vo-artifactory.services.clever-cloud.com
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
Error response from daemon: login attempt to https://odbxikk7vo-artifactory.services.clever-cloud.com/v2/ failed with status: 401 Unauthorized
jbl@poste-devops-jbl-16gbram:~/someops$

```

* answer from clevercloud support team : no docker registry feature in our plan, issue closed
