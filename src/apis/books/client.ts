import { BookSearchRequest, BookSearchResponse, BookDetailsRequest, BookDetailsResponse } from "./types";
import apiClient from "../../client/utils/apiClient";
import { searchApiName, detailsApiName } from "./server";
import type { CacheResult } from "../../server/cache/types";

// Client function to call the book search API
export const searchBooks = async (request: BookSearchRequest): Promise<CacheResult<BookSearchResponse>> => {
  return apiClient.call<CacheResult<BookSearchResponse>, BookSearchRequest>(
    searchApiName,
    request,
    {
      disableCache: true
    }
  );
};

// Client function to call the book details API
export const getBookById = async (request: BookDetailsRequest): Promise<CacheResult<BookDetailsResponse>> => {
  return apiClient.call<CacheResult<BookDetailsResponse>, BookDetailsRequest>(
    detailsApiName,
    request
  );
};
