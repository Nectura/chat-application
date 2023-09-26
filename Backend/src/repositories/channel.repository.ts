import { DbClient } from "../database/prisma-exports";
import { ChannelType } from "../enums/channel-type.enum";

export const ChannelRepository = {
    createAsync: createAsync,
    deleteAsync: deleteAsync,
    getAsync: getAsync,
    getAllAsync: getAllAsync,
    getAllIdsAsync: getAllIdsAsync,
}

async function createAsync(
    type: ChannelType,
    name: string,
    iconUrl: string | null = null,
    ownerId: string | null = null) {
    return await DbClient.channel.create({
        data: {
            name: name,
            type: type as number,
            iconUrl: iconUrl,
            ownerId: ownerId
        }
    });
}

async function deleteAsync(id: bigint) {
    return await DbClient.channel.delete({
        where: {
            id: id,
        }
    });
}

async function getAsync(id: bigint) {
    return await DbClient.channel.findUnique({
        where: {
            id: id,
        }
    });
}

async function getAllAsync(
    userId: string,
    offset: number,
    limit: number) {
    return await DbClient.channel.findMany({
        where: {
            ownerId: userId,
        },
        skip: offset,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function getAllIdsAsync(
    userId: string,
    offset: number,
    limit: number) {
    return await DbClient.channel.findMany({
        where: {
            ownerId: userId,
        },
        skip: offset,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
        }
    });
}