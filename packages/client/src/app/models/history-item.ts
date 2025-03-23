import { Card } from './scryfall';

export interface HistoryItem {
  card: Card;
  boosterId: number;
  date: number;
}
