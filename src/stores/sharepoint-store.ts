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
  Title: string;
  Tags: string[];
  Path: string;
  Author: string;
  ListItemID: number;
}

export interface IQueryOptions {
  title?: string[];
  author?: string[];
  filetype?: string[];
}

async function GetDocuments(q: IQueryOptions): Promise<IDocument[]> {
  // match the query language
  // https://docs.microsoft.com/en-us/sharepoint/dev/general-development/keyword-query-language-kql-syntax-reference
  const fillParams = (q: IQueryOptions) => {
    let result = "?searchQuery=";

    if (q.title) {
      q.title.forEach(myTitle => {
        result += `(title:${myTitle}*) `;
      });
    }
    if (q.author) {
      q.author.forEach(myAuthor => {
        result += `(author:${myAuthor}*) `;
      });
    }
    if (q.filetype) {
      q.filetype.forEach(myFiletype => {
        result += `(filetype:${myFiletype}) `;
      });
    }

    return result;
  };

  const params = fillParams(q);
  const url = getStoreUrl() + params;

  try {
    const result = await store.get(params);
    // Works: http://localhost:4000/api/SharePoint?searchquery=(filetype:docx) (filetype:txt)
    logInfo("GET", result.status, url);
    return result.data;
  } catch (error) {
    LogHandleAxiosError({ error: error, url: url });
  }
}

export const SharePointStore = {
  GetDocuments: GetDocuments
};
