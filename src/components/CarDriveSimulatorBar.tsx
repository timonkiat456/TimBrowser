import React from 'react';
import { VehicleState, ViewMode } from '../types';
import { 
  Car, 
  Smartphone, 
  Columns, 
  Sun, 
  Moon, 
  Mic, 
  Star, 
  Settings, 
  Gauge, 
  ShieldCheck, 
  ShieldAlert, 
  Wifi, 
  Cast,
  Layers
} from 'lucide-react';

interface Props {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  vehicleState: VehicleState;
  onUpdateVehicleState: (state: Partial<VehicleState>) => void;
  onOpenVoiceAssistant: () => void;
  onOpenBookmarkModal: () => void;
  onOpenSettings: () => void;
}

export const CarDriveSimulatorBar: React.FC<Props> = ({
  viewMode,
  onChangeViewMode,
  vehicleState,
  onUpdateVehicleState,
  onOpenVoiceAssistant,
  onOpenBookmarkModal,
  onOpenSettings,
}) => {
  const GEARS: VehicleState['gear'][] = ['P', 'R', 'N', 'D'];

  const handleGearChange = (gear: VehicleState['gear']) => {
    let speed = vehicleState.speed;
    if (gear === 'P' || gear === 'N') {
      speed = 0;
    } else if (gear === 'D' && speed === 0) {
      speed = 65;
    }
    onUpdateVehicleState({ gear, speed });
  };

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none shrink-0 z-40 text-xs shadow-md">
      {/* Left: App Logo & View Mode Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>AutoBrowser</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Android Auto
              </span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Automotive Web & Bookmarks
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

        {/* View Mode Toggle: Dual View / Car Display / Phone Display */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            id="view-mode-split"
            onClick={() => onChangeViewMode('split')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Side-by-Side Interactive Connected Mode"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dual Connected</span>
          </button>

          <button
            id="view-mode-car"
            onClick={() => onChangeViewMode('car')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'car'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Android Auto Car Infotainment Screen Only"
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Car Screen</span>
          </button>

          <button
            id="view-mode-phone"
            onClick={() => onChangeViewMode('phone')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'phone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Android Phone Browser Only"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Phone</span>
          </button>
        </div>
      </div>

      {/* Center: Vehicle Simulation Telemetry Controls (Gear, Speed Slider, Headlights) */}
      <div className="flex items-center gap-3 bg-neutral-950 px-3 py-1.5 rounded-2xl border border-neutral-800">
        {/* Vehicle Gear Shift */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1">Shifter:</span>
          {GEARS.map((g) => (
            <button
              key={g}
              id={`gear-btn-${g}`}
              onClick={() => handleGearChange(g)}
              className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                vehicleState.gear === g
                  ? g === 'D'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : g === 'P'
                    ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                    : 'bg-blue-600 text-white'
                  : 'bg-neutral-850 text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-neutral-800" />

        {/* Speed Control Slider (Driving Safety Simulation) */}
        <div className="flex items-center gap-2">
          <Gauge className={`w-3.5 h-3.5 ${vehicleState.speed > 0 ? 'text-amber-400' : 'text-neutral-500'}`} />
          <input
            id="vehicle-speed-slider"
            type="range"
            min="0"
            max="130"
            step="5"
            value={vehicleState.speed}
            onChange={(e) => {
              const speed = parseInt(e.target.value, 10);
              onUpdateVehicleState({
                speed,
                gear: speed > 0 ? 'D' : vehicleState.gear === 'D' ? 'P' : vehicleState.gear
              });
            }}
            className="w-16 sm:w-24 accent-blue-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            title="Adjust Vehicle Speed (Triggers Driving Safety Policy)"
          />
          <span className="text-xs font-mono font-bold text-neutral-200 min-w-[52px]">
            {vehicleState.speed} km/h
          </span>
        </div>

        <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

        {/* Day/Night Ambient Light Toggle */}
        <button
          id="toggle-headlights-btn"
          onClick={() => onUpdateVehicleState({ isNightMode: !vehicleState.isNightMode })}
          className={`p-1.5 rounded-lg border transition-colors ${
            vehicleState.isNightMode
              ? 'bg-indigo-950/60 border-indigo-700/50 text-indigo-300'
              : 'bg-amber-950/40 border-amber-700/40 text-amber-300'
          }`}
          title={vehicleState.isNightMode ? 'Headlights On (Night Display Mode)' : 'Daylight Mode'}
        >
          {vehicleState.isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Right: Quick Action Hub (Bookmarks, Voice Mic, Settings) */}
      <div className="flex items-center gap-2">
        <button
          id="toolbar-open-bookmarks-btn"
          onClick={onOpenBookmarkModal}
          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-amber-400 font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all active:scale-95"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="hidden sm:inline">Bookmarks</span>
        </button>

        <button
          id="toolbar-voice-btn"
          onClick={onOpenVoiceAssistant}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voice Search</span>
        </button>

        <button
          id="toolbar-settings-btn"
          onClick={onOpenSettings}
          className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
