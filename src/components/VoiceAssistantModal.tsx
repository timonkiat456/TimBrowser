import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, ArrowRight, Compass, Bookmark as BookmarkIcon, Newspaper, Radio } from 'lucide-react';
import { CarSpeechSynthesizer } from '../utils/speechUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (commandText: string, actionType: 'search' | 'url' | 'read' | 'bookmark' | 'speeddial') => void;
  isNightMode?: boolean;
}

export const VoiceAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  isNightMode = true,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const QUICK_COMMANDS = [
    { label: 'Find EV Charging Stations', cmd: 'search EV charging stations nearby', type: 'search' as const, icon: Compass },
    { label: 'Read NPR Morning News', cmd: 'open https://text.npr.org', type: 'url' as const, icon: Newspaper },
    { label: 'Read Current Webpage Aloud', cmd: 'read article aloud', type: 'read' as const, icon: Volume2 },
    { label: 'Open Wikipedia Automobile Portal', cmd: 'open https://en.wikipedia.org/wiki/Portal:Automobiles', type: 'url' as const, icon: Radio },
    { label: 'Bookmark Current Webpage', cmd: 'bookmark current page', type: 'bookmark' as const, icon: BookmarkIcon },
  ];

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setRecognitionError(null);
      return;
    }

    // Try starting Web Speech Recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setRecognitionError(null);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const resultTranscript = event.results[current][0].transcript;
          setTranscript(resultTranscript);

          if (event.results[current].isFinal) {
            handleProcessVoiceInput(resultTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error !== 'no-speech') {
            setRecognitionError(`Microphone notice: ${event.error}. You can also tap sample voice commands below.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start failed', err);
      }
    } else {
      setRecognitionError('Speech recognition is ready via one-touch voice shortcuts below.');
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isOpen]);

  const handleProcessVoiceInput = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    if (!text) return;

    CarSpeechSynthesizer.speak(`Executing: ${rawText}`);

    if (text.includes('read') || text.includes('speak') || text.includes('listen')) {
      onExecuteCommand(rawText, 'read');
    } else if (text.includes('bookmark') || text.includes('save')) {
      onExecuteCommand(rawText, 'bookmark');
    } else if (text.startsWith('http') || text.includes('.com') || text.includes('.org') || text.includes('.gov')) {
      onExecuteCommand(rawText, 'url');
    } else if (text.startsWith('open ') || text.startsWith('go to ')) {
      const query = rawText.replace(/^(open|go to)\s+/i, '');
      onExecuteCommand(query, 'search');
    } else {
      onExecuteCommand(rawText, 'search');
    }

    setTimeout(() => {
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="voice-assistant-modal"
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 overflow-hidden transition-colors ${
          isNightMode 
            ? 'bg-neutral-900 border-neutral-750 text-white' 
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Android Auto Voice Assistant</h3>
              <p className={`text-xs ${isNightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Hands-free safe in-car browsing & voice actions
              </p>
            </div>
          </div>
          <button
            id="close-voice-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isNightMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Mic Listening Orb */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-pulse" />
              </>
            )}
            <button
              id="voice-mic-trigger"
              onClick={() => {
                if (isListening) {
                  setIsListening(false);
                } else {
                  setIsListening(true);
                  setTranscript('');
                }
              }}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isListening 
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white scale-110 ring-4 ring-blue-400/50' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <MicOff className="w-10 h-10 text-neutral-400" />}
            </button>
          </div>

          <div className="mt-5 max-w-sm">
            <p className="text-sm font-semibold text-blue-400">
              {isListening ? 'Listening for car voice command...' : 'Tap microphone to speak'}
            </p>
            <p className={`text-base font-medium mt-1 min-h-[28px] ${transcript ? 'text-white' : 'text-neutral-500 italic'}`}>
              {transcript ? `"${transcript}"` : 'Say "Search EV Chargers", "Read article", or "Open NPR"'}
            </p>
          </div>

          {recognitionError && (
            <p className="text-xs text-amber-400/90 mt-2 px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              {recognitionError}
            </p>
          )}
        </div>

        {/* Quick Driver Voice Commands */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
            <span>Quick 1-Touch Automotive Commands</span>
            <span className="text-[10px] text-neutral-500">Instant Hands-Free</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {QUICK_COMMANDS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  id={`quick-cmd-btn-${idx}`}
                  onClick={() => handleProcessVoiceInput(item.cmd)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    isNightMode
                      ? 'bg-neutral-800/70 border-neutral-700/80 hover:bg-neutral-750 hover:border-neutral-600 text-neutral-200'
                      : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
