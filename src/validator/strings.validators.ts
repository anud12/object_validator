import {ValidationFunction} from "../ObjectValidator";
import {TypeValidators} from "./type.validators";

const isString = () => TypeValidators.is("string");

const hasMinLength = (threshold,
					  errorMessages = [`Trebuie sa contina cel putin ${threshold + 1} caractere!`]): ValidationFunction<string | undefined> =>
	value => {
		return {
			errorMessages,
			isValid: isString()(value).isValid
				&& value !== undefined
				&& threshold < value.length,

		};
	};

const hasMaxLength = (threshold,
					  errorMessages = [`Trebuie sa contina cel mult ${threshold + 1} caractere!`]): ValidationFunction<string | undefined> =>
	value => {
		return {
			errorMessages,
			isValid: isString()(value).isValid
				&& value !== undefined
				&& threshold > value.length,

		};
	};

const validRegex = (regex: RegExp,
					errorMessages = ["Trebuie sa fie validate de regex!"]): ValidationFunction<string | undefined> =>
	value => {
		return {
			errorMessages: errorMessages,
			isValid: isString()(value).isValid
				&& regex.test(value as string)
		};
	};

const isUrl = (errorMessages = ["URL invalid."]): ValidationFunction<string | undefined> => value => {
	let isValidUrl = value !== undefined && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('www.'));
	return {
		errorMessages: errorMessages,
		isValid: isValidUrl
	};
};

export const StringValidators = {
	isString,
	hasMaxLength,
	hasMinLength,
	validRegex,
	isUrl
};
