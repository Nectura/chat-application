export enum SocketEvent {
    // System Events
    SocketServerConnection = 'connection',
    SocketServerDisconnection = 'disconnect',
    // User Profile Events
    UserConnectionStateUpdate = 'user_connection_state_update',
    // Chat Message Events
    ChatMessageSent = 'chat_message_sent',
    ChatMessageReceived = 'chat_message_received',
    ChatMessageModified = 'chat_message_modified',
    ChatMessageDeleted = 'chat_message_deleted',
    // Channel Events
    DirectMessageChannelCreated = 'direct_message_channel_created',
    GroupChannelCreated = 'group_channel_created',
}
