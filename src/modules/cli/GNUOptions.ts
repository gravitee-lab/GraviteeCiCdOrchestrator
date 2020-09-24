import * as yargsLib from 'yargs';

export class GNUOptions {

  public readonly argv;
  private cicd_stage_opt_desc: string;

  constructor(){

    let cicd_stage_option_desc = "\n\n" +`['mvn_release'] In the [https://github.com/${process.env.GH_ORG}/release] ${process.env.GH_ORG} git repo, will run the maven release process, handling all dependency tree parallelization, with reactive behavior (using RxJS), based on the 'release.json' versioned in the https://github.com/${process.env.GH_ORG}/release git repository`
    cicd_stage_option_desc += "\n\n" +`['pull_req'] In every the ${process.env.GH_ORG} product component git repo (dev git repo), will run the docker release process : docker builds and push all docker images for the product, LTS and STS Releases`
    cicd_stage_option_desc += "\n\n" +`['docker_release'] In the [https://github.com/${process.env.GH_ORG}/docker-library] ${process.env.GH_ORG} git repo, will run the docker release process : docker builds and push all docker images for the product, LTS and STS Releases`
    cicd_stage_option_desc += "\n\n" +`['rpm_release'] In the [https://github.com/${process.env.GH_ORG}/rpm-library] ${process.env.GH_ORG} git repo, will run the RPM release process : builds RPM packagesand publishes them to https://packagecloud.io/`
    cicd_stage_option_desc += "\n\n" +`['doc_release'] builds and publish the Gravitee Documentation to https://docs.gravitee.io`
    cicd_stage_option_desc += "\n\n" +`['deploy_demos'] bluegreen deploys all public gravitee demos`
    cicd_stage_option_desc += "\n\n" +`['social'] builds and publish the Social networks , and communication channels announcements (twitter, medium.com, hackernews, facebook, linkedIn, Jumbo posts on website)`
    cicd_stage_option_desc += "\n\n"

    this.argv = yargsLib.options({
      'dry-run': { type: 'boolean', default: true, desc: "\n\n" +"Use this option to run the CICD Process Stage in 'dry run' mode.", alias: 'd' },
      'cicd-stage': { choices: ['mvn_release', 'docker_release', 'rpm_release', 'doc_release', 'deploy_demos', 'social_announcements', 'pull_req'], demandOption: true, desc: `Use this option to specify the CICD Process to run. ${cicd_stage_option_desc}`, alias: 's' },  /// 'pr-bot': { type: 'boolean', default: false, desc: "\n\n" +"Use this option to run the Pull Request Bot CICD Process in a Gravitee IO Component Pipeline.", alias: 'pr' }
      /*,
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
