import { RarityEnum } from './rarity.enum';

export interface Imageuris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}
export interface Legalities {
  standard: string;
  future: string;
  historic: string;
  timeless: string;
  gladiator: string;
  pioneer: string;
  explorer: string;
  modern: string;
  legacy: string;
  pauper: string;
  vintage: string;
  penny: string;
  commander: string;
  oathbreaker: string;
  standardbrawl: string;
  brawl: string;
  alchemy: string;
  paupercommander: string;
  duel: string;
  oldschool: string;
  premodern: string;
  predh: string;
}
export interface Prices {
  usd: string;
  usd_foil?: any;
  usd_etched?: any;
  eur: string;
  eur_foil?: any;
  tix?: any;
}
export interface Relateduris {
  gatherer: string;
  tcgplayer_infinite_articles: string;
  tcgplayer_infinite_decks: string;
  edhrec: string;
}
export interface Purchaseuris {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
}
export interface Allpart {
  object: string;
  id: string;
  component: string;
  name: string;
  type_line: string;
  uri: string;
}
export interface Card {
  object: string;
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  name: string;
  printed_name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris: Imageuris;
  mana_cost: string;
  cmc: number;
  type_line: string;
  printed_type_line: string;
  oracle_text: string;
  printed_text: string;
  colors: string[];
  color_identity: string[];
  keywords: string[];
  legalities: Legalities;
  games: string[];
  reserved: boolean;
  game_changer: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: RarityEnum;
  card_back_id: string;
  artist: string;
  artist_ids: string[];
  illustration_id: string;
  border_color: string;
  frame: string;
  security_stamp: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank: number;
  penny_rank: number;
  prices: Prices;
  related_uris: Relateduris;
  purchase_uris: Purchaseuris;
  mtgo_id: number;
  tcgplayer_id: number;
  cardmarket_id: number;
  all_parts: Allpart[];
}
