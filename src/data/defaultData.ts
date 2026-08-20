import { Bookmark, ArticleContent } from '../types';

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    title: 'PlugShare EV Stations',
    url: 'https://www.plugshare.com',
    category: 'Navigation & EV',
    isSpeedDial: true,
    color: '#10B981',
    createdAt: Date.now() - 86400000 * 5,
    note: 'Find nearby fast DC chargers & CCS/NACS connectors',
    pinned: true,
  },
  {
    id: 'bm-2',
    title: 'OpenStreetMap Live',
    url: 'https://www.openstreetmap.org',
    category: 'Navigation & EV',
    isSpeedDial: true,
    color: '#3B82F6',
    createdAt: Date.now() - 86400000 * 4,
    note: 'Real-time open community road & navigation map',
    pinned: true,
  },
  {
    id: 'bm-3',
    title: 'Windy Weather & Wind Radar',
    url: 'https://www.windy.com',
    category: 'Navigation & EV',
    isSpeedDial: true,
    color: '#06B6D4',
    createdAt: Date.now() - 86400000 * 3,
    note: 'Live radar, storm alerts, and road wind conditions',
  },
  {
    id: 'bm-4',
    title: 'Wikipedia Automotive Portal',
    url: 'https://en.wikipedia.org/wiki/Portal:Automobiles',
    category: 'Travel & Tools',
    isSpeedDial: true,
    color: '#6366F1',
    createdAt: Date.now() - 86400000 * 2,
    note: 'Encyclopedia articles, history & travel guides',
  },
  {
    id: 'bm-5',
    title: 'NPR News Brief',
    url: 'https://text.npr.org',
    category: 'News & Audio',
    isSpeedDial: true,
    color: '#EC4899',
    createdAt: Date.now() - 86400000 * 1,
    note: 'Ultra lightweight, readable news for distraction-free reading',
    pinned: true,
  },
  {
    id: 'bm-6',
    title: 'BBC Lite World News',
    url: 'https://www.bbc.com/news',
    category: 'News & Audio',
    isSpeedDial: true,
    color: '#EF4444',
    createdAt: Date.now() - 86400000 * 1,
    note: 'Global headlines & breaking news updates',
  },
  {
    id: 'bm-7',
    title: 'Hacker News Reader',
    url: 'https://news.ycombinator.com',
    category: 'News & Audio',
    isSpeedDial: false,
    color: '#F97316',
    createdAt: Date.now() - 86400000 * 6,
    note: 'Tech updates, discussions, and industry developments',
  },
  {
    id: 'bm-8',
    title: 'Road & Track Daily',
    url: 'https://www.roadandtrack.com',
    category: 'Entertainment',
    isSpeedDial: true,
    color: '#EAB308',
    createdAt: Date.now() - 86400000 * 7,
    note: 'Automotive culture, electric car reviews & road tests',
  },
  {
    id: 'bm-9',
    title: 'iOverlander Campsites & Rest Stops',
    url: 'https://www.ioverlander.com',
    category: 'Travel & Tools',
    isSpeedDial: false,
    color: '#84CC16',
    createdAt: Date.now() - 86400000 * 8,
    note: 'Rest areas, scenic parking, and amenities along highways',
  },
  {
    id: 'bm-10',
    title: 'Radio Garden Live Global Stations',
    url: 'https://radio.garden',
    category: 'Entertainment',
    isSpeedDial: true,
    color: '#14B8A6',
    createdAt: Date.now() - 86400000 * 9,
    note: 'Listen to thousands of live local radio stations worldwide while parked',
  }
];

export const DEMO_ARTICLES: Record<string, ArticleContent> = {
  'https://www.plugshare.com': {
    url: 'https://www.plugshare.com',
    title: 'EV Charging Network Guide & Highway Corridors',
    author: 'Clean Mobility Team',
    siteName: 'PlugShare Network',
    readTime: '3 min listen',
    date: 'Updated 2026',
    category: 'Navigation & EV',
    paragraphs: [
      'The expansion of high-speed charging corridors has reduced highway range anxiety by over 70% nationwide. Most modern rest plazas now feature ultra-fast 350 kilowatt DC fast chargers capable of replenishing 200 miles in under 15 minutes.',
      'When planning long distance road trips on Android Auto, it is best practice to target battery stops at 15% state of charge for maximum charging curve speeds.',
      'Check connector compatibility before departing: North American Charging Standard (NACS) and CCS-Combo 1 remain supported at almost all public high-output locations.'
    ]
  },
  'https://text.npr.org': {
    url: 'https://text.npr.org',
    title: 'Morning News Digest: Global Energy, Transit & Tech',
    author: 'NPR Newsroom',
    siteName: 'NPR Distraction-Free Edition',
    readTime: '4 min listen',
    date: 'Today at 08:30 AM',
    category: 'News & Audio',
    paragraphs: [
      'Transportation authorities announce a new series of green-wave coordinated traffic signals aimed at reducing urban stop-and-go emissions and travel times.',
      'Renewable energy generation on public grids hit a new record high this quarter, driven by expanded solar and offshore wind capacity.',
      'Automotive software developers are introducing next-generation head unit standards with smarter voice navigation, glanceable typography, and localized audio read-outs.'
    ]
  },
  'https://www.bbc.com/news': {
    url: 'https://www.bbc.com/news',
    title: 'Global Transportation & Infrastructure Roundup',
    author: 'BBC Global Reporting',
    siteName: 'BBC News',
    readTime: '3 min listen',
    date: 'Today',
    category: 'News & Audio',
    paragraphs: [
      'High-speed rail links and smart motorway corridors are receiving expanded infrastructure funding across several continents to improve freight and passenger efficiency.',
      'Weather experts predict mild driving conditions across major metropolitan routes through the weekend with clear visibility on interstates.',
      'New standards for automotive connected devices now emphasize driver ergonomics, hands-free text-to-speech comprehension, and distraction prevention.'
    ]
  },
  'https://en.wikipedia.org/wiki/Portal:Automobiles': {
    url: 'https://en.wikipedia.org/wiki/Portal:Automobiles',
    title: 'The Evolution of In-Car Connected Infotainment',
    author: 'Wikipedia Contributors',
    siteName: 'Wikipedia Free Encyclopedia',
    readTime: '5 min listen',
    date: '2026 Edition',
    category: 'Travel & Tools',
    paragraphs: [
      'Connected vehicle telematics began in the late 1990s with rudimentary analog cellular links for roadside assistance. Over the subsequent decades, smartphones revolutionized vehicle user experiences.',
      'Android Auto, unveiled in 2014, projected user navigation, communications, and media apps directly onto dashboard touchscreens with standardized, driver-safe user interfaces.',
      'Modern automotive browsers allow drivers and passengers to manage travel bookmarks, look up local destination hours while parked, and listen to spoken web articles via Text-to-Speech while in transit.'
    ]
  },
  'https://www.roadandtrack.com': {
    url: 'https://www.roadandtrack.com',
    title: 'Top 10 Scenic Mountain Byways to Explore This Season',
    author: 'Editorial Desk',
    siteName: 'Road & Track',
    readTime: '4 min listen',
    date: 'Featured Route Guide',
    category: 'Entertainment',
    paragraphs: [
      'Nothing beats the sensation of a crisp autumn morning driving through sweeping canyon curves with the panoramic sunroof open and a clear horizon ahead.',
      'From the Pacific Coast Highway to the Blue Ridge Parkway, scenic byways offer countless scenic pullouts, historic stone bridges, and roadside farm stands.',
      'Remember to inspect tire pressure, brake fluid, and battery coolant levels prior to ascending high-altitude mountain passes.'
    ]
  }
};
