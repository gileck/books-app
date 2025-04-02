/**
 * Client implementation for the AI usage monitoring API
 */

import apiClient from '@/client/utils/apiClient';
import { 
  GetAllAIUsageRequest, 
  GetAllAIUsageResponse, 
  GetAIUsageSummaryRequest, 
  GetAIUsageSummaryResponse 
} from './types';
import { allUsageApiName, summaryApiName } from './server';
import type { CacheResult } from '@/server/cache/types';

/**
 * Get all AI usage records with summary
 */
export const getAllUsage = async (
  params: GetAllAIUsageRequest = {}
): Promise<CacheResult<GetAllAIUsageResponse>> => {
  return apiClient.call<CacheResult<GetAllAIUsageResponse>, GetAllAIUsageRequest>(
    allUsageApiName,
    params,
    {
      disableCache: true
    }
  );
};

/**
 * Get AI usage summary
 */
export const getSummary = async (): Promise<CacheResult<GetAIUsageSummaryResponse>> => {
  return apiClient.call<CacheResult<GetAIUsageSummaryResponse>, GetAIUsageSummaryRequest>(
    summaryApiName,
    {},
    {
      disableCache: true
    } 
  );
};
