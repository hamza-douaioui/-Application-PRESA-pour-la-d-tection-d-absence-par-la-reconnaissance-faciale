import http from "./httpService";
import { jsonToFormData } from "./formDataService";
import { apiEndpoint } from "../configurations/apiConfig.json";

const usersEndpoint = apiEndpoint + "/users";

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

export function register(user) {
  return http.post(usersEndpoint, jsonToFormData(user), config);
}

export async function getUserAvatar() {
  const url = usersEndpoint + "/me/avatar/";
  const config = {
    responseType: "blob",
  };

  const { data: image } = await http.get(url, config);

  return URL.createObjectURL(image);
}
