import React, { useEffect, useState, useCallback } from "react";
import { Row, Col } from "antd";

import { Wrapper, UserInfo, UserImage, CustomUl, ImgCustom } from "./style";

// import PostModal from "../../components/PostCard";
import PostModal from "../../components/PostModal";
const Profile = () => {
	const [postModal, setPostModal] = useState(false);

	useEffect(() => {
		// dispatch({
		// 	type: LOAD_MY_POSTS_REQUEST,
		// });
	}, []);

	const onCloseModal = useCallback(() => {
		setPostModal(false);
	}, [postModal]);

	const onOpenModal = useCallback(
		(post) => () => {
			// dispatch({
			// 	type: CHANGE_SELECTED_POST,
			// 	data: post,
			// });
			setPostModal(true);
		},
		[postModal]
	);

	const user = {
		userId: "whwlsvy12",
		name: "박연호",
	};

	const posts = ["asd", "qwe", "zxc"];

	return (
		<div>
			<Wrapper>
				<UserInfo>
					<Row>
						<Col span={9}>
							{user && (
								<UserImage src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png" />
							)}
						</Col>
						<Col span={15}>
							<div>
								<span
									style={{
										fontSize: "30px",
										fontWeight: "700",
										color: "#262626",
									}}
								>
									{user && user.userId}
								</span>
								<span style={{ marginLeft: "10px" }}>{user && user.name}</span>
							</div>

							{/* <div>
                <Button style={{ marginTop: "10px" }}>
                  <Icon type="edit" />
                  개인정보 수정
                </Button>
              </div> */}

							<CustomUl>
								<li>
									{/* 게시글<span>{posts.length}</span> */}
									게시글<span>3</span>
								</li>
								<li>
									팔로잉<span>3</span>
									{/* 팔로잉<span>{followings.length}</span> */}
								</li>
								<li>
									{/* 팔로워<span>{followers.length}</span> */}
									팔로워<span>3</span>
								</li>
							</CustomUl>
							<div />
						</Col>
					</Row>
				</UserInfo>
				<Row>
					{posts.map((v, i) => {
						return (
							<Col span={8} key={i} style={{ marginTop: "10px" }}>
								<div style={{ height: "250px" }}>
									<ImgCustom
										src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png"
										onClick={onOpenModal(v)}
									></ImgCustom>
								</div>
							</Col>
						);
					})}
				</Row>
				{postModal && <PostModal onCloseModal={onCloseModal} />}
			</Wrapper>
		</div>
	);
};

const Test = () => {
	return <div>asd</div>;
};
export default Profile;
