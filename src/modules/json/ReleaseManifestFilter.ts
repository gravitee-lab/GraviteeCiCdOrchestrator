import * as fs from 'fs';
/// import * as loadJsonFile from 'load-json-file';

// export const manifestPath : string = "tests-data/apim/1.30.x/release.json";
export const manifestPath : string = process.env.RELEASE_MANIFEST_PATH;

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
    releaseManifest: any;
    constructor(release_version: string, release_branch: string) {
        this.validateJSon();
        let manifestAsString: string = fs.readFileSync(`${manifestPath}`,'utf8');
        this.releaseManifest = JSON.parse(manifestAsString);
        // console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");

        //this.releaseManifest = {}; /// defaults to the empty JSON Object
        this.gravitee_release_version = release_version;
        this.gravitee_release_branch = release_branch;
    }

    /**
     * returning an A 2-dimensional array
     * npm install load-json-file
     *
     **/
    parse()  : string [][] {

      console.log("{[ReleaseManifestFilter]} - Parsing release.json located at [" + manifestPath + "]");
      console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");

      this.releaseManifest.components.forEach(component => {
        
        if (component.version.includes('-SNAPSHOT')) {
          console.info('');
          console.info("[{CircleCiOrchestrator}] - processing filter selected component : ");
          console.info(`${JSON.stringify(component, null, "  ")}`);
          console.info('');
        }
      });

      console.log ("{[ReleaseManifestFilter]} - Gravitee Release Branch: [" + this.gravitee_release_branch + "]" );
      console.log ("{[ReleaseManifestFilter]} - Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log("{[ReleaseManifestFilter]} - parse() method not fully implemented yet");
      let returnedArray : string [][] = [["graviteeio:whiskey", "graviteeio:in", "graviteeio:a", "graviteeio:jar"], ["graviteeio:Itook", "graviteeio:allof", "graviteeio:hismoney", "graviteeio:mushareem"], ["graviteeio:dabadoo", "graviteeio:dabada", "graviteeio:onefor", "graviteeio:mydaddyoh"]];
      return returnedArray
    }
    /**
     * Checks :
     * => if the file exists,
     * => if it contains a valid JSON,
     *
     **/
    validateJSon()  : void {
      if (!fs.existsSync(manifestPath)) {
        throw new Error("{[ReleaseManifestFilter]} - [" + `${manifestPath}` + "] does not exists, stopping release process");
      } else {
        console.log("{[ReleaseManifestFilter]} - found release.json release manifest located at [" + manifestPath + "]");
      }
    }
}
export let companyName:string = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
