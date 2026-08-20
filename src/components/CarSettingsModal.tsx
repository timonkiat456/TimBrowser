import React from 'react';
import { CarBrowserSettings } from '../types';
import { Settings, Shield, Type, SunMoon, Search, Volume2, X, AlertTriangle, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: CarBrowserSettings;
  onUpdateSettings: (settings: Partial<CarBrowserSettings>) => void;
  isNightMode: boolean;
}

export const CarSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isNightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="car-settings-modal"
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
          isNightMode 
            ? 'bg-neutral-900 border-neutral-750 text-white' 
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Android Auto Browser Settings</h3>
              <p className={`text-xs ${isNightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                In-car display, driver safety & audio reading policies
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isNightMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Driver Safety Lockout Setting */}
          <div className={`p-4 rounded-2xl border ${
            isNightMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    Vehicle In Motion (Drive Mode) Restrictions
                  </h4>
                  <p className={`text-xs mt-1 ${isNightMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Automatically restrict complex video/interactive browsing while vehicle is in Drive (D) gear. Forces clean Reader Mode or Text-to-Speech audio reader.
                  </p>
                </div>
              </div>
              <input
                id="toggle-safety-lockout"
                type="checkbox"
                checked={!settings.allowFullBrowsingWhileDriving}
                onChange={(e) => onUpdateSettings({ allowFullBrowsingWhileDriving: !e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Auto Read Aloud on Drive */}
          <div className={`p-4 rounded-2xl border ${
            isNightMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 mt-0.5">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Automatic Webpage Audio Reading (TTS)</h4>
                  <p className={`text-xs mt-1 ${isNightMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Automatically read articles aloud through vehicle speakers when shifting from Park (P) to Drive (D).
                  </p>
                </div>
              </div>
              <input
                id="toggle-auto-read-drive"
                type="checkbox"
                checked={settings.autoReadAloudOnDrive}
                onChange={(e) => onUpdateSettings({ autoReadAloudOnDrive: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Automotive Typography Size */}
          <div className={`p-4 rounded-2xl border ${
            isNightMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <Type className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold">Infotainment UI Font Size</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  id={`font-size-${size}`}
                  type="button"
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    settings.fontSize === size
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : isNightMode
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-white border-neutral-300 text-neutral-700'
                  }`}
                >
                  {size.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Search Engine Selection */}
          <div className={`p-4 rounded-2xl border ${
            isNightMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold">Default Car Search Engine</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['google', 'duckduckgo', 'bing', 'wikipedia'] as const).map((engine) => (
                <button
                  key={engine}
                  id={`search-engine-${engine}`}
                  type="button"
                  onClick={() => onUpdateSettings({ searchEngine: engine })}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    settings.searchEngine === engine
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : isNightMode
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-white border-neutral-300 text-neutral-700'
                  }`}
                >
                  {engine}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast / Night Mode Sync */}
          <div className={`p-4 rounded-2xl border ${
            isNightMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SunMoon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold">Auto Headlight Night Mode Sync</span>
              </div>
              <input
                id="toggle-auto-night"
                type="checkbox"
                checked={settings.autoNightMode}
                onChange={(e) => onUpdateSettings({ autoNightMode: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <p className={`text-xs mt-2 ${isNightMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Switches browser canvas to anti-glare high contrast dark theme when car headlights turn on.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end">
          <button
            id="done-settings-modal-btn"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
