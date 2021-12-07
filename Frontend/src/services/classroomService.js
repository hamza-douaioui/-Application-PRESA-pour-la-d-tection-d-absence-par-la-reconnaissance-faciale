import http from "./httpService";
import { apiEndpoint } from "../configurations/apiConfig.json";

const classroomsEndpoit = apiEndpoint + "/classrooms";

export function getClassrooms() {
  return http.get(classroomsEndpoit);
}

export function getClassroom(id) {
  return http.get(classroomsEndpoit + "/" + id);
}

export function deleteClassroom(id) {
  return http.delete(classroomsEndpoit + "/" + id);
}

export function addClassroom(classroom) {
  return http.post(classroomsEndpoit, classroom);
}

export function updateClassroom(classroom) {
  const data = { ...classroom };
  delete data._id;
  return http.put(classroomsEndpoit + "/" + classroom._id, data);
}

export function saveClassroom(classroom) {
  if (classroom._id) {
    return updateClassroom(classroom);
  }
  return addClassroom(classroom);
}
