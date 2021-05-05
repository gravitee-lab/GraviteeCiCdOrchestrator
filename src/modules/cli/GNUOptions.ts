/*
Author (Copyright) 2020 <Jean-Baptiste-Lasselle>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

If your software can interact with users remotely through a computer
network, you should also make sure that it provides a way for users to
get its source.  For example, if your program is a web application, its
interface could display a "Source" link that leads users to an archive
of the code.  There are many ways you could offer source, and different
solutions will be better for different programs; see section 13 for the
specific requirements.

You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU AGPL, see
<https://www.gnu.org/licenses/>.
*/
import * as yargsLib from 'yargs';

export class GNUOptions {

  public readonly argv;
  private cicd_stage_opt_desc: string;

  constructor(){

    let cicd_stage_option_desc = "\n\n" +`['mvn_release'] designed to run in the [https://github.com/${process.env.GH_ORG}/release] ${process.env.GH_ORG} git repo, will run the maven release process, handling all dependency tree parallelization, with reactive behavior (using RxJS), based on the 'release.json' versioned in the https://github.com/${process.env.GH_ORG}/release git repository`
    cicd_stage_option_desc += "\n\n" +`['mvn_nexus_staging'] designed to run the nexus staging in every the ${process.env.GH_ORG} product component git repo (dev git repos, aka repos where product source code is versioned).`
    cicd_stage_option_desc += "\n\n" +`['pull_req'] designed to run in every the ${process.env.GH_ORG} product component git repo (dev git repos, aka repos where product source code is versioned), to manage pull requests with different Circle CI Pipeline Workflows, for support sprints, dev sprints, or even secops sprints. , and based on git branch names (prefix).`
    cicd_stage_option_desc += "\n\n" +`['release_bundle'] designed to run in the [https://github.com/${process.env.GH_ORG}/docker-library] ${process.env.GH_ORG} git repo, to make bundles (something like tar arhcives, zip files of jars...) used to install many dependencies in Container images.`
    cicd_stage_option_desc += "\n\n" +`['oci_release'] designed to run in the [https://github.com/${process.env.GH_ORG}/docker-library] ${process.env.GH_ORG} git repo, will run the docker release process : docker builds and push all docker images for the product, LTS and STS Releases`
    cicd_stage_option_desc += "\n\n" +`['rpm_release'] designed to run in the [https://github.com/${process.env.GH_ORG}/docker-library] ${process.env.GH_ORG} git repo,  [https://github.com/${process.env.GH_ORG}/rpm-library] ${process.env.GH_ORG} git repo, will run the RPM release process : builds RPM packagesand publishes them to https://packagecloud.io/`
    cicd_stage_option_desc += "\n\n" +`['doc_release'] builds and publish the Gravitee Documentation to https://docs.gravitee.io`
    cicd_stage_option_desc += "\n\n" +`['social_release'] builds and publish the Social networks , and communication channels announcements (twitter, medium.com, hackernews, facebook, linkedIn, Jumbo posts on website)`
    cicd_stage_option_desc += "\n\n" +`['demos_release'] bluegreen deploys all public gravitee demos`
    cicd_stage_option_desc += "\n\n" +`['bom'] Generates the Bill Of Material (B.O.M.) for the CI/CD Process, from the Process Manifest file, see also [CICD_PROCESS_MANIFEST_PATH] env. var.`
    cicd_stage_option_desc += "\n\n" +`['trigger'] triggers a simple unique pipeline, and uses the TRIGGER_BRANCH, TRIGGER_REPO, TRIGGER_PARAMS env. vars`
    cicd_stage_option_desc += "\n\n"

    this.argv = yargsLib.options({
      'dry-run': { type: 'boolean', default: true, desc: "\n\n" +"Use this option to run the CICD Process Stage in 'dry run' mode.", alias: 'd' },
      'cicd-stage': { choices: ['trigger', 'bom', 'mvn_release', 'mvn_nexus_staging', 'release_bundle', 'docker_release', 'rpm_release', 'doc_release', 'demos_release', 'social_announcements', 'pull_req'], demandOption: true, desc: `Use this option to specify the CICD Process to run. ${cicd_stage_option_desc}`, alias: 's' },  /// 'pr-bot': { type: 'boolean', default: false, desc: "\n\n" +"Use this option to run the Pull Request Bot CICD Process in a Gravitee IO Component Pipeline.", alias: 'pr' }
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
