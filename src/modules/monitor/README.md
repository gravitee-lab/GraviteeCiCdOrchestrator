# Circle CI API : how to check execution status of a pipeline

### About Circle CI Pipelines Workflow execution `status` values : One question



* The `status`, returned for the workflow execution (`https://circleci.com/api/v2/pipeline/${PIPELINE_ID}/workflow`), of a `Circle CI` pipeline, can have one of the following values :

| CircleCI Pipeline Workflow Execution Status value  |  Description  of what happened                                                                  |
|----------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `success`                                          |  execution completed without any error                                                          |
| `running`                                          |  execution is running                                                                           |
| `not_run`                                          |  execution is scheduled, but did not start yet                                                  |
| `failed`                                           |  execution completed with errors                                                                |
| `error`                                            |  execution was canceled, because of `.circleci/config.yml` syntax errors                        |
| `failing`                                          |  execution is still running, and at least one error already occured, without stopping execution |
| `on_hold`                                          |  someone paused the execution                                                                   |
| `canceled`                                         |  someone canceled the execution                                                                 |
| `unauthorized`                                     |  an unauthorized Circle CI user requested the execution, using `Circle CI` API, and it was therefore denied |

* My question is : Are all _Descriptions of what happened_ definitely right? On which of them am I wrong ? Where I am wrong, what does the value means (What happened) ?

* Assuming I am right about all those "_descriptions of what happened_", here is how i can classify thoses statuses :

  * `status` values for which we know it is not even worth waiting to expect any further execution `status` change, regardless of any error(s) :

  | CircleCI Pipeline Workflow Execution Status value  |  Description  of what happened                                                                  |
  |----------------------------------------------------|-------------------------------------------------------------------------------------------------|
  | `success`                                          |  execution completed without any error                                                          |
  | `failed`                                           |  execution completed with errors                                                                |
  | `error`                                            |  execution was canceled, because of `.circleci/config.yml` syntax errors                        |
  | `on_hold`                                          |  someone paused the execution (we will never manually pause a pipeline execution, either with Web UI or Circle CI API)                                                                  |
  | `canceled`                                         |  someone canceled the execution                                                                 |
  | `unauthorized`                                     |  an unauthorized Circle CI user requested the execution, using `Circle CI` API, and it was therefore denied |

  * `status` values for which we know the pipeline is still running, or will run, if we wait some more :

  | CircleCI Pipeline Workflow Execution Status value  |  Description  of what happened                                                                  |
  |----------------------------------------------------|-------------------------------------------------------------------------------------------------|
  | `running`                                          |  execution is running                                                                           |
  | `not_run`                                          |  execution is scheduled, but did not start yet                                                  |
  | `failing`                                          |  execution is still running, and at least one error already occured, without stopping execution |


* _**Note**_ : You need the pipeline execution Id, which is a UUID, to browse workflows executions, of a pipeline execution. Below, you can see that the `ìtems` array in JSON response, lists all "`workflow`" executions (and give their status):

```bash
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/project/gh/gravitee-lab/GraviteeReleaseOrchestrator/pipeline/126 -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   844  100   844    0     0   2192      0 --:--:-- --:--:-- --:--:--  2192
{
  "id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
  "errors": [],
  "project_slug": "gh/gravitee-lab/GraviteeReleaseOrchestrator",
  "updated_at": "2020-09-12T17:47:21.364Z",
  "number": 126,
  "state": "created",
  "created_at": "2020-09-12T17:47:21.364Z",
  "trigger": {
    "received_at": "2020-09-12T17:47:21.320Z",
    "type": "webhook",
    "actor": {
      "login": "Jean-Baptiste-Lasselle",
      "avatar_url": "https://avatars2.githubusercontent.com/u/35227860?v=4"
    }
  },
  "vcs": {
    "origin_repository_url": "https://github.com/gravitee-lab/GraviteeReleaseOrchestrator",
    "target_repository_url": "https://github.com/gravitee-lab/GraviteeReleaseOrchestrator",
    "revision": "d2ae1134f62e24b9d745f3d74357424de6bdc96d",
    "provider_name": "GitHub",
    "commit": {
      "body": "",
      "subject": "feat(specs_implementation) : replacing progress Matrix with Observable Stream pattern everywhere #22"
    },
    "branch": "feature/specs_implementation"
  }
}
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ export PIPELINE_ID="b4f4eabc-d572-4fdf-916a-d5f05d178221"
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/pipeline/${PIPELINE_ID}/workflow -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   749  100   749    0     0   1976      0 --:--:-- --:--:-- --:--:--  1976
{
  "next_page_token": null,
  "items": [
    {
      "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
      "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c",
      "name": "docker_build_and_push",
      "project_slug": "gh/gravitee-lab/GraviteeReleaseOrchestrator",
      "status": "failed",
      "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
      "pipeline_number": 126,
      "created_at": "2020-09-12T17:47:21Z",
      "stopped_at": "2020-09-12T17:48:26Z"
    },
    {
      "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
      "id": "cd7b408f-48d4-4ba7-8a0a-644d82267434",
      "name": "yet_another_test_workflow",
      "project_slug": "gh/gravitee-lab/GraviteeReleaseOrchestrator",
      "status": "success",
      "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
      "pipeline_number": 126,
      "created_at": "2020-09-12T17:47:21Z",
      "stopped_at": "2020-09-12T17:48:11Z"
    }
  ]
}

```
