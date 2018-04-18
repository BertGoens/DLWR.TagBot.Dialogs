import axios from "axios";
import { logInfo } from "../util";
import { LogHandleAxiosError } from "../util/axios-helpers";

const getStoreUrl = (): string => {
  if (process.env.SETTINGS_LOCAL_STORE) {
    return process.env.SETTINGS_LOCAL_STORE;
  }
  if (process.env.SETTINGS_STORE) {
    return process.env.SETTINGS_STORE;
  }
};

const store = axios.create({
  baseURL: getStoreUrl()
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
  const url = getStoreUrl() + params;

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
