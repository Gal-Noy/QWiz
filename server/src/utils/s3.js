import AWS from "aws-sdk";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadFile = async (fileContent, fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: fileType,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data.Location);
    });
  });
};

const getPresignedUrl = async (fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60 * 5, // 5 minutes
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (error, url) => {
      if (error) {
        reject(error);
      }
      resolve(url);
    });
  });
};

export { uploadFile, getPresignedUrl };
