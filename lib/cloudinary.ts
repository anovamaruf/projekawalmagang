import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drtw0hnds';
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '131972358999935';
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || 'mo0_yHDYrABA3uaknaxlcHO9Z0Q';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;