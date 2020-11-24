import React from "react";

import { ImgCustom } from "./style";

const Image = ({ images }) => {
  return <>{<ImgCustom src={`${images[0].src}`} />}</>;
};

export default Image;
