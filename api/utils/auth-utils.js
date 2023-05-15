const Product = require("../models/product");
const User = require("../models/user");
const { comparePasswords } = require("./bcrypt-utils");
const MESSAGES = require("./constants");
const { decodeCredentials } = require("./utils");

async function isAuthorized(auth_header, product_id) {
  try {
    const { decodedUsername, decodedPassword } = decodeCredentials(auth_header);
    const user = await User.findOne({
      where: {
        username: decodedUsername,
      },
    });
    if (user) {
      const userObj = { ...user.toJSON() };
      const passwordsMatched = await comparePasswords(
        decodedPassword,
        userObj.password
      );
      const usernamesMatched = decodedUsername === userObj.username;

      if (usernamesMatched && passwordsMatched) {
        const product = await Product.findOne({
          where: {
            id: product_id,
          },
        });

        if (product) {
          const productObj = product.toJSON();
          if (productObj.owner_user_id === userObj.id) {
            return {
              status: 201,
              message: MESSAGES[201],
            };
          } else {
            return {
              status: 403,
              message: MESSAGES[403],
            };
          }
        } else {
          return {
            status: 404,
            message: MESSAGES[404],
          };
        }
      } else {
        return {
          status: 404,
          message: MESSAGES[404],
        };
      }
    } else {
      return {
        status: 401,
        message: MESSAGES[401],
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      status: 500,
      message: MESSAGES[500],
    };
  }
}

module.exports = {
  isAuthorized,
};
