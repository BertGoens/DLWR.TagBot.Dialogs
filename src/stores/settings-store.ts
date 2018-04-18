import axios from "axios";
import { logInfo } from "../util/logger";
import { LogHandleAxiosError } from "../util/axios-helpers";
import { getStoreUrl } from "../util/store-helper";

const myStoreUrl = getStoreUrl({
  devStore: process.env.SETTINGS_LOCAL_STORE,
  prodStore: process.env.SETTINGS_STORE
});

logInfo("Settings StoreUrl:", myStoreUrl);

const store = axios.create({
  baseURL: myStoreUrl
});

export interface ISettings {
  userId?: string;
  channelId?: string;
  botMutedUntill?: Date;
  lastMessageSent?: Date;
}

async function GetSettingsById(
  id: string,
  channel?: string
): Promise<ISettings> {
  const params = `?id=${id}`;
  const url = myStoreUrl + params;

  try {
    const result = await store.get(params);
    logInfo("GET", result.status, url);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

async function SaveSettingsById(
  id: string,
  settings: ISettings
): Promise<ISettings> {
  const params = `?id=${id}`;
  const url = store.defaults.baseURL + params;
  try {
    var result = await store.put(params, settings);
    logInfo("PUT", result.status, url);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

async function CreateSettings(
  id: string,
  settings: ISettings
): Promise<ISettings> {
  const params = "";
  const url = store.defaults.baseURL + params;
  try {
    logInfo("POST", result.status, url);
    var result = await store.post(params, settings);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

export const SettingsStore = {
  CreateSettings: CreateSettings,
  SaveSettingsById: SaveSettingsById,
  GetSettingsById: GetSettingsById
};
