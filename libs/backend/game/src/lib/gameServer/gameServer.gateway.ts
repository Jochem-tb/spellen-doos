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
import { interval } from 'rxjs';
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
    interval(1000).subscribe(() => {
      if (this.checkRequirementsForGame()) {
        console.log('Requirements met for game');
        const playersForGame = this.queue.splice(0, this.maxPlayerForGame);
        console.log('Starting game with players:', playersForGame);
        this.server.to(playersForGame).emit(BaseGatewayEvents.START_GAME);
      }
    });
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

  private checkRequirementsForGame(): boolean {
    return this.queue.length >= this.minPlayerForGame;
  }

  broadCastToSingleClient(clientId: string, event: string, payload: any) {
    this.server.to(clientId).emit(event, payload);
  }
}
