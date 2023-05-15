function validInputsForUpdate(params) {
  const { password, first_name, last_name } = params;
  if (password === null || first_name === null || last_name === null)
    return false;
  return true;
}

function validInputsForCreate(params) {
  const { username, password, first_name, last_name } = params;
  if (!isValidUsername(username) || !password || !first_name || !last_name)
    return false;
  return true;
}

function validInputsForProductForPatch(params) {
  const { quantity } = params; //{}
  const numericalQty = Number(quantity);
  const validQuantity = numericalQty >= 0 && numericalQty <= 100;
  for (let i in params) {
    if (i === "quantity" && !validQuantity) {
      return false;
    }
    if (!params[i] || params[i] === "") {
      return false;
    }
  }
  return true;
}

function validInputsForProduct(params) {
  const { name, description, sku, manufacturer, quantity } = params;
  const numericalQty = Number(quantity);
  const validQuantity = numericalQty >= 0 && numericalQty <= 100;
  if (
    !name ||
    !description ||
    !sku ||
    !manufacturer ||
    !quantity ||
    !validQuantity
  )
    return false;
  return true;
}

function isValidUsername(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function isValidFileData(fileData) {
  const { file, fileType } = fileData;
  if (!file || !fileType) return false;
  return true;
}

module.exports = {
  validInputsForCreate,
  validInputsForUpdate,
  validInputsForProduct,
  validInputsForProductForPatch,
  isValidFileData,
};
