import Argument from './argument';
import Option from './option';

class Command {

  constructor(name) {
    this._name = name;
    this._arguments = [];
    this._options = [];

    this._configure();

    if (!this._name) {
      throw new Error('Command cannot have an empty name');
    }
  }

  _configure() {
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  /** @returns {Array.<Argument>} */
  get arguments() {
    return this._arguments;
  }

  /** @returns {Array.<Option>} */
  get options() {
    return this._options;
  }

  run() {
    throw new Error(`Method run() needs to be implemented for Command ${this.name}`)
  }

  /**
   * Creates and attaches a new Argument to this Command
   *
   * @param {String} name Name for this argument
   * @param {Number} [options] Config options. One of the ARG_* constants.<br>
   *                         Defaults to ARG_OPTIONAL
   * @param {String} description Description to show in help()
   * @param {*} def Default value for this argument
   */
  addArgument(
    name,
    options = null,
    description = '',
    def = null
  ) {
    this._arguments.push(new Argument(name, options, description, def));
  }

  /**
   * Creates and attaches a new Option to this Command
   *
   * @param {String} name Can be passed w/ or w/o '--' prefixed
   * @param {String} shortcut One-character string to be used as short-hand name
   * @param {Number} options Config options. One of the OPT_* constants.<br>
   *                         Defaults to OPT_EMPTY
   * @param {String} description Descirption to show in help()
   * @param {*} def Default value for this option
   */
  addOption(
    name,
    shortcut,
    options,
    description = '',
    def = null
  ) {
    this._options.push(new Option(name, shortcut, options, description, def));
  }
}

export default Command
