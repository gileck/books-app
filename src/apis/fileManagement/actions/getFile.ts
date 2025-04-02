import { GetFileRequest, GetFileResponse } from '../types';
import { getFileAsString } from '@/server/s3/sdk';

export async function getFile(request: GetFileRequest): Promise<GetFileResponse> {
  if (!request.fileName) {
    return {
      content: "",
      error: "Missing required field: fileName"
    };
  }
  
  try {
    // Use filePath + fileName if filePath is provided, otherwise just fileName
    const fullPath = request.filePath 
      ? `${request.filePath}/${request.fileName}` 
      : request.fileName;
    
    const content = await getFileAsString(fullPath);
    return { 
      content,
      contentType: request.fileName.endsWith('.json') ? 'application/json' : 
                  request.fileName.endsWith('.txt') ? 'text/plain' :
                  'text/plain'
    };
  } catch (error) {
    return {
      content: "",
      error: `Failed to get file: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
