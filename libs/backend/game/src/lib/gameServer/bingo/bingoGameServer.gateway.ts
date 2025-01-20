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
  BingoGameEvents,
  IGameGateway,
  BingoResultEnum,
  BingoCard,
} from '@spellen-doos/shared/api';
import { interval, NotFoundError } from 'rxjs';
import { Server, Socket } from 'socket.io';
// import { RPSGameServerController } from './rpsGameServer.controller';
import { MIN } from 'class-validator';
import { BingoGameServerController } from './bingoGameServer.controller';

@Injectable()
@WebSocketGateway({
  namespace: '/BingoGameServerControllerGateway', // Optional namespace
  cors: {
    origin: '*', // Replace with your client URL in production
  },
})
export class BingoGameServerControllerGateway
  implements
    IGameGateway<BingoGameServerController>,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  games: Map<string, BingoGameServerController> = new Map();
  rooms: Map<string, Socket[]> = new Map();

  queue: Socket[] = [];
  minPlayerForGame: number = 1;
  maxPlayerForGame: number = 30;
  recommendedPlayerForGame: number = 15;

  private readonly TIME_FOR_RECONNECTION_IN_MS = 30000; // 30 seconds

  @WebSocketServer()
  server!: Server;

  // Handle ALL incoming Connectioning clients
  handleConnection(@ConnectedSocket() client: Socket): void {
    console.log(`Client connected on bingoGateway: ${client.id}`);
    this.queue.push(client);
    console.log('Bingo Queue:', this.queue.length);

    if (this.checkRequirementsForGame()) {
      console.log('Requirements met for bingo game');
      this.createGameRoom();
    }
  }

  private checkRequirementsForGame(): boolean {
    //TODO: Implement logic to check dynamic players for game, not always minimum
    return this.queue.length >= this.minPlayerForGame;
  }

  private getPlayersForGame(): Socket[] {
    //TODO: Implement logic to get dynamic players for game, not always minimum
    return this.queue.splice(0, this.minPlayerForGame);
  }

  private createGameRoom(): void {
    const players = this.getPlayersForGame();
    const roomId = `room-${Date.now()}`;
    console.debug('Creating bingo room:', roomId);
    this.rooms.set(roomId, players);

    const gameController = new BingoGameServerController(roomId, players, this);
    this.games.set(roomId, gameController);

    players.forEach((player) => {
      player.join(roomId);
      player.emit(BaseGatewayEvents.SETUP_GAME, roomId);
    });
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    // Remove player from queue if present
    this.queue = this.queue.filter((socket) => socket.id !== client.id);

    // Remove player from rooms if present
    this.rooms.forEach((players, roomId) => {
      this.rooms.set(
        roomId,
        players.filter((player) => player.id !== client.id)
      );

      // If room is empty, remove room and game controller
      if (this.rooms.get(roomId)?.length === 0) {
        console.log('Room is empty. Closing room:', roomId);
        this.rooms.delete(roomId);
        const gameController = this.games.get(roomId);
        if (gameController) {
          console.warn('Send stopgame command to roomController:', roomId);
          gameController.stopGame();
        }
        this.games.delete(roomId);
      } else {
        // If room is not empty, notify the other player of the disconnect
        console.warn('Player disconnected:', client.id);
        this.broadcastToRoom(roomId, BaseGatewayEvents.PLAYER_DISCONNECT, {
          playerId: client.id,
        });

        // Check if the connectedPlayers is more than Minimum players for game, otherwise delete room
        const roomPlayers = this.rooms.get(roomId);
        if (roomPlayers && roomPlayers.length < this.minPlayerForGame) {
          console.warn(
            'Not enough players to continue the game. Closing room:',
            roomId
          );
          const roomController = this.games.get(roomId);
          if (roomController) {
            console.warn('Send stopgame command to roomController:', roomId);
            roomController.stopGame();
          }
          this.rooms.delete(roomId);
          this.games.delete(roomId);
          this.server.to(roomId).emit(BaseGatewayEvents.GAME_OVER, {
            reason: 'Not enough players to continue the game.',
          });
        }
      }
    });

    console.log(`Client disconnected: ${client.id}`);
  }

  //
  // Handle Outgoing messages for controllers
  //

  public broadcastToRoom(roomId: string, event: string, data: any): void {
    this.server.to(roomId).emit(event, data);
  }

  public broadcastToPlayer(playerId: string, event: string, data: any): void {
    this.server.to(playerId).emit(event, data);
  }

  //
  // Handle incoming messages
  //

  @SubscribeMessage(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE)
  getPlayerQueue(@MessageBody() clientId: string): void {
    console.log('Return num of Queue: ', this.queue.length);
    this.server
      .to(clientId)
      .emit(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE, this.queue.length);
  }

  @SubscribeMessage(BaseGatewayEvents.PLAYER_READY)
  playerReady(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string }
  ): void {
    console.log('Player is ready event:', socket.id);
    const roomId = this.getRoomIdForClient(socket, data);
    if (roomId) {
      const game = this.games.get(roomId);
      if (game) {
        game.playerReady(socket);
      } else {
        console.error(`No game controller found for room: ${roomId}`);
      }
    }
  }

  @SubscribeMessage(BingoGameEvents.BINGO_CARD)
  getBingoCard(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): void {
    const roomIdForClient = this.getRoomIdForClient(client, data);

    if (!roomIdForClient) {
      console.error('Client is not part of any room.');
      return;
    }

    console.log('Gettting controller for room:', roomIdForClient);
    const game = this.games.get(roomIdForClient);
    if (game) {
      console.log('Getting bingo card for client:', client.id);
      const card = game.getBingoCard(client);
      console.log('Return card for client: ', client.id, card);
      this.server.to(client.id).emit(BingoGameEvents.BINGO_CARD, card);
    } else {
      console.error(`No game controller found for room: ${roomIdForClient}`);
    }
  }

  private getRoomIdForClient(client: Socket, data: any): string | undefined {
    let roomId;
    if (!data.roomId) {
      console.warn('No roomId provided. Attempting to find room for client.');
      roomId = Array.from(this.rooms.entries()).find(([, players]) =>
        players.includes(client)
      )?.[0];
    } else {
      console.log('[DEBUG] RoomId provided:', data.roomId);
      roomId = data.roomId;
    }

    if (!roomId) {
      console.error('Client is not part of any room.');
      return;
    }

    return roomId;
  }

  @SubscribeMessage(BingoGameEvents.I_HAVE_BINGO)
  iHaveBingo(
    @MessageBody() data: { playerCard: BingoCard; roomId: string },
    @ConnectedSocket() client: Socket
  ): void {
    const roomId = this.getRoomIdForClient(client, data);
    if (roomId) {
      const game = this.games.get(roomId!);
      if (game) {
        game.someoneCalledBingo(client, data.playerCard);
      } else {
        console.error(`No game controller found for room: ${roomId}`);
        console.warn('Closing room:', roomId);
        try {
          this.closeGameRoom(roomId!);
        } catch (error) {
          console.error('Error closing room');
          client.emit(BaseGatewayEvents.GAME_OVER, {});
        }
      }
    }
  }

  private closeGameRoom(roomId: string): void {
    const players = this.rooms.get(roomId);
    if (!players) {
      console.error(`Room ${roomId} not found.`);
      throw new Error(`Room ${roomId} not found.`);
      return;
    }

    players.forEach((player) => {
      player.leave(roomId);
      this.broadcastToPlayer(player.id, BaseGatewayEvents.GAME_OVER, {
        reason: 'Game room closed.',
      });
    });
    this.rooms.delete(roomId);
    this.games.delete(roomId);
  }
}
