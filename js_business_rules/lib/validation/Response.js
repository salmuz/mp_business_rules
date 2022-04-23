/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
'use strict'
const utils = require('../utils')

class Response {
  constructor (message, isOk) {
    if (this.constructor === Response) {
      throw new TypeError("Can't create an instance of an interface.")
    }
    this.message = message
    this.isOk = isOk
    this.__guid = utils.guid()
  }

  isOK () {
    throw new TypeError('Method of Response interface is not implemented.')
  }

  getMessage () {
    throw new TypeError('Method of Response interface is not implemented.')
  }

  get guid () {
    return this.__guid
  }

  static get OK () {
    return ResponseOK.instance
  }

  static get FAILED () {
    return ResponseFailed.instance
  }
}

const singleton = Symbol()
const singletonEnforcer = Symbol()

/**
 * Creation of singleton pattern on the ResponseOK and ResponseFailed
 * source: https://medium.com/@dmnsgn/singleton-pattern-in-es6-d2d021d150ae
 */
class ResponseOK extends Response {
  constructor (enforcer) {
    super('Ok Validation', true)
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot construct singleton')
    }
  }

  static get instance () {
    if (!this[singleton]) {
      this[singleton] = new ResponseOK(singletonEnforcer)
    }
    return this[singleton]
  }

  isOK () {
    return this.isOk
  }
  getMessage () {
    return this.message
  }
  toString () {
    return '[ResponseOk Ok]'
  }
}

class ResponseFailed extends Response {
  constructor (enforcer) {
    super('Failed Generally Error', false)
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot construct singleton')
    }
  }

  static get instance () {
    if (!this[singleton]) {
      this[singleton] = new ResponseFailed(singletonEnforcer)
    }
    return this[singleton]
  }

  isOK () {
    return this.isOk
  }
  getMessage () {
    return this.message
  }
  toString () {
    return '[ResponseFailed Failed]'
  }
}

module.exports = Response
