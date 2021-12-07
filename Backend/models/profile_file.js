const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req, res, callback) {
    callback(null, "uploads/profiles");
  },
  filename: function(req, file, callback) {
    const fileParse = path.parse(file.originalname);
    const name = fileParse.name;
    const extension = fileParse.ext;
    const fileName = file.fieldname + name + Date.now() + extension;
    callback(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000
  },
  fileFilter: function(req, file, callback) {
    const result = validateFile(file);

    if (result) return callback(null, false);

    callback(null, true);
  }
});

function validateFile(file) {
  if (!file) return "No File Selected";

  const authorizedExtensions = /jpg|jpeg|png|PNG|JPG|JPEG/;

  const fileName = path.extname(file.originalname).toLowerCase();
  const isImage = authorizedExtensions.test(fileName);
  const isImageMimeType = authorizedExtensions.test(file.mimetype);

  if (isImage && isImageMimeType) return null;

  return "Not a Valide Image";
}

module.exports.upload = upload;
