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
const isString = function(value) {
  return typeof value === 'string';
};

/**
 *
 * @param baseClass
 * @param mixins
 * @returns {_Combined}
 */
exports.aggregation = (baseClass, ...mixins) => {
  let base = class _Combined extends baseClass {
    constructor (...args) {
      super(...args);
      mixins.forEach((mixin) => {
        if(mixin.prototype.$$constructorMixin)
          mixin.prototype.$$constructorMixin.call(this);
      })
    }
  };
  let copyProps = (candidate, source) => {
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (isString(prop) && prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
          return;
        Object.defineProperty(candidate, prop, Object.getOwnPropertyDescriptor(source, prop));
      });
  };
  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype)
    copyProps(base, mixin)
  });
  return base
};