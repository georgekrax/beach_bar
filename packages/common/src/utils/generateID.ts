import { GenerateIdParams } from "../typings/generateId";

/**
 * Generates a unique identifier (ID)
 * @param {object} options
 * @param {number} options.length - How long the ID to be
 * @param {string=} options.specialCharacters - A string with special characters to apply
 * @param {boolean=} options.lowerCase - Indicates if to use lower case letters
 * @param {boolean=} options.upperCase - Indicates if to use upper case letters
 * @param {boolean=} options.numbersOnly - Indicates if to use only numbers, and not other characters
 * @param {boolean=} options.numbers - Indicates if to use numbers
 * @param {boolean=} options.hyphens - Indicates if to use hyphens
 * @param {boolean=} options.underscores - Indicates if to use underscores
 * @returns {string} The generated ID
 */
export const generateId = ({
  specialCharacters = "@#./&",
  lowerCase = true,
  upperCase = true,
  numbersOnly = false,
  numbers = true,
  hyphen = true,
  underscore = true
}: GenerateIdParams): string => {
  let result = "";
  let characters = "";
  if (lowerCase) {
    characters.concat("abcdefghijklmnopqrstuvwxyz");
  }
  if (upperCase) {
    characters.concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }
  if (numbers) {
    characters.concat("0123456789");
  }
  if (hyphen) {
    characters.concat("-");
  }
  if (underscore) {
    characters.concat("_");
  }
  if (numbersOnly) {
    characters = "0123456789";
  }
  if (specialCharacters) {
    characters.concat(specialCharacters);
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
