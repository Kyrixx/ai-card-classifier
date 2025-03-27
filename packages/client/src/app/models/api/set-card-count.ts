import { RarityEnum } from "../rarity.enum";

export interface SetCardCount {
  rarity: RarityEnum | 'total';
  count: number;
}
