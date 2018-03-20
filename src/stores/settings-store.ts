// @ts-ignore
import axios, { AxiosRequestConfig, AxiosPromise } from "axios";

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

console.log("Settings-store Url: " + storeUrl);
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
    const response = await store.get(`/?id=${id}`);
    const data: ISettings = response.data;
    return { error: null, data: data };
  } catch (error) {
    console.error(error);
    return { error: error, data: null };
  }
};

const SaveSettingsById = async (
  id: string,
  settings: ISettings
): Promise<{ error: any; result: boolean }> => {
  try {
    var result = await store.put(`/?id=${id}`, settings);
    console.log(result);
    return { error: null, result: true };
  } catch (error) {
    console.error(error);
    return { error: error, result: null };
  }
};

const CreateSettings = (
  id: string,
  settings: ISettings
): { error: any; result: boolean } => {
  try {
    var result = store.post("/", settings);
    console.log(result);
    return { error: null, result: true };
  } catch (error) {
    console.error(error);
    return { error: error, result: null };
  }
};

export const SettingsStore = {
  CreateSettings: CreateSettings,
  SaveSettingsById: SaveSettingsById,
  GetSettingsById: GetSettingsById
};
