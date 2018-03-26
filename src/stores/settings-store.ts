import axios from "axios";
import { logInfo, logError, logDebug } from "../util";

var storeUrl = "";
if (
  process.env.NODE_ENV == "PRODUCTION" ||
  process.env.NODE_ENV == "production"
) {
  storeUrl = process.env.SETTINGS_STORE;
} else if (process.env.SETTINGS_LOCAL_STORE) {
  storeUrl = process.env.SETTINGS_LOCAL_STORE;
} else {
  storeUrl = process.env.SETTINGS_STORE;
}

logInfo("Settings-store Url: " + storeUrl);
const store = axios.create({
  baseURL: storeUrl
});

export interface ISettings {
  userId: string;
  channelId: string;
  botMutedUntill?: Date;
  lastMessageSent?: Date;
}

const GetSettingsById = (
  id: string,
  channel?: string
): Promise<{ error: any; data: ISettings }> => {
  const params = `?id=${id}`;
  const url = store.defaults.baseURL + params;
  logDebug("GET ", url);
  return store
    .get(params)
    .then(function(result) {
      logDebug("succesfull " + url + " request");
      return { error: null, data: result.data };
    })
    .catch(function(error) {
      logInfo(
        `Request: ${url} failed: ${error.response && error.response.status}`
      );
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

      return { error: error, data: null };
    });
};

const SaveSettingsById = async (
  id: string,
  settings: ISettings
): Promise<{ error: any; result: boolean }> => {
  try {
    const params = `?id=${id}`;
    const url = store.defaults.baseURL + params;
    logDebug("PUT ", url);
    var result = await store.put(params, settings);
    return { error: null, result: true };
  } catch (err) {
    logError(err);
    Promise.reject(err);
  }
};

const CreateSettings = async (
  id: string,
  settings: ISettings
): Promise<{ error: any; result: boolean }> => {
  try {
    const params = "";
    const url = store.defaults.baseURL + params;
    logDebug("POST ", url);
    var result = await store.post(params, settings);
    return { error: null, result: true };
  } catch (err) {
    logError(err);
    Promise.reject(err);
  }
};

export const SettingsStore = {
  CreateSettings: CreateSettings,
  SaveSettingsById: SaveSettingsById,
  GetSettingsById: GetSettingsById
};
