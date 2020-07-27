import React from "react";

import { ImgCustom } from "./style";

const Image = ({ images }) => {
	return (
		<>
			{
				<ImgCustom
					src={`http://${process.env.REACT_APP_DEV_SERVER}/${images[0].src}`}
				/>
			}
		</>
	);
};

export default Image;
