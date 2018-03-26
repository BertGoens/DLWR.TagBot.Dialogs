import axios, { AxiosPromise } from "axios";
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
  botMutedUntill: Date;
}

const GetSettingsById = async (
  id: string,
  channel?: string
): Promise<{ error: any; data: ISettings }> => {
  var errResult: any = {};
  try {
    const params = `?id=${id}`;
    const url = store.defaults.baseURL + params;
    logDebug("GET ", url);
    const result = await store.get(params);
    return { error: null, data: result.data };
  } catch (err) {
    errResult = err;
    logError(err);
    Promise.reject(err);
  }
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
