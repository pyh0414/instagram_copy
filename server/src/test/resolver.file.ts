import axios from "axios";
import { request } from "graphql-request";
import fs, { createWriteStream } from "fs";
import stream from "stream";

const UPLOAD_FILE = `
	mutation($file: Upload!) {
		uploadFile(file: $file)
	}
`;

const endPoint = "http://localhost:4000/graphql";

xdescribe("File Resover Test", () => {
	it("upload file", async () => {
		try {
			await axios({
				method: "get",
				url:
					"http://kinimage.naver.net/20200104_212/1578125107745Xh4B8_PNG/1578125107651.png",
				responseType: "stream",
			}).then(async function (res) {
				await res.data.pipe(fs.createWriteStream("testSample1.png")); // 일단 파일을 만들언 놓고,
			});

			const createReadStream = await fs.createReadStream("./testSample1.png");

			const file = {
				filename: "testSample2.png",
				mimetype: "image/jpeg",
				encoding: "",
				createReadStream,
			};

			const res = await request(endPoint, UPLOAD_FILE, {
				file,
			});
		} catch (err) {
			console.log("파일이 생성되지 않았습니다.");
		}
	});
});
