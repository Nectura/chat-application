import { DbClient } from "../database/prisma-exports";

export const ChannelUserRepository = {
    createAsync: createAsync,
    getAsync: getAsync,
    deleteAsync: deleteAsync,
    getAllAsync: getAllAsync,
}

async function createAsync(
    channelId: bigint,
    userId: string) {
    return await DbClient.channelUser.create({
        data: {
            channelId: channelId,
            userId: userId,
        }
    });
}

async function getAsync(
    channelId: bigint,
    userId: string) {
    return await DbClient.channelUser.findUnique({
        where: { channelId_userId: { channelId: channelId, userId: userId } }
    });
}

async function getAllAsync(
    userId: string) {
    return await DbClient.channelUser.findMany({
        where: { userId: userId },
        select: { channelId: true }
    });
}

async function deleteAsync(
    channelId: bigint,
    userId: string) {
    return await DbClient.channelUser.delete({
        where: { channelId_userId: { channelId: channelId, userId: userId } }
    });
}
