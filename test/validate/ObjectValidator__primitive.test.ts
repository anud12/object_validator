import {ObjectValidator} from "../../src/ObjectValidator";
import {TestValidator} from "./../testUtils";


describe('ObjectValidator', () => {
  describe('validating string', () => {
    it('should fail validation when a validator that always returns false is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator);
      const result = validator.validate("test");
      expect(result).toStrictEqual({
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });

    });

    it('should fail validation when a trying to validate fields', () => {
      const validator = new ObjectValidator<any>();
      validator.onField("1",TestValidator.falseValidator);
      const result = validator.validate("test");
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

    it('should pass validation when a validator that always returns true is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.trueValidator);
      const result = validator.validate("test");
      expect(result).toStrictEqual({
        "_isValid": true,
        "_messages": [
        ]
      });

    });
  });

  describe('validating empty string value', () => {
    it('should pass validation when a validator that checks equality is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.equalValidator(""));
      const result = validator.validate("");
      expect(result).toStrictEqual({
        "_isValid": true,
        "_messages": []
      });

    });

  });

  describe('validating undefined values', () => {
    it('should fail validation when a validator that always returns false is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator);
      const result = validator.validate(undefined);
      expect(result).toStrictEqual({
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });

    });

    it('should fail validation when a trying to validate fields using a validator that always returns false', () => {
      const validator = new ObjectValidator<any>();
      validator.onField("1",TestValidator.falseValidator);
      const result = validator.validate(undefined);
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

    it('should pass validation when a validator that always returns true is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.trueValidator);
      const result = validator.validate(undefined);
      expect(result).toStrictEqual({
        "_isValid": true,
        "_messages": []
      });

    });

    it('should pass validation when a trying to validate fields using a validator that always returns true', () => {
      const validator = new ObjectValidator<any>();
      validator.onField("1",TestValidator.trueValidator);
      const result = validator.validate(undefined);
      expect(result).toStrictEqual({
        "1": {
          "_isValid": true,
          "_messages": []
        },
        "_isValid": true,
        "_messages": []
      });

    });
  });

  describe('validating empty array values', () => {
    it('should fail validation when a validator that always returns false is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.falseValidator);
      const result = validator.validate([]);
      expect(result).toStrictEqual({
        "_isValid": false,
        "_messages": [
          "validValidator"
        ]
      });

    });

  });

  describe('validating array values', () => {
    it('should pass validation when a validator that checks equality is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.equalValidator(["1"]));
      const result = validator.validate(["1"]);
      expect(result).toStrictEqual({
        "_isValid": true,
        "_messages": []
      });

    });

  });


  describe('validating number 0', () => {
    it('should fail validation when a validator that checks equality is added', () => {
      const validator = new ObjectValidator<any>();
      validator.on(TestValidator.equalValidator(0));
      const result = validator.validate(0);
      expect(result).toStrictEqual({
        "_isValid": true,
        "_messages": []
      });

    });

  });

});