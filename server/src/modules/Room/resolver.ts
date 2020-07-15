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

import { CTX, createRoomInput, Room } from "./type";
import getUserWithToken from "../../utils/getUserWithToken";

const CREATE_ROOM_EVENT = "CREATE_ROOM_EVENT";
const REMOVE_ROOM_EVENT = "REMOVE_ROOM_EVENT";

@Resolver()
export class RoomResolver {
	@Subscription({ topics: CREATE_ROOM_EVENT })
	createRoomEvent(@Root() data: Room): Room {
		return data;
	}

	@Subscription({ topics: REMOVE_ROOM_EVENT })
	removeRoomEvent(@Root() data: Room): Room {
		return data;
	}

	@Mutation((returns) => Boolean)
	async createRoom(
		@Arg("room") room: createRoomInput,
		@Ctx() ctx: CTX,
		@PubSub(CREATE_ROOM_EVENT) publish: Publisher<Room>
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
			await publish(newRoom);
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	@Mutation((returns) => Boolean)
	async removeRoom(
		@Arg("roomId") roomId: string,
		@Ctx() ctx: CTX,
		@PubSub(REMOVE_ROOM_EVENT) publish: Publisher<Room>
	) {
		try {
			const { prisma } = ctx;

			const deletedRoom = await prisma.room.delete({
				where: {
					id: parseInt(roomId),
				},
				include: {
					owner: true,
					chats: true,
				},
			});

			await publish(deletedRoom);
			return true;
		} catch (err) {
			console.log(err);
			return false;
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
