import Axios from "axios";

Axios.interceptors.response.use(null, (error) => {
  const expectedError = error.response && error.status >= 400 && error.status < 500;
  if (!expectedError) console.log("Log The Error In  a Logger", error);

  return Promise.reject(error);
});

function setJwtAuthToken(jwt) {
  Axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: Axios.get,
  post: Axios.post,
  put: Axios.put,
  delete: Axios.delete,
  options: Axios.options,
  setJwtAuthToken,
};
