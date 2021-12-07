const fs = require("fs").promises;
const filesService = require("../services/fileService");

const baseUrl = __dirname + "/../uploads/avatars";

async function readAvatar(fileName) {
  return await fs.readFile(baseUrl + "/" + fileName);
}

async function saveAvatar(file) {
  await filesService.saveFile(file, baseUrl);
}

function validateAvatar(file) {
  const authorizedExtensions = /jpg|jpeg|png|PNG|JPG|JPEG/;
  return filesService.validateFile(file, authorizedExtensions);
}

module.exports.readAvatar = readAvatar;
module.exports.saveAvatar = saveAvatar;
module.exports.validateAvatar = validateAvatar;
