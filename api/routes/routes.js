const express = require("express");
const router = express.Router();
const {
  addUserController,
  getUserController,
  updateUserController,
} = require("../controllers/user-controller");
const {
  createProductController,
  getProductController,
  patchProductController,
  putProductController,
  deleteProductController,
} = require("../controllers/product-controller");
const { testController } = require("../controllers/test-controller");
const {
  uploadImageController,
  deleteImageController,
  getAllImagesController,
  getImageController,
} = require("../controllers/image-controller");

const imagesMiddleware = require("../utils/multer-utils");

router.route("/healthz").get(testController);

router.route("/v5/user").post(addUserController);

router
  .route("/v5/user/:userId")
  .get(getUserController)
  .put(updateUserController);

router.route("/v5/product").post(createProductController);

router
  .route("/v5/product/:productId")
  .get(getProductController)
  .patch(patchProductController)
  .put(putProductController)
  .delete(deleteProductController);

router
  .use(imagesMiddleware)
  .route("/v5/product/:product_id/image")
  .post(uploadImageController);

router
  .route("/v5/product/:product_id/image/:image_id")
  .delete(deleteImageController);

router.route("/v5/product/:product_id/image").get(getAllImagesController);

router.route("/v5/product/:product_id/image/:image_id").get(getImageController);

module.exports = router;
