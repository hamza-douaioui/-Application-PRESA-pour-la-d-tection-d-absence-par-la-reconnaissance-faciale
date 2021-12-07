const tenserFlow = require("@tensorflow/tfjs-node");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// SsdMobilenetv1Options
const minConfidence = 0.3;

// TinyFaceDetectorOptions
const inputSize = 1000;
const scoreThreshold = 0.5;

async function initFaceDetector() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./weights");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./weights");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./weights");
}

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

function convertArrayToFloat32(array) {
  return new Float32Array(Object.values(array));
}

async function getFaceFromImage(filePath) {
  const image = await canvas.loadImage(filePath);

  await initFaceDetector();

  const faceDetectionOptions = getFaceDetectorOptions(faceapi.nets.ssdMobilenetv1);

  return await faceapi
    .detectSingleFace(image, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptor();
}

async function getFaceFromImage(filePath) {
  const image = await canvas.loadImage(filePath);

  await initFaceDetector();

  const faceDetectionOptions = getFaceDetectorOptions(faceapi.nets.ssdMobilenetv1);

  return await faceapi
    .detectSingleFace(image, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptor();
}

async function getAllFacesFromImage(filePath) {
  const image = await canvas.loadImage(filePath);

  await initFaceDetector();

  const faceDetectionOptions = getFaceDetectorOptions(faceapi.nets.ssdMobilenetv1);
  return await faceapi
    .detectAllFaces(image, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();
}

async function getDescriptorFromFace(face) {
  return face.descriptor;
}

async function getDescriptorFromImage(filePath) {
  const face = await getFaceFromImage(filePath);
  return await getDescriptorFromFace(face);
}

function getLabeledDescriptors(label, descriptorsArray) {
  const float32Descriptors = descriptorsArray.map((descriptor) =>
    convertArrayToFloat32(JSON.parse(descriptor))
  );
  return new faceapi.LabeledFaceDescriptors(label, float32Descriptors);
}

async function fileToCanvas(filePath) {
  const image = await canvas.loadImage(filePath);
  return await faceapi.createCanvasFromMedia(image);
}

function drawLabeledBoxOnFace(face, label, color = "rgba(0, 0, 255, 1)") {
  return new faceapi.draw.DrawBox(face.detection.box, {
    label: label,
    boxColor: color,
  });
}

async function compareTwoDescriptors(labeledDescriptors, otherDescriptors) {
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

  return faceMatcher.findBestMatch(otherDescriptors);
}

module.exports.getFaceFromImage = getFaceFromImage;
module.exports.getAllFacesFromImage = getAllFacesFromImage;
module.exports.getDescriptorFromFace = getDescriptorFromFace;
module.exports.getDescriptorFromImage = getDescriptorFromImage;
module.exports.fileToCanvas = fileToCanvas;
module.exports.drawLabeledBoxOnFace = drawLabeledBoxOnFace;
module.exports.getLabeledDescriptors = getLabeledDescriptors;
module.exports.compareTwoDescriptors = compareTwoDescriptors;
