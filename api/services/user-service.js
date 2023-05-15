const { comparePasswords, hashPassword } = require("../utils/bcrypt-utils");
const { decodeCredentials } = require("../utils/utils");

const User = require("../models/user");
const MESSAGES = require("../utils/constants");

async function findOrCreateUser(newUserDetails) {
  const { username, password } = newUserDetails;
  const hashedPassword = await hashPassword(password);
  const [result, created] = await User.findOrCreate({
    where: {
      username,
    },
    defaults: {
      ...newUserDetails,
      password: hashedPassword,
      account_created: new Date(),
      account_updated: new Date(),
    },
  });

  const responseObj = { ...result.toJSON() };
  delete responseObj.password;

  if (created) {
    return {
      status: 201,
      body: {
        message: MESSAGES[201],
        data: responseObj,
      },
    };
  } else {
    return {
      status: 400,
      body: {
        message: "Bad Request. User Already Exists",
        data: {},
      },
    };
  }
}

async function getUserById(id, auth_header) {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    const userObj = { ...user.toJSON() };

    if (user) {
      const { decodedUsername, decodedPassword } =
        decodeCredentials(auth_header);
      const passwordsMatched = await comparePasswords(
        decodedPassword,
        userObj.password
      );

      const usernamesMatched = decodedUsername === userObj.username;

      if (usernamesMatched && passwordsMatched) {
        delete userObj.password;
        return {
          status: 200,
          body: {
            message: MESSAGES[200],
            data: userObj,
          },
        };
      } else if (!usernamesMatched) {
        return {
          status: 403,
          body: {
            message: MESSAGES[403],
            data: {},
          },
        };
      } else if (!passwordsMatched) {
        return {
          status: 401,
          body: {
            message: MESSAGES[401],
            data: {},
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: "Bad Request. User Does Not Exist",
          data: {},
        },
      };
    }
  } catch (error) {
    return {
      status: 400,
      body: {
        message: "Bad Request. User Does Not Exist",
        data: {},
      },
    };
  }
}

async function updateUserById(id, requestBody, auth_header) {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    const userObj = { ...user.toJSON() };

    if (user) {
      const { decodedUsername, decodedPassword } =
        decodeCredentials(auth_header);
      const passwordsMatched = await comparePasswords(
        decodedPassword,
        userObj.password
      );

      const usernamesMatched = decodedUsername === userObj.username;

      if (usernamesMatched && passwordsMatched) {
        let hashedPassword = "";
        if (requestBody && requestBody.password) {
          hashedPassword = await hashPassword(requestBody.password);
        }
        requestBody.password = hashedPassword;
        const affectedCount = await User.update(
          {
            ...requestBody,
            account_updated: new Date(),
          },
          {
            where: {
              id,
              username: decodedUsername,
            },
          }
        );

        if (affectedCount) {
          return {
            status: 204,
            body: {
              message: MESSAGES[204],
              data: {},
            },
          };
        } else {
          return {
            status: 400,
            body: {
              message: MESSAGES[400],
              data: {},
            },
          };
        }
      } else if (!usernamesMatched) {
        return {
          status: 403,
          body: {
            message: MESSAGES[403],
            data: {},
          },
        };
      } else if (!passwordsMatched) {
        return {
          status: 401,
          body: {
            message: MESSAGES[401],
            data: {},
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: "Bad Request. User Does Not Exist",
          data: {},
        },
      };
    }
  } catch (error) {
    return {
      status: 400,
      body: {
        message: "Bad Request. User Does Not Exist",
        data: {},
      },
    };
  }
}

module.exports = {
  getUserById,
  findOrCreateUser,
  updateUserById,
};
