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

  constructor(){

    let init_option_desc = "\n\n" +`Set to true to init a new orb project. This will generate an Org Source code from the Circle CI generic template for an Orb, in the 'orb/' folder. Defaults to false`
    init_option_desc += "\n\n"
    let publish_option_desc = "\n\n" +`Set to true to publish your orb project. Defaults to false`
    publish_option_desc += "\n\n"



    this.argv = yargsLib.options({
      'init': { type: 'boolean', default: false, demandOption: false, desc: `${init_option_desc}`, alias: 'i' },
      'publish': { type: 'boolean', default: false, demandOption: false, desc: `${publish_option_desc}`, alias: 'p' }
      /*,
      b: { type: 'string', demandOption: true },
      c: { type: 'number', alias: 'chill' },
      d: { type: 'array' },
      e: { type: 'count' },
      f: { choices: ['1', '2', '3'] }
      */
    }).argv;
    /// console.log(`valeur yargs de l'option YARGS 'dry-run' : ${this.argv["dry-run"]}`);
  }
}

/// export const gnuOptions: GNUOptions = new GNUOptions();
