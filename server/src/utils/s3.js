import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/**
 * Upload a file to S3
 *
 * @async
 * @function uploadFile
 * @param {Buffer} fileContent - The file content
 * @param {string} fileName - The file name
 * @param {string} fileType - The file type
 * @returns {Promise<string>} - The file URL
 */
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

/**
 * Get a presigned URL for a file
 *
 * @async
 * @function getPresignedUrl
 * @param {string} fileName - The file name
 * @returns {Promise<string>} - The presigned URL
 */
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

/**
 * Delete a file from S3
 *
 * @async
 * @function deleteFile
 * @param {string} fileName - The file name
 * @returns {Promise<object>} - The S3 response
 */
const deleteFile = async (fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

export { uploadFile, getPresignedUrl, deleteFile };
