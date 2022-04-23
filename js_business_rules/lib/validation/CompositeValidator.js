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
const aggregation = require('../ecmas6').aggregation;
const CompositeResponse = require('./CompositeResponse');
const Validator = require('./Validator');

class CompositeValidator extends aggregation(Validator, Array){

  constructor(){
    super();
    let __super = this;
    Array.prototype.slice.apply(arguments).forEach(
     function (response){
       if (!(response instanceof Validator))
         throw Error('One of the arguments isn\'t a Validator object');
       __super.push(response)
     }
    );
  }

  push(validator) {
    if (!(validator instanceof Validator))
      throw Error('One of the arguments isn\'t a specification object');
    super.push(validator);
  }

  isValidate(current, update){
    let compositeResponse = new CompositeResponse();
    this.forEach(function(validator){
      let response = validator.isValidate(current, update);
      if(!response.isOK())
        compositeResponse.push(response)
    });
    return compositeResponse;
  }
}

module.exports = CompositeValidator;