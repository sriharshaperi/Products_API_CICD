const multer = require("multer");
const path = require("path");
const MESSAGES = require("./constants");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extName) {
      cb(
        null,
        "s3_webapp_image_" + Date.now() + path.extname(file.originalname)
      );
    } else {
      cb(new Error(`${MESSAGES[400]} - Cannot upload this file`), false);
    }
  },
});

const upload = (req, res, next) => {
  const multerUpload = multer({ storage: fileStorage }).single("image");
  multerUpload(req, res, function (err) {
    if (err) {
      res.status(400).json({
        message: MESSAGES[400] + " - " + err.message,
      });
    } else {
      next();
    }
  });
};

module.exports = upload;
