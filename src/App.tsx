import React, { useState, useEffect } from 'react';
import { Bookmark, BrowserTab, VehicleState, CarBrowserSettings, ViewMode } from './types';
import { INITIAL_BOOKMARKS, DEMO_ARTICLES } from './data/defaultData';
import { CarHeadUnit } from './components/CarHeadUnit';
import { AndroidPhone } from './components/AndroidPhone';
import { CarDriveSimulatorBar } from './components/CarDriveSimulatorBar';
import { BookmarkManagerModal } from './components/BookmarkManagerModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CarSettingsModal } from './components/CarSettingsModal';
import { CarSpeechSynthesizer } from './utils/speechUtils';
import { Sparkles, Cast, CheckCircle, Info } from 'lucide-react';

const STORAGE_KEYS = {
  BOOKMARKS: 'autobrowser_bookmarks_v1',
  SETTINGS: 'autobrowser_settings_v1',
  VIEW_MODE: 'autobrowser_view_mode_v1',
};

const DEFAULT_SETTINGS: CarBrowserSettings = {
  allowFullBrowsingWhileDriving: false,
  autoReadAloudOnDrive: true,
  fontSize: 'large',
  highContrast: true,
  searchEngine: 'google',
  autoNightMode: true,
  screenDimming: 0,
  hapticFeedback: true,
};

export default function App() {
  // 1. Persistent Bookmarks State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOOKMARKS;
  });

  // 2. Settings State
  const [settings, setSettings] = useState<CarBrowserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // 3. View Mode State (split, car, phone)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      if (saved === 'split' || saved === 'car' || saved === 'phone') return saved;
    } catch {}
    return 'split';
  });

  // 4. Browser Tabs State
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'AutoBrowser Home',
      url: 'car://home',
      history: ['car://home'],
      historyIndex: 0,
      isLoading: false,
      readerMode: false,
    },
    {
      id: 'tab-2',
      title: 'PlugShare EV Stations',
      url: 'https://www.plugshare.com',
      history: ['https://www.plugshare.com'],
      historyIndex: 0,
      isLoading: false,
      readerMode: false,
    },
    {
      id: 'tab-3',
      title: 'NPR Distraction-Free News',
      url: 'https://text.npr.org',
      history: ['https://text.npr.org'],
      historyIndex: 0,
      isLoading: false,
      readerMode: true,
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // 5. Vehicle State Simulation
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    gear: 'P',
    speed: 0,
    isNightMode: true,
    isConnected: true,
    connectionType: 'wireless',
    batteryLevel: 88,
    isCharging: true,
    temperature: 21,
    weatherCondition: 'Sunny',
  });

  // 6. Modals & Toast State
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  // Save Settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Save View Mode
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch {}
  }, [viewMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Navigation handlers
  const handleNavigate = (newUrl: string) => {
    let title = 'Webpage';
    if (newUrl === 'car://home') {
      title = 'AutoBrowser Home';
    } else if (DEMO_ARTICLES[newUrl]) {
      title = DEMO_ARTICLES[newUrl].title;
    } else {
      try {
        title = new URL(newUrl).hostname;
      } catch {
        title = newUrl;
      }
    }

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1);
          newHistory.push(newUrl);
          return {
            ...tab,
            url: newUrl,
            title,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isLoading: false,
          };
        }
        return tab;
      })
    );
  };

  const handleGoBack = () => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId && tab.historyIndex > 0) {
          const nextIndex = tab.historyIndex - 1;
          const targetUrl = tab.history[nextIndex];
          return {
            ...tab,
            url: targetUrl,
            historyIndex: nextIndex,
          };
        }
        return tab;
      })
    );
  };

  const handleGoForward = () => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId && tab.historyIndex < tab.history.length - 1) {
          const nextIndex = tab.historyIndex + 1;
          const targetUrl = tab.history[nextIndex];
          return {
            ...tab,
            url: targetUrl,
            historyIndex: nextIndex,
          };
        }
        return tab;
      })
    );
  };

  const handleRefresh = () => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, isLoading: true };
        }
        return tab;
      })
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === activeTabId ? { ...tab, isLoading: false } : tab))
      );
    }, 400);
  };

  // Bookmark Management Handlers
  const isCurrentUrlBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  const handleToggleBookmark = (url: string, title: string) => {
    if (!url || url === 'car://home') return;

    if (bookmarks.some((b) => b.url === url)) {
      setBookmarks((prev) => prev.filter((b) => b.url !== url));
      showToast('Removed from Bookmarks');
    } else {
      const newBm: Bookmark = {
        id: 'bm-' + Date.now(),
        title: title || new URL(url).hostname,
        url,
        category: 'Custom',
        isSpeedDial: true,
        color: '#3B82F6',
        createdAt: Date.now(),
        pinned: true,
      };
      setBookmarks((prev) => [newBm, ...prev]);
      showToast('★ Saved to Android Auto Speed-Dial Bookmarks');
    }
  };

  const handleAddBookmark = (newBm: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const fullBm: Bookmark = {
      ...newBm,
      id: 'bm-' + Date.now(),
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [fullBm, ...prev]);
    showToast(`Added "${fullBm.title}" to Bookmarks`);
  };

  const handleUpdateBookmark = (updatedBm: Bookmark) => {
    setBookmarks((prev) => prev.map((b) => (b.id === updatedBm.id ? updatedBm : b)));
    showToast(`Updated "${updatedBm.title}"`);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Bookmark deleted');
  };

  // Tab Handlers
  const handleNewTab = () => {
    const newId = 'tab-' + Date.now();
    const newTab: BrowserTab = {
      id: newId,
      title: 'New Tab',
      url: 'car://home',
      history: ['car://home'],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
    }
  };

  // Cast tab to Android Auto / Sync
  const handlePushToCar = (url: string) => {
    handleNavigate(url);
    showToast('✓ Synced & projected tab to Android Auto display');
  };

  // Voice command execution
  const handleExecuteVoiceCommand = (
    commandText: string,
    actionType: 'search' | 'url' | 'read' | 'bookmark' | 'speeddial'
  ) => {
    if (actionType === 'bookmark') {
      handleToggleBookmark(activeTab.url, activeTab.title);
    } else if (actionType === 'read') {
      const art = DEMO_ARTICLES[activeTab.url];
      if (art) {
        CarSpeechSynthesizer.speak(`${art.title}. ${art.paragraphs.join(' ')}`);
      } else {
        CarSpeechSynthesizer.speak(`Reading active webpage ${activeTab.url}. In reader mode on Android Auto.`);
      }
      showToast('🔊 Reading page aloud over car audio');
    } else if (actionType === 'url') {
      const cleaned = commandText.replace(/^open\s+/i, '').trim();
      handleNavigate(cleaned);
      showToast(`Navigating to ${cleaned}`);
    } else {
      let query = commandText.replace(/^(search|find|google)\s+/i, '').trim();
      let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      handleNavigate(searchUrl);
      showToast(`Searching for "${query}"`);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none">
      {/* Top Universal Simulator & Control Bar */}
      <CarDriveSimulatorBar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        vehicleState={vehicleState}
        onUpdateVehicleState={(s) => setVehicleState((prev) => ({ ...prev, ...s }))}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Multi-Screen Display Area */}
      <main className="flex-1 overflow-hidden p-3 sm:p-4 lg:p-6 flex items-center justify-center">
        {viewMode === 'split' ? (
          /* Dual-Screen Connected Mode: Android Auto Head Unit (Left 65%) + Android Phone Companion (Right 35%) */
          <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            {/* Android Auto Head Unit Container */}
            <div className="xl:col-span-8 h-full flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Car Infotainment Display (Android Auto Head Unit)</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">21:9 Widescreen Mode</span>
              </div>
              <div className="flex-1 h-full min-h-0">
                <CarHeadUnit
                  activeTab={activeTab}
                  onNavigate={handleNavigate}
                  onGoBack={handleGoBack}
                  onGoForward={handleGoForward}
                  onRefresh={handleRefresh}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={isCurrentUrlBookmarked}
                  vehicleState={vehicleState}
                  settings={settings}
                  bookmarks={bookmarks}
                  onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
                  onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
                  onOpenSettings={() => setIsSettingsModalOpen(true)}
                />
              </div>
            </div>

            {/* Android Phone Companion Container */}
            <div className="xl:col-span-4 h-full flex flex-col justify-center items-center">
              <div className="flex items-center justify-between w-full max-w-sm sm:max-w-md mb-2 px-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <Cast className="w-3.5 h-3.5 text-blue-400" />
                  <span>Connected Android Phone</span>
                </div>
                <span className="text-[11px] text-blue-400 font-semibold">Live Synced</span>
              </div>

              <AndroidPhone
                tabs={tabs}
                activeTabId={activeTabId}
                onSelectTab={setActiveTabId}
                onNewTab={handleNewTab}
                onCloseTab={handleCloseTab}
                onNavigate={handleNavigate}
                onGoBack={handleGoBack}
                onGoForward={handleGoForward}
                onRefresh={handleRefresh}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={isCurrentUrlBookmarked}
                vehicleState={vehicleState}
                settings={settings}
                bookmarks={bookmarks}
                onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
                onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
                onPushToCar={handlePushToCar}
                onToggleConnection={() =>
                  setVehicleState((prev) => ({ ...prev, isConnected: !prev.isConnected }))
                }
              />
            </div>
          </div>
        ) : viewMode === 'car' ? (
          /* Car Infotainment Screen Fullscreen Mode */
          <div className="w-full h-full max-w-6xl mx-auto flex flex-col">
            <CarHeadUnit
              activeTab={activeTab}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              onGoForward={handleGoForward}
              onRefresh={handleRefresh}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isCurrentUrlBookmarked}
              vehicleState={vehicleState}
              settings={settings}
              bookmarks={bookmarks}
              onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
              onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
            />
          </div>
        ) : (
          /* Android Phone Only Mode */
          <div className="w-full h-full flex items-center justify-center py-2">
            <AndroidPhone
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={setActiveTabId}
              onNewTab={handleNewTab}
              onCloseTab={handleCloseTab}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              onGoForward={handleGoForward}
              onRefresh={handleRefresh}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isCurrentUrlBookmarked}
              vehicleState={vehicleState}
              settings={settings}
              bookmarks={bookmarks}
              onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
              onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onPushToCar={handlePushToCar}
              onToggleConnection={() =>
                setVehicleState((prev) => ({ ...prev, isConnected: !prev.isConnected }))
              }
            />
          </div>
        )}
      </main>

      {/* Interactive Toast Notification Banner */}
      {toastMessage && (
        <div 
          id="app-toast-notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-neutral-900/95 border border-neutral-700 shadow-2xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2.5 backdrop-blur-md animate-fade-in"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bookmark Manager Modal */}
      <BookmarkManagerModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        bookmarks={bookmarks}
        onAddBookmark={handleAddBookmark}
        onUpdateBookmark={handleUpdateBookmark}
        onDeleteBookmark={handleDeleteBookmark}
        onSelectBookmark={handleNavigate}
        currentUrl={activeTab.url}
        currentTitle={activeTab.title}
        isNightMode={vehicleState.isNightMode}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecuteCommand={handleExecuteVoiceCommand}
        isNightMode={vehicleState.isNightMode}
      />

      {/* Car Settings Modal */}
      <CarSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        isNightMode={vehicleState.isNightMode}
      />
    </div>
  );
}
