import React, { useState } from 'react';
import { Bookmark, BrowserTab, VehicleState, CarBrowserSettings } from '../types';
import { BrowserEngine } from './BrowserEngine';
import { 
  Grid, 
  Compass, 
  Music, 
  Mic, 
  Volume2, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  Sun, 
  Moon, 
  Layers, 
  Settings as SettingsIcon, 
  Star, 
  Radio, 
  Maximize, 
  Minimize, 
  ChevronRight, 
  Navigation,
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';

interface Props {
  activeTab: BrowserTab;
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
}

export const CarHeadUnit: React.FC<Props> = ({
  activeTab,
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
}) => {
  const [splitViewMode, setSplitViewMode] = useState<'full' | 'split'>('split');
  const [activeMediaTrack, setActiveMediaTrack] = useState({
    title: 'Highway FM Radio Stream',
    artist: 'Live Broadcast • 98.5 FM',
    playing: true,
  });

  const speedDialBookmarks = bookmarks.filter((b) => b.isSpeedDial);

  const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      id="android-auto-head-unit"
      className="w-full h-full flex flex-col rounded-3xl overflow-hidden border-4 border-neutral-800 bg-neutral-950 shadow-2xl relative"
    >
      {/* Car Screen Physical Bezel Top Status Indicator */}
      <div className="bg-neutral-900/95 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-300 select-none z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ANDROID AUTO</span>
          </div>

          <span className="text-neutral-600">|</span>

          <div className="flex items-center gap-1.5 text-blue-400 font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wireless Connected</span>
          </div>

          <span className="text-neutral-600 hidden sm:inline">|</span>

          {/* Vehicle Gear Selector Indicator */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Gear:</span>
            <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
              vehicleState.gear === 'D'
                ? 'bg-amber-500 text-black animate-pulse'
                : vehicleState.gear === 'P'
                ? 'bg-emerald-500 text-black'
                : 'bg-neutral-700 text-white'
            }`}>
              {vehicleState.gear}
            </span>
            <span className="text-neutral-400 text-[11px] font-mono ml-1">
              {vehicleState.speed} km/h
            </span>
          </div>
        </div>

        {/* Right Info: Clock, Weather, Battery */}
        <div className="flex items-center gap-3.5 text-neutral-300">
          <div className="flex items-center gap-1 text-[11px]">
            {vehicleState.isNightMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span>{vehicleState.temperature}°C {vehicleState.weatherCondition}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            {vehicleState.isCharging ? <BatteryCharging className="w-4 h-4 text-emerald-400" /> : <Battery className="w-4 h-4 text-neutral-300" />}
            <span>{vehicleState.batteryLevel}%</span>
          </div>

          <div className="flex items-center gap-1 font-mono font-bold text-white text-xs pl-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{currentTimeString}</span>
          </div>
        </div>
      </div>

      {/* Main Infotainment Layout: Left Rail + Main Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Android Auto Coolwalk Left Side Rail */}
        <div 
          id="aa-side-rail"
          className="w-16 sm:w-20 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center justify-between py-4 select-none shrink-0 z-20"
        >
          {/* Top Rail Buttons */}
          <div className="flex flex-col items-center gap-3">
            {/* App Grid Launcher */}
            <button
              id="aa-btn-launcher"
              onClick={() => onNavigate('car://home')}
              className="w-12 h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
              title="Android Auto Launcher"
            >
              <Grid className="w-6 h-6" />
            </button>

            {/* Active Browser App Icon */}
            <button
              id="aa-btn-browser"
              onClick={() => onNavigate('car://home')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
                activeTab.url !== ''
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-neutral-900'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="AutoBrowser"
            >
              <Compass className="w-6 h-6" />
            </button>

            {/* Bookmarks Hub Rail Button */}
            <button
              id="aa-btn-bookmarks"
              onClick={onOpenBookmarkModal}
              className="w-12 h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-amber-400 flex items-center justify-center transition-all active:scale-95"
              title="Bookmarks Manager"
            >
              <Star className="w-6 h-6 fill-amber-400/20" />
            </button>

            {/* Split Screen Toggle */}
            <button
              id="aa-btn-split"
              onClick={() => setSplitViewMode(splitViewMode === 'split' ? 'full' : 'split')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                splitViewMode === 'split' ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Widescreen Split Layout"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Rail Buttons */}
          <div className="flex flex-col items-center gap-3">
            {/* Google / Android Auto Voice Assistant Mic Button */}
            <button
              id="aa-btn-mic"
              onClick={onOpenVoiceAssistant}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 ring-2 ring-blue-400/30"
              title="Android Auto Voice Assistant"
            >
              <Mic className="w-6 h-6" />
            </button>

            {/* Settings Button */}
            <button
              id="aa-btn-settings"
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
              title="Car Browser Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area: Main Browser Stage + Optional Split Widget */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Browser Viewport */}
          <div className={`h-full flex flex-col transition-all ${
            splitViewMode === 'split' ? 'w-full lg:w-3/4' : 'w-full'
          }`}>
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
              isCarDisplay={true}
              onOpenVoiceAssistant={onOpenVoiceAssistant}
              speedDialBookmarks={speedDialBookmarks}
              onOpenBookmarkModal={onOpenBookmarkModal}
              onOpenSettings={onOpenSettings}
            />
          </div>

          {/* Split View Secondary Automotive Widget (Navigation / Radio / ETA) */}
          {splitViewMode === 'split' && (
            <div 
              id="aa-split-widget-sidebar"
              className="hidden lg:flex lg:w-1/4 h-full bg-neutral-900 border-l border-neutral-800 flex-col p-4 space-y-4 select-none overflow-y-auto"
            >
              {/* Mini Navigation Card */}
              <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Navigation className="w-4 h-4" />
                    <span>Active Route</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">Next Turn in 500m</span>
                </div>
                <div className="text-base font-bold text-white">Turn right onto Route 101 North</div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mt-3 pt-2 border-t border-neutral-700">
                  <span>ETA: 18 mins</span>
                  <span>14.2 km remaining</span>
                </div>
              </div>

              {/* In-Car Audio & Media Card */}
              <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 shadow-md flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Music className="w-4 h-4" />
                    <span>In-Car Media Stream</span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">{activeMediaTrack.title}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{activeMediaTrack.artist}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-700 flex items-center justify-between">
                  <button 
                    onClick={() => setActiveMediaTrack(prev => ({ ...prev, playing: !prev.playing }))}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{activeMediaTrack.playing ? 'Playing' : 'Paused'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('https://radio.garden')}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Radio Garden</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick Car Speed-Dial Sidebar Short-List */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Speed Dial</span>
                  <button onClick={onOpenBookmarkModal} className="text-blue-400 text-[10px] hover:underline">All</button>
                </div>
                <div className="space-y-1.5">
                  {speedDialBookmarks.slice(0, 3).map((bm) => (
                    <button
                      key={bm.id}
                      onClick={() => onNavigate(bm.url)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-left transition-colors"
                    >
                      <span className="text-xs font-semibold text-neutral-200 truncate">{bm.title}</span>
                      <ChevronRight className="w-3 h-3 text-neutral-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
