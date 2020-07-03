import React, { useState, useCallback } from "react";
import { Input } from "antd";

const HeaderInput = ({ onDelaySearch }) => {
	const [userId, setUserId] = useState("");
	const onChangeUserId = useCallback(
		(e) => {
			const userId = e.target.value;
			setUserId(userId);
			onDelaySearch(userId);
		},
		[userId]
	);

	return (
		<>
			<Input.Search
				size="small"
				style={{ width: "70%" }}
				onChange={onChangeUserId}
				value={userId}
			/>
		</>
	);
};

export default HeaderInput;
