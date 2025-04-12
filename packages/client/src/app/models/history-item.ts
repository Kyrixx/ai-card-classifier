import { Card } from './mtg-json';

export interface HistoryItem {
  _id: number;
  card: Card;
  boosterId: number;
  date: number;
  isDoublon?: boolean;
}
