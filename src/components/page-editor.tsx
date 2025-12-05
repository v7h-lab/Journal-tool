import { useState, useRef } from 'react';
import { FloatingToolbar } from './floating-toolbar';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { JournalPage, PageCustomization } from '../App';

interface Props {
  pages: JournalPage[];
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
  updatePage: (pageId: string, updates: Partial<JournalPage>) => void;
  addPage: () => void;
  pageCustomization: PageCustomization;
}

const HANDWRITTEN_FONTS = [
  { name: 'Caveat', value: '"Caveat", cursive' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Indie Flower', value: '"Indie Flower", cursive' },
  { name: 'Kalam', value: '"Kalam", cursive' },
  { name: 'Permanent Marker', value: '"Permanent Marker", cursive' }
];

export function PageEditor({ pages, currentPageIndex, setCurrentPageIndex, updatePage, addPage, pageCustomization }: Props) {
  const [selectedFont, setSelectedFont] = useState(HANDWRITTEN_FONTS[0].value);
  const [fontSize, setFontSize] = useState(18);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentPage = pages[currentPageIndex];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePage(currentPage.id, { content: e.target.value });
  };

  const addImage = () => {
    if (imageUrl) {
      const newImage = {
        id: Date.now().toString(),
        url: imageUrl,
        x: 50,
        y: 30,
        width: 200,
        height: 200
      };
      updatePage(currentPage.id, {
        images: [...currentPage.images, newImage]
      });
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const addVideo = () => {
    if (videoUrl) {
      // Extract YouTube video ID
      let embedUrl = videoUrl;
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.includes('youtube.com') 
          ? new URLSearchParams(new URL(videoUrl).search).get('v')
          : videoUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      const newVideo = {
        id: Date.now().toString(),
        url: embedUrl,
        x: 50,
        y: 30,
        width: 320,
        height: 180
      };
      updatePage(currentPage.id, {
        videos: [...currentPage.videos, newVideo]
      });
      setVideoUrl('');
      setShowVideoInput(false);
    }
  };

  const removeImage = (imageId: string) => {
    updatePage(currentPage.id, {
      images: currentPage.images.filter(img => img.id !== imageId)
    });
  };

  const removeVideo = (videoId: string) => {
    updatePage(currentPage.id, {
      videos: currentPage.videos.filter(vid => vid.id !== videoId)
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-32">
      {/* Page Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
          disabled={currentPageIndex === 0}
          className="p-2 rounded-lg bg-white shadow-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="px-4 py-2 bg-white rounded-lg shadow-md">
          Page {currentPageIndex + 1} of {pages.length}
        </span>
        
        <button
          onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
          disabled={currentPageIndex === pages.length - 1}
          className="p-2 rounded-lg bg-white shadow-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={addPage}
          className="px-4 py-2 rounded-lg bg-amber-600 text-white shadow-md hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Page
        </button>
      </div>

      {/* Page Canvas */}
      <div className="relative w-full max-w-4xl">
        <div
          className="relative w-full aspect-[8.5/11] rounded-lg shadow-2xl overflow-hidden"
          style={{ backgroundColor: pageCustomization.color }}
        >
          {/* Page Material Background */}
          {pageCustomization.material === 'lined' && (
            <div className="absolute inset-0 flex flex-col justify-around px-12 py-16 pointer-events-none">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="h-px bg-blue-300/40" />
              ))}
            </div>
          )}
          {pageCustomization.material === 'dotted' && (
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} 
            />
          )}
          {pageCustomization.material === 'grid' && (
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} 
            />
          )}

          {/* Text Content */}
          <textarea
            ref={textareaRef}
            value={currentPage.content}
            onChange={handleContentChange}
            placeholder="Start writing your thoughts..."
            className="absolute inset-0 w-full h-full p-12 bg-transparent resize-none outline-none"
            style={{
              fontFamily: selectedFont,
              fontSize: `${fontSize}px`,
              lineHeight: '1.8',
              color: '#1a1a1a'
            }}
          />

          {/* Images */}
          {currentPage.images.map((image) => (
            <div
              key={image.id}
              className="absolute group cursor-move"
              style={{
                left: `${image.x}%`,
                top: `${image.y}%`,
                width: `${image.width}px`,
                height: `${image.height}px`
              }}
            >
              <img
                src={image.url}
                alt="Journal media"
                className="w-full h-full object-cover rounded shadow-lg"
              />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}

          {/* Videos */}
          {currentPage.videos.map((video) => (
            <div
              key={video.id}
              className="absolute group cursor-move"
              style={{
                left: `${video.x}%`,
                top: `${video.y}%`,
                width: `${video.width}px`,
                height: `${video.height}px`
              }}
            >
              <iframe
                src={video.url}
                className="w-full h-full rounded shadow-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => removeVideo(video.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Input Modal */}
      {showImageInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageInput(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4">Add Image</h3>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 outline-none focus:border-amber-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={addImage}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Add Image
              </button>
              <button
                onClick={() => setShowImageInput(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Input Modal */}
      {showVideoInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVideoInput(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4">Add YouTube Video</h3>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 outline-none focus:border-amber-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={addVideo}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Add Video
              </button>
              <button
                onClick={() => setShowVideoInput(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      <FloatingToolbar
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onAddImage={() => setShowImageInput(true)}
        onAddVideo={() => setShowVideoInput(true)}
        fonts={HANDWRITTEN_FONTS}
      />

      {/* Load Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Kalam:wght@300;400;700&family=Permanent+Marker&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
