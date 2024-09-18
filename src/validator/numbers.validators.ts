import {ValidationFunction} from "../ObjectValidator";

const isInteger = (errorMessages = [`Trebuie sa fie intreg!`]): ValidationFunction<number | string | undefined> =>
	value => {
		return {
			errorMessages,
			isValid: isDecimal()(value).isValid
				&& !(value + "").includes(".")
		};
	};

const isDecimal = (errorMessages = [`Trebuie sa fie numeric!`]): ValidationFunction<number | string | undefined> =>
	value => {
		return {
			errorMessages,
			isValid: value ? Number(value).toString() !== "NaN" && !(value + "").endsWith(".") : true
		};
	};

const min = (threshold: number,
			 errorMessages = [`Trebuie sa fie mai mare decat ${threshold}!`]): ValidationFunction<number | string | undefined> =>
	value => {
		return {
			errorMessages,
			isValid: isDecimal()(value).isValid
				&& value !== undefined
				&& threshold <= (value as number),

		};
	};

const max = (threshold: number,
			 errorMessages = [`Trebuie sa fie mai mica decat ${threshold}!`]): ValidationFunction<number | string | undefined> =>
	value => {
		return {
			errorMessages,
			isValid: isDecimal()(value).isValid
				&& value !== undefined
				&& (value as number) <= threshold
		};
	};

export const NumberValidators = {
	min,
	max,
	isDecimal: isDecimal,
	isInteger: isInteger
};
