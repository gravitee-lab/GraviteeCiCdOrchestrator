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

import "./lib/env";
import "./lib/errors";
import { Cli } from './cli/Cli';
import * as runner from './runner/runner';
import * as shelljs from 'shelljs';

export const cli : Cli = new Cli();

console.log(`{[ index.ts ]} --- valeur yargs de l'option YARGS 'init' : ${cli.gnuOptions.argv["init"]}`);

process.argv = cli.gnuOptions.argv;

console.log(` === (Circle CI CLI Binary in use is [${process.env.CCI_CLI_BINARY}])`)

console.log(` === Validating  the Circle CI Pipeline for this Circle CI Orb Project [.circleci/config.yml]`)
let CCI_CLI_CMD: string =`${process.env.CCI_CLI_BINARY} config validate`
if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
  shelljs.echo(' !! Error validating  the Circle CI Pipeline for this Circle CI Orb Project [.circleci/config.yml] (have you edited it?)');
  shelljs.exit(1);
}

let orbRunner: runner.CciCLIRunner = new runner.CciCLIRunner();
orbRunner.runCycle();
