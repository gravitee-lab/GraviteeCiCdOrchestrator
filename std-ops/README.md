# Standard operations

The Gravitee CI CD Orchestrator is a distributed software designed to perform
all CI CD Operations of a full CI CD System, operating on the scope of a Github.com organization.

As such, The Gravitee CI CD Orchestrator deployed in a Github Organization `my-org-A`, implements a full CI CD System, and
the CI CD System operating in the `my-org-A` Github Organization, is an autonomous infrastructure.

And just like any infrastructure, the CI CD System operating in any Github Organization, is managed with
standard operations, like :
* deployment operations
* secret management operations
* etc...

As infrastructure, we recommend managing the CI CD System operating in any Github Organization, with the "Infra-As-Code" approach :
* automate every operation (among which standard operations)
* version-control the source code of every automated operation (git strongly recommended)

At https://gravitee.io our CI CD System :
* operates in the https://github.com/gravitee-io Github Organization
* is tested in the https://github.com/gravitee-lab Github Organization



In :
* the [`gravitee-io`](./gravitee-io) Folder, are documented and versioned all standard operations of the CI CD System operating in the https://github.com/gravitee-io Github Organization.
* the [`gravitee-lab`](./gravitee-lab) Folder, are documented and versioned all standard operations of the CI CD System operating in the https://github.com/gravitee-lab Github Organization.
