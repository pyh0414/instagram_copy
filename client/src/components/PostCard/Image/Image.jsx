import React from "react";

import { ImgCustom } from "./style";

const Image = ({ images }) => {
	return (
		<>
			{
				<ImgCustom
					src={`http://${process.env.REACT_APP_SERVER_DOMAIN}/${images[0].src}`}
				/>
			}
		</>
	);
};

export default Image;
