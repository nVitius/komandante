import Debug from 'debug'
import Loader from './loader';

import Ordre from './exports';

const debug = new Debug('ordre:cli:');

export default class CLI {
  /**
   * @param {String} root
   * @param {String} dir
   */
  constructor(root, dir) {
    debug(`Creating CLI in ${root} under ${dir}`);

    this._loader = new Loader(root, dir);

    /**
     * @type {Array <Ordre.Command>}
     */
    this._commands = this._loader.commands;
  }

  /**
   *
   * @param {String} name Name of the command to run.
   *                      Defaults to first node argument. (i.e. node cli.js <b>foo:say</b>)
   */
  run(name = process.argv[2]) {
    debug(`Running command: ${name}`);

    if (!(name in this._commands)) {
      throw new Error('Command does not exist!');
    }

    this._commands[name].run();
  }
}
