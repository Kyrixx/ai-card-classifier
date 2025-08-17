import { Session } from './session';

export class Card {
  _id: number;
  uuid: string;
  createdAt: number;
  boosterId: number;
  setCode: string;
  number: number;
  foil?: number;
  session: Session;
}
