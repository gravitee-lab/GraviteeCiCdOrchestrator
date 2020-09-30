# The truth about the birth of the S.H.I.E.L.D. (it is French)

This set of modules was designed after analyzing an issue proved to be caused by Circle CI API v2 : no bug or design issue in the `Gravitee CI CD Orchestrator` responsibility is proved.

The Shield provides a solution protecting `Gravitee` CI CD Service from this Circle CI anomaly, but reifies a much larger new concept, in `Gravitee CI CD Orchestrator`.

The issue on github.com, with the full live analysis: https://github.com/gravitee-lab/GraviteeCiCdOrchestrator/issues/28

The opened issue on circleci.com : https://ideas.circleci.com/api-feature-requests/p/behavior-triggering-pipeline-of-circleci-project-not-set-up-to-start-building



## The whole story

* When required Circle CI projects are not activated on https://app.circleci.com ,
* then the `Gravitee CI CD Orchestrator` does not detect the problem, and should stop its execution(and it does not).
*  here a sample output of a test when only one of 25 Circle CI projects are activated, and the 24 others are not (below sample output of the processing of one of the Parallel Execution Set, which has `18` pipeline entries)  :

```bash
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], Progress Matrix is now  :
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '2',
    id: 'de87eee6-72e4-40c7-a896-620895c93cfe',
    created_at: '2020-09-30T10:59:32.329Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: '5323bdc4-af91-4561-aee1-c6c3d6834cc1',
    created_at: '2020-09-30T10:59:32.341Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: 'b024f9e9-4a89-4f77-9f18-53ae2e9724b8',
    created_at: '2020-09-30T10:59:32.367Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: '8515af3d-c48c-46ca-ae34-6194c5ad25a1',
    created_at: '2020-09-30T10:59:32.378Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: 'd3b2ac0a-fcb5-4fe9-a593-3c32166a460e',
    created_at: '2020-09-30T10:59:32.406Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: 'b0a25724-87c0-4226-82bc-bd364b43f410',
    created_at: '2020-09-30T10:59:32.430Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: 'e3e85a73-0052-4959-946d-6a47bc08e626',
    created_at: '2020-09-30T10:59:32.432Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: '13cd2f3f-da64-450b-8aef-bc50ad314d4e',
    created_at: '2020-09-30T10:59:32.443Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: '967b6e3f-0f5e-40c9-a948-6e924168a557',
    created_at: '2020-09-30T10:59:32.488Z',
    exec_state: 'pending'
  }
]
```

The test which allowed me to identified this issue, had the following execution plan :

```JSon
{
 "execution_plan_is": [
  [],
  [],
  [],
  [
   {
    "name": "gravitee-definition",
    "version": "1.23.2-SNAPSHOT"
   },
   {
    "name": "gravitee-fetcher-api",
    "version": "1.3.0-SNAPSHOT"
   }
  ],
  [],
  [
   {
    "name": "gravitee-policy-api",
    "version": "1.9.0-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-plugin",
    "version": "1.13.0-SNAPSHOT"
   }
  ],
  [],
  [
   {
    "name": "gravitee-gateway",
    "version": "3.1.4-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-resource-oauth2-provider-am",
    "version": "1.10.0-SNAPSHOT"
   },
   {
    "name": "gravitee-resource-oauth2-provider-keycloak",
    "version": "1.7.0-SNAPSHOT"
   }
  ],
  [
   {
    "name": "gravitee-policy-apikey",
    "version": "2.0.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-ratelimit",
    "version": "1.8.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-mock",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-cache",
    "version": "1.6.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-xslt",
    "version": "1.4.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-groovy",
    "version": "1.11.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-dynamic-routing",
    "version": "1.9.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-jwt",
    "version": "1.14.4-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-keyless",
    "version": "1.2.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-openid-connect-userinfo",
    "version": "1.2.0-SNAPSHOT"
   },
   {
    "name": "gravitee-fetcher-http",
    "version": "1.10.1-SNAPSHOT"
   },
   {
    "name": "gravitee-fetcher-git",
    "version": "1.6.0-SNAPSHOT"
   },
   {
    "name": "gravitee-fetcher-gitlab",
    "version": "1.9.3-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-role-based-access-control",
    "version": "1.0.2-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-ssl-enforcement",
    "version": "1.0.1-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-json-threat-protection",
    "version": "1.0.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-regex-threat-protection",
    "version": "1.0.0-SNAPSHOT"
   },
   {
    "name": "gravitee-policy-xml-threat-protection",
    "version": "1.0.0-SNAPSHOT"
   }
  ],
  []
 ]
}
```

## Analysis of the issue

* The first non-empty Parallel Execution Set is of index 3, and has the following two entries :

```JSon
{
 "parallelExecutionsSet": [
  {
   "name": "gravitee-definition",
   "version": "1.23.2-SNAPSHOT"
  },
  {
   "name": "gravitee-fetcher-api",
   "version": "1.3.0-SNAPSHOT"
  }
 ]
}
```
* Now, the logs for the processing of this Parallel Execution Set are :

```bash
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.name : [gravitee-definition]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.version : [1.23.2-SNAPSHOT]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - so component git branch to trigger pipeline on is : [1.23.x]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of process.argv["dry-run"] : [true]
[{[ReactiveParallelExecutionSet]} - (process.argv["dry-run"] === 'true') condition is true
curl -X POST -d {"parameters":{"gio_action":"product_release_dry_run"},"branch":"1.23.x"} -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <obfuscatedsecretvalue>' https://circleci.com/api/v2/project/gh/gravitee-lab/gravitee-definition/pipeline
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.name : [gravitee-fetcher-api]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of component.version : [1.3.0-SNAPSHOT]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - so component git branch to trigger pipeline on is : [1.3.x]
[{[ReactiveParallelExecutionSet # triggerPipelines()]} - value of process.argv["dry-run"] : [true]
[{[ReactiveParallelExecutionSet]} - (process.argv["dry-run"] === 'true') condition is true
curl -X POST -d {"parameters":{"gio_action":"product_release_dry_run"},"branch":"1.3.x"} -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <obfuscatedsecretvalue>' https://circleci.com/api/v2/project/gh/gravitee-lab/gravitee-fetcher-api/pipeline
[{ReactiveParallelExecutionSet}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] =>  {
  number: 2,
  state: 'pending',
  id: 'ef4264c2-f6f4-4cc4-a928-e7f89f3aff90',
  created_at: '2020-09-30T10:59:27.610Z'
}
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], Progress Matrix is now  :
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '2',
    id: 'ef4264c2-f6f4-4cc4-a928-e7f89f3aff90',
    created_at: '2020-09-30T10:59:27.610Z',
    exec_state: 'pending'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], this.pipelines_nb : [2]
[ --- [ReactiveParallelExecutionSet], triggerProgress.length : [1]
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '2',
    id: 'ef4264c2-f6f4-4cc4-a928-e7f89f3aff90',
    created_at: '2020-09-30T10:59:27.610Z',
    exec_state: 'pending'
  }
]
[{[ReactiveParallelExecutionSet]} - triggering Circle CI Build completed! :)]
[{ReactiveParallelExecutionSet}] - [handleTriggerPipelineCircleCIResponseData] Processing Circle CI API Response [data] =>  {
  number: 2,
  state: 'pending',
  id: '6faac079-dbf6-480f-9375-7252417c73b8',
  created_at: '2020-09-30T10:59:27.664Z'
}
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], Progress Matrix is now  :
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '2',
    id: 'ef4264c2-f6f4-4cc4-a928-e7f89f3aff90',
    created_at: '2020-09-30T10:59:27.610Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: '6faac079-dbf6-480f-9375-7252417c73b8',
    created_at: '2020-09-30T10:59:27.664Z',
    exec_state: 'pending'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- [ReactiveParallelExecutionSet], this.pipelines_nb : [2]
[ --- [ReactiveParallelExecutionSet], triggerProgress.length : [2]
[-----------------------------------------------]
[-----------------------------------------------]
[
  {
    pipeline_exec_number: '2',
    id: 'ef4264c2-f6f4-4cc4-a928-e7f89f3aff90',
    created_at: '2020-09-30T10:59:27.610Z',
    exec_state: 'pending'
  },
  {
    pipeline_exec_number: '2',
    id: '6faac079-dbf6-480f-9375-7252417c73b8',
    created_at: '2020-09-30T10:59:27.664Z',
    exec_state: 'pending'
  }
]
[-----------------------------------------------]
[-----------------------------------------------]
[ --- progress Matrix Observer: NEXT
[ --- All Pipelines have been triggered !
[ --- notifier call :
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x
{[CircleCiOrchestrator]} - x+x+x+x+x+x+x+x+x+x
{[CircleCiOrchestrator]} - PARALLEL EXECUTION SET NO.[3] JUST COMPLETED TRIGGERING [CIRCLE CI] PIPELINES -
{[CircleCiOrchestrator]} - NOW EXECUTING NEXT PARALLEL EXECUTION SET NO.[4]  -
[{CircleCiOrchestrator}] - processing Parallel Execution Set no. [4] will trigger the following [Circle CI] pipelines :
[{CircleCiOrchestrator}] - Skipped Parallel Executions Set no. [4] because it is empty, proceed with next
[{CircleCiOrchestrator}] - processing Parallel Execution Set no. [5] will trigger the following [Circle CI] pipelines :

+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x

```
* So, here is what happened :
  * the HTTP request to trigger the 2 pipelines were sent
  * and the HTTP requests are the right ones, to send, which are :
    * for the `{ "name": "gravitee-definition", "version": "1.23.2-SNAPSHOT" }` Gravitee component, the HTTP request sent was :

```bash
curl -X POST -d "{\"parameters\":{\"gio_action\":\"product_release_dry_run\"},\"branch\":\"1.3.x\"}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <obfuscatedsecretvalue>' https://circleci.com/api/v2/project/gh/gravitee-lab/gravitee-fetcher-api/pipeline
```
    * for the `{ "name": "gravitee-fetcher-api", "version": "1.3.0-SNAPSHOT" }` Gravitee component, the HTTP request sent was :

```bash
curl -X POST -d "{\"parameters\":{\"gio_action\":\"product_release_dry_run\"},\"branch\":\"1.3.x\"}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <obfuscatedsecretvalue>' https://circleci.com/api/v2/project/gh/gravitee-lab/gravitee-fetcher-api/pipeline
```

Okay, so now,let's sum up the situation, for one of the components :
* for the `{ "name": "gravitee-definition", "version": "1.23.2-SNAPSHOT" }` Gravitee component :
  * the HTTP request sent was :

```bash
curl -X POST -d "{\"parameters\":{\"gio_action\":\"product_release_dry_run\"},\"branch\":\"1.3.x\"}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <obfuscatedsecretvalue>' https://circleci.com/api/v2/project/gh/gravitee-lab/gravitee-fetcher-api/pipeline
```

  * the `Gravitee CI CD Orchestrator` doesreceivethe HTTP response for this request, since the logs mention the call to the `handleTriggerPipelineCircleCIResponseData` method.
  * But let's check using `curl` what is theHTTP response of the Circle CI API, when trying to trigger the pipeline, for the Circle CI _Project_ for the `{ "name": "gravitee-definition", "version": "1.23.2-SNAPSHOT" }` Gravitee component (so the https://github.com/gravitee-lab/gravitee-definition Github repo), which is not "_setup to start building_" :

```bash
$ curl -iv -X POST -d "{\"parameters\":{\"gio_action\":\"product_release_dry_run\"},\"branch\":\"2.0.x\"}" -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Circle-Token: <obfuscatedsecretvalue>' https://circleci.com/api/v2/project/gh/gravitee-lab/gravitee-policy-apikey/pipeline
Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying 52.3.117.48:443...
* TCP_NODELAY set
* Connected to circleci.com (52.3.117.48) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server did not agree to a protocol
* Server certificate:
*  subject: CN=*.circleci.com
*  start date: Nov 20 00:00:00 2019 GMT
*  expire date: Dec 20 12:00:00 2020 GMT
*  subjectAltName: host "circleci.com" matched cert's "circleci.com"
*  issuer: C=US; O=Amazon; OU=Server CA 1B; CN=Amazon
*  SSL certificate verify ok.
> POST /api/v2/project/gh/gravitee-lab/gravitee-policy-apikey/pipeline HTTP/1.1
> Host: circleci.com
> User-Agent: curl/7.68.0
> Content-Type: application/json
> Accept: application/json
> Circle-Token: b5ac5f184c1cc2112d1b46863cecff4cd4b577ec
> Content-Length: 72
>
* upload completely sent off: 72 out of 72 bytes
* Mark bundle as not supporting multiuse
< HTTP/1.1 201 Created
HTTP/1.1 201 Created
< Content-Type: application/json;charset=utf-8
Content-Type: application/json;charset=utf-8
< Date: Wed, 30 Sep 2020 12:16:20 GMT
Date: Wed, 30 Sep 2020 12:16:20 GMT
< Server: nginx
Server: nginx
< Set-Cookie: ring-session=zOqnpZyrKAH1JuMFya0iARj8MOV5c67kdnhpuoYKYM8wjQ%2FRpCw246Vpe%2F3X4rvgGPjKP32fngjb0bD4WZ%2BfUjzO1RqB2OpgpHlB9VsR0FgUb6pGgSF4xdDO0amZhk857HVcfKS4wk6uOF6W7YtCuE4kKRWOB5%2B0kgieZMfgSY%2BGJlUMuk8RPgbBlkU8xxjo%2BIFqxsgrrflpKqlPubhpTa%2B%2BcPugAFvzTMfnxNcGo3M%3D--b5pgkO4jqd%2BAhpv3oZ%2BQ7Grv3IfImJQp1uU%2F6B9OnIE%3D;Path=/;HttpOnly;Expires=Thu, 30 Sep 2021 12:01:40 +0000;Max-Age=1209600;Secure
Set-Cookie: ring-session=zOqnpZyrKAH1JuMFya0iARj8MOV5c67kdnhpuoYKYM8wjQ%2FRpCw246Vpe%2F3X4rvgGPjKP32fngjb0bD4WZ%2BfUjzO1RqB2OpgpHlB9VsR0FgUb6pGgSF4xdDO0amZhk857HVcfKS4wk6uOF6W7YtCuE4kKRWOB5%2B0kgieZMfgSY%2BGJlUMuk8RPgbBlkU8xxjo%2BIFqxsgrrflpKqlPubhpTa%2B%2BcPugAFvzTMfnxNcGo3M%3D--b5pgkO4jqd%2BAhpv3oZ%2BQ7Grv3IfImJQp1uU%2F6B9OnIE%3D;Path=/;HttpOnly;Expires=Thu, 30 Sep 2021 12:01:40 +0000;Max-Age=1209600;Secure
< Strict-Transport-Security: max-age=15724800
Strict-Transport-Security: max-age=15724800
< X-CircleCI-Identity: circle-www-api-v1-9fbcd796d-2rnjm
X-CircleCI-Identity: circle-www-api-v1-9fbcd796d-2rnjm
< X-Frame-Options: DENY
X-Frame-Options: DENY
< X-RateLimit-Limit: 151
X-RateLimit-Limit: 151
< X-RateLimit-Remaining: 150
X-RateLimit-Remaining: 150
< X-RateLimit-Reset: 0
X-RateLimit-Reset: 0
< x-request-id: f092b3cb-c28b-411a-8d13-1a6620c9b00f
x-request-id: f092b3cb-c28b-411a-8d13-1a6620c9b00f
< X-route: /api/v2/project/:project-slug/pipeline
X-route: /api/v2/project/:project-slug/pipeline
< Content-Length: 114
Content-Length: 114
< Connection: keep-alive
Connection: keep-alive

<
* Connection #0 to host circleci.com left intact
{"number":6,"state":"pending","id":"b6de2aa3-4b18-4dde-aaed-73f9528135fe","created_at":"2020-09-30T12:16:20.796Z"}
```

Oh my, there we have found the bottom issue :

* **When a Circle CI _project_ is not "_setup to start building_", and you never the less use the Circle CI API to trigger a Pipeline execution for this project,what does the Circle CI API v2 answers ? HTTP Response is `201 Created` !!!! What an un-expected test result !!!**
* If I had to give a suggestion,I wouldsay that in this case, the Circle CI API v2 should return :
  * an [HTTP Response code `403`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) , which is not an authentication error meant code, [like `401`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) : _The HTTP 403 Forbidden client error status response code indicates that the server understood the request but refuses to authorize it._
  * along with a JSon response payload including an explicit error message, something like :

```JSon
{
   error_mesage: "You tried to trigger a Pipeline Execution for the <project_slug> project,but this project is not setup to start building"
}
```

Finally note the "`pipeline_number`" was incremented, running my tests, which should not happen, and :
* this certainly hurts the ability to design a CI CD System based on Circle CI, with Global CI CD  service Accountability.
* and this is probably both :
  * a very important good reason to consider this behavior a major anomaly,
  * and the high value of designing a fix for this issue, in GraviteeCI CD System, fix that I will therefore call the `AccountabilityShieldService` feature, in that system. This service resposibility will be to ensure no entropy/disruption is introduced the in the Accountability data of the Gravitee CI CD Service. Accountability Service of the Gravitee CI CD Service will, for example, and probably, be implemented through an analytics system such as a classic ELK/Filebeats, see https://github.com/gravitee-lab/GraviteeCiCdOrchestrator/issues/8#issuecomment-678852657 .

### Conclusion of the analysis

* To start with, we clearly have isolated what can clearly be considered  a Circle CI API v2 behavioral bug, so we will open an issue
* Before knowing the answer of the Circle CI Tech Team, We will  add a shield, to the `Gravitee CI CD Orchestrator`,which will protect it :
  * from this behavioral anomaly,
  * and from future bugs in the future bug fixes of this issue, from the CircleCI Team :they are humans just like us at Gravitee, and errors are inherently part of humans.
  * But the `Gravitee CI CD Orchestrator` is not a human, it is a cybernetic system, in the sense that it is designed to behave as an autonomous system. So also Autonomous from natural human errors, and that's why it's design will include this shield

# The Accountabilty Shield Service design

### _(Or the birth of the Gravitee **Strategic Homeland Intervention Enforcement Logistics Division**)_

Now that we understand perfectly the issue, The Shield design is very simple, and designed regarding what the `Gravitee CI CD Orchestrator` wants to do : to perform a secured, meanfully logged release.

Ok, so here is the design, very simple :
* The  `Gravitee CI CD Orchestrator`, before processing any CI CD stage,  will always run the `AccountabilityShield`, to ensure no Accountability entropy is risked, running the CI CD stage
* To each CI CD stage, the  `AccountabilityShieldService` will have a matching `AccountabilityShield`  :
  * if the CI CD stage is `mvn_relase`, then the executed `AccountabilityShieldTask` will use the Circle CI API v2 to check that all Circle CI prjects involved in an execution plan, are actually setup to start building.
  * if the CI CD stage is `someotherstage`, then the executed `AccountabilityShieldTask` will check something else, if needed.
  * if the CI CD stage is `somethirdotherstage`, and there is nothing to check to ensureCID CD Service accountabilty, then the executed `AccountabilityShieldTask` will just log `[AccountabilityShieldTask] for CI CD stage [somethirdotherstage] has nothing to do, to ensure no entropy introduction is risked` .

Sowehave the design pattern now :
* An `AccountabilityShieldService` class
* An `AccountabilityShield` abstract class, with an abstract method named `shieldUp()`
* And for every CI CD stage named `mycicdstage` ,  a class extending the `AccountabilityShield` abstract class, named `MyCiCdStageAccountabilityShield`, with an implementation of the abstract method  `shieldUp()`,

Example in our case :
* CI CD stage named `mvn_release` ,  a class extending the `AccountabilityShield` abstract class, named `Mvn_ReleaseAccountabilityShield`, with an implementation of the abstract method  `shieldUp()`, which :
  * will use the Circle CI API v2 to check that all Circle CI projects involved in an execution plan,
  * are actually setup to start building.

`shieldUp()` will have to be invoked after the `ReleaseManifestParser` has builded up the execution plan, and before processing the execution plan:  So as first instruction of the `src/modules/circleci/CircleCiOrchestrator.ts#start()` method, [here](https://github.com/gravitee-lab/GraviteeCiCdOrchestrator/blob/2e1fa523d204f582a916252de167775b3f5b8cbe/src/modules/circleci/CircleCiOrchestrator.ts#L244)

And this is how we will take `Thanos` down at `Gravitee`, before he does any harm, because we,at Gravitee, know how to bend space time, classic French Geometry from Poincaré.


### The opened issue at circle.com

https://ideas.circleci.com/api-feature-requests/p/behavior-triggering-pipeline-of-circleci-project-not-set-up-to-start-building

The S.H.I.EL.D.is waiting for CircleCI friends,now, :)
