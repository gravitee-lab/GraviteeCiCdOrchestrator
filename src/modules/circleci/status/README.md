Tocomplete this task, I will need to :
* [ ] have one answer on one technical question to Circle CI Tech team. I have today sent the question
* [ ] modify `Gravitee CI CD Orchestrator` source code, using the answer to the technical question :
  * the orchestrator needs to find out, using Circle CI API, when it is not worth waiting anymore, for a Pipeline execution status change
  * that, for the orchestrator, to "wait",  between 2 sets of pipeline executions, or stop the Release process because an error occured while releasing one component.

Finally, note that :
* Circle CI Pipelines are made of "workflows" (one or more), which are decomposed into "jobs"
* and that the execution status of a Pipeline, lies in the execution status of each of its workflows : A Circle CI pipeline has completed its execution (with or without errors), exactly when all of the _Workflows_ it is made of, have themselves completed their execution.
* In other words, All details about a Pipeline execution status are at the worfkflow level : this is where the `Gravitee CI CD Orchestrator` will "dig" the Circle CI API v2  to actually fully, reactively be aware of "what going on with a given Pipeline execution".

Here below is the question I forwarded to Circle CI Solution Engineering Team (and full details about all Pipeline execution statuses) :

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


* _**Note**_ :
  * You need the pipeline execution Id, which is a GUID, to browse workflows executions, of a pipeline execution. Below, you can see that the `ìtems` array in JSON response, lists all "`workflow`" executions (and give their status):

```bash
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/project/gh/gravitee-lab/GraviteeCiCdOrchestrator/pipeline/126 -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   844  100   844    0     0   2192      0 --:--:-- --:--:-- --:--:--  2192
{
  "id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
  "errors": [],
  "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
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
    "origin_repository_url": "https://github.com/gravitee-lab/GraviteeCiCdOrchestrator",
    "target_repository_url": "https://github.com/gravitee-lab/GraviteeCiCdOrchestrator",
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
      "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
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
      "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
      "status": "success",
      "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
      "pipeline_number": 126,
      "created_at": "2020-09-12T17:47:21Z",
      "stopped_at": "2020-09-12T17:48:11Z"
    }
  ]
}

```
  * Then, using each workflow GUID, one can fully inspect each workflow execution status, using :

```bash
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ export WF_GUID='75e83261-5b3c-4bc0-ad11-514bb01f634c'
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID} -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   351  100   351    0     0    909      0 --:--:-- --:--:-- --:--:--   911
{
  "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
  "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c",
  "name": "docker_build_and_push",
  "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
  "status": "failed",
  "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
  "pipeline_number": 126,
  "created_at": "2020-09-12T17:47:21Z",
  "stopped_at": "2020-09-12T17:48:26Z"
}
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ export WF_GUID='cd7b408f-48d4-4ba7-8a0a-644d82267434'
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID} -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   356  100   356    0     0    951      0 --:--:-- --:--:-- --:--:--   949*
{
  "pipeline_id": "b4f4eabc-d572-4fdf-916a-d5f05d178221",
  "id": "cd7b408f-48d4-4ba7-8a0a-644d82267434",
  "name": "yet_another_test_workflow",
  "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
  "status": "success",
  "started_by": "a159e94e-3763-474d-8c51-d1ea6ed602d4",
  "pipeline_number": 126,
  "created_at": "2020-09-12T17:47:21Z",
  "stopped_at": "2020-09-12T17:48:11Z"
}
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ # could even go further into jobs details
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID}/job -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   309  100   309    0     0    846      0 --:--:-- --:--:-- --:--:--   846
{
  "next_page_token": null,
  "items": [
    {
      "dependencies": [],
      "job_number": 126,
      "id": "18c8b37e-1e11-43a7-bb50-863e93789d58",
      "started_at": "2020-09-12T17:47:54Z",
      "name": "yet_another_test_job",
      "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
      "status": "success",
      "type": "build",
      "stopped_at": "2020-09-12T17:48:11Z"
    }
  ]
}
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ export WF_GUID='75e83261-5b3c-4bc0-ad11-514bb01f634c'
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID}/job -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   293  100   293    0     0    725      0 --:--:-- --:--:-- --:--:--   725
{
  "next_page_token": null,
  "items": [
    {
      "dependencies": [],
      "job_number": 127,
      "id": "fc2332c9-ce54-405b-8b4f-d5af38210627",
      "started_at": "2020-09-12T17:47:25Z",
      "name": "build",
      "project_slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
      "status": "failed",
      "type": "build",
      "stopped_at": "2020-09-12T17:48:26Z"
    }
  ]
}
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ export JOB_NUMB=$(curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID}/job -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .items[0].job_number)
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   293  100   293    0     0    781      0 --:--:-- --:--:-- --:--:--   781
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ echo "JOB_NUMB=[${JOB_NUMB}]"
JOB_NUMB=[127]
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ export PROJ_SLUG=$(curl -X GET https://circleci.com/api/v2/workflow/${WF_GUID} -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .project_slug | awk -F '"' '{print $2}')
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   351  100   351    0     0    936      0 --:--:-- --:--:-- --:--:--   936
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ echo "PROJ_SLUG=[${PROJ_SLUG}]"
PROJ_SLUG=[gh/gravitee-lab/GraviteeCiCdOrchestrator]
jbl@poste-devops-jbl-16gbram:~/gravitee-orchestra$ curl -X GET https://circleci.com/api/v2/project/${PROJ_SLUG}/job/${JOB_NUMB} -H 'Accept: application/json' -H "Circle-Token: ${CCI_API_KEY}" | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   833  100   833    0     0   2180      0 --:--:-- --:--:-- --:--:--  2180
{
  "web_url": "https://circleci.com/gh/gravitee-lab/GraviteeCiCdOrchestrator/127",
  "project": {
    "external_url": "https://github.com/gravitee-lab/GraviteeCiCdOrchestrator",
    "slug": "gh/gravitee-lab/GraviteeCiCdOrchestrator",
    "name": "GraviteeCiCdOrchestrator"
  },
  "parallel_runs": [
    {
      "index": 0,
      "status": "failed"
    }
  ],
  "started_at": "2020-09-12T17:47:25.054Z",
  "latest_workflow": {
    "name": "docker_build_and_push",
    "id": "75e83261-5b3c-4bc0-ad11-514bb01f634c"
  },
  "name": "build",
  "executor": {
    "resource_class": "medium",
    "type": "machine"
  },
  "parallelism": 1,
  "status": "failed",
  "number": 127,
  "pipeline": {
    "id": "b4f4eabc-d572-4fdf-916a-d5f05d178221"
  },
  "duration": 61896,
  "created_at": "2020-09-12T17:47:21.907Z",
  "messages": [],
  "contexts": [
    {
      "name": "gravitee-lab"
    }
  ],
  "organization": {
    "name": "gravitee-lab"
  },
  "queued_at": "2020-09-12T17:47:21.934Z",
  "stopped_at": "2020-09-12T17:48:26.950Z"
}

```
