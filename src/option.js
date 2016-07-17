export const OPT_REQUIRED = 2;
export const OPT_OPTIONAL = 4;
export const OPT_ARRAY = 8;
export const OPT_EMPTY = 16;

export default class Option {

  /**
   * @param {String} name Can be passed w/ or w/o '--' prefixed
   * @param {String} shortcut One-character string to be used as short-hand name
   * @param {Number} options Config options. One of the OPT_* constants.<br>
   *                         Defaults to OPT_EMPTY
   * @param {String} description Descirption to show in help()
   * @param {*} def Default value for this option
   */
  constructor(
    name,
    shortcut,
    options,
    description = '',
    def = null
  ) {
    if (name === null) {
      throw new Error('Option mame cannot be empty.');
    }

    if (typeof shortcut === 'undefined' || shortcut === '') {
      shortcut = null;
    }

    if (!options) {
      options = OPT_EMPTY;
    }

    if (options < 2 || options > 30) {
      throw new Error(`Invalid options for Option: ${name}`);
    }

    this._name = name;
    this._shortcut = shortcut;
    this._options = options;
    this._description = description;
    this._def = def;

    if ((this._options & OPT_ARRAY) === OPT_ARRAY && (this._options & OPT_EMPTY) === OPT_EMPTY) {
      throw new Error('Cannot use OPT_ARRAY together w/ OPT_EMPTY');
    }
  }
}
