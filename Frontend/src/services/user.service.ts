import { UserDTO } from "../models/DTO/user.DTO";

export async function fetchUsers(userIds: string[]): Promise<UserDTO[]> {
    const uniqueIds = new Set(userIds);
    const response = await fetch(process.env.REACT_APP_API_URL + "/api/users?ids=" + Array.from(uniqueIds).join(","));
    const data = await response.json();
    return data;
};
