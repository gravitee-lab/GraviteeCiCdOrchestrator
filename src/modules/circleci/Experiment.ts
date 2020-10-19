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
import * as rxjs from 'rxjs';
import { CircleCIClient } from '../../modules/circleci/CircleCIClient'
import { CircleCISecrets } from '../../modules/circleci/CircleCISecrets'
import { map, tap, retryWhen, delayWhen,delay,take } from 'rxjs/operators';
import * as axiosLib from 'axios';
import axiosCancel from 'axios-cancel';
/**
 * https://www.tutorialspoint.com/rxjs/rxjs_observables.htm
 * https://www.devglan.com/javascript/rxjs-tutorial
 * https://itnext.io/angular-6-7-rxjs-6-in-depth-tutorial-example-83e897e5699
 * https://xgrommx.github.io/rx-book/index.html
 **/
export class Experiment {

  private someObserver: MyObserver;
  private someSubject: rxjs.Subject<number>;

  constructor() {
    this.someSubject = new rxjs.Subject<number>();
  }

  public testIt() {
    this.someObserver;
    this.someSubject.subscribe({
      next: (data) => {

      },
      error: (error) => {

      },
      complete: () => {

      }
    })
    this.someSubject.subscribe();
  }

}

export class MyDummyClassA {

  public readonly name: string;
  public readonly age: number;
  constructor() {
    this.name = "jean"
    this.age = 45;
  }

}


export class MyObserver implements rxjs.Observer<CircleCIClient> {

  public next(data: CircleCIClient) {

  }

  public error(error: CircleCIClient) {

  }

  public complete() {

  }

}

/**
 * Voilà un Subscriber à proprement parler.
 **/
export class MySubscriber extends rxjs.Subscriber<CircleCIClient> {

  public next(data: CircleCIClient) {

  }
  public error(error: CircleCIClient) {

  }
  public complete() {

  }
}


// adds cancel prototype method
/// axiosCancel( axios );
///class AxiosSubscriber extends rxjs.Subscriber<axiosLib.AxiosResponse<any>> { /// MyDummyClassA
class AxiosSubscriber extends rxjs.Subscriber<MyDummyClassA> { ///

    private completed: boolean;
    constructor( observer ) {
        super( observer );

        // observer.next( 'HELLO' );
        // observer.complete();
        this.completed = false;
        // make axios request on subscription
        let config = {
          headers: {
            "Accept": "application/json"
          }
        };
        axiosLib.default.get('https://randomuser.me/api', config)
        .then( ( response ) => {
            observer.next( response.data );
            this.completed = true;
            observer.complete();
        } )
        .catch( ( error ) => {
            this.completed = true;
            observer.error( error );
        } );
    }
    next: (data) => {
    }
    unsubscribe() {
        console.log( 'unsubscribed' );
        super.unsubscribe();
    }
}
