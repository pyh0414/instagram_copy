import AWS from "aws-sdk";
import randomstring from "randomstring";

export const s3UploadFile = async (file) => {
  const { createReadStream, mimetype } = await file;

  const imageType = mimetype.split("/")[1];
  const fileName = `${randomstring.generate(10)}.${imageType}`;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const s3 = new AWS.S3({ region: process.env.AWS_RAWS_REGIONEGION });
  const params = {
    ACL: "public-read",
    Bucket: process.env.S3_ORIGIN_BUCKET_NAME,
    Body: createReadStream(),
    Key: fileName,
    ContentType: imageType, // 주석처리하면 s3파일을 웹페이지에서 열어보는 것이 아닌 다운로드 받게됨
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("error uploading...", err);
        reject(err);
      } else {
        console.log("successfully uploaded file...", data);
        resolve(data.Location);
      }
    });
  });
};
