const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRecipeInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.ingredients = !isEmpty(data.ingredients) ? data.ingredients : "";
  data.directions = !isEmpty(data.directions) ? data.directions : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Recipe Name field is required";
  }
  if (Validator.isEmpty(data.ingredients)) {
    errors.ingredients = "Ingredients field is required";
  }
  if (Validator.isEmpty(data.directions)) {
    errors.directions = "Directions field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
