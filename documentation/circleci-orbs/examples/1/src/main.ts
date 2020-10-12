import * as shelljs from 'shelljs';


const CCI_CLI_RUN_ORB_CMD: string=`${process.env.CCI_CLI_BINARY} run src/orb/orb.yml`
if (shelljs.exec(CCI_CLI_RUN_ORB_CMD).code !== 0) { // synchrone sleep to simulate waiting for Pipeline execution to complete. (RxJS Subscription)
  shelljs.echo('Error running Orb ');
  shelljs.exit(1);
}
