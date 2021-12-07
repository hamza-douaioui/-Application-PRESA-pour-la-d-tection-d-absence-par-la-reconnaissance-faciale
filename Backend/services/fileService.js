const fs = require("fs").promises;
const path = require("path");

async function saveBufferAsFile(directory, fileName, buf) {
  await fs.mkdir(directory, { recursive: true });

  await fs.writeFile(path.resolve(directory, fileName), buf);
}

async function saveFile(file, directory) {
  var oldpath = file.path;
  var newpath = directory + "/" + file.name;
  await fs.rename(oldpath, newpath);
}

function generateName(file) {
  const fileParse = path.parse(file.name);
  const name = fileParse.name;
  const extension = fileParse.ext;
  return name + Date.now() + extension;
}

function validateFile(file, authorizedExtensions) {
  if (!file) return "No File Selected";

  const fileName = path.extname(file.name).toLowerCase();
  const isImage = authorizedExtensions.test(fileName);
  const isImageMimeType = authorizedExtensions.test(file.type);

  if (isImage && isImageMimeType) return null;

  return "Not a Valide File Type";
}

module.exports.saveBufferAsFile = saveBufferAsFile;
module.exports.generateName = generateName;
module.exports.saveFile = saveFile;
module.exports.validateFile = validateFile;
