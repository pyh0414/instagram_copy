import React from "react";
import Slider from "react-slick";

import { Wrapper, ImageWrapper } from "./style";

// const ImageCarousel = ({ images }) => {
const ImageCarousel = () => {
	const images = [1, 2, 3, 4];
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
								<Wrapper key={i}>
									<ImageWrapper src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png" />
								</Wrapper>
							);
						})}
					</Slider>
				</div>
			) : (
				<Wrapper>
					<ImageWrapper src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png" />
				</Wrapper>
			)}
		</div>
	);
};

export default ImageCarousel;
