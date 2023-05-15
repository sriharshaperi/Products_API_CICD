require("dotenv").config;
const AWS = require("aws-sdk");
const fs = require("fs");
const MESSAGES = require("../utils/constants");
const Image = require("../models/image");
const { isAuthorized } = require("../utils/auth-utils");
const Product = require("../models/product");

const s3_Instance = {
  s3: null,
  bucketName: null,
};

async function createS3Instance() {
  if (!s3_Instance.s3) {
    const s3 = new AWS.S3({
      region: process.env.REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const bucketName = process.env.S3_BUCKET_NAME;
    s3_Instance.s3 = s3;
    s3_Instance.bucketName = bucketName;
  }
}

async function imageUploadService(auth_header, product_id, file) {
  try {
    const result = await isAuthorized(auth_header, product_id);
    if (result.status !== 201) {
      return {
        status: result.status,
        body: {
          message: result.message,
          data: {},
        },
      };
    }

    if (!s3_Instance.s3) {
      await createS3Instance();
    }
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: s3_Instance.bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    const imageData = await s3_Instance.s3.upload(uploadParams).promise();
    if (imageData) {
      const imageDataToDB = await Image.create({
        product_id,
        file_name: { ...imageData }.Key,
        date_created: new Date(),
        s3_bucket_path: { ...imageData }.Location,
      });
      if (imageDataToDB) {
        return {
          status: 200,
          body: {
            message: MESSAGES[200],
            data: imageDataToDB.toJSON(),
          },
        };
      } else {
        return {
          status: 400,
          body: {
            message: MESSAGES[400],
            data: imageDataToDB.toJSON(),
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: MESSAGES[400],
          data: {},
        },
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      status: 500,
      body: {
        message: error.message,
        data: {},
      },
    };
  }
}

async function imageDeleteService(auth_header, image_id, product_id) {
  try {
    const result = await isAuthorized(auth_header, product_id);
    if (result.status !== 201) {
      return {
        status: result.status,
        body: {
          data: {},
          message: result.message,
        },
      };
    }

    if (!s3_Instance.s3) {
      await createS3Instance();
    }

    const productByProductId = await Product.findOne({
      id: product_id,
    });

    if (productByProductId) {
      const imageRecordByImageId = await Image.findOne({
        where: {
          image_id,
        },
      });
      if (imageRecordByImageId) {
        const imageData = await Image.findOne({
          where: { image_id, product_id },
        });

        let imageDataObj;
        if (imageData) {
          imageDataObj = imageData.toJSON();
          console.log("File to be deleted : ", imageDataObj.file_name);
          const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: imageDataObj.file_name,
          };
          const deletedObj = await s3_Instance.s3
            .deleteObject(params)
            .promise();
          if (deletedObj) {
            const deleteImgRecord = await Image.destroy({
              where: {
                image_id,
              },
            });
            console.log("deleted record ===> " + deleteImgRecord);
            return {
              status: 204,
              data: {
                message: "",
                body: {},
              },
            };
          } else {
            return {
              status: 404,
              data: {
                message: MESSAGES[404],
                body: {},
              },
            };
          }
        } else {
          return {
            status: 400,
            data: {
              message: "",
              body: {},
            },
          };
        }
      } else {
        return {
          status: 404,
          body: {
            message: MESSAGES[404] + " - Image Id Does Not Exist",
          },
        };
      }
    } else {
      return {
        status: 404,
        body: {
          message: MESSAGES[404] + " - Product Id Does Not Exist",
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

async function getImageByImageId(auth_header, image_id, product_id) {
  const result = await isAuthorized(auth_header, product_id);
  if (result.status !== 201) {
    return {
      status: result.status,
      body: {
        message: result.message,
        data: {},
      },
    };
  }

  if (!s3_Instance.s3) {
    await createS3Instance();
  }

  const productByProductId = await Product.findOne({
    id: product_id,
  });

  if (productByProductId) {
    const imageRecordByImageId = await Image.findOne({
      where: {
        image_id,
      },
    });
    if (imageRecordByImageId) {
      const imageData = await Image.findOne({
        where: { image_id, product_id },
      });
      if (imageData) {
        const imageDataObj = imageData.toJSON();
        return {
          status: 200,
          body: {
            message: MESSAGES[200],
            data: imageDataObj,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message:
              MESSAGES[404] +
              " - No images found with given image_id (and / or) product_id",
            data: {},
          },
        };
      }
    } else {
      return {
        status: 404,
        body: {
          message: MESSAGES[404] + " Image id does not exist",
          data: {},
        },
      };
    }
  } else {
    return {
      status: 404,
      body: {
        message: MESSAGES[404] + " Product id does not exist",
        data: {},
      },
    };
  }
}

async function getImagesByProductId(auth_header, product_id) {
  const result = await isAuthorized(auth_header, product_id);
  if (result.status !== 201) {
    return {
      status: result.status,
      body: result.message,
    };
  }

  if (!s3_Instance.s3) {
    await createS3Instance();
  }

  const productByProductId = await Product.findOne({
    id: product_id,
  });

  if (productByProductId) {
    const imagesData = await Image.findAll({ where: { product_id } });
    if (imagesData) {
      return {
        status: 200,
        body: {
          message: MESSAGES[200],
          data: [...imagesData],
        },
      };
    } else {
      return {
        status: 404,
        body: {
          message:
            MESSAGES[404] + " - No images found for the given product_id",
          data: [],
        },
      };
    }
  } else {
    return {
      status: 404,
      body: {
        message: MESSAGES[404] + " - product_id does not exist",
        data: [],
      },
    };
  }
}

async function deleteS3ImagesWithProductId(auth_header, product_id) {
  try {
    const getAllImages = await Image.findAll({
      where: {
        product_id,
      },
    });

    if (!getAllImages) {
      return {
        status: 404,
        body: {
          message: MESSAGES[404] + " - product_id does not exist",
          data: [],
        },
      };
    } else {
      await Promise.all(
        getAllImages.map(async (image) => {
          await imageDeleteService(auth_header, image.image_id, product_id);
        })
      );

      await Image.destroy({
        where: {
          product_id,
        },
      });

      return {
        status: 204,
        data: {
          message: "",
          body: {},
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  imageUploadService,
  imageDeleteService,
  getImageByImageId,
  getImagesByProductId,
  deleteS3ImagesWithProductId,
};
