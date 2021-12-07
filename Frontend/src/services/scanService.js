import http from "./httpService";
import { jsonToFormData } from "./formDataService";
import { apiEndpoint } from "../configurations/apiConfig.json";

const scanEndpoint = apiEndpoint + "/scans";

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

export async function scan(data) {
  return await http.post(scanEndpoint, jsonToFormData(data), config);
}
