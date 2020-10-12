import "./lib/env";
import * as runner from './runner/runner';
import * as shelljs from 'shelljs';


/// Will validate the Circle CI Pipeline for this Orb Project
console.log(` === Current Folder `)
let PRE_CMD: string =`pwd && tree src/ && ls -allh .`
if (shelljs.exec(PRE_CMD).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
  shelljs.echo('Error valdiating Orb ');
  shelljs.exit(1);
}
console.log(` === Validating  the Circle CI Pipeline for this Circle CI Orb Project [.circleci/config.yml]`)
let CCI_CLI_CMD: string =`${process.env.CCI_CLI_BINARY} config validate`
if (shelljs.exec(CCI_CLI_CMD).code !== 0) {
  shelljs.echo(' !! Error validating  the Circle CI Pipeline for this Circle CI Orb Project [.circleci/config.yml] (have you edited it?)');
  shelljs.exit(1);
}

let orbRunner: runner.CciCLIRunner = new runner.CciCLIRunner();
orbRunner.run();
