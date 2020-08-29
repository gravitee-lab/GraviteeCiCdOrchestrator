/// import * as whatever from '@some/pkgIneed';

/**
 * A Template prototype POO structure for all  Orchestrator types :
 * classes, abstract classes, interfaces, and namespaces. Also on how
 * to handle Args type checking. 
 **/
export namespace mynamespace { /// not sureI wanna use namespaces we'll see how unseful it is.


  export abstract class AbstractMyPOOType implements mynamespace.IMyPOOType {
    constructor (
      name: string,
      args: AbstractMyPOOTypeArgs
    ) {
      console.log('Hey i am AbstractMyPOOType \'s constructor ')
    }
  }
  export interface IMyPOOType {

  }

  export interface AbstractMyPOOTypeArgs {
    timeout: number; // in milliseconds
  }

  export interface MyPOOTypeArgs extends mynamespace.AbstractMyPOOTypeArgs {
    paramOne: string;
  }

  /**
   *
   *
   **/
  export class MyPOOType extends mynamespace.AbstractMyPOOType {

    public readonly paramOne: string
    ///
    ///
    /**
     * Sets Hosts values "inside the Gravitee Apllication" :  for CORS etc...
     * For example, if set to `gravitee-apim`, then then Gravitee Gateway will
     * be expected exposed at https://gravitee-apim.mycompany.io/ and Gravitee API Consumers
     * Portal will be exposed at https://gravitee-apim.mycompany.io/portal
     **/
    public readonly baseNomsDomainesMyPOOType: string;

    constructor (
      name: string,
      args: MyPOOTypeArgs
    ) {
      super(`valueofContructorParamOne`, args)


      // ---------------------------------
      // Helm Charts common properties
      // --
      // Initialization : helm repo add graviteeio https://helm.gravitee.io
      // --
      // cf. la méthode [ executerUnHelmChart () {} ]
      // --
      this.paramOne = "graviteeio";

      const something = 'ccc';


    }


  }

}
