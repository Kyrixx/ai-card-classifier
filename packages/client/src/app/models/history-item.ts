import { Card } from './mtg-json';

export interface HistoryItem {
  _id: number | null;
  card: Card;
  foil: boolean;
  boosterId: number;
  date: number;
  isDoublon?: boolean;
}
