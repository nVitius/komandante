import Argument from './argument'
import Option from './option'

class Command {

  /**
   * @param {String} name
   */
  constructor(name) {
    this._name = name

    /**
     * @type {Map<String, Argument>}
     * @private
     */
    this._arguments = new Map()

    /**
     * @type {Map<String, Option>}
     * @private
     */
    this._options = new Map()

    this._configure()

    if (!this._name) {
      throw new Error('Command cannot have an empty name')
    }
  }

  _configure() {
  }

  /** @param {String} name */
  set name(name) {
    this._name = name
  }

  /** @returns {String} */
  get name() {
    return this._name
  }

  /** @returns {Map<String, Argument>} */
  get arguments() {
    return this._arguments
  }

  /** @returns {Map<String, Option>} */
  get options() {
    return this._options
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
    const newArgument = new Argument(name, options, description, def)

    for (const argument in this.arguments.values()) {
      if (newArgument.isRequired() && argument.isOptional()) {
        throw new Error('Cannot specify an ARG_REQUIRED after ARG_OPTIONAL')
      }

      if (argument.isArray()) {
        throw new Error('Cannot add another Argument after an ARG_ARRAY')
      }
    }

    this.arguments.set(name, newArgument)
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
    if (name.indexOf('--') === 0) {
      name = name.substr(2)
    }

    this.options.set(name, new Option(name, shortcut, options, description, def))
  }
}

export default Command
