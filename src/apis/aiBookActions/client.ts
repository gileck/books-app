import { BookAiActionRequest, BookAiActionResponse } from "./types";
import apiClient from "../../client/utils/apiClient";
import { name } from "./index";
import type { CacheResult } from "../../server/cache/types";

/**
 * Client function to call the AI book actions API
 * This is used by the client-side code to trigger AI actions on books
 */
export const performBookAiAction = async (request: BookAiActionRequest): Promise<CacheResult<BookAiActionResponse>> => {
  return apiClient.call<CacheResult<BookAiActionResponse>, BookAiActionRequest>(
    name,
    request
  );
};
