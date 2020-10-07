# The Tests data


## `Gravitee APIM`

### `1.30.x`


* `release-data/apim/1.30.x/tests/release.test1.json`, expected filtered dependencies :
```JSon
{
  "components": [
      {
          "name": "gravitee-definition",
          "version": "1.20.3-SNAPSHOT"
      },
      {
          "name": "gravitee-management-webui",
          "version": "1.30.19-SNAPSHOT"
      },
      {
          "name": "gravitee-policy-rest-to-soap",
          "version": "1.6.0-SNAPSHOT"
      },
      {
          "name": "gravitee-policy-transformqueryparams",
          "version": "1.4.1-SNAPSHOT"
      },
      {
          "name": "gravitee-policy-request-validation",
          "version": "1.7.3-SNAPSHOT"
      },
      {
          "name": "gravitee-policy-assign-content",
          "version": "1.4.0-SNAPSHOT"
      }
  ]
}

```
* test 2, exepected :

```bash
{
    "components": [
        {
            "name": "gravitee-management-webui",
            "version": "1.30.19-SNAPSHOT"
        },
        {
            "name": "gravitee-policy-rest-to-soap",
            "version": "1.6.0-SNAPSHOT"
        },
        {
            "name": "gravitee-policy-dynamic-routing",
            "version": "1.9.1-SNAPSHOT"
        },
        {
            "name": "gravitee-policy-override-http-method",
            "version": "1.1.0-SNAPSHOT"
        },
        {
            "name": "gravitee-policy-request-validation",
            "version": "1.7.3-SNAPSHOT"
        },
        {
            "name": "gravitee-resource-oauth2-provider-generic",
            "version": "1.13.0-SNAPSHOT"
        },
        {
            "name": "gravitee-resource-oauth2-provider-am",
            "version": "1.10.0-SNAPSHOT"
        },
        {
            "name": "gravitee-notifier-email",
            "version": "1.2.3-SNAPSHOT"
        },
        {
            "name": "gravitee-service-discovery-consul",
            "version": "1.1.1-SNAPSHOT"
        },
        {
            "name": "gravitee-policy-ssl-enforcement",
            "version": "1.0.1-SNAPSHOT"
        }
    ]
}
```
