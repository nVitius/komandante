import Debug from 'debug'
import Minimist from 'minimist'

import Command from './command'
import Loader from './loader'


const debug = new Debug('ordre:cli:')

class CLI {
  /**
   * @param {String} root
   * @param {String} dir
   */
  constructor(root, dir) {
    debug(`Creating CLI in ${root} under ${dir}`)

    /**
     * @type {Loader}
     * @name CLI#_loader
     * @private
     */
    this._loader = new Loader(root, dir)

    /**
     * @type {Array<Command>}
     * @name CLI#_commands
     * @private
     */
    this._commands = this._loader.commands

    /**
     * @type {Object}
     * @name CLI#_cliArgs
     * @private
     */
    this._cliArgs = Minimist(process.argv.slice(3)) // 2 is the command name
    debug(this._cliArgs)

    /**
     * @type {Command}
     * @name CLI#_activeCommand
     * @private
     */
    this._activeCommand = null
  }

  /**
   * @param {String} name Name of the command to run.
   *                      Defaults to first node argument. (i.e. node cli.js <b>foo:say</b>)
   */
  run(name = process.argv[2]) {
    debug(`Running command: ${name}`)

    if (!(name in this._commands)) {
      throw new Error('Command does not exist!')
    }

    this._activeCommand = this._commands[name]
    this._parse()

    const result = this._activeCommand.run()

    return result.__proto__ && result.__proto__.hasOwnProperty('then')
      ? Promise.resolve(result)
      : result
  }

  _parse() {
    if (this._activeCommand === null) {
      throw new Error('No active command')
    }

    // TODO: loop over arguments and assign values
    let argCount = 0

    // parse all arguments
    this._activeCommand.arguments.forEach(argument => {
      let value

      if (this._cliArgs._[argCount] === undefined) {
        if (argument.isRequired()) {
          throw new Error(`Missing required argument: ${argument.name}`)

        }

        return
      }

      if (argument.isArray()) {
        argument.value = this._cliArgs._.slice(argCount)

      } else {
        argument.value = this._cliArgs._[argCount]

      }

      debug(`Assigned value ${argument.value} to argument ${argument.name}`)
      argCount++
    })

    this._activeCommand.options.forEach(option => {
      let value
      if (option.name in this._cliArgs) {
        option.value = this._cliArgs[option.name]

      } else if (option.shortcut in this._cliArgs) {
        option.value = this._cliArgs[option.shortcut]

      } else {
        return

      }

      debug(`Assigned value ${option.value} to option ${option.name}`)
    })

  }
}

export default CLI
