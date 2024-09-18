# ObjectValidator

The `ObjectValidator` class is a utility for validating JavaScript objects. It allows you to define validation rules for
each field of an object and validate the object against these rules.

## Usage

Here is a basic example of how to use the `ObjectValidator` class:

```typescript
import {ObjectValidator} from './ObjectValidator';
import {TestValidator} from './TestValidator';

// Create a new ObjectValidator instance
const validator = new ObjectValidator<{ "1": string, "2": string }>();

// Add a validator for a specific field
validator.onField("1", TestValidator.falseValidator);

// Validate an object
const result = validator.validate({
  "1": "",
  "2": "",
});

// The result is an object that indicates whether each field is valid
console.log(result);
```

In this example, the `TestValidator.falseValidator` is a validation function that always returns `false`. The `validate`
method returns an object that indicates whether each field is valid.

## Chaining `onField` and Calling `validate`

The `ObjectValidator` class allows you to chain `onField` calls to add multiple field validators to an object. After
adding the validators, you can call the `validate` method to validate an object against these validators.

Here is an example of how to chain `onField` calls and use `validate`:

```typescript
// Create a new ObjectValidator instance
const validator = new ObjectValidator<any>();

// Chain onField calls to add validators for multiple fields
validator
  .on(GenericValidators.required())
  .onField("field1", StringValidators.isString())
  .onField("field2", StringValidators.hasMinLength(5))
  .onField("field3", FileValidators.validSize(5))
  .onField("field4", FileValidators.validImageExtension(["image/png", "image/jpeg"]));

// Validate an object
const result = validator.validate({
  field1: "Hello, world!",
  field2: "Hello",
  field3: new File(["content"], "filename.txt"),
  field4: new File(["content"], "filename.png", {type: "image/png"}),
});

// The result is an object that indicates whether each field is valid
console.log(result);
```

In this example, the `onField` method is used to add validators for four different fields. The `validate` method is then
called to validate an object against these validators. The result is an object that indicates whether each field is
valid.

## Understanding the Return Value of `validate`

The `validate` method of the `ObjectValidator` class returns an object that indicates whether each field in the input
object is valid according to the validators added using the `onField` method and any root validators added using
the `on` method.

In the following usage, the `validate` method is called with an object that has two fields: `name` and `age`. Each of
these fields has one or more validators associated with it, and there is also a root validator that checks if the object
itself is valid.

```typescript
// Create a new ObjectValidator instance
const validator = new ObjectValidator<any>()
  .on(GenericValidators.required())
  // Add validators for the "name" field
  .onField("name", StringValidators.isString())
  .onField("name", StringValidators.hasMinLength(2))

  // Add validators for the "age" field
  .onField("age", NumberValidators.isInteger())
  .onField("age", NumberValidators.min(0))
  .onField("age", NumberValidators.max(120))

// Validate an object
const result = validator.validate({
  name: "John Doe",
  age: 30,
});
```

The returned object will have the same structure as the input object, but instead of the original values, each field
will contain an object with two properties: `_isValid` and `_messages`.

- The `_isValid` property is a boolean that indicates whether the field is valid. It will be `true` if all validators
  for the field returned `true`, and `false` otherwise.
- The `_messages` property is an array of strings that contains the error messages returned by any validators that
  failed.

In addition, the returned object will have an `_isValid` property that indicates whether the object itself is valid
according to the root validators, and a `_messages` property that contains any error messages returned by the root
validators.

For example, if the value of `name` is a string and has at least 2 characters (as required
by `StringValidators.isString()` and `StringValidators.hasMinLength(2)`), and the value of `age` is an integer between 0
and 120 (as required by `NumberValidators.isInteger()`, `NumberValidators.min(0)`, and `NumberValidators.max(120)`), the
returned object might look like this:

```json
{
  "_isValid": true,
  "_messages": [
  ],
  "age": {
    "_isValid": false,
    "_messages": [
      "Trebuie sa fie intreg!",
      "Trebuie sa fie mai mare decat 0!",
      "Trebuie sa fie mai mica decat 120!"
    ]
  },
  "name": {
    "_isValid": true,
    "_messages": [
    ]
  }
}
```

This object can be used to easily check whether the input object is valid and, if not, which fields are invalid and why.

## Validating an Object with multiple Levels of Depth

The `ObjectValidator` class can be used to validate an object with multiple levels of depth. This involves creating
separate `ObjectValidator` instances for each level of the object and adding them as validators for the corresponding
fields.

Here is an example of how to validate an object with multiple levels of depth:

```typescript
// Create a new ObjectValidator instance
const validator = new ObjectValidator<any>()

  // Add validators for the "name" field
  .onField("name", StringValidators.isString())
  .onField("name", StringValidators.hasMinLength(2))

  // Add validators for the "age" field
  .onField("age", NumberValidators.isInteger())
  .onField("age", NumberValidators.min(0))
  .onField("age", NumberValidators.max(120))

  // Add validators for the "email" field
  .onField("email", StringValidators.isString())
  .onField("email", StringValidators.validRegex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) // Basic email regex

  // Add validators for the "address" field
  .onField("address", new ObjectValidator<any>()
    .onField("street", StringValidators.isString())
    .onField("city", StringValidators.isString())
    .onField("country", StringValidators.isString())
  )

  // Add validators for the "work" field
  .onField("work", StringValidators.isString())

  // Add validators for the "workAddress" field
  .onField("workAddress", new ObjectValidator<any>()
    .onField("street", StringValidators.isString())
    .onField("city", StringValidators.isString())
    .onField("country", StringValidators.isString())
  )

  // Add validators for the "website" field
  .onField("website", StringValidators.isString())
  .onField("website", StringValidators.isUrl())

  // Add validators for the "car" field
  .onField("car", new ObjectValidator<any>()
    .onField("make", StringValidators.isString())
    .onField("model", StringValidators.isString())
    .onField("year", NumberValidators.isInteger())
  );

// Validate an object
const result = validator.validate({
  name: "John Doe",
  age: 30,
  email: "john.doe@example.com",
  address: {
    street: "123 Main St",
    city: "Anytown",
    country: "USA"
  },
  work: "Software Developer",
  workAddress: {
    street: "456 Office St",
    city: "Worktown",
    country: "USA"
  },
  website: "https://www.johndoe.com",
  car: {
    make: "Toyota",
    model: "Camry",
    year: 2020
  }
});

console.log(result);
```

<details>
<summary>
This is the result if every test failed
</summary>

```json
{
  "_isValid": false,
  "_messages": [],
  "address": {
    "_isValid": false,
    "_messages": [],
    "city": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    },
    "country": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    },
    "street": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    }
  },
  "age": {
    "_isValid": false,
    "_messages": [
      "Trebuie sa fie intreg!",
      "Trebuie sa fie mai mare decat 0!",
      "Trebuie sa fie mai mica decat 120!"
    ]
  },
  "car": {
    "_isValid": false,
    "_messages": [],
    "make": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    },
    "model": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    },
    "year": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie intreg!"
      ]
    }
  },
  "email": {
    "_isValid": false,
    "_messages": [
      "Trebuie sa fie de tipul string",
      "Trebuie sa fie validate de regex!"
    ]
  },
  "name": {
    "_isValid": false,
    "_messages": [
      "Trebuie sa fie de tipul string",
      "Trebuie sa contina cel putin 3 caractere!"
    ]
  },
  "website": {
    "_isValid": false,
    "_messages": [
      "Trebuie sa fie de tipul string",
      "URL invalid."
    ]
  },
  "work": {
    "_isValid": false,
    "_messages": [
      "Trebuie sa fie de tipul string"
    ]
  },
  "workAddress": {
    "_isValid": false,
    "_messages": [],
    "city": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    },
    "country": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    },
    "street": {
      "_isValid": false,
      "_messages": [
        "Trebuie sa fie de tipul string"
      ]
    }
  }
}
```

</details>


In this example, separate `ObjectValidator` instances are created for each level of the object. The `validate` method of
an `ObjectValidator` instance is used as a validator for a field in the parent object. This allows the validation to be
performed recursively on each level of the object. The result is an object that indicates whether each field is valid.

## Creating a Custom Validator

Creating a custom validator involves defining a validation function that takes a value and returns an object
with `isValid` and `errorMessages` properties. The `isValid` property is a boolean that indicates whether the value is
valid, and the `errorMessages` property is an array of strings that contains error messages if the value is not valid.

Here's an example of how to create a custom validator:

```typescript
import {ValidationFunction} from "../validation.type";

// Define a custom validator that checks if a string starts with a specific prefix
const startsWith = (prefix: string, errorMessages = [`Must start with ${prefix}`]): ValidationFunction<string> => value => {
  return {
    errorMessages,
    isValid: value.startsWith(prefix),
  };
};

// Use the custom validator
const validator = new ObjectValidator<any>();
validator.onField("field1", startsWith("Hello"));

const result = validator.validate({
  field1: "Hello, world!",
});

console.log(result);
```

In this example, the `startsWith` function is a custom validator that checks if a string starts with a specific prefix.
The `onField` method is used to add the custom validator for a specific field. The `validate` method is then called to
validate an object against the validators. The result is an object that indicates whether each field is valid.

Remember, the custom validator function must return an object with `isValid` and `errorMessages` properties.
The `isValid` property should be `true` if the value is valid according to your custom validation logic, and `false`
otherwise. The `errorMessages` property should be an array of error messages that explain why the value is not valid.