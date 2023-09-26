export function getDirectMessageRoomName(firstUserId: string, secondUserId: string) {
    return `${firstUserId}-${secondUserId}`;
}
