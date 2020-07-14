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

import {
	CTX,
	createRoomInput,
	Room,
	createRoomSubscriptionPayload,
} from "./type";
import getUserWithToken from "../../utils/getUserWithToken";

@Resolver()
export class RoomResolver {
	@Subscription({ topics: "CREATE_ROOM" })
	createRoomEvent(@Root() data: Room): Room {
		return data;
	}

	@Mutation((returns) => Room, { nullable: true })
	async createRoom(
		@Arg("room") room: createRoomInput,
		@Ctx() ctx: CTX,
		@PubSub("CREATE_ROOM") publish: Publisher<Room>
	) {
		try {
			const { name } = room;
			const { prisma } = ctx;
			const user = await getUserWithToken(ctx);
			const newRoom = await prisma.room.create({
				data: {
					name,
					owner: {
						connect: {
							userId: user,
						},
					},
				},
				include: {
					owner: true,
					chats: true,
				},
			});
			console.log(newRoom);
			await publish(newRoom);
		} catch (err) {
			console.log(err);
		}
	}

	@Query((returns) => [Room]!, { nullable: true })
	async getAllRooms(@Ctx() ctx: CTX) {
		try {
			const { prisma } = ctx;

			const rooms = await prisma.room.findMany({
				include: {
					owner: {
						select: {
							id: true,
							userId: true,
							profile: true,
						},
					},
					chats: {
						select: {
							content: true,
							user: {
								select: {
									id: true,
									userId: true,
									profile: true,
								},
							},
						},
					},
				},
			});
			return rooms;
		} catch (err) {
			console.log(err);
		}
	}
}
