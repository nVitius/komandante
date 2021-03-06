import Debug from 'debug'
import * as fs from 'fs'
import * as path from 'path'

import Command from './command'


const debug = new Debug('ordre:loader:')

export default class Loader {
  /**
   * @param {String} root Root-directory of project
   * @param {String} dir Sub-directory with Commands
   */
  constructor(root, dir) {
    this._root = root
    this._dir = dir
    this._commands = []

    this._load()
  }

  /**
   * Recurse through `this._dir` for Commands.
   * Must contain 'Command' (i.e. FooCommand.js)
   *
   * @param {String} absolutePath Absolute path of directory w/ Commands
   * @private
   */
  _load(absolutePath = path.join(this._root, this._dir)) {
    debug(`Looking for Commands in ${absolutePath}`)

    fs.readdirSync(absolutePath).forEach((file) => {
      debug(`Checking ${file}`)
      if (fs.statSync(path.join(absolutePath, file)).isDirectory()) {
        this._load(path.join(absolutePath, file))

        return
      }

      if (file.indexOf('Command') === -1) {
        return
      }

      let temp = require(path.join(absolutePath, file))
      if (temp.__esModule) {
        temp = temp.default
      }

      /**
       * @type {Command}
       */
      let command

      try {
        command = new temp()
      } catch (e) {
        if (e instanceof TypeError) {
          throw new Error(`Error when trying to instantiate class for file: ${file}. Did you export the class? \n ${e.message}`)
        }

        throw e
      }

      if (!(command instanceof Command)) {
        throw new Error(`Commands must extend Ordre.Command: ${absolutePath}`)
      }

      this._commands[command.name] = command
    })
  }

  get commands() {
    return this._commands
  }
}
