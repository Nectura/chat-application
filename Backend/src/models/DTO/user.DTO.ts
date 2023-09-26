export class UserDTO {
    id: string;
    name: string;
    avatarUrl: string | null = null;
    createdAt: Date | null = null;

    constructor(
        id: string,
        name: string,
        avatarUrl: string | null) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }
}
