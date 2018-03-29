import { logInfo, logError } from "../util";

export const LogHandleAxiosError = ({ error: error, url: url }) => {
  logInfo(`${error.response && error.response.status} ${url}`);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    logError(error.message);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    logError(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    logError("Error", error.message);
  }
};
