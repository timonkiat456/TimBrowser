import React, { useState } from 'react';
import { Bookmark } from '../types';
import { 
  Bookmark as BookmarkIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Star, 
  Folder, 
  Search, 
  X, 
  Save, 
  SlidersHorizontal,
  Compass,
  Radio,
  Newspaper,
  Wrench,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  onUpdateBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onSelectBookmark: (url: string) => void;
  currentUrl?: string;
  currentTitle?: string;
  isNightMode?: boolean;
}

const CATEGORIES: Bookmark['category'][] = [
  'Navigation & EV',
  'News & Audio',
  'Travel & Tools',
  'Entertainment',
  'Custom',
];

const PRESET_COLORS = [
  '#10B981', '#3B82F6', '#6366F1', '#EC4899', '#EF4444', '#F97316', '#EAB308', '#84CC16', '#14B8A6'
];

export const BookmarkManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bookmarks,
  onAddBookmark,
  onUpdateBookmark,
  onDeleteBookmark,
  onSelectBookmark,
  currentUrl = '',
  currentTitle = '',
  isNightMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'add' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState(currentTitle || '');
  const [formUrl, setFormUrl] = useState(currentUrl || '');
  const [formCategory, setFormCategory] = useState<Bookmark['category']>('Navigation & EV');
  const [formIsSpeedDial, setFormIsSpeedDial] = useState(true);
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [formNote, setFormNote] = useState('');

  if (!isOpen) return null;

  const handleOpenAddForm = (urlToUse?: string, titleToUse?: string) => {
    setEditingBookmark(null);
    setFormTitle(titleToUse || currentTitle || '');
    setFormUrl(urlToUse || currentUrl || '');
    setFormCategory('Navigation & EV');
    setFormIsSpeedDial(true);
    setFormColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setFormNote('');
    setActiveTab('add');
  };

  const handleStartEdit = (bm: Bookmark) => {
    setEditingBookmark(bm);
    setFormTitle(bm.title);
    setFormUrl(bm.url);
    setFormCategory(bm.category);
    setFormIsSpeedDial(bm.isSpeedDial);
    setFormColor(bm.color || PRESET_COLORS[0]);
    setFormNote(bm.note || '');
    setActiveTab('add');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) return;

    let formattedUrl = formUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const title = formTitle.trim() || new URL(formattedUrl).hostname;

    if (editingBookmark) {
      onUpdateBookmark({
        ...editingBookmark,
        title,
        url: formattedUrl,
        category: formCategory,
        isSpeedDial: formIsSpeedDial,
        color: formColor,
        note: formNote,
      });
    } else {
      onAddBookmark({
        title,
        url: formattedUrl,
        category: formCategory,
        isSpeedDial: formIsSpeedDial,
        color: formColor,
        note: formNote,
        pinned: formIsSpeedDial,
      });
    }

    setActiveTab('all');
    setEditingBookmark(null);
  };

  const filteredBookmarks = bookmarks.filter((bm) => {
    const matchesCategory = selectedCategory === 'all' || bm.category === selectedCategory;
    const matchesSearch =
      bm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bm.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bm.note && bm.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Navigation & EV':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'News & Audio':
        return <Newspaper className="w-4 h-4 text-pink-400" />;
      case 'Travel & Tools':
        return <Wrench className="w-4 h-4 text-indigo-400" />;
      case 'Entertainment':
        return <Radio className="w-4 h-4 text-teal-400" />;
      default:
        return <Folder className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="bookmark-manager-modal"
        className={`relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isNightMode 
            ? 'bg-neutral-900 border-neutral-700 text-neutral-100' 
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isNightMode ? 'border-neutral-800 bg-neutral-950/60' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <BookmarkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Android Auto Bookmark Hub</h2>
              <p className={`text-xs ${isNightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Organize, speed-dial, and sync webpages between phone and car display
              </p>
            </div>
          </div>
          <button
            id="close-bookmark-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isNightMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center justify-between px-6 py-2 border-b text-sm ${
          isNightMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-neutral-100/60'
        }`}>
          <div className="flex items-center gap-2">
            <button
              id="tab-all-bookmarks"
              onClick={() => { setActiveTab('all'); setEditingBookmark(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isNightMode ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Bookmarks ({bookmarks.length})
            </button>
            <button
              id="tab-speed-dial"
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                isNightMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Car Speed-Dial ({bookmarks.filter(b => b.isSpeedDial).length})
            </button>
          </div>

          <button
            id="open-add-bookmark-btn"
            onClick={() => handleOpenAddForm()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Bookmark
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'add' ? (
            <form onSubmit={handleSubmitForm} className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-750">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  {editingBookmark ? 'Edit Bookmark' : 'Add New Webpage to Bookmarks'}
                </h3>
                {currentUrl && !editingBookmark && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormTitle(currentTitle || '');
                      setFormUrl(currentUrl || '');
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Use Current Open Page
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-300">Webpage Title / Name</label>
                <input
                  id="form-bookmark-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. NPR Distraction-Free News"
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    isNightMode 
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-300">URL / Web Address</label>
                <input
                  id="form-bookmark-url"
                  type="text"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    isNightMode 
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Category</label>
                  <select
                    id="form-bookmark-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isNightMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                    }`}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-300">Badge Accent Color</label>
                  <div className="flex items-center gap-2 py-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          formColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-300">Driver Note / Quick Info (Optional)</label>
                <input
                  id="form-bookmark-note"
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="e.g. Best for EV charging stops & road trips"
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isNightMode 
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                  }`}
                />
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isNightMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-100 border-neutral-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-400/20 text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Pin to Android Auto Speed-Dial</div>
                    <div className={`text-xs ${isNightMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Shows up as large 1-tap tile on car infotainment dashboard
                    </div>
                  </div>
                </div>
                <input
                  id="form-speed-dial-toggle"
                  type="checkbox"
                  checked={formIsSpeedDial}
                  onChange={(e) => setFormIsSpeedDial(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('all'); setEditingBookmark(null); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isNightMode ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  id="save-bookmark-submit-btn"
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  {editingBookmark ? 'Update Bookmark' : 'Save Bookmark'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    id="bookmark-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookmarks by name, URL, or note..."
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isNightMode 
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' 
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-neutral-700 text-white font-semibold'
                        : isNightMode ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white font-semibold'
                          : isNightMode ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmark Grid / List */}
              {filteredBookmarks.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <BookmarkIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No bookmarks found</p>
                  <p className="text-xs opacity-75 mt-1">Try adjusting your search query or add a new bookmark.</p>
                  <button
                    onClick={() => handleOpenAddForm()}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add One Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredBookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      id={`bookmark-card-${bm.id}`}
                      className={`group relative p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isNightMode
                          ? 'bg-neutral-800/60 border-neutral-750 hover:bg-neutral-800 hover:border-neutral-650'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: bm.color || '#3B82F6' }}
                            />
                            <h4 className="text-sm font-semibold truncate tracking-tight">
                              {bm.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {bm.isSpeedDial && (
                              <span className="p-1 rounded bg-amber-400/20 text-amber-400" title="Pinned to Android Auto Speed-Dial">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                              </span>
                            )}
                            <button
                              onClick={() => handleStartEdit(bm)}
                              className={`p-1.5 rounded-lg opacity-80 group-hover:opacity-100 transition-colors ${
                                isNightMode ? 'hover:bg-neutral-700 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
                              }`}
                              title="Edit Bookmark"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteBookmark(bm.id)}
                              className={`p-1.5 rounded-lg opacity-80 group-hover:opacity-100 text-rose-400 transition-colors ${
                                isNightMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-100'
                              }`}
                              title="Delete Bookmark"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className={`text-xs truncate font-mono mt-1 ${
                          isNightMode ? 'text-neutral-400' : 'text-neutral-500'
                        }`}>
                          {bm.url}
                        </div>

                        {bm.note && (
                          <p className={`text-xs mt-2 line-clamp-1 italic ${
                            isNightMode ? 'text-neutral-300' : 'text-neutral-600'
                          }`}>
                            "{bm.note}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-700/50">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isNightMode ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {getCategoryIcon(bm.category)}
                          {bm.category}
                        </span>

                        <button
                          id={`launch-bookmark-${bm.id}`}
                          onClick={() => {
                            onSelectBookmark(bm.url);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          <span>Open in Car</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
