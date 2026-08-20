import React, { useState } from 'react';
import { Bookmark, BrowserTab, VehicleState, CarBrowserSettings } from '../types';
import { BrowserEngine } from './BrowserEngine';
import { 
  Wifi, 
  Battery, 
  Cast, 
  Star, 
  Plus, 
  Layers, 
  MoreVertical, 
  Share2, 
  Compass, 
  Smartphone, 
  ExternalLink,
  Sliders,
  CheckCircle2,
  BookmarkPlus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface Props {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onNewTab: () => void;
  onCloseTab: (id: string) => void;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  onToggleBookmark: (url: string, title: string) => void;
  isBookmarked: boolean;
  vehicleState: VehicleState;
  settings: CarBrowserSettings;
  bookmarks: Bookmark[];
  onOpenVoiceAssistant: () => void;
  onOpenBookmarkModal: () => void;
  onOpenSettings: () => void;
  onPushToCar: (url: string) => void;
  onToggleConnection: () => void;
}

export const AndroidPhone: React.FC<Props> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  onToggleBookmark,
  isBookmarked,
  vehicleState,
  settings,
  bookmarks,
  onOpenVoiceAssistant,
  onOpenBookmarkModal,
  onOpenSettings,
  onPushToCar,
  onToggleConnection,
}) => {
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const speedDialBookmarks = bookmarks.filter((b) => b.isSpeedDial);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      id="android-phone-device"
      className="w-full max-w-sm sm:max-w-md h-[780px] sm:h-[840px] mx-auto bg-neutral-900 border-[10px] border-neutral-800 rounded-[48px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-neutral-700"
    >
      {/* Phone Top Notch / Hole Punch Camera & Speaker */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-900 rounded-b-2xl z-40 flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-neutral-800 ring-1 ring-neutral-700 mr-2" />
        <div className="w-10 h-1 rounded-full bg-neutral-700" />
      </div>

      {/* Android System Status Bar */}
      <div className="bg-neutral-900 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-neutral-300 font-medium select-none z-30 shrink-0">
        <span className="font-semibold text-white tracking-wide">{currentTime}</span>
        <div className="flex items-center gap-2.5">
          <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40">
            5G
          </div>
          <Wifi className="w-3.5 h-3.5 text-neutral-200" />
          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">{vehicleState.batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* Android Auto Connection Bar */}
      <div className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 px-4 py-2 flex items-center justify-between border-b border-blue-700/50 z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
            <Cast className="w-3.5 h-3.5" />
            <span>Android Auto Synced</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="phone-cast-to-car-btn"
            onClick={() => onPushToCar(activeTab.url)}
            className="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1"
            title="Cast active browser tab directly to car infotainment"
          >
            <span>Cast to Car</span>
          </button>
        </div>
      </div>

      {/* Mobile Browser Top Toolbar */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-3 py-2 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('car://home')}
            className="p-1.5 rounded-lg bg-blue-600 text-white"
            title="Home"
          >
            <Compass className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white">AutoBrowser Mobile</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmarks Manager Modal Button */}
          <button
            id="phone-open-bookmarks-btn"
            onClick={onOpenBookmarkModal}
            className="p-2 rounded-lg text-amber-400 hover:bg-neutral-800 transition-colors"
            title="Bookmarks"
          >
            <Star className="w-4 h-4 fill-amber-400/30" />
          </button>

          {/* Tab Switcher Button */}
          <button
            id="phone-open-tabs-btn"
            onClick={() => setShowTabSwitcher(!showTabSwitcher)}
            className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs border border-neutral-700 transition-all"
            title="Tabs Tray"
          >
            {tabs.length}
          </button>

          {/* Quick Menu */}
          <button
            id="phone-quick-menu-btn"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Menu Dropdown */}
      {showQuickMenu && (
        <div className="absolute top-28 right-4 w-56 bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl p-2 z-50 text-xs text-neutral-200 animate-fade-in">
          <button
            onClick={() => {
              onToggleBookmark(activeTab.url, activeTab.title);
              setShowQuickMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-700 text-left transition-colors"
          >
            <BookmarkPlus className="w-4 h-4 text-amber-400" />
            <span>{isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}</span>
          </button>

          <button
            onClick={() => {
              onOpenBookmarkModal();
              setShowQuickMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-700 text-left transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-blue-400" />
            <span>Manage All Bookmarks</span>
          </button>

          <button
            onClick={() => {
              onPushToCar(activeTab.url);
              setShowQuickMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-700 text-left transition-colors text-emerald-400"
          >
            <Cast className="w-4 h-4" />
            <span>Send Tab to Android Auto</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              setShowQuickMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-700 text-left transition-colors border-t border-neutral-700/80 mt-1 pt-2"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Browser & Car Settings</span>
          </button>
        </div>
      )}

      {/* Mobile Tab Switcher Tray Overlay */}
      {showTabSwitcher ? (
        <div className="flex-1 bg-neutral-950 p-4 overflow-y-auto z-20 flex flex-col justify-between animate-fade-in">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white">Open Browser Tabs ({tabs.length})</span>
              <button
                id="phone-add-tab-btn"
                onClick={() => {
                  onNewTab();
                  setShowTabSwitcher(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> New Tab
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setShowTabSwitcher(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    tab.id === activeTabId
                      ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/40'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {tab.title || 'New Tab'}
                    </span>
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseTab(tab.id);
                        }}
                        className="text-xs text-neutral-400 hover:text-rose-400 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-neutral-400 truncate mt-1">
                    {tab.url}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowTabSwitcher(false)}
            className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold mt-4 transition-colors"
          >
            Close Tabs Tray
          </button>
        </div>
      ) : (
        /* Main Mobile Browser Viewport Engine */
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <BrowserEngine
            activeTab={activeTab}
            onNavigate={onNavigate}
            onGoBack={onGoBack}
            onGoForward={onGoForward}
            onRefresh={onRefresh}
            onToggleBookmark={onToggleBookmark}
            isBookmarked={isBookmarked}
            vehicleState={vehicleState}
            settings={settings}
            isCarDisplay={false}
            onOpenVoiceAssistant={onOpenVoiceAssistant}
            speedDialBookmarks={speedDialBookmarks}
            onOpenBookmarkModal={onOpenBookmarkModal}
            onOpenSettings={onOpenSettings}
          />
        </div>
      )}

      {/* Android Bottom Navigation Pill Gesture Bar */}
      <div className="bg-neutral-900 py-3 flex items-center justify-center shrink-0 z-30 select-none">
        <div className="w-32 h-1 rounded-full bg-neutral-600" />
      </div>
    </div>
  );
};
