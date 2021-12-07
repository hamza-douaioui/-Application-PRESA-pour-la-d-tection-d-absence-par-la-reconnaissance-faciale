import http from "./httpService";
import { apiEndpoint } from "../configurations/apiConfig.json";

const absentsEndpoit = apiEndpoint + "/absents";

export function getAbsents() {
  return http.get(absentsEndpoit);
}
