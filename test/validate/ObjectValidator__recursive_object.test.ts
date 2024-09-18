import {ObjectValidator} from "../../src/ObjectValidator";
import {TestValidator} from "./../testUtils";


describe('ObjectValidator', () => {
  describe('validating deep objects having empty string value', () => {
    it('should fail validation when an object validator that contains another validator always returns false is added for each field', () => {
      const validator = new ObjectValidator<any>();
      validator.onField("1", new ObjectValidator<any>()
        .onField("1.1", TestValidator.falseValidator)
        .onField("1.2", TestValidator.falseValidator)
      );
      validator.onField("2", new ObjectValidator<any>()
        .onField("2.1", TestValidator.falseValidator)
        .onField("2.2", TestValidator.falseValidator)
      );
      const result = validator.validate({
        "1": {
          "1.1": "",
          "1.2": "",
        },
        "2": {
          "2.1": "",
          "2.2": "",
        }
      });
      expect(result).toStrictEqual({
        "1": {
          "1.1": {
            "_isValid": false,
            "_messages": [
              "validValidator"
            ]
          },
          "1.2": {
            "_isValid": false,
            "_messages": [
              "validValidator"
            ]
          },
          "_isValid": false,
          "_messages": []
        },
        "2": {
          "2.1": {
            "_isValid": false,
            "_messages": [
              "validValidator"
            ]
          },
          "2.2": {
            "_isValid": false,
            "_messages": [
              "validValidator"
            ]
          },
          "_isValid": false,
          "_messages": []
        },
        "_isValid": false,
        "_messages": []
      });
    });
  });

});