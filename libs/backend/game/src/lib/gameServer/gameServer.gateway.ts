import { Inject, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  BaseGatewayEvents,
  IGame,
  IGameGateway,
} from '@spellen-doos/shared/api';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  namespace: '/RPSGameServerControllerGateway', // Optional namespace
  cors: {
    origin: '*', // Replace with your client URL in production
  },
})
export class RPSGameServerControllerGateway
  implements IGameGateway, OnGatewayConnection, OnGatewayDisconnect
{
  queue: string[] = [];
  minPlayerForGame: number = 2;
  maxPlayerForGame: number = 2;
  recommendedPlayerForGame: number = 2;
  game?: IGame | undefined;
  connectedPlayers: string[] = [];

  @WebSocketServer()
  server!: Server;

  // Handle new client connections
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(
      `Client connected to RPSGameServerControllerGateway clientId: ${client.id}`
    );
    this.queue.push(client.id);
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    this.queue = this.queue.filter((id) => id !== client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE)
  getPlayerQueue(@MessageBody() clientId: string): void {
    console.log('Returning number of players in queue');
    console.log('Queue length:', this.queue.length);
    console.log('Client ID:', clientId);
    this.broadCastToSingleClient(
      clientId,
      BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE,
      this.queue.length
    );
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
