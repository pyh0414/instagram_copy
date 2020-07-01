import React, { useState, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "antd";

import { Wrapper, UserInfo, UserImage, CustomUl, ImgCustom } from "./style";
import { GET_ME } from "../../components/PostCard/Body/Body";

import PostModal from "../../components/PostModal";
const Profile = () => {
	const [postModal, setPostModal] = useState(false);
	const [post, setPost] = useState(null);

	const { data } = useQuery(GET_ME);
	const user = data.user;
	const onCloseModal = useCallback(() => {
		setPostModal(false);
	}, []);

	const onOpenModal = useCallback(
		(post) => () => {
			setPost(post);
			setPostModal(true);
		},
		[]
	);

	return (
		<div>
			<Wrapper>
				<UserInfo>
					<Row>
						<Col span={9}>
							{<UserImage src={`http://localhost:4000/${user.profile}`} />}
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
									{user.userId}
								</span>
								<span style={{ marginLeft: "10px" }}>{user.name}</span>
							</div>

							<div>
								<Button style={{ marginTop: "10px" }}>
									<EditOutlined />
									개인정보 수정
								</Button>
							</div>

							<CustomUl>
								<li>
									게시글<span>{user.myPosts.length}</span>
								</li>
								<li>
									팔로잉<span>{user.following.length}</span>
								</li>
								<li>
									팔로워<span>{user.follower.length}</span>
								</li>
							</CustomUl>
							<div />
						</Col>
					</Row>
				</UserInfo>
				<Row>
					{user.myPosts.map((v, i) => {
						return (
							<Col span={8} key={i} style={{ marginTop: "10px" }}>
								<div style={{ height: "250px" }}>
									<ImgCustom
										src={`http://localhost:4000/${v.images[0].src}`}
										onClick={onOpenModal(v)}
									></ImgCustom>
								</div>
							</Col>
						);
					})}
				</Row>
				{postModal && (
					<PostModal onCloseModal={onCloseModal} post={post} me={user} />
				)}
			</Wrapper>
		</div>
	);
};

export default Profile;
