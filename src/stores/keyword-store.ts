import axios from "axios";
import { logInfo } from "../util";
import { LogHandleAxiosError } from "../util/axios-helpers";

const getStoreUrl = (): string => {
  if (process.env.KEYWORD_LOCAL_STORE) {
    return process.env.KEYWORD_LOCAL_STORE;
  }
  if (process.env.KEYWORD_STORE) {
    return process.env.KEYWORD_STORE;
  }
};

const store = axios.create({
  baseURL: getStoreUrl()
});

export interface IKeywordCollection {
  documents: [
    {
      id: string;
      keyPhrases: string[];
    }
  ];
  errors: string[];
}

async function GetKeywords(filepath: string): Promise<IKeywordCollection> {
  const params = "?path=" + filepath;
  const url = getStoreUrl() + params;

  try {
    const result = await store.get(params);
    logInfo("GET", result.status, url);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

export const KeywordStore = {
  GetKeywords: GetKeywords
};
