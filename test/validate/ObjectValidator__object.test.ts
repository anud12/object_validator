import {ObjectValidator} from "../../src/ObjectValidator";
import {TestValidator} from "./../testUtils";


describe('ObjectValidator', () => {
  describe('validating objects', () => {
    it('should fail validation when a validator that always returns false is added', () => {
      const validator = new ObjectValidator<{ "1": string, "2": string }>();
      validator.onField("1", TestValidator.falseValidator);
      const result = validator.validate({
        "1": "",
        "2": "",
      });

      expect(result).toStrictEqual({
        "1": {
          "_isValid": false,
          "_messages": [
            "validValidator"
          ]
        },
        "_isValid": false,
        "_messages": []
      });
    });

    it('should merge results when a validator that always returns false is added per field and per instance', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator)
      validator.onField("1", TestValidator.falseValidator);
      validator.onField("2", TestValidator.falseValidator);
      const result = validator.validate({
        "1": "",
        "2": "",
      });
      expect(result).toStrictEqual({
        "1": {
          "_isValid": false,
          "_messages": [
            "validValidator"
          ]
        },
        "2": {
          "_isValid": false,
          "_messages": [
            "validValidator"
          ]
        },
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });
    });

    it('should fail when one field result is false', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.trueValidator)
      validator.onField("1", TestValidator.falseValidator);
      validator.onField("2", TestValidator.trueValidator);
      const result = validator.validate({
        "1": "",
        "2": "",
      });
      expect(result).toStrictEqual({
        "1": {
          "_isValid": false,
          "_messages": [
            "validValidator"
          ]
        },
        "2": {
          "_isValid": true,
          "_messages": []
        },
        "_isValid": false,
        "_messages": []
      });
    });

    it('should fail when one instance result is false', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator)
      validator.onField("1", TestValidator.trueValidator);
      validator.onField("2", TestValidator.trueValidator);
      const result = validator.validate({
        "1": "",
        "2": "",
      });
      expect(result).toStrictEqual({
        "1": {
          "_isValid": true,
          "_messages": []
        },
        "2": {
          "_isValid": true,
          "_messages": []
        },
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });
    });


    it('should merge results when a validator checks equality is added per field', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator)
      validator.onField("1", TestValidator.equalValidator("1"));
      validator.onField("2", TestValidator.equalValidator("2"));
      validator.onField("3", TestValidator.equalValidator("3"));
      const result = validator.validate({
        "1": "1",
        "2": "2",
        "3": "3",
      });
      expect(result).toStrictEqual({
        "1": {
          "_isValid": true,
          "_messages": []
        },
        "2": {
          "_isValid": true,
          "_messages": []
        },
        "3": {
          "_isValid": true,
          "_messages": []
        },
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });
    });
  });

  describe('validating objects containing empty string property', () => {

    it('should still validate fields', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator)
      validator.onField("1", TestValidator.falseValidator);
      validator.onField("", TestValidator.falseValidator);
      const result = validator.validate({
        "1": "",
        "": "",
      });
      expect(result).toStrictEqual({
        "1": {
          "_isValid": false,
          "_messages": [
            "validValidator"
          ]
        },
        "": {
          "_isValid": false,
          "_messages": [
            "validValidator"
          ]
        },
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });
    });
  });
});