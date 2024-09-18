import {ObjectValidator} from "./../src/ObjectValidator";
import {TestValidator} from "./testUtils";
describe('ObjectValidator', () => {
  describe('getForField', () => {
    it('results should be the same when using instance validator', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator);
      const testValue = {
        "1": "",
        "2": "",
      }
      const originalResult = validator.validate(testValue);
      const cloneResult = validator.clone().validate(testValue)
      expect(cloneResult).toStrictEqual(originalResult);
    });
  })

  describe('clone field validator', () => {
    it('results should be the same when using field validator', () => {
      const validator = new ObjectValidator<any>();
      validator.onField("1", TestValidator.falseValidator);
      const testValue = {
        "1": "",
        "2": "",
      }
      const originalResult = validator.validate(testValue);
      const cloneResult = validator.clone().validate(testValue)
      expect(cloneResult).toStrictEqual(originalResult);
    });
  })
});
