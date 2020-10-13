import "./lib/env";
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
orbRunner.run();
