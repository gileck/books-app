import { ApiHandlers } from "./types";
import * as chat from "./chat/server";
import * as clearCache from "./settings/clearCache/server";
import * as fileManagement from "./fileManagement/server";
import * as aiUsage from "./monitoring/aiUsage/server";
import * as books from "./books/server";
import { GetAllAIUsageRequest, GetAIUsageSummaryRequest } from "./monitoring/aiUsage/types";
import { BookSearchRequest, BookDetailsRequest } from "./books/types";

export const apiHandlers: ApiHandlers = {
  [chat.name]: { process: chat.process as (params: unknown) => Promise<unknown>},
  [clearCache.name]: { process: clearCache.process as (params: unknown) => Promise<unknown>},
  [fileManagement.name]: { process: fileManagement.process as (params: unknown) => Promise<unknown>},
  [books.searchApiName]: { 
    process: (params: unknown) => books.searchBooks(params as BookSearchRequest) 
  },
  [books.detailsApiName]: { 
    process: (params: unknown) => books.getBookById(params as BookDetailsRequest) 
  },
  [aiUsage.allUsageApiName]: { 
    process: (params: unknown) => aiUsage.process(params as GetAllAIUsageRequest, 'all') as Promise<unknown>
  },
  [aiUsage.summaryApiName]: { 
    process: (params: unknown) => aiUsage.process(params as GetAIUsageSummaryRequest, 'summary') as Promise<unknown>
  },
};
