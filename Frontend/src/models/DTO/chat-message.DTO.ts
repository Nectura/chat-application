export class ChatMessageDTO {
    id: string | null = null;
    channelId: string;
    senderId: string;
    message: string;
    createdAt: Date | null = null;
    modifiedAt: Date | null = null;

    constructor(
        channelId: string,
        senderId: string,
        message: string) {
        this.channelId = channelId;
        this.senderId = senderId;
        this.message = message;
    }
}

export class DirectMessageChannelCreationDTO {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }
}
