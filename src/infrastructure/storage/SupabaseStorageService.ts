import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StorageService } from '../../domain/services/StorageService.js';
import { UploadedFile } from '../../domain/entities/UploadedFile.js';
import { ValidationError } from '../../domain/errors/DomainError.js';

export class SupabaseStorageService implements StorageService {
  private readonly s3: S3Client | null = null;
  private readonly bucketName: string;
  private readonly publicUrlBase: string;

  constructor() {
    const endpoint = process.env['SUPABASE_S3_ENDPOINT'];
    const accessKeyId = process.env['S3_ACCESS_KEY_ID'];
    const secretAccessKey = process.env['S3_SECRET_ACCESS_KEY'];
    const region = process.env['S3_REGION'] || 'us-east-1';

    this.bucketName = process.env['S3_BUCKET_NAME'] || process.env['SUPABASE_BUCKET'] || 'autorenova-bucket';
    this.publicUrlBase = this.resolvePublicUrlBase(process.env['SUPABASE_STORAGE_PUBLIC_URL'] || endpoint || '');

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3 = new S3Client({
        endpoint,
        region,
        forcePathStyle: true,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      console.warn('Credenciales S3 de Supabase no configuradas. Las imágenes no se podrán subir.');
    }
  }

  async uploadFile(file: UploadedFile, folder: string): Promise<string> {
    if (!this.s3) {
      throw new ValidationError('Servicio de almacenamiento no configurado');
    }

    if (!this.publicUrlBase) {
      throw new ValidationError('SUPABASE_STORAGE_PUBLIC_URL no está configurada');
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new ValidationError('El archivo excede el tamaño máximo permitido de 5MB');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new ValidationError('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG, WEBP o GIF');
    }

    const originalExtension = file.filename.split('.').pop()?.toLowerCase();
    const extension = originalExtension || this.extensionFromMime(file.mimetype);
    const safeFolder = folder.replace(/^\/+|\/+$/g, '');
    const key = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    return `${this.publicUrlBase}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!this.s3 || !this.publicUrlBase) return false;

    const key = this.extractKeyFromUrl(fileUrl);
    if (!key) return false;

    try {
      await this.s3.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }));
      return true;
    } catch (error) {
      console.error('Error eliminando imagen del bucket:', error);
      return false;
    }
  }

  private extensionFromMime(mimetype: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    return extensions[mimetype] || 'jpg';
  }

  private resolvePublicUrlBase(rawUrl: string): string {
    const trimmed = rawUrl.replace(/\/$/, '');
    if (!trimmed) return '';

    if (trimmed.endsWith('/storage/v1/s3')) {
      return trimmed.replace('/storage/v1/s3', `/storage/v1/object/public/${this.bucketName}`);
    }

    if (!trimmed.includes('/storage/v1/object/public')) {
      return `${trimmed}/storage/v1/object/public/${this.bucketName}`;
    }

    if (!trimmed.endsWith(`/${this.bucketName}`)) {
      return `${trimmed}/${this.bucketName}`;
    }

    return trimmed;
  }

  private extractKeyFromUrl(fileUrl: string): string | null {
    if (fileUrl.startsWith(`${this.publicUrlBase}/`)) {
      return decodeURIComponent(fileUrl.slice(this.publicUrlBase.length + 1));
    }

    try {
      const url = new URL(fileUrl);
      const marker = `/object/public/${this.bucketName}/`;
      const markerIndex = url.pathname.indexOf(marker);
      if (markerIndex >= 0) {
        return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
      }
    } catch {
      return null;
    }

    return null;
  }
}
