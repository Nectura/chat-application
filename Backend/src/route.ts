import { Express, Request, Response } from 'express';
import { FirebaseAdmin } from './firebase';
import { ChatMessageRepository } from './repositories/chat-message.repository';
import { ChatMessageDTO } from './models/DTO/chat-message.DTO';
import { UserRepository } from './repositories/user.repository';
import { UserDTO } from './models/DTO/user.DTO';

export function configureRoutes(app: Express) {
    // Note: Fetches chat messages using pagination
    app.get('/api/messages', async (req: Request, res: Response) => {
      const messages = await ChatMessageRepository.getAllAsync(1, 0, 100);
      const mappedMessages: ChatMessageDTO[] = messages.map((message) => {
        const DTO = new ChatMessageDTO(message.channelId.toString(), message.senderId.toString(), message.message);
        DTO.id = message.id.toString();
        DTO.createdAt = message.createdAt;
        DTO.modifiedAt = message.modifiedAt;
        return DTO;
      });
      res.json(mappedMessages);
    });

    // Note: Fetches user profiles using pagination
    app.get('/api/users', async (req: Request, res: Response) => {
      const userIds = req.query.ids as string;
      const users = await UserRepository.getAllAsync(userIds.split(','), 0, 100);
      const mappedUsers: UserDTO[] = users.map((user) => {
        const DTO = new UserDTO(user.id.toString(), user.name, user.avatarUrl);
        DTO.createdAt = user.createdAt;
        return DTO;
      });
      res.json(mappedUsers);
    });

    // Note: Updates the authenticated user's profile
    app.put('/api/users', async (req: Request, res: Response) => {
      const authToken = req.headers.authorization?.replace('Bearer ', '');
      if (!authToken) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const decodedToken = await FirebaseAdmin.auth().verifyIdToken(authToken);
      if (!decodedToken.uid) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const user = await UserRepository.getAsync(decodedToken.uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { nickname } = req.body;
      await UserRepository.updateAsync(user.id.toString(), nickname, null);
    });
}
