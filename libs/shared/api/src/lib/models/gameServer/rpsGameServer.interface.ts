import { Socket } from 'socket.io';

export interface IRPSGameServer {
  maxRounds: number;
  currentRound: number;
  playerAWins: number;
  playerBWins: number;
  draws: number;
  playerAChoice?: RPSChoicesEnum;
  playerBChoice?: RPSChoicesEnum;

  playerA: Socket;
  playerB: Socket;

  roundsInfo: IRPSRoundInfo[];
}

export enum RPSChoicesEnum {
  Steen = 'Steen',
  Papier = 'Papier',
  Schaar = 'Schaar',
  PlayerB = "PlayerB",
  PlayerA = "PlayerA",
  Visible = "visible",
  Hidden = "hidden"
}

export interface IRPSRoundInfo {
  round: number;
  playerAChoice: RPSChoicesEnum;
  playerBChoice: RPSChoicesEnum;
  winner: RPSWinnerEnum;
}

export enum RPSWinnerEnum {
  PlayerA = 'PlayerA',
  PlayerB = 'PlayerB',
  Draw = 'Draw',
}

export enum RPSGameEvents {
  CHANGE_CHOICE = 'changeChoice',
  ROUND_RESULT = 'roundResult',
}
