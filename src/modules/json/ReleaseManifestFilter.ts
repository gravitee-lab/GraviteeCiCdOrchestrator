import * as fs from 'fs';
/// import * as loadJsonFile from 'load-json-file';

// export const manifestPath : string = "tests-data/apim/1.30.x/release.json";
export const manifestPath : string = process.env.RELEASE_MANIFEST_PATH;

/**
 * Filters Gravitee components to release and builds an Execution Plan.
 * @comment All methods are synchronous
 **/
export class ReleaseManifestFilter {
    /**
     * [gravitee_release_branch] must match one the of the existing branch on
     **/
    gravitee_release_branch: string;
    gravitee_release_version: string;
    releaseManifest: any;
    selectedComponents : any;
    constructor(release_version: string, release_branch: string) {
        this.validateJSon();
        // console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");

        //this.releaseManifest = {}; /// defaults to the empty JSON Object
        this.gravitee_release_version = release_version;
        this.gravitee_release_branch = release_branch;
        this.selectedComponents = { "components" : []};
    }
    /**
     * Filters the releaseManifest Release manifest file to
     * Populate [this.selectedComponents] with the components that should be included in the release
     **/
    filter() : void {
      console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");

      this.releaseManifest.components.forEach(component => {

        if (component.version.includes('-SNAPSHOT')) {
          console.info('');
          /// console.debug("[{CircleCiOrchestrator}] - processing filter selected component : ");
          /// console.debug(`${JSON.stringify(component, null, "  ")}`);
          //selectedComponents.push(component);
          this.selectedComponents.components.push(component);
          console.info('');
        }
      });
      console.debug("{[ReleaseManifestFilter]} - Selected components are [" + `${JSON.stringify(this.selectedComponents, null, "  ")}` + "]");
    }
    /**
     * Generates the Execution plan using [this.selectedComponents] with the components that should be included in the release
     * @returns A 2-dimensional JSon array, which is the execution plan, that will be executted by the {@see CircleCiOrchestrator}
     *
     **/
    buildExecutionPlan()  : string [][] {
      let execPlan : any [][] = [[]];
      this.filter(); /// populates the [this.selectedComponents] Class member

      this.selectedComponents.components.forEach(component => {
        execPlan[0].push(component);
        /// .keys(obj).length
        console.log ("{[ReleaseManifestFilter]} - The component : ");
        console.log (`${JSON.stringify(component, null, "  ")}`);
        console.log ("{[ReleaseManifestFilter]} - has a total of " + `${Object.keys(component).length}` +" [JSon] properties.");

      });

      console.log ("{[ReleaseManifestFilter]} - Gravitee Release Branch: [" + this.gravitee_release_branch + "]" );
      console.log ("{[ReleaseManifestFilter]} - Gravitee Release Version: [" + this.gravitee_release_version + "]" );
      console.log("{[ReleaseManifestFilter]} - parse() method not fully implemented yet");
      // returnedArray = [['graviteeio:rrr', "graviteeio:in", "graviteeio:a", "graviteeio:jar"], ["graviteeio:Itook", "graviteeio:allof", "graviteeio:hismoney", "graviteeio:mushareem"], ["graviteeio:dabadoo", "graviteeio:dabada", "graviteeio:onefor", "graviteeio:mydaddyoh"]];
      execPlan = [
        [
          { graviteeio :
            { gituri : "ccc", version : ""}
          },
          { graviteeio :
            { gituri : "ccc", version : ""}
          },

          { graviteeio :
            { gituri : "ccc", version : ""}
          }
        ],
        [
          { graviteeio :
            { gituri : "ccc", version : ""}
          },
          { graviteeio :
            { gituri : "ccc", version : ""}
          }
        ]
      ];

      return execPlan
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
      console.info("{[ReleaseManifestFilter]} - Parsing release.json Release Manifest file located at [" + manifestPath + "]");
      console.debug("{[ReleaseManifestFilter]} - Parsed Manifest is [" + `${JSON.stringify(this.releaseManifest, null, "  ")}` + "]");
      let manifestAsString: string = fs.readFileSync(`${manifestPath}`,'utf8');
      this.releaseManifest = JSON.parse(manifestAsString);
    }
}
export let companyName:string = "Gravitee.io";
/// let notVisibleFromOutside:string = "I'm a kind of protected property";
