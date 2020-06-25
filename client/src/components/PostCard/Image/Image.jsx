import React from "react";

import { ImgCustom } from "./style";

const Image = ({ images }) => {
	return <>{<ImgCustom src={`http://localhost:4000/${images[0].src}`} />}</>;
};

export default Image;
