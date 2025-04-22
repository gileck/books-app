import { ApiHandlers } from "./types";
import * as chat from "./chat/server";
import * as clearCache from "./settings/clearCache/server";
import * as fileManagement from "./fileManagement/server";
import * as aiUsage from "./monitoring/aiUsage/server";
import * as books from "./books/server";
import * as aiBookActions from "./aiBookActions/server";


export const apiHandlers: ApiHandlers = {
  [chat.name]: { process: chat.process as (params: unknown) => Promise<unknown> },
  [clearCache.name]: { process: clearCache.process as (params: unknown) => Promise<unknown> },
  [fileManagement.name]: { process: fileManagement.process as (params: unknown) => Promise<unknown> },
  [aiUsage.all]: { process: aiUsage.getAllUsage as (params: unknown) => Promise<unknown> },
  [aiUsage.summary]: { process: aiUsage.getSummary as (params: unknown) => Promise<unknown> },
  [books.searchApiName]: { process: books.searchBooks as (params: unknown) => Promise<unknown> },
  [books.detailsApiName]: { process: books.getBookById as (params: unknown) => Promise<unknown> },
  [aiBookActions.name]: { process: aiBookActions.process as (params: unknown) => Promise<unknown> },
};
