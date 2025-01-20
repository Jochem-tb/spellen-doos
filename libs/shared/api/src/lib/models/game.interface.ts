export interface IGame {
  _id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  tutorialContent?: string;
  cardImage: string;
  maxPlayers: number;
  minPlayers: number;
}

export interface ITutorialStep {
  title: string;
  description: string;
  image: string;
}

export type ICreateGame = Pick<
  IGame,
  | 'name'
  | 'shortDescription'
  | 'longDescription'
  | 'cardImage'
  | 'maxPlayers'
  | 'minPlayers'
>;
export type IUpdateGame = Partial<Omit<IGame, '_id'>>;
