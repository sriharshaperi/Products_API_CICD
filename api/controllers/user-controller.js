const {
  validInputsForCreate,
  validInputsForUpdate,
} = require("../utils/validations");
const {
  findOrCreateUser,
  getUserById,
  updateUserById,
} = require("../services/user-service");
const MESSAGES = require("../utils/constants");

async function addUserController(request, response) {
  try {
    const requestBody = { ...request.body };
    if (!validInputsForCreate(requestBody)) {
      response.status(400).json({ message: MESSAGES[400] });
    } else {
      const feedback = await findOrCreateUser(requestBody);
      response.status(feedback.status).json(feedback.body);
    }
  } catch (error) {
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function getUserController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const userId = Number(request.params.userId);

    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!userId) {
      //send 400 bad response
      response.status(400).json({ message: MESSAGES[400] });
    } else {
      const userDetails = await getUserById(userId, auth_header);
      response.status(userDetails.status).json(userDetails.body);
    }
  } catch (error) {
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

async function updateUserController(request, response) {
  try {
    const auth_header = request.headers.authorization;
    const userId = Number(request.params.userId);
    const {
      username,
      account_created,
      account_updated,
      first_name,
      last_name,
      password,
    } = request.body;

    let requestBody = {};

    if (password) {
      requestBody.password = password;
    }
    if (first_name) {
      requestBody.first_name = first_name;
    }
    if (last_name) {
      requestBody.last_name = last_name;
    }

    if (!auth_header) {
      //send 401 response for unauthorized request
      response.status(401).json({
        message: MESSAGES[401],
      });
    } else if (!userId) {
      //send 400 bad response
      response.status(400).json({ message: MESSAGES[400] });
    } else if (username || account_created || account_updated) {
      //send 400 response for invalid inputs
      response.status(400).json({
        message: MESSAGES.RESTRICTED_INPUTS,
      });
    } else if (!validInputsForUpdate(requestBody)) {
      //send 400 response for invalid inputs
      response.status(400).json({ message: MESSAGES[400] });
    } else {
      const userDetails = await updateUserById(
        userId,
        requestBody,
        auth_header
      );
      response.status(userDetails.status).json(userDetails.body);
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ message: MESSAGES.VALIDATION_ERROR });
  }
}

module.exports = {
  addUserController,
  getUserController,
  updateUserController,
};
