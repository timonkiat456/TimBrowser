export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: 'Navigation & EV' | 'News & Audio' | 'Travel & Tools' | 'Entertainment' | 'Custom';
  favicon?: string;
  isSpeedDial: boolean;
  color?: string;
  createdAt: number;
  note?: string;
  pinned?: boolean;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
  isPrivate?: boolean;
  isLoading?: boolean;
  readerMode?: boolean;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  visitCount: number;
}

export interface ArticleContent {
  url: string;
  title: string;
  author?: string;
  siteName: string;
  readTime: string;
  date: string;
  paragraphs: string[];
  category: string;
  tags?: string[];
  coverImage?: string;
}

export interface VehicleState {
  gear: 'P' | 'D' | 'R' | 'N';
  speed: number; // km/h
  isNightMode: boolean;
  isConnected: boolean;
  connectionType: 'wireless' | 'usb';
  batteryLevel: number;
  isCharging: boolean;
  temperature: number;
  weatherCondition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Night Clear';
  destinationEta?: string;
}

export interface CarBrowserSettings {
  allowFullBrowsingWhileDriving: boolean;
  autoReadAloudOnDrive: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  searchEngine: 'google' | 'duckduckgo' | 'bing' | 'wikipedia';
  autoNightMode: boolean;
  screenDimming: number; // 0 to 100
  hapticFeedback: boolean;
}

export type ViewMode = 'split' | 'car' | 'phone';
