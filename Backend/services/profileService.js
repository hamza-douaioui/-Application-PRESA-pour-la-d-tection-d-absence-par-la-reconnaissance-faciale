const fs = require("fs").promises;
const filesService = require("../services/fileService");
const path = require("path");
const slash = require("slash");

const baseUrl = slash(path.join(__dirname, "../uploads", "profiles"));

function getFilePath(fileName) {
  return slash(path.join(baseUrl, fileName));
}

async function readProfile(fileName) {
  return await fs.readFile(getFilePath(fileName));
}

async function saveProfile(file) {
  await filesService.saveFile(file, baseUrl);
}

function validateProfile(file) {
  const authorizedExtensions = /jpg|jpeg|png|PNG|JPG|JPEG/;
  return filesService.validateFile(file, authorizedExtensions);
}

module.exports.getFilePath = getFilePath;
module.exports.readProfile = readProfile;
module.exports.saveProfile = saveProfile;
module.exports.validateProfile = validateProfile;
