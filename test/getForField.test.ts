import {ObjectValidator} from "./../src/ObjectValidator";
import {TestValidator} from "./testUtils";

describe('ObjectValidator', () => {
  describe('getForField', () => {
    it('should pass when instance validator is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator);
      const testValue = {
        "1": "",
        "2": "",
      }
      const fieldValidator = validator.getForField("1");
      const result = fieldValidator.validate(testValue)
      expect(result).toStrictEqual({
        "_isValid": true,
        "_messages": []
      });
    });

    it('should fail  when field validator is added', () => {
      const validator = new ObjectValidator<any>();
      validator.onField("1",TestValidator.falseValidator);
      const testValue = {
        "1": "",
        "2": "",
      }
      const fieldValidator = validator.getForField("1");
      const result = fieldValidator.validate(testValue)
      expect(result).toStrictEqual({
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });
    });
  })
});
