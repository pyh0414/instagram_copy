import React from "react";
import Slider from "react-slick";

import {
	MultiImageWrapper,
	SingleImageWrapper,
	MultiImage,
	SingleImage,
} from "./style";

const ImageCarousel = ({ images }) => {
	const setting = {
		dots: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		fade: true,
	};

	return (
		<div>
			<link
				rel="stylesheet"
				type="text/css"
				charset="UTF-8"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
			/>
			<link
				rel="stylesheet"
				type="text/css"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
			/>

			{images.length > 1 ? (
				<div
					style={{
						paddingRight: "30px",
						paddingLeft: "30px",
						backgroundColor: "black",
						textAlign: "center",
					}}
				>
					<Slider {...setting}>
						{images.map((v, i) => {
							return (
								<MultiImageWrapper key={i}>
									<MultiImage src={`http://localhost:4000/${v.src}`} />
								</MultiImageWrapper>
							);
						})}
					</Slider>
				</div>
			) : (
				<SingleImageWrapper>
					<SingleImage src={`http://localhost:4000/${images[0].src}`} />
				</SingleImageWrapper>
			)}
		</div>
	);
};

export default ImageCarousel;
