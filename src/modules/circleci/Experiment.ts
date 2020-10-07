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
