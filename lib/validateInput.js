const validateInput = (input) => {
  if (inputIsAPositiveNumber(input)) {
    return true;
  } else {
    throw new TypeError('The input value must be a number that is greater than 0.');
  }
}

const inputIsAPositiveNumber = (input) => {
  const parsedInput = parseInt(input);
  return (parsedInput > 0 && parsedInput !== NaN);
}

module.exports = validateInput;
