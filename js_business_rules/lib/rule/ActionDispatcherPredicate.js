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
const ActionDispatcher = require("./ActionDispatcher");
const logger = require('../loggings').logger('BusinessRuleDispatcher');

/**
 * Class for dispatching a method later validations
 */
class ActionDispatcherPredicate extends ActionDispatcher{

  constructor(predicate, ...supplemental){
    super();
    this.predicate = predicate;
    this.supplemental = supplemental;
  }

  /**
   * In this method, we update the candidate by adding some
   * information that will be useful for knowing the reason
   * of the validation.
   * @param candidate
   */
  fire(...candidate){
    logger.debug("Dispatch the function predicate:", this.predicate.toString());
    Array.prototype.push.apply(candidate, this.supplemental);
    this.predicate.apply(this.predicate, candidate);
  }
}

module.exports = ActionDispatcherPredicate;