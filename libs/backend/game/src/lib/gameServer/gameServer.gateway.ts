import { Inject, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  namespace: '/rpsGameServerGateway', // Optional namespace
  cors: {
    origin: '*', // Replace with your client URL in production
  },
})
export class RPSGameServerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  // Handle new client connections
  handleConnection(client: Socket) {
    console.log(`Client connected to ${this.server} clientId: ${client.id}`);
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Custom event for handling messages
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { userId: string; message: string }
  ): string {
    console.log(`Received message from user ${data.userId}: ${data.message}`);
    this.broadcastToAll('response', data);
    return `Message received: ${data.message}`;
  }

  // Broadcast a message to all connected clients
  broadcastToAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  broadCastToSingleClient(clientId: string, event: string, payload: any) {
    this.server.to(clientId).emit(event, payload);
  }
}
