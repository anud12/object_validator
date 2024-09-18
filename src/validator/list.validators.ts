import {ValidationFunction} from "../ObjectValidator";
import {GenericValidators} from "./generic.validators";

export const notEmpty = (errorMessages = [`Campul este obligatoriu!`]): ValidationFunction<Array<any> | undefined> =>
        (value) => ({
    errorMessages,
    isValid: GenericValidators.required()(value).isValid
        && value !== undefined
        && value !== null
        && value.length > 0
});

export const ListValidators = {
    notEmpty: notEmpty
};