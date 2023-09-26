import { Server as SocketServer, Socket } from 'socket.io';
import { ChatMessageDTO, DirectMessageChannelCreationDTO } from './models/DTO/chat-message.DTO';
import { ChatMessageRepository } from './repositories/chat-message.repository';
import { ChannelRepository } from './repositories/channel.repository';
import { getDirectMessageRoomName } from './functions/socket-room.functions';
import { UserConnectionStateUpdateDTO } from './models/DTO/user-connection-state-update.DTO';
import { ChannelUserRepository } from './repositories/channel-user.repository';
import { UserRepository } from './repositories/user.repository';
import { SocketEvent } from './enums/socket-event.enum';
import { UserConnectionState } from './enums/user-connection-state.enum';
import { ChannelType } from './enums/channel-type.enum';
import jwt from 'jsonwebtoken';

/*
On socket connection, join the user socket to their active rooms (channels).
(All open DMs and Groups are considered active rooms)

DM channel rooms should be created whenever a user sends a message to another user and a room doesn't exist yet.
If the room already exists, the message should be sent to the existing room.

Group channel rooms should be created whenever a user creates a group and a room doesn't exist yet.
If the room already exists, the user should be joined to the existing room.
*/

export function configureSocketServerEvents(socketServer: SocketServer) {
    socketServer.on(SocketEvent.SocketServerConnection, async (socket: Socket) => {
        configureSocketEvents(socket);
        const decodedToken = jwt.decode(socket.handshake.auth.token);
        if (!decodedToken) {
            console.log(`Invalid token.`);
            socket.disconnect();
            return;
        }
        const payload = decodedToken as jwt.JwtPayload;
        socket.data.userId = payload.sub;
        const user = await UserRepository.getAsync(socket.data.userId);
        let requiresNickNameUpdate = false;
        if (!user) {
            await UserRepository.createAsync(
                socket.data.userId,
                socket.data.userId,
                payload.email,
                null
            );
            await ChannelUserRepository.createAsync(
                BigInt(1),
                socket.data.userId,
            );
            requiresNickNameUpdate = true;
        }
        if (user?.name === user?.id) {
            requiresNickNameUpdate = true;
        }
        const activeChannels = await ChannelUserRepository.getAllAsync(socket.data.userId);
        console.log(`User ${socket.data.userId} has ${activeChannels.length} active channels.`);
        await Promise.all(activeChannels.map(async (channel: any) => {
            await joinRoomAsync(socket, channel.channelId);
        }));
        sendStatusUpdate(socket, UserConnectionState.Connected);
    });
}

async function joinRoomAsync(socket: Socket, channelId: bigint) {
    if (socket.rooms.has(channelId.toString())) return;
    await socket.join(channelId.toString());
    console.log(`User ${socket.data.userId} joined room ${channelId}.`);
}

function sendStatusUpdate(socket: Socket, state: UserConnectionState) {
    const connectionStateUpdateDTO = new UserConnectionStateUpdateDTO(socket.data.userId, state);
    socket.broadcast.emit(SocketEvent.UserConnectionStateUpdate, connectionStateUpdateDTO);
}

function configureSocketEvents(socket: Socket) {
    socket.on(SocketEvent.SocketServerDisconnection, () => {
        console.log(`User ${socket.data.userId} disconnected.`);
        sendStatusUpdate(socket, UserConnectionState.Disconnected);
    });

    socket.on(SocketEvent.DirectMessageChannelCreated, async (creationRequest: DirectMessageChannelCreationDTO) => {
        await ChannelRepository.createAsync(
            ChannelType.DirectMessage,
            getDirectMessageRoomName(socket.id, creationRequest.userId),
        );
        socket.emit(SocketEvent.DirectMessageChannelCreated, creationRequest);
    });

    socket.on(SocketEvent.ChatMessageSent, async (message: ChatMessageDTO) => {
        const createdMessage = await ChatMessageRepository.createAsync(
            BigInt(message.channelId),
            message.senderId,
            message.message,
        );
        message.id = createdMessage.id.toString();
        message.createdAt = createdMessage.createdAt;
        socket.emit(SocketEvent.ChatMessageReceived, message);
        socket.broadcast.to(message.channelId.toString()).emit(SocketEvent.ChatMessageReceived, message);
    });

    socket.on(SocketEvent.ChatMessageModified, async (message: ChatMessageDTO) => {
        if (!message.id) {
            console.log(`Invalid message id.`);
            return;
        }
        const updatedMessage = await ChatMessageRepository.updateAsync(
            BigInt(message.id),
            message.message,
        );
        message.modifiedAt = updatedMessage.modifiedAt;
        socket.emit(SocketEvent.ChatMessageModified, message);
        socket.broadcast.to(message.channelId.toString()).emit(SocketEvent.ChatMessageModified, message);
    });

    socket.on(SocketEvent.ChatMessageDeleted, async (message: ChatMessageDTO) => {
        if (!message.id) {
            console.log(`Invalid message id.`);
            return;
        }
        await ChatMessageRepository.deleteAsync(
            BigInt(message.id)
        );
        socket.emit(SocketEvent.ChatMessageDeleted, message);
        socket.broadcast.to(message.channelId.toString()).emit(SocketEvent.ChatMessageDeleted, message);
    });
}