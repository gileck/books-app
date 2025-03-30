import { 
  FileManagementRequest, 
  FileManagementResponse,
  ListFilesResponse,
  WriteFileResponse,
  DeleteFileResponse,
  CreateFolderResponse,
  DeleteFolderResponse
} from "./types";
import apiClient from "../../clientUtils/apiClient";
import { name } from "./index";
import type { CacheResult } from "@/serverUtils/cache/types";

// Main function to manage files
export const manageFiles = async (
  request: FileManagementRequest
): Promise<CacheResult<FileManagementResponse>> => {
  return apiClient.call<CacheResult<FileManagementResponse>, FileManagementRequest>(
    name,
    request
  );
};

// Helper functions for specific operations
export const listFiles = async (
  prefix?: string
): Promise<CacheResult<ListFilesResponse>> => {
  return manageFiles({ action: 'list', prefix }) as Promise<CacheResult<ListFilesResponse>>;
};

export const writeFile = async (
  fileName: string,
  content: string,
  contentType?: string
): Promise<CacheResult<WriteFileResponse>> => {
  return manageFiles({
    action: 'write',
    fileName,
    content,
    contentType
  }) as Promise<CacheResult<WriteFileResponse>>;
};

export const deleteFile = async (
  fileName: string
): Promise<CacheResult<DeleteFileResponse>> => {
  return manageFiles({
    action: 'delete',
    fileName
  }) as Promise<CacheResult<DeleteFileResponse>>;
};

export const createFolder = async (
  folderName: string
): Promise<CacheResult<CreateFolderResponse>> => {
  return manageFiles({
    action: 'createFolder',
    folderName
  }) as Promise<CacheResult<CreateFolderResponse>>;
};

export const deleteFolder = async (
  folderName: string
): Promise<CacheResult<DeleteFolderResponse>> => {
  return manageFiles({
    action: 'deleteFolder',
    folderName
  }) as Promise<CacheResult<DeleteFolderResponse>>;
};
