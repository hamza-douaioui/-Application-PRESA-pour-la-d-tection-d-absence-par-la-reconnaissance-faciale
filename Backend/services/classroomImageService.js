const fs = require("fs").promises;
const filesService = require("../services/fileService");
const path = require("path");
const slash = require("slash");

const baseUrl = slash(path.join(__dirname, "../uploads", "classrooms"));

function getBaseUrl() {
  return baseUrl;
}

function getFilePath(fileName) {
  return slash(path.join(baseUrl, fileName));
}

async function readClassroomImage(fileName) {
  return await fs.readFile(getFilePath(fileName));
}

async function saveClassroomImage(file) {
  await filesService.saveFile(file, baseUrl);
}

function validateClassroomImage(file) {
  const authorizedExtensions = /jpg|jpeg|png|PNG|JPG|JPEG/;
  return filesService.validateFile(file, authorizedExtensions);
}

module.exports.getBaseUrl = getBaseUrl;
module.exports.getFilePath = getFilePath;
module.exports.readClassroomImage = readClassroomImage;
module.exports.saveClassroomImage = saveClassroomImage;
module.exports.validateClassroomImage = validateClassroomImage;
