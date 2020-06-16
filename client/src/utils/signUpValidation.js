import { message } from "antd";

export default ({
	userPw,
	userPwCheck,
	profile,
	hasSameIdChecked,
	hasSameId,
}) => {
	if (userPw !== userPwCheck) {
		message.error("비밀번호가 서로 다릅니다.", 0.5);
		return false;
	}

	if (profile.trim() === "") {
		message.error("프로필을 입력해 주세요.", 0.5);
		return false;
	}
	if (!hasSameIdChecked) {
		message.error("아이디 중복확인을 해주세요", 0.5);
		return false;
	}
	if (hasSameId) {
		message.error("중복된 아이디 입니다", 0.5);
		return false;
	}
	return true;
};
