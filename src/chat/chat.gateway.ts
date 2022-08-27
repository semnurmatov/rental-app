import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SendMessage } from './types';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: SendMessage) {
    this.server.emit(`message-received-${data.to}`);
  }
}
