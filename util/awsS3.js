import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

// Create the S3 client lazily so environment variables (dotenv) can be loaded
// before the client is constructed. This prevents creating a client with
// undefined credentials which causes "resolved credential object not valid".
let s3Client = null;
function getS3Client() {
  if (s3Client) return s3Client;

  const accessKeyId = process.env.aws_bucket_key_id;
  const secretAccessKey = process.env.aws_bucket_key;
  const region = process.env.aws_region;

  if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS credentials appear to be missing. Check environment variables: aws_bucket_key_id and aws_bucket_key');
  }

  s3Client = new S3Client({
    region,
    credentials: accessKeyId && secretAccessKey ? {
      accessKeyId,
      secretAccessKey
    } : undefined
  });

  return s3Client;
}

export async function uploadFile(fileStream, fileName) {
  const s3 = getS3Client();

  const uploadParams = {
    Bucket: process.env.aws_bucket_name,
    Key: fileName, // file name
    Body: fileStream, // file content
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    // console.log("Upload success:", data);
    return data;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

// Usage:
// uploadFile("your-bucket-name", "destination-key-in-s3", "local-file-path");c

export default uploadFile