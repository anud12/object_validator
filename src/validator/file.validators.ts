import {ValidationFunction} from "../ObjectValidator";


export const validSize = (
  thresholdInMB: number,
  errorMessages = [`Dimensiunea fisierului depaseste limita de ${thresholdInMB} MB!`]): ValidationFunction<File | undefined> => (file) => {

  let isValid = true;
  if (file?.size) {
    isValid = file?.size / 1024 / 1024 <= thresholdInMB;
  }
  return {
    errorMessages,
    isValid
  };
};

export const validImageExtension = (
  fileTypes: string[],
  errorMessages = [`Fisierul trebuie sa fie de format ${fileTypes.join(", ")}`]): ValidationFunction<File | undefined> => (file) => {
  let isValid = true;
  if(file) {
    isValid = fileTypes.includes(file.type)
  }

  return {
    errorMessages,
    isValid
  };
};


export const fileRequired = (
  errorMessages = ['Fisierul este obligatoriu!']): ValidationFunction<File | undefined> => (file) => {
  return {
    errorMessages,
    isValid: Boolean(file)
  };
};


export const FileValidators = {
  validSize,
  validImageExtension,
  fileRequired,
};
