const {
  validInputsForProduct,
  validInputsForProductForPatch,
} = require("../utils/validations");
const {
  createProduct,
  getProduct,
  patchProduct,
  putProduct,
  deleteProduct,
} = require("../services/product-service");

const MESSAGES = require("../utils/constants");

async function createProductController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const requestBody = { ...request.body };
    const { owner_user_id, date_added, date_last_updated } = requestBody;
    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (
      owner_user_id ||
      date_added ||
      date_last_updated ||
      !validInputsForProduct(requestBody)
    ) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await createProduct(auth_header, requestBody);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function getProductController(request, response) {
  try {
    const productId = Number(request.params.productId);
    if (!productId) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await getProduct(productId);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function patchProductController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const productId = Number(request.params.productId);
    const requestBody = { ...request.body };
    const invalidRequestBody = JSON.stringify(requestBody) === "{}";
    const { id, owner_user_id, date_added, date_last_updated } = requestBody;
    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (
      !productId ||
      invalidRequestBody ||
      !validInputsForProductForPatch(requestBody) ||
      id ||
      owner_user_id ||
      date_added ||
      date_last_updated
    ) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await patchProduct(productId, requestBody, auth_header);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function putProductController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const productId = Number(request.params.productId);
    const requestBody = { ...request.body };
    const invalidRequestBody = JSON.stringify(requestBody) === "{}";
    const { id, owner_user_id, date_added, date_last_updated } = requestBody;
    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (
      !productId ||
      invalidRequestBody ||
      !validInputsForProduct(requestBody) ||
      id ||
      owner_user_id ||
      date_added ||
      date_last_updated
    ) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await putProduct(productId, requestBody, auth_header);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function deleteProductController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const productId = Number(request.params.productId);
    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!productId) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await deleteProduct(productId, auth_header);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

module.exports = {
  createProductController,
  getProductController,
  patchProductController,
  putProductController,
  deleteProductController,
};
