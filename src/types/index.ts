export interface UploadedImage {
  id: string;
  image: Blob;
  createdAt: number;
}

export interface ImagePair {
  id: string;
  imageAId: string;
  imageBId: string;
  createdAt: number;
}

export interface GameCard {
  id: string;
  pairId: string;
  side: 'A' | 'B';
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchColor?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  cards: GameCard[];
  players: Player[];
  activePlayerIndex: number;
  firstFlippedCard: GameCard | null;
  secondFlippedCard: GameCard | null;
  isChecking: boolean;
  isGameOver: boolean;
  moves: number;
}
