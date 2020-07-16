import {
	Resolver,
	Subscription,
	Root,
	Mutation,
	Arg,
	Ctx,
	Publisher,
	PubSub,
	Query,
} from "type-graphql";
import { Chat, createChatInput, CTX } from "./type";
import getUserWithToken from "../../utils/getUserWithToken";

const CREATE_CHAT_EVENT = "CREATE_CHAT_EVENT";

@Resolver()
export class ChatResolver {
	@Subscription({ topics: CREATE_CHAT_EVENT })
	createChatEvent(@Root() data: Chat): Chat {
		return data;
	}

	@Mutation((returns) => Boolean, { nullable: true })
	async createChat(
		@Arg("data")
		data: createChatInput,
		@Ctx() ctx: CTX,
		@PubSub(CREATE_CHAT_EVENT) publish: Publisher<Chat>
	) {
		try {
			const { content, roomId } = data;
			const { prisma } = ctx;

			const userId = await getUserWithToken(ctx);
			const user = await prisma.user.findOne({
				where: {
					userId,
				},
			});

			const newChat = await prisma.chat.create({
				data: {
					content,
					room: {
						connect: {
							id: roomId,
						},
					},
					user: {
						connect: {
							id: user.id,
						},
					},
				},
				include: {
					room: true,
					user: true,
				},
			});

			await publish(newChat);
		} catch (err) {
			console.log(err);
		}
	}
}
