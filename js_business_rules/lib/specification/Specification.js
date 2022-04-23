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
const ISpecification = require('./ISpecification');
const logger = require('../loggings').logger("Specification");

/**
 * The `Specification` abstract class is a extension of `ISpecification` interface.
 * We added several specification generals as such :
 * (1) And : `Conjunction`
 * (2) Or : `Disjunction`
 * (3) Not : `Negation`
 */
class Specification extends ISpecification{

  constructor() {
    super();
    if (this.constructor === Specification) {
      throw new TypeError("Can't create an instance of an abstract class.");
    }
  }

  isSatisfiedBy(...candidate){
    throw new TypeError("Can't call a abstract method(isSatisfiedBy).");
  }

  /**
   * Returns a new conjunction between the specification actual and
   * a new specification `other`.
   * @param other
   * @return {AndSpecification}
   */
  and(other){
    return new AndSpecification(this, other);
  }

  /**
   * Returns a new disjunction between the specification actual and
   * a new specification `other`.
   * @param other
   * @return {OrSpecification}
   */
  or(other){
    return new OrSpecification(this, other);
  }

  /**
   * Returns a new negation specification composed from the specification actual
   * @return {NotSpecification}
   */
  not(){
    return new NotSpecification(this);
  }

  /**
   * Creates the conjunction specifications
   * @param other
   * @param others
   * @return {AndSpecification}
   */
  all(other, ...others){
    logger.debug("Number of conjunctions:", others.length + 1)
    let specification = new AndSpecification(this, other);
    others.forEach(function(andOther){
      specification = specification.add(andOther);
    });
    return specification;
  }

  /**
   * Creates the disjunction specifications
   * @param other
   * @param others
   * @return {AndSpecification}
   */
  any(other, ...others){
    logger.debug("Number of disjunction:", others.length + 1)
    let specification = new OrSpecification(this, other);
    others.forEach(function(andOther){
      specification = specification.or(andOther);
    });
    return specification;
  }
}

class AndSpecification extends Specification{

  constructor(left, right){
    super();
    this.leftCondition = left;
    this.rightCondition = right;
  }

  isSatisfiedBy(...candidate){
    logger.debug("[AndSpecification] with (left, right, candidate)", this.leftCondition, this.rightCondition, candidate);
    return this.leftCondition.isSatisfiedBy.apply(this.leftCondition, candidate) &&
     this.rightCondition.isSatisfiedBy.apply(this.rightCondition, candidate);
  }
}

class OrSpecification extends Specification{

  constructor(left, right){
    super();
    this.leftCondition = left;
    this.rightCondition = right;
  }

  isSatisfiedBy(...candidate){
    logger.debug("[OrSpecification] with (left, right, candidate)", this.leftCondition, this.rightCondition, candidate);
    return this.leftCondition.isSatisfiedBy.apply(this.leftCondition, candidate) ||
     this.rightCondition.isSatisfiedBy.apply(this.rightCondition, candidate);
  }
}

class NotSpecification extends Specification{

  constructor(condition){
    super();
    this.notCondition = condition;
  }

  isSatisfiedBy(...candidate) {
    logger.debug("[NotSpecification] with (not, candidate)", this.notCondition, candidate);
    return !this.notCondition.isSatisfiedBy.apply(this.notCondition, candidate)
  }
}

module.exports = Specification;