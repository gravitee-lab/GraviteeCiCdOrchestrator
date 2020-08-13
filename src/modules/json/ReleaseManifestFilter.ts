import * as fs from 'fs';

export let manifestPath : string = "./release.json";

/**
 * 1./ extracts the scale : the `buildDependencies` element alone, as [scale.json]
 *
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
      console.log ("Gravitee Release Branch: [" + this.gravitee_release_branch + "]" );
      console.log ("Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log("Parsing release.json not implemented yet");
      let returnedArray : string [][] = [[], [], []];
      return returnedArray
    }
    /**
     * just checks if the file exists
     **/
    validateJSon()  : void {
      console.log ("Gravitee Release Branch: [" + this.gravitee_release_branch + "]" );
      console.log ("Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log("Parsing release.json not implemented yet");
    }
}
export let companyName:string = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
