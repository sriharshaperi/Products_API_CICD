const { comparePasswords, hashPassword } = require("../utils/bcrypt-utils");
const { decodeCredentials } = require("../utils/utils");

const Product = require("../models/product");
const User = require("../models/user");
const MESSAGES = require("../utils/constants");
const { deleteS3ImagesWithProductId } = require("./image-service");

async function createProduct(auth_header, productDetails) {
  const { sku } = productDetails;
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
      const [productResult, created] = await Product.findOrCreate({
        where: {
          sku: sku,
        },
        defaults: {
          ...productDetails,
          quantity: Number(productDetails.quantity),
          date_added: new Date(),
          date_last_updated: new Date(),
          owner_user_id: userObj.id,
        },
      });

      const productObj = { ...productResult.toJSON() };

      if (created) {
        return {
          status: 200,
          body: {
            message: MESSAGES[200],
            data: productObj,
          },
        };
      } else {
        return {
          status: 400,
          body: {
            message: "Bad Request. Product With Given Sku Already Exists",
            data: {},
          },
        };
      }
    } else {
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
      status: 401,
      body: {
        message: MESSAGES[401],
        data: {},
      },
    };
  }
}

async function getProduct(productId) {
  const product = await Product.findOne({
    where: {
      id: productId,
    },
  });

  if (product) {
    const productObj = { ...product.toJSON() };
    return {
      status: 200,
      body: {
        message: MESSAGES[200],
        data: productObj,
      },
    };
  } else {
    return {
      status: 404,
      body: {
        message: MESSAGES[404],
        data: {},
      },
    };
  }
}

async function patchProduct(productId, productDetails, auth_header) {
  try {
    const { sku } = productDetails; //obj {}
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

      //valid password for the username
      if (passwordsMatched) {
        const product = await Product.findOne({
          where: {
            id: productId,
          },
        });

        if (product) {
          const productObj = { ...product.toJSON() };

          //if the same user is updatin the product who has created it
          if (productObj.owner_user_id === userObj.id) {
            if (sku) {
              const checkForExistingSku = await Product.findOne({
                where: {
                  sku,
                },
              });

              if (
                checkForExistingSku &&
                checkForExistingSku.toJSON().id !== productObj.id
              ) {
                return {
                  status: 400,
                  body: {
                    message: "Bad Request. Product Exists With the Given Sku",
                    data: {},
                  },
                };
              } else {
                const affectedCount = await Product.update(
                  {
                    ...productDetails,
                    date_last_updated: new Date(),
                  },
                  {
                    where: {
                      id: productId,
                    },
                  }
                );

                //update successful
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
              }
            } else {
              const affectedCount = await Product.update(
                {
                  ...productDetails,
                  date_last_updated: new Date(),
                },
                {
                  where: {
                    id: productId,
                  },
                }
              );

              //update successful
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
            }
          } else {
            return {
              status: 403,
              body: {
                message: MESSAGES[403],
                data: {},
              },
            };
          }
        } else {
          return {
            status: 400,
            body: {
              message:
                "Bad Request. Product Does Not Exist With the Given productId",
              data: {},
            },
          };
        }
      } else {
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
        status: 401,
        body: {
          message: MESSAGES[401],
          data: {},
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

async function putProduct(productId, productDetails, auth_header) {
  try {
    const { sku } = productDetails;
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

      //valid password for the username
      if (passwordsMatched) {
        const product = await Product.findOne({
          where: {
            id: productId,
          },
        });

        if (product) {
          const productObj = { ...product.toJSON() };

          //if the same user is updatin the product who has created it
          if (productObj.owner_user_id === userObj.id) {
            const checkForExistingSku = await Product.findOne({
              where: {
                sku,
              },
            });

            if (
              checkForExistingSku &&
              checkForExistingSku.toJSON().id !== productObj.id
            ) {
              return {
                status: 400,
                body: {
                  message: "Bad Request. Product Exists With the Given Sku",
                  data: {},
                },
              };
            } else {
              const affectedCount = await Product.update(
                {
                  ...productDetails,
                  date_last_updated: new Date(),
                },
                {
                  where: {
                    id: productId,
                  },
                }
              );

              //update successful
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
            }
          } else {
            return {
              status: 403,
              body: {
                message: MESSAGES[403],
                data: {},
              },
            };
          }
        } else {
          return {
            status: 400,
            body: {
              message:
                "Bad Request. Product Does Not Exist With the Given productId",
              data: {},
            },
          };
        }
      } else {
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
        status: 401,
        body: {
          message: MESSAGES[401],
          data: {},
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(productId, auth_header) {
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

    if (passwordsMatched) {
      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });

      if (product) {
        const productObj = { ...product.toJSON() };

        if (productObj.owner_user_id === userObj.id) {
          await deleteS3ImagesWithProductId(auth_header, productId);

          const deletedProduct = await Product.destroy({
            where: {
              id: productId,
            },
          });

          return {
            status: 204,
            body: {
              message: MESSAGES[204],
              data: {},
            },
          };
        } else {
          return {
            status: 403,
            body: {
              message: MESSAGES[403],
              data: {},
            },
          };
        }
      } else {
        return {
          status: 404,
          body: {
            message: MESSAGES[404],
            data: {},
          },
        };
      }
    } else {
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
      status: 401,
      body: {
        message: MESSAGES[401],
        data: {},
      },
    };
  }
}

module.exports = {
  //   getUserById,
  createProduct,
  getProduct,
  patchProduct,
  putProduct,
  deleteProduct,
  //   updateUserById,
};
