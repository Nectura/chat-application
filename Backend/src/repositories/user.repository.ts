import { DbClient } from "../database/prisma-exports";

export const UserRepository = {
    existsAsync: existsAsync,
    createAsync: createAsync,
    getAsync: getAsync,
    getAllAsync: getAllAsync,
    updateAsync: updateAsync,
}

async function existsAsync(id: string) {
    const user = await getAsync(id);
    return user !== null;
}

async function createAsync(id: string, name: string, emailAddress: string, avatarUrl: string | null) {
    await DbClient.user.create({
        data: {
            id: id,
            name: name,
            emailAddress: emailAddress,
            avatarUrl: avatarUrl,
            createdAt: new Date(),
        }
    });
}

async function getAsync(id: string) {
    return await DbClient.user.findUnique({
        where: {
            id: id,
        }
    });
}

async function getAllAsync(
    userIds: string[],
    offset: number,
    limit: number) {
    return await DbClient.user.findMany({
        where: {
            id: {
                in: userIds,
            }
        },
        skip: offset,
        take: limit,
    });
}

async function updateAsync(
    id: string,
    name: string,
    avatarUrl: string | null) {
    await DbClient.user.update({
        where: {
            id: id,
        },
        data: {
            name: name,
            avatarUrl: avatarUrl,
        }
    });
}