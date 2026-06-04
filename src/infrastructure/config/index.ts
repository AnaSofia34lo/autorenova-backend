import 'dotenv/config';

export const config = {
  port: process.env['PORT'] || '5000',
  databaseUrl: process.env['DATABASE_URL'],
  jwtSecret: process.env['JWT_SECRET'] || 'fallback-super-secret-key-change-me',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || '24h',
  adminEmail: process.env['ADMIN_EMAIL'] || 'admin@autorenova.com',
  adminPassword: process.env['ADMIN_PASSWORD'] || 'AdminPass123!',
  supabaseS3Endpoint: process.env['SUPABASE_S3_ENDPOINT'],
  s3AccessKeyId: process.env['S3_ACCESS_KEY_ID'],
  s3SecretAccessKey: process.env['S3_SECRET_ACCESS_KEY'],
  s3Region: process.env['S3_REGION'] || 'us-east-1',
  s3BucketName: process.env['S3_BUCKET_NAME'] || 'autorenova-bucket',
  supabaseStoragePublicUrl: process.env['SUPABASE_STORAGE_PUBLIC_URL'],
  frontendUrl: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  apiBaseUrl: process.env['API_BASE_URL'] || 'http://localhost:5000/api/v1'
};

export default config;
