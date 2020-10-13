import * as yargsLib from 'yargs';

export class GNUOptions {

  public readonly argv;

  constructor(){

    let init_option_desc = "\n\n" +`Set to true to init a new orb project. This will generate an Org Source code from the Circle CI generic template for an Orb, in the 'orb/' folder. Defaults to false`
    init_option_desc += "\n\n"

    this.argv = yargsLib.options({
      'init': { type: 'boolean', default: false, demandOption: false, desc: `${init_option_desc}`, alias: 'i' },
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
