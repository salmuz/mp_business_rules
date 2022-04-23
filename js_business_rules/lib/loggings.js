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

const dateFormat = require('./utils');

exports.logger = function (classOrFileJs) {

  let _factory = Object.create(null);
  let isEnable = !process.env.APP_DEBUG ? false : (process.env.APP_DEBUG === "true");

  if (!classOrFileJs)
    throw new Error("It's necessary define a class or file javascript for the trace log.")

  let message = function (msg, now) {

    let __stackFunc = function () {
      let orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function (_, stack) {
        return stack;
      };
      let err = new Error;
      Error.captureStackTrace(err, __stackFunc);
      let stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    };

    let __stack = __stackFunc();
    let __nameFnc = __stack[2].getFunctionName() || "Anonymous()";

    if (msg instanceof Error) msg = msg.stack || msg.message;
    let _lnFnc = "\x1b[36m[" + __stack[2].getLineNumber() + ":" + __nameFnc + "]:\x1b[0m";
    return (_lnFnc + "\x1b[32m[DEBUG:" + now + "]:\x1b[0m" + (!msg ? "" : msg));
  };

  let nestedDebug = function () {
    console.log.apply(console, arguments);
  };

  let printDebug = function (msg) {
    let _nb_args = Object.keys(arguments['1']).length;
    if (_nb_args > 1) {
      let args = Array.prototype.slice.call(arguments[1]);
      nestedDebug(msg, args.slice(1, args.length));
    } else {
      nestedDebug(msg);
    }
  };

  // Override the methode debug by debuging object javascript file
  _factory.debug = function (msg) {
    let now = dateFormat.nowDateFormat("yyyy-mm-dd h:MM:ss");
    printDebug("\x1b[31m[DEBUG]\x1b[0m" + "\x1b[36m[" + classOrFileJs + "]\x1b[0m" + message(msg, now), arguments)
  };

  _factory.error = function (err) {
    let now = dateFormat.nowDateFormat("yyyy-mm-dd h:MM:ss");
    printDebug("\x1b[31m[ERROR]\x1b[0m" + "\x1b[36m[" + classOrFileJs + "]\x1b[0m" + message(err, now), arguments)
  };

  _factory.info = function (msg) {
    let now = dateFormat.nowDateFormat("yyyy-mm-dd h:MM:ss");
    printDebug("\x1b[31m[INFO]\x1b[0m" + "\x1b[36m[" + classOrFileJs + "]\x1b[0m" + message(msg, now), arguments)
  };

  if (!process.env.APP_DEBUG || !isEnable) {
    _factory.debug = function () {
    };
  }

  return _factory;
}
