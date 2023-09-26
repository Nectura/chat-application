import { DbClient } from "../database/prisma-exports";

export const ChatMessageRepository = {
    createAsync: createAsync,
    deleteAsync: deleteAsync,
    updateAsync: updateAsync,
    getAllAsync: getAllAsync,
}

async function createAsync(
    channelId: bigint,
    senderId: string,
    message: string) {
    return await DbClient.chatMessage.create({
        data: {
            channelId: channelId,
            senderId: senderId,
            message: message,
        }
    });
}

async function deleteAsync(id: bigint) {
    return await DbClient.chatMessage.delete({
        where: {
            id: id,
        }
    });
}

async function updateAsync(id: bigint, message: string) {
    return await DbClient.chatMessage.update({
        where: {
            id: id,
        },
        data: {
            message: message,
            modifiedAt: new Date(),
        }
    });
}

async function getAllAsync(
    channelId: number,
    offset: number,
    limit: number) {
    return await DbClient.chatMessage.findMany({
        where: {
            channelId: channelId,
        },
        skip: offset,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
}