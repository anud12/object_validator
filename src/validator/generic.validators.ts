import {ValidationFunction} from "../ObjectValidator";

const isEmptyArray = value => {
	if(Array.isArray(value)){
		return value.length === 0;
	}
	return false;
};

const required = (errorMessages = [`Campul este obligatoriu!`]): ValidationFunction<any> => value => ({
    errorMessages,
    isValid: typeof(value) !== "undefined"
        && value !== ""
		&& !isEmptyArray(value)
});

export const GenericValidators = {
    required
};