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

const {
  BusinessRuleDispatcher,
  Specification,
  Validator,
  Response,
  ResponseBase,
  ActionDispatcher
} = require('../index')
const assert = require('assert')
const logger = require('../lib/loggings').logger('TestBusinessRules')

class SimpleResponse extends ResponseBase {

}

class CookiesCheckRule extends Specification {
  isSatisfiedBy (candidate, expected) {
    return true
  }
}

class PriceSpreadIntRule extends Specification {
  constructor (spread) {
    super()
    this.spread = spread
  }

  isSatisfiedBy (current, update) {
    let greaterThan = new PriceGreaterThan(this.spread)
    let lowerThan = new PriceLowerThan(this.spread)
    return lowerThan.and(greaterThan).isSatisfiedBy(current, update)
  }
}

class PriceGreaterThan extends PriceSpreadIntRule {
  constructor (spread) {
    super(spread)
  }
  isSatisfiedBy (current, update) {
    let lower = current * (1 - this.spread)
    logger.debug(`Is update price greater than ${update} >= ${lower}`)
    return update >= lower
  }
}

class PriceLowerThan extends PriceSpreadIntRule {
  constructor (spread) {
    super(spread)
  }
  isSatisfiedBy (current, update) {
    let upper = current * (1 + this.spread)
    logger.debug(`Is update price less than ${update} <= ${upper}.`)
    return update <= upper
  }
}

class ValidationPrice extends Validator {
  constructor (specification) {
    super()
    this.specification = specification
  }

  isValidate (current, update) {
    try {
      assert(typeof current === 'number' && typeof update === 'number')
      let FAILED = new SimpleResponse(
        'Price ' + update + ' has not passed validations',
        false
      )
      return this.specification.isSatisfiedBy(current, update)
        ? Validator.Response.OK
        : FAILED
    } catch (e) {
      logger.debug(
        'ValidationPrice Exception [current, update] ' + e,
        current,
        update
      )
      logger.error(e)
      return Response.FAILED
    }
  }
}

class PriceUntrustedAction extends ActionDispatcher {
  fire () {
    console.log('Re-executed!')
  }
}

var specification = new PriceSpreadIntRule(0.17)
var validation = new ValidationPrice(specification)
var action = new PriceUntrustedAction()

var businessRule = new BusinessRuleDispatcher(validation, action)
businessRule.nextSuccesor(new BusinessRuleDispatcher(validation, action))
console.log('---->', businessRule.handleValidation(10, 14))
