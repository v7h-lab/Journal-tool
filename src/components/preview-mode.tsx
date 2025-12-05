import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { JournalPage, CoverCustomization, PageCustomization } from '../App';
import { PREVIEW_BACKGROUNDS } from './journal-cover';

interface Props {
  pages: JournalPage[];
  coverCustomization: CoverCustomization;
  pageCustomization: PageCustomization;
}

export function PreviewMode({ pages, coverCustomization, pageCustomization }: Props) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [direction, setDirection] = useState(0);

  // Page Indexing Logic:
  // Page 0: Front Cover
  // Page 1: Inside Front Cover (Blank/Styled)
  // Page 2..N+1: Content Pages
  // Page N+2: Inside Back Cover (Right side of last spread)
  // Page N+3: Back Cover (Left side of closing spread)
  
  // Determine total displayable pages.
  // We need to end with: [Left Content/Blank] | [Inside Back]
  // Followed by: [Back Cover] | [Empty]
  // "Inside Back" must be an EVEN index (Right page).
  // "Back Cover" must be an ODD index (Left page).
  
  const baseCount = pages.length + 2; // Cover(1) + Inside(1) + Content(N)
  
  // If baseCount is Odd (last index is Even/Right), we need a filler before IB? 
  // No, if last content index is Right, next is Left. We want IB on Right.
  // So we need a filler on Left.
  // If baseCount is Even (last index is Odd/Left), next is Right. IB can go there.
  
  const totalDisplayablePages = (baseCount % 2 === 0) 
    ? baseCount + 2 // Add IB + BC
    : baseCount + 3; // Add Filler + IB + BC
    
  const insideBackCoverIndex = totalDisplayablePages - 2;
  const backCoverIndex = totalDisplayablePages - 1;

  // Max spread calculation:
  // Formula: Math.ceil((totalDisplayablePages - 1) / 2)
  const maxSpread = Math.ceil((totalDisplayablePages - 1) / 2);

  const goToNextSpread = () => {
    if (currentSpread < maxSpread) {
      setDirection(1);
      setCurrentSpread(currentSpread + 1);
    }
  };

  const goToPreviousSpread = () => {
    if (currentSpread > 0) {
      setDirection(-1);
      setCurrentSpread(currentSpread - 1);
    }
  };

  const renderPage = (pageIndex: number) => {
    // PAGE 0: FRONT COVER
    if (pageIndex === 0) {
      return (
        <div
          className="w-full h-full rounded-r-lg shadow-2xl relative"
          style={{
            backgroundColor: coverCustomization.color,
            backgroundImage: coverCustomization.texture === 'leather'
              ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)'
              : coverCustomization.texture === 'fabric'
              ? 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px)'
              : 'none'
          }}
        >
          <div className="absolute inset-8 border-2 border-amber-200/30 rounded" />
          
          {/* Cover Title */}
          <div 
            className="absolute inset-x-0 text-center"
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

          {coverCustomization.stickers.map((sticker) => (
            <div
              key={sticker.id}
              className="absolute select-none"
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                fontSize: `${sticker.size}px`,
                rotate: `${sticker.rotation}deg`
              }}
            >
              {sticker.emoji}
            </div>
          ))}
        </div>
      );
    }
    
    // PAGE: INSIDE FRONT COVER
    if (pageIndex === 1) {
        return (
            <div
                className="w-full h-full shadow-xl relative overflow-hidden"
                style={{ 
                    backgroundColor: '#fdfbf7',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}
            >
                <div className="absolute inset-0 flex items-end justify-center pb-10 opacity-50">
                    <span className="font-serif italic text-gray-400">Ex Libris</span>
                </div>
            </div>
        );
    }

    // PAGE: INSIDE BACK COVER (Matches Inside Front Cover)
    if (pageIndex === insideBackCoverIndex) {
        return (
            <div
                className="w-full h-full shadow-xl relative overflow-hidden"
                style={{ 
                    backgroundColor: '#fdfbf7',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}
            >
                <div className="absolute inset-0 flex items-end justify-center pb-10 opacity-50">
                    {/* Empty or different text for back */}
                </div>
            </div>
        );
    }

    // PAGE: BACK COVER (Matches Front Cover Style but no Title)
    if (pageIndex === backCoverIndex) {
        return (
            <div
              className="w-full h-full rounded-l-lg shadow-2xl relative"
              style={{
                backgroundColor: coverCustomization.color,
                backgroundImage: coverCustomization.texture === 'leather'
                  ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)'
                  : coverCustomization.texture === 'fabric'
                  ? 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px)'
                  : 'none'
              }}
            >
              <div className="absolute inset-8 border-2 border-amber-200/30 rounded" />
              
              {/* Small Logo / Branding */}
              <div className="absolute bottom-12 inset-x-0 text-center opacity-50">
                  <span 
                    className="text-sm tracking-widest uppercase font-semibold"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                      My Digital Journal
                  </span>
              </div>
            </div>
        );
    }

    // CONTENT PAGES (Indices 2+)
    // Map global index 2 to pages[0]
    const contentIndex = pageIndex - 2;
    
    // If index is negative (left of cover) or out of bounds (filler pages), return appropriate view
    if (pageIndex < 0) {
        return <div className="w-full h-full" />; // Transparent
    }
    
    // Render Filler Page (Blank content page style) if within range but not a content page
    // This happens when we need an even number of pages before the Inside Back Cover
    if (contentIndex >= pages.length) {
      // If it's past the Back Cover index, it shouldn't be rendered (handled by spread logic usually)
      if (pageIndex > backCoverIndex) return <div className="w-full h-full" />;

      return (
        <div
          className="w-full h-full shadow-2xl relative"
          style={{ backgroundColor: pageCustomization.color }}
        />
      );
    }

    const page = pages[contentIndex];

    return (
      <div
        className="w-full h-full shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: pageCustomization.color }}
      >
        {/* Page Material Background */}
        {pageCustomization.material === 'lined' && (
          <div className="absolute inset-0 flex flex-col justify-around px-8 py-12 pointer-events-none">
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

        {/* Content */}
        <div className="absolute inset-0 p-8">
          <div
            className="whitespace-pre-wrap"
            style={{
              fontFamily: '"Caveat", cursive',
              fontSize: '18px',
              lineHeight: '1.8'
            }}
          >
            {page.content}
          </div>

          {/* Images */}
          {page.images.map((image) => (
            <div
              key={image.id}
              className="absolute"
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
            </div>
          ))}

          {/* Videos */}
          {page.videos.map((video) => (
            <div
              key={video.id}
              className="absolute"
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate Left and Right Page Indices based on Current Spread
  // Spread 0: Left -1 (Empty), Right 0 (Cover)
  // Spread 1: Left 1 (Inside), Right 2 (Content 1)
  // Spread 2: Left 3 (Content 2), Right 4 (Content 3)
  
  const leftPageIndex = currentSpread === 0 ? -1 : (currentSpread * 2) - 1;
  const rightPageIndex = currentSpread === 0 ? 0 : (currentSpread * 2);

  // Helper to calculate displayed page numbers
  const getPageLabel = () => {
      if (currentSpread === 0) return 'Front Cover';
      
      // If we are at the last spread (Back Cover)
      if (currentSpread === maxSpread) return 'Back Cover';

      // Generic Label Logic
      const leftLabel = getSinglePageLabel(leftPageIndex);
      const rightLabel = getSinglePageLabel(rightPageIndex);
      
      return `${leftLabel} - ${rightLabel}`;
  };

  const getSinglePageLabel = (idx: number) => {
      if (idx === 1) return 'Inside Front Cover';
      if (idx === insideBackCoverIndex) return 'Inside Back Cover';
      if (idx === backCoverIndex) return 'Back Cover'; // Should not happen on single side usually
      
      const contentIdx = idx - 2;
      if (contentIdx < 0) return ''; // Should not happen
      if (contentIdx >= pages.length) return 'End';
      
      return `Page ${contentIdx + 1}`;
  };

  return (
    <div 
        className="flex flex-col items-center gap-8 w-full h-full justify-center py-10 overflow-auto"
        style={{
            backgroundImage: PREVIEW_BACKGROUNDS.find(b => b.id === coverCustomization.previewBackground)?.value,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
    >
      <div className="flex items-center justify-center gap-6 w-full max-w-7xl px-4">
        <button
          onClick={goToPreviousSpread}
          disabled={currentSpread === 0}
          className="p-3 rounded-full bg-white shadow-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

          {/* Book Spread */}
        <div 
          className="relative w-full max-w-5xl"
          style={{ 
            perspective: '2000px',
            aspectRatio: '17/11'
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSpread}
              custom={direction}
              initial={{ rotateY: direction > 0 ? 90 : -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: direction > 0 ? -90 : 90, opacity: 0 }}
              transition={{
                rotateY: { type: 'spring', stiffness: 100, damping: 20 },
                opacity: { duration: 0.3 }
              }}
              className="absolute inset-0 grid grid-cols-2 gap-1"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Left Page */}
              <motion.div
                className="h-full w-full rounded-l-lg overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {renderPage(leftPageIndex)}
              </motion.div>

              {/* Right Page */}
              <motion.div
                className="h-full w-full rounded-r-lg overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {renderPage(rightPageIndex)}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Book Spine Shadow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-r from-black/20 via-black/10 to-black/20 pointer-events-none z-10" />
        </div>

        <button
          onClick={goToNextSpread}
          disabled={currentSpread === maxSpread}
          className="p-3 rounded-full bg-white shadow-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Page Counter */}
      <div className="text-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
        <p className="text-gray-800 font-medium">
          {getPageLabel()}
        </p>
        <p className="text-gray-500 text-sm">
          Spread {currentSpread + 1} of {maxSpread + 1}
        </p>
      </div>

      {/* Load Google Fonts for preview */}
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Kalam:wght@300;400;700&family=Permanent+Marker&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
