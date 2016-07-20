import Debug from 'debug'
import Minimist from 'minimist';

import Command from './command';
import Loader from './loader';


const debug = new Debug('ordre:cli:');

class CLI {
  /**
   * @param {String} root
   * @param {String} dir
   */
  constructor(root, dir) {
    debug(`Creating CLI in ${root} under ${dir}`);

    /**
     * @type {Loader}
     * @name CLI#_loader
     * @private
     */
    this._loader = new Loader(root, dir);

    /**
     * @type {Array<Command>}
     * @name CLI#_commands
     * @private
     */
    this._commands = this._loader.commands;

    /**
     * @type {Object}
     * @name CLI#_cliArgs
     * @private
     */
    this._cliArgs = Minimist(process.argv.slice(3)); // 2 is the command name
    debug(this._cliArgs);

    /**
     * @type {Command}
     * @name CLI#_activeCommand
     * @private
     */
    this._activeCommand = null;
  }

  /**
   * @param {String} name Name of the command to run.
   *                      Defaults to first node argument. (i.e. node cli.js <b>foo:say</b>)
   */
  run(name = process.argv[2]) {
    debug(`Running command: ${name}`);

    if (!(name in this._commands)) {
      throw new Error('Command does not exist!');
    }

    this._activeCommand = this._commands[name];
    this._parse();

    this._activeCommand.run();
  }

  _parse() {
    if (this._activeCommand === null) {
      throw new Error('No active command');
    }

    // TODO: loop over arguments and assign values
    let argCount = 0;

    // parse all arguments
    for (let name in this._activeCommand.arguments) {
      if(!this._activeCommand.arguments.hasOwnProperty(name)) continue;

      const argument = this._activeCommand.arguments[name];

      let value;
      if (argument.isArray()) {
        value = this._cliArgs._.slice(argCount);

      } else {
        value = this._cliArgs._[argCount];

      }

      debug(`Assign value ${value} to argument ${argument.name}`);
      argument.value = value;
      argCount++;
    }

    for (let name in this._activeCommand.options) {
      if(!this._activeCommand.options.hasOwnProperty(name)) continue;

      const option = this._activeCommand.options[name];

      let value;
      if (option.name in this._cliArgs) {
        value = this._cliArgs[option.name];

      } else if (option.shortcut in this._cliArgs) {
        value = this._cliArgs[option.shortcut];

      } else {
        return;

      }

      debug(`Asssigning value ${value} to option ${option.name}`);
      option.value = value;
    }

  }
}

export default CLI;
