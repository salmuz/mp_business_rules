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
const IBusinessRule = require('./IBusinessRule');
const IBusinessHandler = require('./IBusinessHandler');
const aggregation = require('../ecmas6').aggregation;
const logger = require('../loggings').logger('BusinessRuleDispatcher');

class BusinessRuleDispatcher extends aggregation(IBusinessRule, IBusinessHandler) {

  /**
   *
   * @param validator
   * @param action
   */
  constructor(validator, action){
    super(validator, action);
  }

  evaluate(...candidate){
    logger.debug("[Target to evaluate for the rule validation]", candidate);
    return this.validator.isValidate.apply(this.validator, candidate);
  }

  handleValidation(...candidate){
    let response = this.evaluate.apply(this, candidate);
    logger.debug("Response getting later to apply the validator :", response);
    if(response.isOK()){
      this.action.fire.apply(this.action, candidate);
    }else {
      if(this.successor) return this.successor.handleValidation.apply(this.successor, candidate);
    }
    return response;
  }

}

module.exports = BusinessRuleDispatcher;