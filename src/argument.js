export const ARG_REQUIRED = 2;
export const ARG_OPTIONAL = 4;
export const ARG_ARRAY = 8;

export default class Argument {
  /**
   * @param {String} name Name for this argument
   * @param {Number} [options] Config options. One of the ARG_* constants.<br>
   *                         Defaults to ARG_OPTIONAL
   * @param {String} [description] Description to show in help()
   * @param {*} [def] Default value for this argument
   */
  constructor(
    name,
    options,
    description = '',
    def = null
  ) {
    if (name === null) {
      throw new Error('Argument mame cannot be empty.');
    }

    if (options === null) {
      options = ARG_OPTIONAL;
    }

    if (options < 2 || options > 14) {
      throw new Error(`Invalid options for Argument: ${name}`);
    }

    this._name = name;
    this._options = options;
    this._description = description;
    this._def = def;
  }
}
