import {ValidationFunction} from "../src/ObjectValidator";

const trueValidator: ValidationFunction<any> = value => {
  return {
    isValid: true,
    errorMessages: ["validValidator"]
  }
}

const falseValidator: ValidationFunction<any> = value => {
  return {
    isValid: false,
    errorMessages: ["validValidator"]
  }
}

const equalValidator = (initialValue: any): ValidationFunction<any> => value => {
  return {
    isValid: JSON.stringify(initialValue) === JSON.stringify(value),
    errorMessages: ["validValidator"]
  }
}

export const TestValidator = {
  trueValidator,
  falseValidator,
  equalValidator
}