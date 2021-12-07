import http from "./httpService";
import { jsonToFormData } from "./formDataService";
import { apiEndpoint } from "../configurations/apiConfig.json";

const studentsEndpoit = apiEndpoint + "/students";

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

function getStudentEndPoint(id) {
  return studentsEndpoit + "/" + id;
}

export function getStudent(id) {
  return http.get(getStudentEndPoint(id));
}

export function addStudent(student) {
  return http.post(studentsEndpoit, jsonToFormData(student), config);
}

export function updateStudent(student) {
  const data = { ...student };
  delete data._id;
  return http.put(getStudentEndPoint(student._id), jsonToFormData(data), config);
}

export function deleteStudent(id) {
  return http.delete(getStudentEndPoint(id));
}

export function saveStudent(student) {
  if (student._id) {
    return updateStudent(student);
  }
  return addStudent(student);
}

export function getStudents() {
  return http.get(studentsEndpoit);
}

export async function getStudentAvatar(student) {
  const { _id } = student;

  const config = {
    responseType: "blob",
  };

  const url = getStudentEndPoint(_id) + "/avatar";

  const { data: image } = await http.get(url, config);

  return URL.createObjectURL(image);
}

export async function getStudentProfile(student, fileName) {
  const { _id } = student;

  const config = {
    responseType: "blob",
  };

  const url = getStudentEndPoint(_id) + "/profiles/" + fileName;

  const { data: image } = await http.get(url, config);

  return URL.createObjectURL(image);
}

export function addProfilesToStudent(student, profiles) {
  const { _id } = student;

  const formData = new FormData();

  for (let i = 0; i < profiles.length; i++) {
    formData.append("profiles", profiles[i]);
  }

  const url = getStudentEndPoint(_id) + "/profiles";

  return http.post(url, formData, config);
}
