const {
  imageUploadService,
  imageDeleteService,
  getImageByImageId,
  getImagesByProductId,
} = require("../services/image-service");
const MESSAGES = require("../utils/constants");
const { isValidFileData } = require("../utils/validations");

async function uploadImageController(request, response, next) {
  try {
    const auth_header = request.headers.authorization;
    const product_id = Number(request.params.product_id);
    const file = request.file;
    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!product_id) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await imageUploadService(auth_header, product_id, file);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function deleteImageController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const product_id = Number(request.params.product_id);
    const image_id = Number(request.params.image_id);

    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!product_id || !image_id) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await imageDeleteService(
        auth_header,
        image_id,
        product_id
      );
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function getImageController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const product_id = Number(request.params.product_id);
    const image_id = Number(request.params.image_id);
    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!product_id || !image_id) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await getImageByImageId(
        auth_header,
        image_id,
        product_id
      );
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function getAllImagesController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const product_id = Number(request.params.product_id);

    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!product_id) {
      response.status(400).json({
        message: MESSAGES[400],
      });
    } else {
      const feedback = await getImagesByProductId(auth_header, product_id);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

module.exports = {
  getAllImagesController,
  getImageController,
  uploadImageController,
  deleteImageController,
};
