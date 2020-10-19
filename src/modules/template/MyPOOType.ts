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
/// import * as whatever from '@some/pkgIneed';

/**
 * A Template prototype POO structure for all  Orchestrator types :
 * classes, abstract classes, interfaces, and namespaces. Also on how
 * to handle Args type checking.
 **/
export namespace mynamespace { /// not sureI wanna use namespaces we'll see how unseful it is.


  export abstract class AbstractMyPOOType implements mynamespace.IMyPOOType {
    constructor (
      name: string,
      args: AbstractMyPOOTypeArgs
    ) {
      console.log('Hey i am AbstractMyPOOType \'s constructor ')
    }
  }
  export interface IMyPOOType {

  }

  export interface AbstractMyPOOTypeArgs {
    timeout: number; // in milliseconds
  }

  export interface MyPOOTypeArgs extends mynamespace.AbstractMyPOOTypeArgs {
    paramOne: string;
  }

  /**
   *
   *
   **/
  export class MyPOOType extends mynamespace.AbstractMyPOOType {

    public readonly paramOne: string
    ///
    ///
    /**
     * Sets Hosts values "inside the Gravitee Apllication" :  for CORS etc...
     * For example, if set to `gravitee-apim`, then then Gravitee Gateway will
     * be expected exposed at https://gravitee-apim.mycompany.io/ and Gravitee API Consumers
     * Portal will be exposed at https://gravitee-apim.mycompany.io/portal
     **/
    public readonly baseNomsDomainesMyPOOType: string;

    constructor (
      name: string,
      args: MyPOOTypeArgs
    ) {
      super(`valueofContructorParamOne`, args)


      this.paramOne = "graviteeio";

      const something = 'ccc';


    }


  }

}
