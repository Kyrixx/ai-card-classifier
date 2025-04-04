import { Card } from './scryfall';

export interface HistoryItem {
  _id: number;
  card: Card;
  boosterId: number;
  date: number;
  isDoublon?: boolean;
}
