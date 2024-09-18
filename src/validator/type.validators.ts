import {ValidationFunction} from "../ObjectValidator";

export const is = (type: string, errorMessages = [`Trebuie sa fie de tipul ${type}`]): ValidationFunction<any> => value => {
    return ({
        errorMessages,
        isValid: typeof(value) === type,
    })
};


export const isNot = (type: string, errorMessages = [`Trebuie sa nu fie de tipul ${type}`]): ValidationFunction<any> => value => ({
    errorMessages,
    isValid: typeof(value) !== type,

});


export const TypeValidators = {
    is,
    isNot,

};