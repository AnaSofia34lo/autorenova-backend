import multer from 'multer';

// Use memory storage so files are not saved locally but sent straight to bucket
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
