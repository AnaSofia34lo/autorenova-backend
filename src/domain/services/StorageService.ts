import { UploadedFile } from '../entities/UploadedFile.js';

export interface StorageService {
  uploadFile(file: UploadedFile, folder: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}
