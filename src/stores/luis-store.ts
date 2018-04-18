import axios from "axios";
import { logInfo } from "../util";
import { LogHandleAxiosError } from "../util/axios-helpers";

const storeUrl = process.env.LUIS_MODEL_URL;

const store = axios.create({
  baseURL: storeUrl
});

interface ILuisEntity {
  entity: string | number;
  type: string;
  startIndex: number;
  endIndex: number;
  resolution?: {
    value: string | number;
  };
  score: number;
}

interface ILuisIntent {
  intent: string;
  score: number;
}

export interface ILuisResponse {
  entities: ILuisEntity[];
  intents: ILuisIntent[];
  query: string;
  topScoringIntent: ILuisIntent;
}

async function recognize(utterance: string): Promise<ILuisResponse> {
  const url = storeUrl + utterance;

  try {
    const result = await store.get(utterance);
    logInfo(result.config.method, result.status, result.config.url);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

export const LuisStore = {
  Recognize: recognize
};
