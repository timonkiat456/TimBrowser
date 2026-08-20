import React, { useState, useEffect } from 'react';
import { Bookmark, BrowserTab, VehicleState, CarBrowserSettings, ArticleContent } from '../types';
import { DEMO_ARTICLES } from '../data/defaultData';
import { CarSpeechSynthesizer } from '../utils/speechUtils';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Star, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ShieldAlert, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Lock, 
  Mic,
  Share2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Compass,
  Radio,
  Newspaper,
  Wrench,
  AlertCircle
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
  isCarDisplay?: boolean;
  onOpenVoiceAssistant?: () => void;
  speedDialBookmarks: Bookmark[];
  onOpenBookmarkModal?: () => void;
  onOpenSettings?: () => void;
}

export const BrowserEngine: React.FC<Props> = ({
  activeTab,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  onToggleBookmark,
  isBookmarked,
  vehicleState,
  settings,
  isCarDisplay = false,
  onOpenVoiceAssistant,
  speedDialBookmarks,
  onOpenBookmarkModal,
  onOpenSettings,
}) => {
  const [inputUrl, setInputUrl] = useState(activeTab.url);
  const [isReadingMode, setIsReadingMode] = useState(activeTab.readerMode || false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [iframeError, setIframeError] = useState(false);

  // Sync input text when tab changes
  useEffect(() => {
    setInputUrl(activeTab.url);
    setIframeError(false);
  }, [activeTab.url]);

  // Sync TTS state listener
  useEffect(() => {
    CarSpeechSynthesizer.setCallback((speaking) => {
      setIsSpeaking(speaking);
    });

    return () => {
      CarSpeechSynthesizer.stop();
    };
  }, []);

  // When vehicle shifts to Drive and auto TTS is enabled
  useEffect(() => {
    if (vehicleState.gear === 'D' && settings.autoReadAloudOnDrive && activeTab.url && activeTab.url !== 'car://home') {
      handleStartTextToSpeech();
    }
  }, [vehicleState.gear]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    let target = inputUrl.trim();
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('car://')) {
      onNavigate(target);
    } else if (target.includes('.') && !target.includes(' ')) {
      onNavigate('https://' + target);
    } else {
      // Search engine
      let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
      if (settings.searchEngine === 'duckduckgo') {
        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
      } else if (settings.searchEngine === 'bing') {
        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
      } else if (settings.searchEngine === 'wikipedia') {
        searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(target)}`;
      }
      onNavigate(searchUrl);
    }
  };

  const currentArticle: ArticleContent = DEMO_ARTICLES[activeTab.url] || {
    url: activeTab.url,
    title: activeTab.title || 'Web Document',
    author: 'Web Source',
    siteName: new URL(activeTab.url.startsWith('http') ? activeTab.url : 'https://auto.browser').hostname,
    readTime: '2 min read',
    date: 'Live page',
    category: 'General',
    paragraphs: [
      `You are currently viewing ${activeTab.url}. In distraction-free reader mode on Android Auto, page content is stripped of clutter and optimized for automotive typography and text-to-speech comprehension.`,
      `You can bookmark this page to your Android Auto speed-dial tiles for rapid one-touch access during travel, or tap the speaker icon above to have the content read aloud over the vehicle's speakers.`,
      `Safe driving tip: When the vehicle is in motion, high-density websites and video streams are automatically adapted to voice and glanceable layouts.`
    ]
  };

  const handleStartTextToSpeech = () => {
    if (isSpeaking) {
      CarSpeechSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    const fullText = `${currentArticle.title}. From ${currentArticle.siteName}. ` + currentArticle.paragraphs.join(' ');
    CarSpeechSynthesizer.speak(fullText, () => {
      setIsSpeaking(false);
    });
  };

  const isVehicleMoving = vehicleState.gear === 'D' || vehicleState.speed > 0;
  const isSafetyLockoutActive = isVehicleMoving && !settings.allowFullBrowsingWhileDriving && !isReadingMode && activeTab.url !== 'car://home';

  // Responsive font scaling
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'extra-large':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-normal';
    }
  };

  return (
    <div 
      id="browser-engine-container"
      className={`w-full h-full flex flex-col overflow-hidden select-none transition-colors ${
        vehicleState.isNightMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Top Browser Navigation & URL Bar */}
      <div 
        id="browser-nav-bar"
        className={`flex items-center gap-2 px-3 py-2 border-b shrink-0 transition-colors ${
          vehicleState.isNightMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        {/* Nav Controls */}
        <div className="flex items-center gap-1">
          <button
            id="browser-btn-back"
            onClick={onGoBack}
            disabled={activeTab.historyIndex <= 0}
            className={`p-2 rounded-xl transition-all ${
              activeTab.historyIndex <= 0
                ? 'opacity-30 cursor-not-allowed'
                : vehicleState.isNightMode ? 'hover:bg-neutral-800 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="browser-btn-forward"
            onClick={onGoForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className={`p-2 rounded-xl transition-all ${
              activeTab.historyIndex >= activeTab.history.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : vehicleState.isNightMode ? 'hover:bg-neutral-800 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Forward"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="browser-btn-reload"
            onClick={onRefresh}
            className={`p-2 rounded-xl transition-all ${
              vehicleState.isNightMode ? 'hover:bg-neutral-800 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Refresh"
          >
            <RotateCw className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab.isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            id="browser-btn-home"
            onClick={() => onNavigate('car://home')}
            className={`p-2 rounded-xl transition-all ${
              activeTab.url === 'car://home'
                ? 'bg-blue-600/20 text-blue-400'
                : vehicleState.isNightMode ? 'hover:bg-neutral-800 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Car Browser Home"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Address / Search Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 relative flex items-center min-w-0">
          <div className="absolute left-3 flex items-center gap-1.5 text-neutral-400 pointer-events-none">
            {activeTab.url.startsWith('https') ? (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
          </div>

          <input
            id="browser-address-input"
            type="text"
            value={inputUrl === 'car://home' ? '' : inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Search web or enter automotive URL..."
            className={`w-full pl-9 pr-24 py-2 rounded-2xl text-xs sm:text-sm font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              vehicleState.isNightMode
                ? 'bg-neutral-800/90 border-neutral-700 text-white placeholder-neutral-500 focus:bg-neutral-800'
                : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white'
            }`}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {/* Voice Mic inside input */}
            {onOpenVoiceAssistant && (
              <button
                type="button"
                id="voice-search-bar-btn"
                onClick={onOpenVoiceAssistant}
                className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                title="Android Auto Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark Star Button */}
            <button
              type="button"
              id="toggle-star-bookmark-btn"
              onClick={() => onToggleBookmark(activeTab.url, activeTab.title)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-400 bg-amber-400/15'
                  : vehicleState.isNightMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add to Android Auto Bookmarks'}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </form>

        {/* Action Controls: Reader Mode, TTS Speaker, Zoom */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Reader Mode Toggle */}
          <button
            id="toggle-reader-mode-btn"
            onClick={() => setIsReadingMode(!isReadingMode)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              isReadingMode
                ? 'bg-indigo-600 text-white shadow-sm'
                : vehicleState.isNightMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Distraction-Free Automotive Reader Mode"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Reader</span>
          </button>

          {/* Text-to-Speech (TTS) Car Audio Reader */}
          <button
            id="toggle-car-tts-btn"
            onClick={handleStartTextToSpeech}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-emerald-600 text-white animate-pulse shadow-md'
                : vehicleState.isNightMode ? 'hover:bg-neutral-800 text-emerald-400' : 'hover:bg-neutral-100 text-emerald-600'
            }`}
            title={isSpeaking ? 'Pause Audio Reader' : 'Read Webpage Aloud (Car Speakers)'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Listening...' : 'Read Aloud'}</span>
          </button>
        </div>
      </div>

      {/* TTS Active Audio Banner */}
      {isSpeaking && (
        <div className="bg-emerald-900/80 border-b border-emerald-700 px-4 py-2 flex items-center justify-between text-xs text-emerald-100 backdrop-blur-md animate-fade-in shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">AutoBrowser TTS: Reading "{currentArticle.title}"</span>
          </div>
          <button
            id="stop-tts-banner-btn"
            onClick={() => {
              CarSpeechSynthesizer.stop();
              setIsSpeaking(false);
            }}
            className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Stop Audio
          </button>
        </div>
      )}

      {/* Main Viewport Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* 1. Android Auto Speed-Dial Home Screen */}
        {activeTab.url === 'car://home' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Automotive Hero Banner */}
              <div className={`p-5 rounded-3xl border relative overflow-hidden ${
                vehicleState.isNightMode
                  ? 'bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-neutral-900 border-blue-900/40'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-400/30">
                        Android Auto Connected
                      </span>
                      {vehicleState.gear === 'D' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-400/30">
                          Drive Mode Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                          Parked (P)
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">AutoBrowser Dashboard</h2>
                    <p className={`text-xs sm:text-sm mt-1 ${vehicleState.isNightMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      Select speed-dial bookmarks below or use hands-free voice search while driving.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenVoiceAssistant && (
                      <button
                        id="hero-voice-assistant-btn"
                        onClick={onOpenVoiceAssistant}
                        className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg transition-all flex items-center gap-2"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Voice Command</span>
                      </button>
                    )}
                    {onOpenBookmarkModal && (
                      <button
                        id="hero-manage-bookmarks-btn"
                        onClick={onOpenBookmarkModal}
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 ${
                          vehicleState.isNightMode
                            ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200'
                            : 'bg-white border-neutral-300 hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <Star className="w-4 h-4 text-amber-400" />
                        <span>Manage Bookmarks</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Speed Dial Section - 1-Tap Big Automotive Tiles */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Android Auto Speed-Dial Bookmarks</span>
                  </h3>
                  <span className={`text-xs ${vehicleState.isNightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Optimized for in-car touch targets
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {speedDialBookmarks.map((bm) => (
                    <button
                      key={bm.id}
                      id={`speed-dial-tile-${bm.id}`}
                      onClick={() => onNavigate(bm.url)}
                      className={`group p-4 rounded-2xl border text-left flex flex-col justify-between min-h-[110px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${
                        vehicleState.isNightMode
                          ? 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-850'
                          : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                          style={{ backgroundColor: bm.color || '#3B82F6' }}
                        >
                          {bm.title.charAt(0)}
                        </div>
                        <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 transition-colors" />
                      </div>

                      <div className="mt-3">
                        <h4 className="text-sm font-bold truncate leading-snug group-hover:text-blue-400 transition-colors">
                          {bm.title}
                        </h4>
                        <p className={`text-[11px] truncate font-mono mt-0.5 ${
                          vehicleState.isNightMode ? 'text-neutral-400' : 'text-neutral-500'
                        }`}>
                          {bm.url.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Car Shortcuts Category Groups */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className={`p-4 rounded-2xl border ${
                  vehicleState.isNightMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <Compass className="w-4 h-4" /> Navigation & EV Charging
                  </div>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => onNavigate('https://www.plugshare.com')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-emerald-500/10 text-neutral-300 hover:text-emerald-400 transition-colors"
                    >
                      • PlugShare High-Power Chargers
                    </button>
                    <button 
                      onClick={() => onNavigate('https://www.openstreetmap.org')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-emerald-500/10 text-neutral-300 hover:text-emerald-400 transition-colors"
                    >
                      • OpenStreetMap Community Roads
                    </button>
                    <button 
                      onClick={() => onNavigate('https://www.windy.com')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-emerald-500/10 text-neutral-300 hover:text-emerald-400 transition-colors"
                    >
                      • Windy Live Storm & Radar
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  vehicleState.isNightMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-pink-400 font-semibold text-xs uppercase tracking-wider">
                    <Newspaper className="w-4 h-4" /> Spoken News & Distraction-Free
                  </div>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => onNavigate('https://text.npr.org')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-pink-500/10 text-neutral-300 hover:text-pink-400 transition-colors"
                    >
                      • NPR Text-Only Morning Digest
                    </button>
                    <button 
                      onClick={() => onNavigate('https://www.bbc.com/news')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-pink-500/10 text-neutral-300 hover:text-pink-400 transition-colors"
                    >
                      • BBC Global Reporting Brief
                    </button>
                    <button 
                      onClick={() => onNavigate('https://news.ycombinator.com')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-pink-500/10 text-neutral-300 hover:text-pink-400 transition-colors"
                    >
                      • Hacker News Clean Tech Feed
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  vehicleState.isNightMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                    <Radio className="w-4 h-4" /> Travel & Reference
                  </div>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => onNavigate('https://en.wikipedia.org/wiki/Portal:Automobiles')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-indigo-500/10 text-neutral-300 hover:text-indigo-400 transition-colors"
                    >
                      • Wikipedia Automobile History
                    </button>
                    <button 
                      onClick={() => onNavigate('https://www.roadandtrack.com')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-indigo-500/10 text-neutral-300 hover:text-indigo-400 transition-colors"
                    >
                      • Road & Track Scenic Routes
                    </button>
                    <button 
                      onClick={() => onNavigate('https://radio.garden')} 
                      className="w-full text-left py-1 px-2 rounded-lg text-xs font-medium hover:bg-indigo-500/10 text-neutral-300 hover:text-indigo-400 transition-colors"
                    >
                      • Radio Garden Live Global Audio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isSafetyLockoutActive ? (
          /* 2. Driving Safety Lockout Overlay */
          <div className="flex-1 flex items-center justify-center p-6 bg-neutral-950/95 backdrop-blur-lg text-white animate-fade-in">
            <div className="max-w-md text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vehicle In Motion: Safety Lockout
                </span>
                <h3 className="text-xl font-bold mt-2">Browsing Locked While Driving</h3>
                <p className="text-xs text-neutral-400 mt-1.5">
                  For your safety, standard visual webpage rendering is paused while driving ({vehicleState.speed} km/h). Use voice audio reading or distraction-free glanceable text.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="lockout-read-aloud-btn"
                  onClick={handleStartTextToSpeech}
                  className="flex-1 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Read Article Aloud</span>
                </button>
                <button
                  id="lockout-reader-mode-btn"
                  onClick={() => setIsReadingMode(true)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold border border-neutral-700 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Glanceable Text</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 italic">
                Tip: Park the vehicle (Shift to P) to unlock full web interaction.
              </p>
            </div>
          </div>
        ) : isReadingMode ? (
          /* 3. Automotive Distraction-Free Reader Mode */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-3xl mx-auto w-full">
            <div className="space-y-6">
              {/* Article Header */}
              <div className="border-b pb-4 border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                  <span>{currentArticle.category}</span>
                  <span>•</span>
                  <span>{currentArticle.readTime}</span>
                  <span>•</span>
                  <span>{currentArticle.date}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {currentArticle.title}
                </h1>
                <div className="flex items-center justify-between mt-3 text-xs text-neutral-400">
                  <span>By {currentArticle.author || currentArticle.siteName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartTextToSpeech}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'Pause Reading' : 'Listen with TTS'}</span>
                    </button>
                    <button
                      onClick={() => setIsReadingMode(false)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    >
                      Web View
                    </button>
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div className={`space-y-4 ${getFontSizeClass()} text-neutral-200 font-serif`}>
                {currentArticle.paragraphs.map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 4. Live Embedded Web Rendering / Safe Automotive Web Iframe */
          <div className="flex-1 w-full h-full relative bg-white">
            {iframeError ? (
              <div className="flex-1 h-full flex items-center justify-center p-6 bg-neutral-900 text-white text-center">
                <div className="max-w-md space-y-3">
                  <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold">External Web Embedding Guard</h3>
                  <p className="text-xs text-neutral-400">
                    This website ({activeTab.url}) restricts direct in-frame loading. Would you like to view it in Automotive Reader Mode or open externally?
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => setIsReadingMode(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                    >
                      Switch to Car Reader Mode
                    </button>
                    <a
                      href={activeTab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-1"
                    >
                      Open in New Tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                id="browser-active-iframe"
                src={activeTab.url}
                title={activeTab.title}
                onError={() => setIframeError(true)}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                className="w-full h-full border-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
