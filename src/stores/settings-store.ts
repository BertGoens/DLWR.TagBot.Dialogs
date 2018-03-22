import axios from "axios";
import { info, error, debug } from "../util";

var storeUrl = "";
if (
  process.env.NODE_ENV == "PRODUCTION" ||
  process.env.NODE_ENV == "production"
) {
  storeUrl = process.env.SETTINGS_STORE;
} else {
  storeUrl =
    process.env.SETTINGS_LOCAL_STORE || "http://localhost:4000/api/settings";
}

info("Settings-store Url: " + storeUrl);
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
  try {
    const params = `/?id=${id}`;
    const url = store.defaults.baseURL + params;
    debug("GET ", url);
    const response = await store.get(params);
    const data: ISettings = response.data;
    return { error: null, data: data };
  } catch (err) {
    error(err);
    return { error: err, data: null };
  }
};

const SaveSettingsById = async (
  id: string,
  settings: ISettings
): Promise<{ error: any; result: boolean }> => {
  try {
    const params = `/?id=${id}`;
    const url = store.defaults.baseURL + params;
    debug("PUT ", url);
    var result = await store.put(params, settings);
    return { error: null, result: true };
  } catch (err) {
    error(err);
    return { error: err, result: null };
  }
};

const CreateSettings = async (
  id: string,
  settings: ISettings
): Promise<{ error: any; result: boolean }> => {
  try {
    const params = "/";
    const url = store.defaults.baseURL + params;
    debug("POST ", url);
    var result = await store.post(params, settings);
    return { error: null, result: true };
  } catch (err) {
    error(err);
    return { error: err, result: null };
  }
};

export const SettingsStore = {
  CreateSettings: CreateSettings,
  SaveSettingsById: SaveSettingsById,
  GetSettingsById: GetSettingsById
};
