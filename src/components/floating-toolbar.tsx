import { Type, Image, Video, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onAddImage: () => void;
  onAddVideo: () => void;
  fonts: Array<{ name: string; value: string }>;
}

export function FloatingToolbar({ selectedFont, setSelectedFont, fontSize, setFontSize, onAddImage, onAddVideo, fonts }: Props) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 flex items-center gap-4">
        {/* Font Selection */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Type className="w-4 h-4 text-gray-600" />
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="bg-transparent outline-none cursor-pointer"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Font Size */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center">{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Media Buttons */}
        <button
          onClick={onAddImage}
          className="p-3 hover:bg-amber-50 rounded-lg transition-colors group"
          title="Add Image"
        >
          <Image className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
        </button>

        <button
          onClick={onAddVideo}
          className="p-3 hover:bg-amber-50 rounded-lg transition-colors group"
          title="Add YouTube Video"
        >
          <Video className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
        </button>
      </div>
    </motion.div>
  );
}
