export interface IHelpButton {
  route: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export type IHelpButtonCreate = Omit<IHelpButton, '_id'>;
export type IHelpButtonUpdate = Omit<IHelpButton, '_id'>;
