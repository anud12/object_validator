/**
 * ValidationResult type is used to represent the result of a validation operation.
 * It contains a boolean indicating the validity of the operation and an array of error messages.
 */
export type ValidationFunctionResult = {
  isValid: boolean,
  errorMessages: Array<string>
}
/**
 * ValidationFunction type represents a function that takes a value and returns a ValidationFunctionResult.
 */
export type ValidationFunction<ValueType> = (value: ValueType) => ValidationFunctionResult

/**
 * SelfValidationErrors type represents the validation errors of the object itself.
 */
type SelfValidationErrors = {
  _messages: Array<string>,
  _isValid: boolean
}

/**
 * ObjectValidationResult type represents the validation result of an object.
 * It contains the validation errors of the object itself and the validation results of its fields.
 */
export type ObjectValidationResult<T> = SelfValidationErrors & {
  [P in keyof T]?: ObjectValidationResult<T[P]>
}

/**
 * ObjectValidator class is used to validate objects.
 * It contains a list of validators for the object itself and a map of validators for each field of the object.
 */
export class ObjectValidator<T> {
  private thisValidators: Array<ValidationFunction<T>> = [];
  private fieldValidatorMap: Map<keyof T, ObjectValidator<T[keyof T]>> = new Map();

  /**
   * Creates a clone of the current ObjectValidator instance.
   * @returns A new ObjectValidator instance with the same validators as the current instance.
   */
  clone(): ObjectValidator<T> {
    const validator = new ObjectValidator<T>();
    validator.addAll(this);
    return validator;
  }

  /**
   * Adds all validators from another ObjectValidator instance to the current instance.
   * @param objectValidator - The ObjectValidator instance from which validators are to be added.
   * @returns The current ObjectValidator instance.
   */
  addAll(objectValidator: ObjectValidator<T>) {
    this.thisValidators = [...this.thisValidators, ...objectValidator.thisValidators];
    objectValidator.fieldValidatorMap.forEach((array, key) => {
      const keyValidator = this.fieldValidatorMap.get(key) ?? new ObjectValidator<T[keyof T]>();
      keyValidator.thisValidators = [...keyValidator.thisValidators, ...array.thisValidators]
      this.fieldValidatorMap.set(key, keyValidator);
    })
    return this;
  }

  /**
   * Retrieves the ObjectValidator for a specific field.
   * @param field - The field for which the ObjectValidator is to be retrieved.
   * @returns The ObjectValidator for the specified field.
   */
  getForField<U extends keyof T>(field: U): ObjectValidator<T[U]> {
    const validator = this.fieldValidatorMap.get(field) as unknown as ObjectValidator<T[U]>;
    return validator?.clone() ?? new ObjectValidator<T[U]>();
  }

  /**
   * Adds a validator to the current ObjectValidator instance.
   * @param validator - The validator to be added.
   * @returns The current ObjectValidator instance.
   */
  on = (validator: ValidationFunction<T>) => {
    this.thisValidators.push(validator);
    return this;
  };

  /**
   * Adds a validator for a specific field to the current ObjectValidator instance.
   * @param field - The field for which the validator is to be added.
   * @param validator - The validator to be added.
   * @returns The current ObjectValidator instance.
   */
  onField = <U extends keyof T>(field: U, validator: ValidationFunction<T[U]> | ObjectValidator<T[keyof T]>) => {
    const objectValidator = this.fieldValidatorMap.get(field) || new ObjectValidator<T[keyof T]>();
    this.fieldValidatorMap.set(field, objectValidator);
    if (validator instanceof ObjectValidator) {
      objectValidator.addAll(validator)
      return this;
    }

    objectValidator.on(validator);
    return this;

  };

  /**
   * Validates a value using the validators in the current ObjectValidator instance.
   * @param value - The value to be validated.
   * @returns The validation result.
   */
  validate = (value: T): ObjectValidationResult<T> => {
    const result = this.computeThisValidators(value);
    this.appendChildValidators(result, value);
    return result;
  };

  /**
   * computeThisValidators method is used to compute the validation result of the object itself.
   * It applies all the validators of the object to the given value and aggregates the results.
   * @param value - The value to be validated.
   * @returns The validation result of the object itself.
   */
  private computeThisValidators = (value: T): ObjectValidationResult<T> => {
    const thisErrors = this.thisValidators
      .map(validationFunction => validationFunction(value))
      .reduce((acc, result) => {
        const isValid = acc.isValid && result.isValid;
        if(isValid) {
          return {
            isValid,
            errorMessages: [],
          }
        }
        return {
          isValid: false,
          errorMessages: [...acc.errorMessages, ...result.errorMessages]
        }
      }, {isValid: true, errorMessages: []}  satisfies ValidationFunctionResult)
    return {
      _isValid: thisErrors.isValid,
      _messages: thisErrors.errorMessages
    } satisfies ObjectValidationResult<unknown> as any;
  }

  /**
   * appendChildValidators method is used to compute the validation results of the fields of the object.
   * It applies all the validators of each field to the corresponding value and aggregates the results.
   * @param objectResult - The validation result of the object itself.
   * @param value - The value to be validated.
   */
  private appendChildValidators = (objectResult: ObjectValidationResult<T>, value: T):void => {

    this.fieldValidatorMap.forEach((validatorList, key) => {
      const result = validatorList
        .validate(value?.[key]) as ObjectValidationResult<unknown>
      objectResult[key] = result as any;
      if (!result._isValid) {
        objectResult._isValid = false;
      }
    })
  }

}
