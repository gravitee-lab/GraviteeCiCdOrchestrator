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
import * as shelljs from 'shelljs';
import axios from 'axios';
/// import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import * as fs from 'fs';


/**
 *
 * Responsible to persist the state of the Release CI CD Process
 * by commit and push to the https://github.com/${GITHUB_ORG}/release.git Github Git Repo
 **/
export class ReleaseProcessStatePersistenceManager {

  private someClassAttribute: any;

  constructor() {
  }


    /**
     * Triggers a Circle CI Pipeline, for a repo on Github
     *
     * @argument arg_one  {@type string} Blablabla
     * @argument arg_two {@type string} Blablabla
     * -----
     * -----
     *
     *
     * @returns any Something
     **/
    someMethod(arg_one: string, arg_two: string): any {


      return null;

    }

}
