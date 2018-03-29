import axios from "axios";
import { logInfo } from "../util";
import { LogHandleAxiosError } from "../util/axios-helpers";

const getStoreUrl = (): string => {
  if (process.env.SHAREPOINT_LOCAL_STORE) {
    return process.env.SHAREPOINT_LOCAL_STORE;
  }
  if (process.env.SHAREPOINT_STORE) {
    return process.env.SHAREPOINT_STORE;
  }
};

const store = axios.create({
  baseURL: getStoreUrl()
});

export interface IDocument {
  Name: string;
  Tags: string[];
  Location: string;
  Author: string;
  ListItemId: number;
}

export interface IQueryOptions {
  title?: string;
  author?: string;
}

async function GetDocuments(q: IQueryOptions): Promise<IDocument[]> {
  //searchquery="Title:*"&author=Thomas Maes"
  // ?searchquery="Author:John AND Title:Test*";
  const fillParams = (q: IQueryOptions) => {
    let result = "";
    if (q.title && q.author) {
      return `?searchQuery="Title:${q.title}* AND Author=${q.author}"`;
    } else if (q.title) {
      return `?searchQuery="Title:${q.title}*"`;
    } else if (q.author) {
      return `?searchQuery="Author:${q.author}"`;
    } else {
      return `?searchQuery="Title:*"`;
    }
  };
  const params = fillParams(q);
  const url = getStoreUrl() + params;

  try {
    const result = await store.get(params);
    logInfo("GET", result.status, url);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

export const SharePointStore = {
  GetDocuments: GetDocuments
};
