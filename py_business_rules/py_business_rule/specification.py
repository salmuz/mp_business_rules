# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

from typing import Any, Dict
from types import FunctionType
from functools import wraps

__all__ = ["Specification"]


def _add_error(spec: "Specification", supplementary: str = ""):
    return {
        spec.__class__.__name__:
            supplementary + getattr(spec, "description", "No description")
    }


def _decorator_stack_errors(func):
    @wraps(func)
    def wrap_stack_error_messages(self, *args, **kwargs):
        result = func(self, *args, **kwargs)
        self.__is_checked_candidate__ = True
        self.stack_error_messages(result)
        return result
    
    return wrap_stack_error_messages


class SpecificationMeta(type):
    def __new__(mcs, cls_name, cls_bases, cls_attributes: Dict[str, Any]):
        super_new = super(SpecificationMeta, mcs).__new__(mcs, cls_name,
                                                          cls_bases,
                                                          cls_attributes)
        name_method = "is_satisfied_by"
        if hasattr(super_new, name_method) and \
                type(getattr(super_new, name_method)) == FunctionType:
            super_new.is_satisfied_by = _decorator_stack_errors(
                super_new.is_satisfied_by
            )
            setattr(super_new, "__is_checked_candidate__", False)
        return super_new


class Specification(metaclass=SpecificationMeta):
    
    def __init__(self):
        self.report_errors = {}
    
    def is_executed_satisfied_by(self):
        return getattr(self, "__is_checked_candidate__", False);
    
    def stack_error_messages(self, result):
        if not result and self.is_executed_satisfied_by():
            if isinstance(self, Specification):
                self.report_errors.update(_add_error(self))
            else:
                raise NotImplementedError()
        return self.report_errors
    
    def is_satisfied_by(self, candidate: any) -> bool:
        raise NotImplementedError()
    
    def __and__(self, spec: "Specification") -> "AndSpecification":
        return AndSpecification(self, spec)
    
    def __or__(self, spec: "Specification") -> "OrSpecification":
        return OrSpecification(self, spec)
    
    def __invert__(self) -> "NotSpecification":
        return NotSpecification(self)
    
    def __call__(self, candidate: any):
        return self.is_satisfied_by(candidate)


class UnarySpecification(Specification):
    
    def __init__(self, spec: Specification):
        super().__init__()
        self._spec = spec
    
    def is_satisfied_by(self, candidate: any) -> bool:
        raise NotImplementedError()
    
    def stack_error_messages(self, result):
        if not result and self.is_executed_satisfied_by():
            return _add_error(self._spec)
        return {}


class MultarySpecification(Specification):
    
    def __init__(self, *specifications):
        super().__init__()
        self._specs = specifications
    
    def stack_error_messages(self, result):
        if not result:
            for spec in self._specs:
                self.report_errors = {**self.report_errors,
                                      **spec.report_errors}
    
    def stack_error_messages(self, result):
        if not result and not self.report_errors and \
                self.is_executed_satisfied_by():
            for spec in self._specs:
                if isinstance(spec, MultarySpecification):
                    self.report_errors.update(spec.stack_error_messages(result))
                elif isinstance(spec, UnarySpecification):
                    self.report_errors.update(spec.stack_error_messages(result))
                else:
                    self.report_errors.update(spec.report_errors)
        return self.report_errors
    
    def is_satisfied_by(self, candidate: any) -> bool:
        raise NotImplementedError()


class AndSpecification(MultarySpecification):
    def __init__(self, spec_left: Specification, spec_right: Specification):
        super().__init__(spec_left, spec_right)
        self._spec_left = self._specs[0]
        self._spec_right = self._specs[1]
    
    def is_satisfied_by(self, candidate: Any) -> bool:
        return self._spec_left.is_satisfied_by(candidate) and \
               self._spec_right.is_satisfied_by(candidate)


class OrSpecification(MultarySpecification):
    def __init__(self, spec_left: Specification, spec_right: Specification):
        super().__init__(spec_left, spec_right)
        self._spec_left = self._specs[0]
        self._spec_right = self._specs[1]
    
    def is_satisfied_by(self, candidate: Any) -> bool:
        return self._spec_left.is_satisfied_by(candidate) or \
               self._spec_right.is_satisfied_by(candidate)


class NotSpecification(UnarySpecification):
    def __init__(self, spec: Specification):
        super().__init__(spec)
    
    def is_satisfied_by(self, candidate: any) -> bool:
        return not self._spec.is_satisfied_by(candidate)
    
    def stack_error_messages(self, result):
        if not result and self.is_executed_satisfied_by():
            return _add_error(self._spec, "Neg ~ ")
        return {}
