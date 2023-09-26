import { ChatMessageDTO } from "../models/DTO/chat-message.DTO";

export async function fetchMessages(): Promise<ChatMessageDTO[]> {
    const response = await fetch(process.env.REACT_APP_API_URL + "/api/messages");
    const data = await response.json();
    return data;
}