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
/**
 *
 * @param baseClass
 * @param mixins
 * @return {base}
 */
exports.aggregation = function (baseClass, mixins) {
  var base = function () {
    baseClass.apply(this, arguments);
    mixins.forEach(function (mixin) {
      mixin.prototype.initializer.call(this);
    }.bind(this));
  };
  base.prototype = Object.create(baseClass.prototype);
  base.prototype.constructor = base;
  var copyProps = function (candidate, source) {
    Object.getOwnPropertyNames(source).forEach(function (prop) {
      if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
        return;
      Object.defineProperty(candidate, prop, Object.getOwnPropertyDescriptor(source, prop))
    })
  };
  mixins.forEach(function (mixin) {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};