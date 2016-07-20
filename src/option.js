export const OPT_REQUIRED = 2;
export const OPT_OPTIONAL = 4;
export const OPT_ARRAY = 8;
export const OPT_EMPTY = 16;

export default class Option {

  /**
   * @param {String} name Name for this Option
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

    if (this.isEmpty() && this.isArray()) {
      throw new Error('Cannot use OPT_EMPTY together w/ OPT_ARRAY');
    }

    if (this.isEmpty() && this.isRequired()) {
      throw new Error('Cannot use OPT_EMPTY together w/ OPT_REQUIRED');
    }

    this._name = name;
    this._shortcut = shortcut;
    this._options = options;
    this._description = description;

    this.value = def;
  }

  set value(value) {
    if (this.isEmpty() && (value !== null || typeof value !== 'undefined')) {
      throw new Error(`Option value passed for OPT_EMPTY: ${this._name}`);
    }

    if (this.isRequired() && (value === null || typeof value === 'undefined')) {
      throw new Error(`Option value omitted for OPT_REQUIRED: ${this._name}`);
    }

    if (this.isEmpty() && (value === null || typeof value === 'undefined')) {
      value = false;
    }

    if (this.isArray() && !(value instanceof Array)) {
      value = [value];
    }

    this._value = value;
  }

  isRequired() {
    return (this._options & OPT_REQUIRED) === OPT_REQUIRED;
  }

  isOptional() {
    return (this._options & OPT_OPTIONAL) === OPT_OPTIONAL;
  }

  isArray() {
    return (this._options & OPT_ARRAY) === OPT_ARRAY;
  }

  isEmpty() {
    return (this._options & OPT_EMPTY) === OPT_EMPTY;
  }
}
