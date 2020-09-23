import * as yargsLib from 'yargs';

export class GNUOptions {

  public readonly argv;
  private cicd_stage_opt_desc: string;

  constructor(){

    let cicd_stage_option_desc = "\n\n" +`['mvn_release'] will run the maven release process, handling all dependency tree parallelization, with reactive behavior (using RxJS), based on the 'release.json' versioned in the https://github.com/${process.env.GH_ORG}/release git repository`
    cicd_stage_option_desc += "\n\n" +`['docker_release'] will run the docker release process : docker builds and push all docker images for the product, LTS and STS Releases`
    cicd_stage_option_desc += "\n\n"

    this.argv = yargsLib.options({
      'dry-run': { type: 'boolean', default: true, desc: "Use this option to run the CICD Process dry, or not.", alias: 'd' },
      'cicd-stage': { choices: ['mvn_release', 'docker_release', 'rpm_release', 'doc_release', 'deploy_demos', 'social_announcements'], demandOption: true, desc: `Use this option to specify the CICD Process to run. ${cicd_stage_option_desc}`, alias: 's' }/*,

      b: { type: 'string', demandOption: true },
      c: { type: 'number', alias: 'chill' },
      d: { type: 'array' },
      e: { type: 'count' },
      f: { choices: ['1', '2', '3'] }
      */
    }).argv;
    /// console.log(`valeur yargs de l'option YARGS 'dry-run' : ${this.argv["dry-run"]}`);
    /// console.log(`valeur yargs de l'option YARGS 'cicd-stage' : ${this.argv["cicd-stage"]}`);
  }
}

/// export const gnuOptions: GNUOptions = new GNUOptions();
