/// import * as whatever from '@some/pkgIneed';

/**
 * A Template prototype POO structure for all  Orchestrator types :
 * classes, abstract classes, interfaces, and namespaces. Also on how
 * to handle Args type checking.
 **/

  export interface GraviteeComponentArgs {
    name: string;
    version: string;
  }

  /**
   * Represents a gravitee component, made of :
   * a name : determines the github repo, with {process.env.GH_ORG} e.g. [repo_http_uri] [https://github.com/process.env.GH_ORG/`${name}`]
   * a semver version number as a string, eventually 
   * ''
   *
   **/
  export class GraviteeComponent {

    public readonly name: string;
    public readonly repo_http_uri: string;
    public readonly repo_ssh_uri: string;
    public readonly version: string;

    ///


    constructor (
      args: GraviteeComponentArgs
    ) {
      /// super(`valueofContructorParamOne`, args)


      this.name = args.name;
      this.repo_http_uri = `https://github.com/${process.env.GH_ORG}/${name}`;
      this.repo_ssh_uri = `git@github.com:${process.env.GH_ORG}/${name}`;
      this.version = args.version;


    }


  }
