import fs from 'fs';

export let manifestPath : string = "./release.json";
export class ReleaseManifestFilter {
    gravitee_release_version: string;
    gravitee_release_message: string;
    constructor(release_version: string, release_message: string) {
        this.gravitee_release_version = release_version;
        this.gravitee_release_message = release_message;
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
