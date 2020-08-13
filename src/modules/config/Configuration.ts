import fs from 'fs';

export interface OrchestratorConfig
{
    product: string;
    execution: number;
    settings: string[];
}
/**
 * 1./ extracts the scale : the `buildDependencies` element alone, as [scale.json]
 * 2./ ccc
 *
 **/
export class Configuration {
    /**
     * [config_file_path] The path to the configuration file, from
     * the PWD of the process executing the [GraviteeReleaseOrchestrator]
     **/
    config_file_path: string;
    constructor() {
        this.config_file_path = config_file_path;
    }
    /**
     * returning an A 2-dimensional array
     **/
    loadConfigFromFile()  : void {
      console.log ("Gravitee Release Branch: [" + this.gravitee_release_branch + "]" );
      console.log ("Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log("Parsing release.json not implemented yet");
      let returnedArray : string [][] = [[], [], []];
      return returnedArray
    }
    /**
     * This method constructs a JSON Object, containing only the [buildDependencies]
     * JSon element from the [release.json]
     **/
    resolveScale()  : any {
      console.log ("Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log ("Gravitee Release Message: [" + this.gravitee_release_message + "]" );
      console.log("Parsing release.json not implemented yet");
      let returnedArray : string [][] = {

      };
      return returnedArray
    }
    /**
     * just checks if the file exists
     **/
    validateJSon()  : void {
      console.log ("Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log ("Gravitee Release Message: [" + this.gravitee_release_message + "]" );
      console.log("Parsing release.json not implemented yet");
    }
}
export let companyName:string = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
