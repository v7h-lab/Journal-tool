import { useState, useRef } from 'react';
import { Sparkles, Plus, Trash2, Type, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { CoverCustomization, PageCustomization } from '../App';

interface Props {
  coverCustomization: CoverCustomization;
  setCoverCustomization: (customization: CoverCustomization) => void;
  pageCustomization: PageCustomization;
  setPageCustomization: (customization: PageCustomization) => void;
}

const STICKER_OPTIONS = [
  '✨', '🌟', '💫', '🌙', '☀️', '🌸', '🌺', '🌻', '🌼', '🌷', 
  '🦋', '🐝', '🐞', '🐌', '🎨', '📝', '✏️', '🖊️', '💭', '💡', 
  '🎭', '🎪', '🎡', '🎢', '🎠', '🎀', '🎁', '🎈', '🎉', '🎊',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑',
  '⚽', '🏀', '🏈', '⚾', '🥎', 'mV', '🏐', '🏉', '🎱', '🔮'
];

const TEXTURES = [
  { id: 'leather', name: 'Leather', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)' },
  { id: 'fabric', name: 'Fabric', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px)' },
  { id: 'smooth', name: 'Smooth', pattern: 'none' }
];

const MATERIALS = [
  { id: 'lined', name: 'Lined' },
  { id: 'dotted', name: 'Dotted' },
  { id: 'grid', name: 'Grid' },
  { id: 'blank', name: 'Blank' }
];

const COVER_COLORS = ['#8B4513', '#654321', '#2C1810', '#DC143C', '#191970', '#2F4F4F', '#8B008B', '#556B2F'];
const PAGE_COLORS = ['#FFF8DC', '#FFFACD', '#F0E68C', '#FAFAD2', '#FFE4B5', '#FFFFFF'];
const TEXT_COLORS = ['#FFD700', '#C0C0C0', '#FFFFFF', '#000000', '#FFB6C1', '#98FB98', '#87CEFA', '#DDA0DD'];

export const PREVIEW_BACKGROUNDS = [
  { 
    id: 'default', 
    name: 'Default', 
    value: 'linear-gradient(to bottom right, #fffbeb, #fff7ed, #fef3c7)',
    thumbnail: null // Will use gradient
  },
  { 
    id: 'meadow', 
    name: 'Meadow', 
    value: 'url("https://plus.unsplash.com/premium_photo-1711217237364-827b31b57e92?q=80&w=1484&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1711217237364-827b31b57e92?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'sky', 
    name: 'Sky', 
    value: 'url("https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2787&auto=format&fit=crop")',
    thumbnail: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'wood', 
    name: 'Wood Desk', 
    value: 'url("https://images.unsplash.com/photo-1437419764061-2473afe69fc2?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    thumbnail: 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?q=80&w=200&auto=format&fit=crop'
  }
];

// Default background (not shown in options)
export const DEFAULT_BACKGROUND = {
  id: 'minimal',
  name: 'Minimal Grey',
  value: 'linear-gradient(#f3f4f6, #f3f4f6)'
};

export function JournalCover({ coverCustomization, setCoverCustomization, pageCustomization, setPageCustomization }: Props) {
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const addSticker = (emoji: string) => {
    const newSticker = {
      id: Date.now().toString(),
      emoji,
      x: 50,
      y: 50,
      size: 48,
      rotation: 0
    };
    setCoverCustomization({
      ...coverCustomization,
      stickers: [...coverCustomization.stickers, newSticker]
    });
  };

  const updateSticker = (id: string, updates: Partial<typeof coverCustomization.stickers[0]>) => {
    setCoverCustomization({
      ...coverCustomization,
      stickers: coverCustomization.stickers.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    });
  };

  const removeSticker = (id: string) => {
    setCoverCustomization({
      ...coverCustomization,
      stickers: coverCustomization.stickers.filter(s => s.id !== id)
    });
  };

  const updateTitle = (updates: Partial<typeof coverCustomization.title>) => {
    setCoverCustomization({
      ...coverCustomization,
      title: {
        ...coverCustomization.title!, // assume title exists because we set it in initial state
        ...updates
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <h2 className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Cover Preview
          </h2>
          <button
            onClick={() => {
              console.log('=== TEST BUTTON CLICKED ===');
              console.log('Current stickers:', coverCustomization.stickers);
            }}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Console
          </button>
        </div>
        
        <div 
            className="p-10 rounded-xl w-full flex justify-center items-center"
            style={{ 
                backgroundImage: PREVIEW_BACKGROUNDS.find(b => b.id === coverCustomization.previewBackground)?.value || DEFAULT_BACKGROUND.value,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <motion.div
            ref={coverRef}
            className="relative w-full max-w-md aspect-[3/4] rounded-lg shadow-2xl cursor-pointer overflow-hidden"
            style={{
                backgroundColor: coverCustomization.color,
                backgroundImage: TEXTURES.find(t => t.id === coverCustomization.texture)?.pattern
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            >
            {/* Border decoration */}
            <div className="absolute inset-4 border-2 border-amber-200/30 rounded" />
            
            {/* Cover Title */}
            <div 
                className="absolute inset-x-0 text-center pointer-events-none"
                style={{
                top: `${coverCustomization.title?.y ?? 30}%`,
                }}
            >
                <h1
                style={{
                    color: coverCustomization.title?.color ?? '#FFD700',
                    fontSize: `${coverCustomization.title?.size ?? 48}px`,
                    fontFamily: coverCustomization.title?.font === 'serif' ? 'serif' : 'sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
                >
                {coverCustomization.title?.text ?? 'My Journal'}
                </h1>
            </div>

            {/* Stickers */}
            {coverCustomization.stickers.map((sticker) => (
                <motion.div
                key={sticker.id}
                drag
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={coverRef}
                onDragEnd={(event, info) => {
                    // Get the cover container dimensions to calculate percentage
                    const coverElement = coverRef.current;
                    
                    if (coverElement) {
                        const rect = coverElement.getBoundingClientRect();
                        
                        // Use offset - the total distance from start position
                        const offsetXPercent = (info.offset.x / rect.width) * 100;
                        const offsetYPercent = (info.offset.y / rect.height) * 100;
                        
                        // Calculate new position with bounds (keep within 0-100%)
                        const newX = Math.max(0, Math.min(100, sticker.x + offsetXPercent));
                        const newY = Math.max(0, Math.min(100, sticker.y + offsetYPercent));
                        
                        console.log('Drag ended:', {
                            emoji: sticker.emoji,
                            offset: info.offset,
                            offsetPercent: { x: offsetXPercent, y: offsetYPercent },
                            oldPos: { x: sticker.x, y: sticker.y },
                            newPos: { x: newX, y: newY }
                        });
                        
                        updateSticker(sticker.id, {
                            x: newX,
                            y: newY
                        });
                    }
                }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0 }}
                className="absolute cursor-move select-none"
                style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    fontSize: `${sticker.size}px`,
                    rotate: `${sticker.rotation}deg`,
                    touchAction: 'none'
                }}
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                    setSelectedSticker(sticker.id);
                }}
                >
                {sticker.emoji}
                </motion.div>
            ))}
            </motion.div>
        </div>

        {/* Page Preview */}
        <div className="w-full max-w-md">
          <h3>Page Preview</h3>
          <div
            className="w-full aspect-[3/4] rounded shadow-lg mt-4 relative"
            style={{ backgroundColor: pageCustomization.color }}
          >
            {pageCustomization.material === 'lined' && (
              <div className="absolute inset-0 flex flex-col justify-around px-8 py-12">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-px bg-blue-300/40" />
                ))}
              </div>
            )}
            {pageCustomization.material === 'dotted' && (
              <div className="absolute inset-0 p-8" style={{
                backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
            )}
            {pageCustomization.material === 'grid' && (
              <div className="absolute inset-0 p-8" style={{
                backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
            )}
          </div>
        </div>
      </div>

      {/* Customization Controls */}
      <div className="space-y-6">
        {/* Cover Customization */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="mb-4">Cover Customization</h3>
          
          {/* Color Selection */}
          <div className="mb-6">
            <label className="block mb-2">Cover Color</label>
            <div className="flex flex-wrap gap-3">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setCoverCustomization({ ...coverCustomization, color })}
                  className={`w-12 h-12 rounded-lg shadow-md transition-transform hover:scale-110 ${
                    coverCustomization.color === color ? 'ring-4 ring-amber-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Texture Selection */}
          <div className="mb-6">
            <label className="block mb-2">Cover Texture</label>
            <div className="flex gap-3">
              {TEXTURES.map((texture) => (
                <button
                  key={texture.id}
                  onClick={() => setCoverCustomization({ ...coverCustomization, texture: texture.id })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    coverCustomization.texture === texture.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {texture.name}
                </button>
              ))}
            </div>
          </div>


          {/* Preview Background Selection */}
          <div className="mb-6">
             <label className="block mb-2">Preview Background</label>
             <div className="flex flex-wrap gap-3">
                {PREVIEW_BACKGROUNDS.map((bg) => (
                    <button
                        key={bg.id}
                        onClick={() => setCoverCustomization({ ...coverCustomization, previewBackground: bg.id })}
                        className={`w-12 h-12 rounded-full border shadow-sm transition-transform hover:scale-110 overflow-hidden ${
                            coverCustomization.previewBackground === bg.id 
                            ? 'ring-2 ring-offset-1 ring-amber-500' 
                            : 'border-gray-200'
                        }`}
                        title={bg.name}
                    >
                        {bg.thumbnail ? (
                            <img 
                                src={bg.thumbnail} 
                                alt={bg.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div 
                                className="w-full h-full"
                                style={{
                                    backgroundImage: bg.value
                                }}
                            />
                        )}
                    </button>
                ))}
             </div>
          </div>

          {/* Title Customization */}
          <div className="mb-6 border-t border-gray-100 pt-6">
            <h4 className="flex items-center gap-2 font-medium mb-3">
              <Type className="w-4 h-4 text-amber-600" />
              Cover Title
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600">Text</label>
                <input
                  type="text"
                  value={coverCustomization.title?.text || ''}
                  onChange={(e) => updateTitle({ text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Enter title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-600">Size</label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={coverCustomization.title?.size || 48}
                    onChange={(e) => updateTitle({ size: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600">Vertical Position</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={coverCustomization.title?.y || 30}
                    onChange={(e) => updateTitle({ y: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-600">Font Style</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateTitle({ font: 'serif' })}
                    className={`flex-1 py-2 px-3 rounded border ${
                      coverCustomization.title?.font === 'serif' 
                        ? 'bg-amber-50 border-amber-500 text-amber-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } font-serif`}
                  >
                    Serif
                  </button>
                  <button
                    onClick={() => updateTitle({ font: 'sans' })}
                    className={`flex-1 py-2 px-3 rounded border ${
                      coverCustomization.title?.font === 'sans' 
                        ? 'bg-amber-50 border-amber-500 text-amber-900' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } font-sans`}
                  >
                    Sans
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-600">Title Color</label>
                <div className="flex flex-wrap gap-2">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateTitle({ color })}
                      className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 ${
                        coverCustomization.title?.color === color ? 'ring-2 ring-offset-1 ring-amber-500' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticker Selection */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block mb-2">Add Stickers</label>
            <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
              {STICKER_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Sticker Controls */}
            {selectedSticker && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span>Selected Sticker Controls</span>
                  <button
                    onClick={() => {
                      removeSticker(selectedSticker);
                      setSelectedSticker(null);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1">Size</label>
                    <input
                      type="range"
                      min="24"
                      max="150"
                      value={coverCustomization.stickers.find(s => s.id === selectedSticker)?.size || 48}
                      onChange={(e) => updateSticker(selectedSticker, { size: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Rotation</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={coverCustomization.stickers.find(s => s.id === selectedSticker)?.rotation || 0}
                      onChange={(e) => updateSticker(selectedSticker, { rotation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Customization */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="mb-4">Page Customization</h3>
          
          {/* Page Color */}
          <div className="mb-6">
            <label className="block mb-2">Page Color</label>
            <div className="flex flex-wrap gap-3">
              {PAGE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPageCustomization({ ...pageCustomization, color })}
                  className={`w-12 h-12 rounded-lg shadow-md border-2 transition-transform hover:scale-110 ${
                    pageCustomization.color === color ? 'ring-4 ring-amber-500 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Material Selection */}
          <div>
            <label className="block mb-2">Page Material</label>
            <div className="grid grid-cols-2 gap-3">
              {MATERIALS.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setPageCustomization({ ...pageCustomization, material: material.id })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    pageCustomization.material === material.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {material.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
