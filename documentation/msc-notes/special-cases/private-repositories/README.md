# Cases related to private repositories


Those cases relate to issues and questions in sthe scope of private repositories, used for Entreprise Edition


### Gravitee Cockpit

Issue picked up in Pipeline Execution : https://app.circleci.com/pipelines/github/gravitee-io/gravitee-cockpit/30/workflows/fc71e2d5-3c2f-4913-a63e-ec1d68bd5aca/jobs/29

Right, this first case is intresting :
* for private repositories, there are many dependencies for which there is no maven repository, i.e. no private repository.
* And this causes Circle CI pipelines to be doomed to fail :
  * indeed, many a dependency can't be fetched from a Circle CI Pipeline, as maven dependencies, from a private repository (because it does not exist).
  * here :
    * the `gravitee-cockpit` maven project is built, but one of its dependencies `gravitee-licence-api`, cannot be fethced from any of the maven repositories
    * this dependency comes from the `gravitee-cockpit-api` project,
    * what the development team does is that they locally build `gravitee-cockpit-api` before `gravitee-cockpit`

Alright, now, the question is : what could be done, so that pull requests can be built here, without a proper release ?

First answer :
* For every Gravtiee component, there could be SNAPSHOT pushed (mvn deploy) to a maven central repo, for any commit which is built, on a source branch of a pull request :
  * If the repository is a private one, for an Entreprise Edition, the referential maven central repo has to be different, its url  in a maven gravitee entreprise edition profile, and URL pof maven central repo service a secret injected from java properties in profile.
  * If the repository is a public one Community Edition, then another maven repository, publicly accessible this one, and set with a "Community Edition" maven profile.
