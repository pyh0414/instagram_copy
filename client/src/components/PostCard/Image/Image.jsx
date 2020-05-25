import React from "react";

import { ImgCustom } from "./style";

const Image = ({ images }) => {
	return (
		<>
			<ImgCustom src={`http://localhost:3060/${images[0].src}`} />
		</>
	);
};

export default Image;
