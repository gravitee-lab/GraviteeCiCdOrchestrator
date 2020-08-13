export let manifestRepoURI : string = "./release.json";

/**
 * This module allows to check whch is the reference git repo where the release.json lives.
 * This module will (in the future) load those infos from a configuration file, config.toml
 *
 **/
export class ReleaseManifestFilter {
    /**
     * [gravitee_release_branch] must match one the of the existing branch on
     **/
    gravitee_release_branch: string;
    gravitee_release_version: string;
    constructor(release_version: string, release_branch: string) {
        this.gravitee_release_version = release_version;
        this.gravitee_release_branch = release_branch;
    }
    /**
     * returning an A 2-dimensional array
     **/
    parse()  : string [][] {
      console.log ("Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log ("Gravitee Release Message: [" + this.gravitee_release_message + "]" );
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
