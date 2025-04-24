import { BookAiActionRequest, BookAiActionResponse } from "./types";
import apiClient from "../../client/utils/apiClient";
import { name } from "./index";
import type { CacheResult } from "../../server/cache/types";
import type { ApiOptions } from "../../client/utils/apiClient";

/**
 * Client function to call the AI book actions API
 * This is used by the client-side code to trigger AI actions on books
 * @param request The request parameters
 * @param options Optional API options including cache settings
 */
export const performBookAiAction = async (
  request: BookAiActionRequest, 
  options?: ApiOptions
): Promise<CacheResult<BookAiActionResponse>> => {
  return apiClient.call<CacheResult<BookAiActionResponse>, BookAiActionRequest>(
    name,
    request,
    options
  );
};
