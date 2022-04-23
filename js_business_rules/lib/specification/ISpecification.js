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
/**
 *  Interface ISpecification for creating constraints customized
 *
 *  If we would to create a simple constraint to validate a candidate specific,
 *  we could to inherit of this interface and implement to `isSatisfiedBy` method.
 */
class ISpecification {

  constructor() {
    if (this.constructor === ISpecification) {
      throw new TypeError("Can't create an instance of an interface.");
    }
  }

  /**
   * This function must verify if the candidate satisfies ours constraints.
   * We can create our own constraints (or business rule) for a type of candidate.
   * Example:
   *  (1) If a client has to the money for buying something.
   * @param candidate value to validate
   */
  isSatisfiedBy(...candidate){
    throw new TypeError("Can't call a interface method.");
  }
}

module.exports = ISpecification;