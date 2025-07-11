import { RarityEnum } from './rarity.enum';

export type BoosterConfig = {
  boosters: BoosterPack[];
  boostersTotalWeight: number;
  name?: string;
  sheets: Record<string, BoosterSheet>;
};
export type BoosterPack = {
  contents: Partial<Record<string, number>>;
  weight: number;
};
export type BoosterSheet = {
  allowDuplicates?: boolean;
  balanceColors?: boolean;
  cards: Record<string, number>;
  foil: boolean;
  fixed?: boolean;
  totalWeight: number;
};
export type CardAtomic = {
  asciiName?: string;
  attractionLights?: number[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  convertedManaCost: number;
  defense?: string;
  edhrecRank?: number;
  edhrecSaltiness?: number;
  faceConvertedManaCost?: number;
  faceManaValue?: number;
  faceName?: string;
  firstPrinting?: string;
  foreignData?: ForeignData[];
  hand?: string;
  hasAlternativeDeckLimit?: boolean;
  identifiers: Identifiers;
  isFunny?: boolean;
  isReserved?: boolean;
  keywords?: string[];
  layout: string;
  leadershipSkills?: LeadershipSkills;
  legalities: Legalities;
  life?: string;
  loyalty?: string;
  manaCost?: string;
  manaValue: number;
  name: string;
  prices: Price[];
  power?: string;
  printings?: string[];
  purchaseUrls: PurchaseUrls;
  relatedCards: RelatedCards;
  rulings?: Rulings[];
  side?: string;
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
};
export type CardDeck = {
  artist?: string;
  artistIds?: string[];
  asciiName?: string;
  attractionLights?: number[];
  availability: string[];
  boosterTypes?: string[];
  borderColor: string;
  cardParts?: string[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  convertedManaCost: number;
  count: number;
  defense?: string;
  duelDeck?: string;
  edhrecRank?: number;
  edhrecSaltiness?: number;
  faceConvertedManaCost?: number;
  faceFlavorName?: string;
  faceManaValue?: number;
  faceName?: string;
  finishes: string[];
  flavorName?: string;
  flavorText?: string;
  foreignData?: ForeignData[];
  frameEffects?: string[];
  frameVersion: string;
  hand?: string;
  hasAlternativeDeckLimit?: boolean;
  hasContentWarning?: boolean;
  hasFoil: boolean;
  hasNonFoil: boolean;
  identifiers: Identifiers;
  image_uris: ImageUris;
  isAlternative?: boolean;
  isFoil: boolean;
  isFullArt?: boolean;
  isFunny?: boolean;
  isOnlineOnly?: boolean;
  isOversized?: boolean;
  isPromo?: boolean;
  isRebalanced?: boolean;
  isReprint?: boolean;
  isReserved?: boolean;
  isStarter?: boolean;
  isStorySpotlight?: boolean;
  isTextless?: boolean;
  isTimeshifted?: boolean;
  keywords?: string[];
  language: string;
  layout: string;
  leadershipSkills?: LeadershipSkills;
  legalities: Legalities;
  life?: string;
  loyalty?: string;
  manacost?: string;
  manavalue: number;
  name: string;
  number: string;
  originalPrintings?: string[];
  originalReleaseDate?: string;
  originalText?: string;
  originalType?: string;
  otherFaceIds?: string[];
  prices: Price[];
  power?: string;
  printings?: string[];
  promoTypes?: string[];
  purchaseUrls: PurchaseUrls;
  rarity: RarityEnum;
  relatedCards?: RelatedCards;
  rebalancedPrintings?: string[];
  rulings?: Rulings[];
  securityStamp?: string;
  setcode: string;
  side?: string;
  signature?: string;
  sourceProducts?: string[];
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
  variations?: string[];
  watermark?: string;
};
export type CardSet = {
  artist?: string;
  artistIds?: string[];
  asciiName?: string;
  attractionLights?: number[];
  availability: string[];
  boosterTypes?: string[];
  borderColor: string;
  cardParts?: string[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  convertedManaCost: number;
  defense?: string;
  duelDeck?: string;
  edhrecRank?: number;
  edhrecSaltiness?: number;
  faceConvertedManaCost?: number;
  faceFlavorName?: string;
  faceManaValue?: number;
  faceName?: string;
  finishes: string[];
  flavorName?: string;
  flavorText?: string;
  foreignData?: ForeignData[];
  frameEffects?: string[];
  frameVersion: string;
  hand?: string;
  hasAlternativeDeckLimit?: boolean;
  hasContentWarning?: boolean;
  hasFoil: boolean;
  hasNonFoil: boolean;
  identifiers: Identifiers;
  isAlternative?: boolean;
  isFullArt?: boolean;
  isFunny?: boolean;
  isOnlineOnly?: boolean;
  isOversized?: boolean;
  isPromo?: boolean;
  isRebalanced?: boolean;
  isReprint?: boolean;
  isReserved?: boolean;
  isStarter?: boolean;
  isStorySpotlight?: boolean;
  isTextless?: boolean;
  isTimeshifted?: boolean;
  keywords?: string[];
  language: string;
  layout: string;
  leadershipSkills?: LeadershipSkills;
  legalities: Legalities;
  life?: string;
  loyalty?: string;
  manaCost?: string;
  manaValue: number;
  name: string;
  number: string;
  originalPrintings?: string[];
  originalReleaseDate?: string;
  originalText?: string;
  originalType?: string;
  otherFaceIds?: string[];
  power?: string;
  printings?: string[];
  promoTypes?: string[];
  purchaseUrls: PurchaseUrls;
  rarity: string;
  relatedCards?: RelatedCards;
  rebalancedPrintings?: string[];
  rulings?: Rulings[];
  securityStamp?: string;
  setCode: string;
  side?: string;
  signature?: string;
  sourceProducts?: SourceProducts;
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
  variations?: string[];
  watermark?: string;
};
export type CardSetDeck = {
  count: number;
  isFoil?: boolean;
  uuid: string;
};
export type CardToken = {
  artist?: string;
  artistIds?: string[];
  asciiName?: string;
  availability: string[];
  boosterTypes?: string[];
  borderColor: string;
  cardParts?: string[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  edhrecSaltiness?: number;
  faceName?: string;
  faceFlavorName?: string;
  finishes: string[];
  flavorName?: string;
  flavorText?: string;
  frameEffects?: string[];
  frameVersion: string;
  hasFoil: boolean;
  hasNonFoil: boolean;
  identifiers: Identifiers;
  isFullArt?: boolean;
  isFunny?: boolean;
  isOnlineOnly?: boolean;
  isOversized?: boolean;
  isPromo?: boolean;
  isReprint?: boolean;
  isTextless?: boolean;
  keywords?: string[];
  language: string;
  layout: string;
  loyalty?: string;
  manaCost?: string;
  name: string;
  number: string;
  orientation?: string;
  originalText?: string;
  originalType?: string;
  otherFaceIds?: string[];
  power?: string;
  promoTypes?: string[];
  relatedCards?: RelatedCards;
  reverseRelated?: string[];
  securityStamp?: string;
  setCode: string;
  side?: string;
  signature?: string;
  sourceProducts?: string[];
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
  watermark?: string;
};
export type ImageUris = {
  en: string;
  fr: string;
}
export type Price = {
  price: number,
  currency: string,
  priceProvider: string,
}
export type PriceFormats = {
  mtgo?: Record<'cardhoarder', PriceList>;
  paper?: Record<'cardkingdom' | 'cardmarket' | 'cardsphere' | 'tcgplayer', PriceList>;
};
export type PriceList = {
  buylist?: PricePoints;
  currency: string;
  retail?: PricePoints;
};
export type PricePoints = {
  etched?: Record<string, number>;
  foil?: Record<string, number>;
  normal?: Record<string, number>;
};
export type SealedProductCard = {
  foil?: boolean;
  name: string;
  number: string;
  set: string;
  uuid: string;
};
export type SealedProductContents = {
  card?: SealedProductCard[];
  deck?: SealedProductDeck[];
  other?: SealedProductOther[];
  pack?: SealedProductPack[];
  sealed?: SealedProductSealed[];
  variable?: Record<"configs", SealedProductContents[]>[];
};
export type SealedProductDeck = {
  name: string;
  set: string;
};
export type SealedProductOther = {
  name: string;
};
export type SealedProductPack = {
  code: string;
  set: string;
};
export type SealedProductSealed = {
  count: number;
  name: string;
  set: string;
  uuid: string;
};
export type CardType = {
  subTypes: string[];
  superTypes: string[];
};
export type CardTypes = {
  artifact: CardType;
  battle: CardType;
  conspiracy: CardType;
  creature: CardType;
  enchantment: CardType;
  instant: CardType;
  land: CardType;
  phenomenon: CardType;
  plane: CardType;
  planeswalker: CardType;
  scheme: CardType;
  sorcery: CardType;
  tribal: CardType;
  vanguard: CardType;
};
export type Deck = {
  code: string;
  commander?: CardDeck[];
  mainBoard: CardDeck[];
  name: string;
  releaseDate: string | null;
  sealedProductUuids: string;
  sideBoard: CardDeck[];
  type: string;
};
export type DeckList = {
  code: string;
  fileName: string;
  name: string;
  releaseDate: string | null;
  type: string;
};
export type DeckSet = {
  code: string;
  commander?: CardSetDeck[];
  mainBoard: CardSetDeck[];
  name: string;
  releaseDate: string | null;
  sealedProductUuids: string[] | null;
  sideBoard: CardSetDeck[];
  type: string;
};
export type ForeignData = {
  faceName?: string;
  flavorText?: string;
  identifiers: Identifiers;
  language: string;
  name: string;
  text?: string;
  type?: string;
};
export type Identifiers = {
  abuId?: string;
  cardKingdomEtchedId?: string;
  cardKingdomFoilId?: string;
  cardKingdomId?: string;
  cardsphereId?: string;
  cardsphereFoilId?: string;
  cardtraderId?: string;
  csiId?: string;
  mcmId?: string;
  mcmMetaId?: string;
  miniaturemarketId?: string;
  mtgArenaId?: string;
  mtgjsonFoilVersionId?: string;
  mtgjsonNonFoilVersionId?: string;
  mtgjsonV4Id?: string;
  mtgoFoilId?: string;
  mtgoId?: string;
  multiverseId?: string;
  scgId?: string;
  scryfallId?: string;
  scryfallCardBackId?: string;
  scryfalloracleid?: string;
  scryfallIllustrationId?: string;
  tcgplayerProductId?: string;
  tcgplayerEtchedProductId?: string;
  tntId?: string;
};
export type Keywords = {
  abilityWords: string[];
  keywordAbilities: string[];
  keywordActions: string[];
};
export type LeadershipSkills = {
  brawl: boolean;
  commander: boolean;
  oathbreaker: boolean;
};
export type Legalities = {
  alchemy?: string;
  brawl?: string;
  commander?: string;
  duel?: string;
  explorer?: string;
  future?: string;
  gladiator?: string;
  historic?: string;
  historicbrawl?: string;
  legacy?: string;
  modern?: string;
  oathbreaker?: string;
  oldschool?: string;
  pauper?: string;
  paupercommander?: string;
  penny?: string;
  pioneer?: string;
  predh?: string;
  premodern?: string;
  standard?: string;
  standardbrawl?: string;
  timeless?: string;
  vintage?: string;
};
export type Meta = {
  date: string;
  version: string;
};
export type PurchaseUrls = {
  cardKingdom?: string;
  cardKingdomEtched?: string;
  cardKingdomFoil?: string;
  cardmarket?: string;
  tcgplayer?: string;
  tcgplayerEtched?: string;
};
export type RelatedCards = {
  reverseRelated?: string[];
  spellbook?: string[];
};
export type Rulings = {
  date: string;
  text: string;
};
export type SealedProduct = {
  cardCount?: number;
  category?: string;
  contents?: SealedProductContents;
  identifiers: Identifiers;
  name: string;
  productSize?: number;
  purchaseUrls: PurchaseUrls;
  releaseDate?: string;
  subtype: string | null;
  uuid: string;
};
export type Set = {
  baseSetSize: number;
  block?: string;
  booster?: Record<string, BoosterConfig>;
  cards: CardSet[];
  cardsphereSetId?: number;
  code: string;
  codeV3?: string;
  decks?: DeckSet[];
  isForeignOnly?: boolean;
  isFoilOnly: boolean;
  isNonFoilOnly?: boolean;
  isOnlineOnly: boolean;
  isPaperOnly?: boolean;
  isPartialPreview?: boolean;
  keyruneCode: string;
  languages?: string[];
  mcmId?: number;
  mcmIdExtras?: number;
  mcmName?: string;
  mtgoCode?: string;
  name: string;
  parentCode?: string;
  releaseDate: string;
  sealedProduct?: SealedProduct[];
  tcgplayerGroupId?: number;
  tokens: CardToken[];
  tokenSetCode?: string;
  totalSetSize: number;
  translations: Translations;
  type: string;
};
export type SetList = {
  baseSetSize: number;
  block?: string;
  cardsphereSetId?: number;
  code: string;
  codeV3?: string;
  decks?: DeckSet[];
  isForeignOnly?: boolean;
  isFoilOnly: boolean;
  isNonFoilOnly?: boolean;
  isOnlineOnly: boolean;
  isPaperOnly?: boolean;
  isPartialPreview?: boolean;
  keyruneCode: string;
  languages?: string[];
  mcmId?: number;
  mcmIdExtras?: number;
  mcmName?: string;
  mtgoCode?: string;
  name: string;
  parentCode?: string;
  releaseDate: string;
  sealedProduct?: SealedProduct[];
  tcgplayerGroupId?: number;
  totalSetSize: number;
  tokenSetCode?: string;
  translations: Translations;
  type: string;
};
export type SourceProducts = {
  etched: string[];
  foil: string[];
  nonfoil: string[];
};
export type TcgplayerSkus = {
  condition: string;
  finish: string;
  language: string;
  printing: string;
  productId: string;
  skuId: string;
};
export type Translations = {
  "Ancient Greek"?: string;
  Arabic?: string;
  "Chinese Simplified"?: string;
  "Chinese Traditional"?: string;
  French?: string;
  German?: string;
  Hebrew?: string;
  Italian?: string;
  Japanese?: string;
  Korean?: string;
  Latin?: string;
  Phyrexian?: string;
  "Portuguese (Brazil)"?: string;
  Russian?: string;
  Sanskrit?: string;
  Spanish?: string;
};
export type AllPrintingsFile = { meta: Meta; data: Record<string, Set>; };
export type AllPricesFile = { meta: Meta; data: Record<string, PriceFormats>; };
export type AllPricesTodayFile = { meta: Meta; data: Record<string, PriceFormats>; };
export type AllIdentifiersFile = { meta: Meta; data: Record<string, CardSet>; };
export type AtomicCardsFile = { meta: Meta; data: Record<string, CardAtomic>; };
export type CompiledListFile = { meta: Meta; data: string[]; };
export type EnumValues = { meta: Meta; data: Record<string, Record<string, string[]>>};
export type LegacyFile = { meta: Meta; data: Record<string, CardSet>; };
export type LegacyAtomicFile = { meta: Meta; data: Record<string, CardAtomic>; };
export type ModernFile = { meta: Meta; data: Record<string, CardSet>; };
export type ModernAtomicFile = { meta: Meta; data: Record<string, CardAtomic>; };
export type PauperAtomicFile = { meta: Meta; data: Record<string, CardAtomic>; };
export type PioneerFile = { meta: Meta; data: Record<string, CardSet>; };
export type PioneerAtomicFile = { meta: Meta; data: Record<string, CardAtomic>; };
export type StandardFile = { meta: Meta; data: Record<string, CardSet>; };
export type StandardAtomicFile = { meta: Meta; data: Record<string, CardAtomic>; };
export type VintageFile = { meta: Meta; data: Record<string, CardSet>; };
export type VintageAtomicFile = { meta: Meta; data: Record<string, CardAtomic>; };

export type Card = CardDeck;
export const getFrenchCard = (card?: Card | null): Card | null => {
  if(!card) {
    return null;
  }

  const foreignData = card?.foreignData?.find((foreignData) => foreignData?.language === 'French');
  return {
    ...card,
    name: foreignData?.name ?? '',
    text: foreignData?.text ?? '',
  }
}
export const getCardPrice = (card?: Card | null) => {
  const filterByCurrency = (prices: Price[], currency: string) =>
    prices
      ?.filter((price) => price.currency === currency)
      .sort((a, b) => a.price - b.price)?.[0]?.price;

  if (!card) {
    console.warn('[model/mtg-json] getCardPrice: card is null');
    return 0.0;
  }
  const prices = card.prices;
  return filterByCurrency(prices, 'EUR') || filterByCurrency(prices, 'USD') || 0.0;
}
export const getCardImageUrl = (card?: Card | null, forceLanguage: string = 'fr') => {
  // @ts-ignore
  return card?.image_uris?.[forceLanguage] || card?.image_uris?.fr || card?.image_uris?.en || '';
}
export const getCardName = (card?: Card | null) => {
  const frenchCard = getFrenchCard(card);
  return frenchCard?.name || card?.name || '';
}
