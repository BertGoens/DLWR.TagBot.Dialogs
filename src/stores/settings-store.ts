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
): Promise<ISettings> => {
  try {
    const response = await store.get(`/?id=${id}`);
    const data: ISettings = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};

const SaveSettingsById = async (
  id: string,
  settings: ISettings
): Promise<boolean> => {
  try {
    var result = await store.put(`/?id=${id}`, settings);
    console.log(result);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const CreateSettings = (id: string, settings: ISettings): boolean => {
  try {
    var result = store.post("/", settings);
    console.log(result);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const SettingsStore = {
  CreateSettings: CreateSettings,
  SaveSettingsById: SaveSettingsById,
  GetSettingsById: GetSettingsById
};
