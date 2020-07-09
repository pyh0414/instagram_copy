import React, { useState, useCallback } from "react";
import { Input } from "antd";

const HeaderInput = ({ onDelaySearch }) => {
	const [userId, setUserId] = useState("");
	const onChangeUserId = useCallback(
		(e) => {
			setUserId(e.target.value);
			onDelaySearch(e.target.value);
		},
		[onDelaySearch]
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
