import * as shelljs from 'shelljs';
import * as fs from 'fs';

export interface CircleCISecrets {
  circleci: {
    auth: {
      username: string,
      token: string
    }
  }
}
/**
 *
 * Mimics the official Circle CI cLient, only much simpler, and with [RxJS]
 * Circle CI API v2 based
 **/
export class CciCLIRunner {
  private secrets: CircleCISecrets;

  constructor() {
    this.loadCircleCISecrets();
    let CCI_CLI_CMD: string =`${process.env.CCI_CLI_BINARY} setup --token "${this.secrets.circleci.auth.token}" --host ${process.env.CCI_SERVER} --no-prompt`
    if (shelljs.exec(CCI_CLI_CMD).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
      throw new Error('Error setting up Circle CI CLI Orb ');
      // shelljs.exit(1);
    }
  }

  loadCircleCISecrets () : void { ///     private secrets: CircleCISecrets;
    /// first load the secretfile

    let secretFileAsString: string = fs.readFileSync(process.env.CCI_SECRETS_FILE_PATH,'utf8');
    this.secrets = JSON.parse(secretFileAsString);
  }

    /**
     * Runs all Shell commands for the Dev cycle of a Circle CI Orb
     *
     * -----
     *
     *
     * @returns any But it actually is an Observable Stream of the HTTP response you can subscribe to.
     **/
    run(): void {
      console.log(` === (Circle CI CLI Binary in use is [${process.env.CCI_CLI_BINARY}])`)

      console.log(` === Packing the Circle CI Orb`)
      let CCI_CLI_CMD: string=`${process.env.CCI_CLI_BINARY} config pack src/orb`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
        shelljs.echo('Error packing Orb with [FYAML](https://github.com/CircleCI-Public/fyaml) Standard ');
        shelljs.exit(1);
      }

      console.log(` === Validating the packed Circle CI Orb`)
      CCI_CLI_CMD =`${process.env.CCI_CLI_BINARY} orb validate src/orb/orb.yml`
      if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
        shelljs.echo('Error validating Orb ');
        shelljs.exit(1);
      }

    }


}
