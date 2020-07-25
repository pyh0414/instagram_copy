import AWS from "aws-sdk";

export const s3UploadFile = async (file) => {
	const { createReadStream, filename } = await file;

	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	});
	const s3 = new AWS.S3({ region: process.env.AWS_RAWS_REGIONEGION });

	const s3DefaultParams = {
		ACL: "public-read",
		Bucket: process.env.S3_BUCKET_NAME,
		Conditions: [
			["content-length-range", 0, 1024000], // 1 Mb
			{ acl: "public-read" },
		],
	};

	return new Promise((resolve, reject) => {
		s3.upload(
			{
				...s3DefaultParams,
				Body: createReadStream(),
				Key: `${filename}`,
			},
			(err, data) => {
				if (err) {
					console.log("error uploading...", err);
					reject(err);
				} else {
					console.log("successfully uploaded file...", data);
					resolve(data.Location);
				}
			}
		);
	});
};
