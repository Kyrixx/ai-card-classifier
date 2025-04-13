import { Card } from './mtg-json';

export interface HistoryItem {
  _id: number;
  card: Card;
  foil: boolean;
  boosterId: number;
  date: number;
  isDoublon?: boolean;
}
