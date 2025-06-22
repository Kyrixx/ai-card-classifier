export interface Session {
  id: string;
  type: string;
  card_count: number;
  booster_count: number;
  name: string;
  cards: { id: number, createdAt: string, setCode: string; number: string; boosterId: string; foil?: boolean }[]
}
