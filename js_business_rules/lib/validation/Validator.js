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
'use strict';
const utils = require("../utils");

class Validator{

  /**
   *
   * @param specification
   * @param response the failed response for the validator
   */
  constructor(specification, responseFailed) {
    if (this.constructor === Validator) {
      throw new TypeError("Can't create an instance of an interface.");
    }
    this.specification = specification;
    this.responseFailed = responseFailed;
    this.__guid = utils.guid()
  }

  /**
   * In this function we must manage all type error, exception or parse error,
   * because of the candidate given in bad format.
   * We can use of assert exception and return a Response.FAILED general.
   * @return a class Response
   */
  validate(){
    throw new TypeError("Method of Validator interface is not implemented.");
  }

  get guid(){
    return this.__guid;
  }

  toString(){
    return '[Interface Validator]';
  }

}

module.exports = Validator;