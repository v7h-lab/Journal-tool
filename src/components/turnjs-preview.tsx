import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { JournalPage, CoverCustomization, PageCustomization } from '../App';
import { PREVIEW_BACKGROUNDS } from './journal-cover';

interface Props {
  pages: JournalPage[];
  coverCustomization: CoverCustomization;
  pageCustomization: PageCustomization;
}

export function TurnJsPreview({ pages, coverCustomization, pageCustomization }: Props) {
  console.log('=== TURNJS PREVIEW LOADED - VERSION 2.0 ===');
  console.log('TurnJsPreview component rendering with:', { 
    pagesCount: pages.length, 
    coverColor: coverCustomization.color,
    pageColor: pageCustomization.color,
    coverType: coverCustomization.coverType
  });

  // State management for Turn.js instance, current page, and zoom
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomTarget, setZoomTarget] = useState<{ x: number; y: number } | null>(null);
  const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(true);
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  // Ref for Turn.js container element
  const turnContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref to store Turn.js instance (using any type as Turn.js uses jQuery)
  const turnInstanceRef = useRef<any>(null);

  // Log when coverCustomization changes
  useEffect(() => {
    console.log('=== COVER CUSTOMIZATION CHANGED ===');
    console.log('Cover Type:', coverCustomization.coverType);
    console.log('Full coverCustomization:', coverCustomization);
  }, [coverCustomization]);

  // Calculate total displayable pages
  // Page structure: Front Cover, Inside Front Cover, Content Pages, Inside Back Cover, Back Cover
  useEffect(() => {
    const baseCount = pages.length + 2; // Cover + Inside Front Cover + Content
    const total = (baseCount % 2 === 0) ? baseCount + 2 : baseCount + 3;
    setTotalPages(total);
  }, [pages.length]);

  // Initialize Turn.js on component mount and reinitialize when totalPages changes
  useEffect(() => {
    if (!turnContainerRef.current) {
      console.log('Skipping initialization: no container');
      return;
    }

    if (totalPages === 0) {
      console.log('Skipping initialization: totalPages is 0');
      return;
    }

    // Destroy existing instance if it exists (for reinitialization)
    if (turnInstanceRef.current) {
      console.log('Destroying existing Turn.js instance for reinitialization');
      try {
        turnInstanceRef.current.turn('destroy');
        turnInstanceRef.current = null;
      } catch (error) {
        console.error('Error destroying Turn.js:', error);
      }
    }

    console.log('Starting Turn.js initialization with totalPages:', totalPages);

    try {
      // Calculate book dimensions based on viewport
      const container = turnContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      console.log('Container dimensions:', { containerWidth, containerHeight });
      
      // Use aspect ratio of 17:11 for the book (double page spread)
      const bookWidth = Math.min(containerWidth, containerHeight * (17 / 11));
      const bookHeight = bookWidth * (11 / 17);

      console.log('Book dimensions:', { bookWidth, bookHeight });

      // Access jQuery from window object
      const $ = (window as any).$;
      console.log('jQuery available:', !!$);
      console.log('Turn.js available:', $ && typeof $.fn.turn === 'function');
      
      if (!$ || typeof $.fn.turn !== 'function') {
        const errorMsg = `Turn.js library not loaded. jQuery: ${!!$}, Turn.js: ${$ && typeof $.fn.turn}`;
        console.error(errorMsg);
        setInitError(errorMsg);
        return;
      }

      // Create a div for Turn.js to initialize on
      const turnDiv = document.createElement('div');
      turnDiv.id = 'turn-book';
      turnDiv.style.width = `${bookWidth}px`;
      turnDiv.style.height = `${bookHeight}px`;
      turnDiv.style.margin = '0 auto';
      
      // Clear container and add turn div
      container.innerHTML = '';
      container.appendChild(turnDiv);

      // Ensure Google Fonts are loaded (they should already be in index.html)
      // Add a small delay to ensure fonts are loaded before rendering
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Kalam:wght@300;400;700&family=Permanent+Marker&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
      
      // Add pages to the Turn.js container before initialization
      const isHardCover = coverCustomization.coverType === 'hard';
      console.log('=== CREATING PAGE DIVS ===');
      console.log('isHardCover:', isHardCover);
      console.log('coverType:', coverCustomization.coverType);
      
      for (let i = 0; i < totalPages; i++) {
        const pageDiv = document.createElement('div');
        // Add 'hard' class to front and back covers for hard cover effect
        if (isHardCover && (i === 0 || i === totalPages - 1)) {
          pageDiv.className = 'turn-page hard';
          console.log(`Page ${i}: Added 'hard' class (${i === 0 ? 'front' : 'back'} cover)`);
        } else {
          pageDiv.className = 'turn-page';
        }
        pageDiv.setAttribute('data-page-index', i.toString());
        turnDiv.appendChild(pageDiv);
      }

      console.log(`Created ${totalPages} page divs`);
      
      // Verify the classes were applied
      const allPageDivs = turnDiv.querySelectorAll('.turn-page');
      console.log('Page divs with classes:');
      allPageDivs.forEach((div, idx) => {
        console.log(`  Page ${idx}: className="${div.className}"`);
      });

      // Initialize Turn.js with configuration
      const $turnElement = $(turnDiv);
      
      // Check cover type for hard cover settings (already declared above)
      console.log('=== TURN.JS INITIALIZATION ===');
      console.log('Cover type:', { 
        coverType: coverCustomization.coverType, 
        isHardCover,
        gradientsEnabled: !isHardCover,
        duration: isHardCover ? 800 : 600
      });
      
      const turnOptions: any = {
        width: bookWidth,
        height: bookHeight,
        autoCenter: true,
        display: 'double',
        acceleration: true,
        gradients: true, // Always enable gradients - individual pages with .hard class won't bend
        elevation: 50,
        duration: isHardCover ? 800 : 600, // Slower turn for hard covers
        pages: totalPages,
        page: 1,
        // Touch gesture configuration
        // Turn.js has built-in touch support that automatically detects and handles:
        // - Swipe left/right gestures for page navigation
        // - Drag-and-release interactions with page corners
        // - Touch sensitivity and drag thresholds (handled internally by Turn.js)
        // The library uses native touch events and requires no additional configuration
        // for basic touch functionality on mobile devices
        when: {
          turning: (_event: Event, page: number, _view: string[]) => {
            setCurrentPage(page);
          },
          turned: (_event: Event, page: number, _view: string[]) => {
            setCurrentPage(page);
          },
          start: (_event: Event, pageObject: any, corner: string) => {
            // Called when user starts dragging a page corner (touch or mouse)
            // pageObject contains page information, corner indicates which corner was grabbed
            console.log('Page turn started', { page: pageObject, corner });
          },
          end: (_event: Event, pageObject: any, turned: boolean) => {
            // Called when drag ends
            // turned=true: drag passed halfway point and page turn completed
            // turned=false: drag released before halfway, page returned to original position
            console.log('Page turn ended', { page: pageObject, completed: turned });
          }
        }
      };
      
      $turnElement.turn(turnOptions);
      
      // For hard covers, we've already disabled gradients in turnOptions
      // The gradients: false setting makes pages turn without bending
      if (isHardCover) {
        console.log('Hard cover mode enabled - gradients disabled, slower duration set');
      }

      // Store the jQuery-wrapped element as the Turn.js instance
      turnInstanceRef.current = $turnElement;

      // Verify classes after Turn.js initialization
      console.log('=== AFTER TURN.JS INITIALIZATION ===');
      const pagesAfterInit = turnDiv.querySelectorAll('*');
      console.log(`Found ${pagesAfterInit.length} total elements after init`);
      
      // Log the structure
      console.log('Turn.js DOM structure:');
      Array.from(turnDiv.children).forEach((child, idx) => {
        console.log(`  Child ${idx}: tagName=${child.tagName}, className="${child.className}", id="${child.id}"`);
      });
      
      // Add hard class to covers after Turn.js transforms the DOM
      // Use setTimeout to ensure Turn.js has finished its DOM transformations
      if (isHardCover) {
        setTimeout(() => {
          // Turn.js changes .turn-page to .page after initialization
          const turnPages = turnDiv.querySelectorAll('.page');
          console.log(`=== ADDING HARD CLASS (after timeout) ===`);
          console.log(`Found ${turnPages.length} .page elements`);
          console.log('Turn.js container HTML:', turnDiv.innerHTML.substring(0, 500));
          
          // Add hard class to first and last pages
          if (turnPages.length > 0) {
            const firstPage = turnPages[0];
            firstPage.classList.add('hard');
            // Force the class to stick by setting it multiple ways
            firstPage.setAttribute('class', firstPage.className + ' hard');
            console.log(`Added hard class to first page, classes: "${firstPage.className}"`);
            console.log(`First page HTML:`, firstPage.outerHTML.substring(0, 200));
          }
          if (turnPages.length > 1) {
            const lastIdx = turnPages.length - 1;
            const lastPage = turnPages[lastIdx];
            lastPage.classList.add('hard');
            // Force the class to stick by setting it multiple ways
            lastPage.setAttribute('class', lastPage.className + ' hard');
            console.log(`Added hard class to last page, classes: "${lastPage.className}"`);
            console.log(`Last page HTML:`, lastPage.outerHTML.substring(0, 200));
          }
          
          // Verify after a bit more time
          setTimeout(() => {
            const verifyPages = turnDiv.querySelectorAll('.page.hard');
            console.log(`=== VERIFICATION: Found ${verifyPages.length} pages with .hard class ===`);
          }, 500);
        }, 100);
      }

      console.log('Turn.js initialized successfully');
      setInitError(null);
    } catch (error) {
      const errorMsg = `Failed to initialize Turn.js: ${error}`;
      console.error(errorMsg, error);
      setInitError(errorMsg);
    }
  }, [totalPages, coverCustomization.coverType]);

  // Cleanup Turn.js instance on component unmount
  useEffect(() => {
    return () => {
      if (turnInstanceRef.current) {
        try {
          // Check if destroy method exists before calling it
          if (typeof turnInstanceRef.current.turn === 'function') {
            // Try to destroy the instance
            turnInstanceRef.current.turn('destroy');
          }
          // Clear the reference
          turnInstanceRef.current = null;
          console.log('Turn.js instance cleaned up');
        } catch (error) {
          // Silently fail - Turn.js cleanup is not critical
          console.log('Turn.js cleanup skipped (not critical)');
        }
      }
    };
  }, []);

  // Render pages into Turn.js after initialization
  useEffect(() => {
    if (!turnInstanceRef.current || !turnContainerRef.current) {
      console.log('Skipping page rendering: no instance or container');
      return;
    }

    console.log('Rendering pages into Turn.js...');

    try {
      // Find all page divs - Try multiple selectors since Turn.js transforms the DOM
      let pageElements = turnContainerRef.current.querySelectorAll('.page');
      
      // Fallback to .turn-page if .page doesn't exist yet
      if (!pageElements || pageElements.length === 0) {
        pageElements = turnContainerRef.current.querySelectorAll('.turn-page');
      }
      
      if (!pageElements || pageElements.length === 0) {
        console.error('No page elements found!');
        return;
      }

      console.log(`Found ${pageElements.length} page elements (expected ${totalPages})`);

      // Log the actual structure
      console.log('Turn.js container children:');
      Array.from(turnContainerRef.current.children).forEach((child, idx) => {
        console.log(`  Child ${idx}: tag=${child.tagName}, class="${child.className}", children=${child.children.length}`);
      });

      pageElements.forEach((pageElement, index) => {
        // Render page content as HTML
        const pageContent = renderPageAsHTML(index);
        (pageElement as HTMLElement).innerHTML = pageContent;
        console.log(`Rendered page ${index}, content length: ${pageContent.length}`);
      });

      console.log('Pages rendered into Turn.js successfully');
    } catch (error) {
      console.error('Error rendering pages:', error);
    }
  }, [totalPages, pages, coverCustomization, pageCustomization]);

  // Watch for changes to props and trigger Turn.js refresh
  useEffect(() => {
    if (!turnInstanceRef.current) {
      return;
    }

    // No need to refresh - the page rendering effect handles updates
  }, [pages, coverCustomization, pageCustomization]);

  // Update navigation button states based on current page and zoom state
  useEffect(() => {
    // Disable previous button when on first page or when zoomed
    setIsPreviousDisabled(currentPage === 1 || isZoomed);
    
    // Disable next button when on last page or when zoomed
    setIsNextDisabled(currentPage === totalPages || isZoomed);
  }, [currentPage, totalPages, isZoomed]);

  /**
   * Navigate to the next page
   */
  const goToNextPage = useCallback(() => {
    console.log('goToNextPage called', {
      hasInstance: !!turnInstanceRef.current,
      isNextDisabled,
      isZoomed,
      currentPage,
      totalPages
    });

    // Prevent navigation when zoomed
    if (!turnInstanceRef.current || isNextDisabled || isZoomed) {
      console.log('Navigation prevented');
      return;
    }

    try {
      console.log('Calling turn.next()');
      turnInstanceRef.current.turn('next');
    } catch (error) {
      console.error('Error navigating to next page:', error);
    }
  }, [isNextDisabled, isZoomed, currentPage, totalPages]);

  /**
   * Navigate to the previous page
   */
  const goToPreviousPage = useCallback(() => {
    console.log('goToPreviousPage called', {
      hasInstance: !!turnInstanceRef.current,
      isPreviousDisabled,
      isZoomed,
      currentPage,
      totalPages
    });

    // Prevent navigation when zoomed
    if (!turnInstanceRef.current || isPreviousDisabled || isZoomed) {
      console.log('Navigation prevented');
      return;
    }

    try {
      console.log('Calling turn.previous()');
      turnInstanceRef.current.turn('previous');
    } catch (error) {
      console.error('Error navigating to previous page:', error);
    }
  }, [isPreviousDisabled, isZoomed, currentPage, totalPages]);

  /**
   * Handle keyboard navigation
   * Listen for ArrowLeft and ArrowRight key presses
   */
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    // Check if the key pressed is ArrowLeft or ArrowRight
    if (event.key === 'ArrowLeft') {
      // Navigate to previous page, respecting page boundaries
      goToPreviousPage();
    } else if (event.key === 'ArrowRight') {
      // Navigate to next page, respecting page boundaries
      goToNextPage();
    }
  }, [goToPreviousPage, goToNextPage]);

  // Attach keyboard event listener on mount
  useEffect(() => {
    // Add event listener for keyboard navigation
    window.addEventListener('keydown', handleKeyboardNavigation);

    // Cleanup: remove event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation]);

  /**
   * Zoom in to specific coordinates
   * Enable Turn.js zoom with smooth animation
   */
  const zoomIn = useCallback((x: number, y: number) => {
    if (!turnInstanceRef.current) {
      return;
    }

    try {
      if (turnInstanceRef.current.turn('is')) {
        // Convert percentage coordinates to pixel coordinates
        // Turn.js zoom expects coordinates relative to the page
        const zoomLevel = 2; // 2x zoom
        
        // Call Turn.js zoom method
        turnInstanceRef.current.turn('zoom', zoomLevel, { x: x, y: y });
        
        // Update zoom state
        setIsZoomed(true);
        
        console.log(`Zoomed in at (${x}%, ${y}%)`);
      }
    } catch (error) {
      console.error('Error zooming in:', error);
      // If zoom fails, fall back to center zoom
      try {
        turnInstanceRef.current.turn('zoom', 2);
        setIsZoomed(true);
      } catch (fallbackError) {
        console.error('Fallback zoom also failed:', fallbackError);
      }
    }
  }, []);

  /**
   * Zoom out to normal view
   * Disable Turn.js zoom with smooth animation
   */
  const zoomOut = useCallback(() => {
    if (!turnInstanceRef.current) {
      return;
    }

    try {
      if (turnInstanceRef.current.turn('is')) {
        // Call Turn.js zoom method with level 1 (normal view)
        turnInstanceRef.current.turn('zoom', 1);
        
        // Update zoom state
        setIsZoomed(false);
        setZoomTarget(null);
        
        console.log('Zoomed out to normal view');
      }
    } catch (error) {
      console.error('Error zooming out:', error);
      // Force state update even if Turn.js call fails
      setIsZoomed(false);
      setZoomTarget(null);
    }
  }, []);

  /**
   * Handle double-click zoom
   * Detect double-click events on pages, calculate coordinates, and toggle zoom
   */
  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!turnInstanceRef.current) {
      return;
    }

    try {
      // Get the clicked element
      const target = event.target as HTMLElement;
      
      // Find the closest page element
      const pageElement = target.closest('.turn-page') as HTMLElement;
      if (!pageElement) {
        return;
      }

      // Calculate click coordinates relative to the page
      const rect = pageElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      // Clamp coordinates to valid bounds (0-100%)
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      if (isZoomed) {
        // If already zoomed, zoom out
        zoomOut();
      } else {
        // If not zoomed, zoom in at the clicked coordinates
        setZoomTarget({ x: clampedX, y: clampedY });
        zoomIn(clampedX, clampedY);
      }
    } catch (error) {
      console.error('Error handling double-click zoom:', error);
    }
  }, [isZoomed, zoomIn, zoomOut]);

  // Calculate page indices for journal structure
  const insideBackCoverIndex = totalPages - 2;
  const backCoverIndex = totalPages - 1;

  /**
   * Calculate position information for the position indicator
   * Returns spread number, total spreads, and descriptive label
   */
  const calculatePositionInfo = useCallback((): {
    spreadNumber: number;
    totalSpreads: number;
    label: string;
  } => {
    // Front Cover (page 1 in Turn.js 1-based indexing)
    if (currentPage === 1) {
      return {
        spreadNumber: 1,
        totalSpreads: Math.ceil(totalPages / 2),
        label: 'Front Cover'
      };
    }

    // Back Cover (last page)
    if (currentPage === totalPages) {
      return {
        spreadNumber: Math.ceil(totalPages / 2),
        totalSpreads: Math.ceil(totalPages / 2),
        label: 'Back Cover'
      };
    }

    // Calculate spread number (2 pages per spread in double-page mode)
    // Turn.js shows pages in pairs, so spread = ceil(page / 2)
    const spreadNumber = Math.ceil(currentPage / 2);
    const totalSpreads = Math.ceil(totalPages / 2);

    // For content pages, show page numbers for both left and right pages
    // In double-page mode, odd pages are on the right, even pages are on the left
    // When viewing a spread, we see the current page and potentially the next page
    
    // Determine if we're on inside covers
    if (currentPage === 2) {
      return {
        spreadNumber,
        totalSpreads,
        label: 'Inside Front Cover'
      };
    }

    if (currentPage === insideBackCoverIndex + 1) {
      return {
        spreadNumber,
        totalSpreads,
        label: 'Inside Back Cover'
      };
    }

    // For content pages, calculate the actual content page numbers
    // Page indices: 0=Front, 1=Inside Front, 2=Content 0, 3=Content 1, etc.
    const leftPageIndex = currentPage - 1; // Convert to 0-based
    const rightPageIndex = currentPage; // Next page in 0-based would be currentPage

    // Calculate content page numbers (subtract 2 for front cover and inside front cover)
    const leftContentPage = leftPageIndex - 2;
    const rightContentPage = rightPageIndex - 2;

    // Check if these are valid content pages
    const isLeftContent = leftContentPage >= 0 && leftContentPage < pages.length;
    const isRightContent = rightContentPage >= 0 && rightContentPage < pages.length;

    if (isLeftContent && isRightContent) {
      return {
        spreadNumber,
        totalSpreads,
        label: `Pages ${leftContentPage + 1} - ${rightContentPage + 1}`
      };
    } else if (isLeftContent) {
      return {
        spreadNumber,
        totalSpreads,
        label: `Page ${leftContentPage + 1}`
      };
    } else if (isRightContent) {
      return {
        spreadNumber,
        totalSpreads,
        label: `Page ${rightContentPage + 1}`
      };
    }

    // Fallback for any other case
    return {
      spreadNumber,
      totalSpreads,
      label: `Spread ${spreadNumber}`
    };
  }, [currentPage, totalPages, pages.length, insideBackCoverIndex]);

  /**
   * Render a single page as HTML string for Turn.js
   */
  const renderPageAsHTML = (pageIndex: number): string => {
    console.log(`renderPageAsHTML called for pageIndex ${pageIndex}`, {
      totalPages,
      insideBackCoverIndex,
      backCoverIndex,
      pagesLength: pages.length
    });

    try {
      // Front Cover
      if (pageIndex === 0) {
        console.log('Rendering front cover with stickers:', coverCustomization.stickers);
        
        const isHardCover = coverCustomization.coverType === 'hard';
        
        // Generate texture pattern
        let texturePattern = '';
        if (coverCustomization.texture === 'leather') {
          texturePattern = 'background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px);';
        } else if (coverCustomization.texture === 'fabric') {
          texturePattern = 'background-image: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px);';
        }
        
        const coverShadow = isHardCover 
          ? 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.1);' 
          : 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);';
        
        const coverBorder = isHardCover ? 'border: 2px solid rgba(0,0,0,0.1);' : '';
        
        const hardClass = isHardCover ? ' hard' : '';
        return `
          <div class="${hardClass}" style="width: 100%; height: 100%; border-radius: 0 0.5rem 0.5rem 0; position: relative; background-color: ${coverCustomization.color}; ${texturePattern} ${coverShadow} ${coverBorder}">
            <div style="position: absolute; top: 2rem; right: 2rem; bottom: 2rem; left: 2rem; border: 2px solid rgba(251, 191, 36, 0.3); border-radius: 0.25rem;"></div>
            <div style="position: absolute; left: 0; right: 0; text-align: center; pointer-events: none; top: ${coverCustomization.title?.y ?? 30}%;">
              <h1 style="color: ${coverCustomization.title?.color ?? '#FFD700'}; font-size: ${coverCustomization.title?.size ?? 48}px; font-family: ${coverCustomization.title?.font === 'serif' ? 'serif' : 'sans-serif'}; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); margin: 0;">
                ${coverCustomization.title?.text ?? 'My Journal'}
              </h1>
            </div>
            ${coverCustomization.stickers.map(sticker => {
              console.log(`Sticker ${sticker.emoji} at x:${sticker.x}%, y:${sticker.y}%, size:${sticker.size}px, rotation:${sticker.rotation}deg`);
              return `<div style="position: absolute; left: ${sticker.x}%; top: ${sticker.y}%; font-size: ${sticker.size}px; transform: rotate(${sticker.rotation}deg); user-select: none; pointer-events: none;">${sticker.emoji}</div>`;
            }).join('')}
          </div>
        `;
      }

      // Back Cover (check this before inside covers to ensure it renders correctly)
      if (pageIndex === backCoverIndex) {
        console.log(`Rendering BACK COVER for pageIndex ${pageIndex}`);
        
        const isHardCover = coverCustomization.coverType === 'hard';
        
        // Generate texture pattern (same as front cover)
        let texturePattern = '';
        if (coverCustomization.texture === 'leather') {
          texturePattern = 'background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px);';
        } else if (coverCustomization.texture === 'fabric') {
          texturePattern = 'background-image: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px);';
        }
        
        const coverShadow = isHardCover 
          ? 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.1);' 
          : 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);';
        
        const coverBorder = isHardCover ? 'border: 2px solid rgba(0,0,0,0.1);' : '';
        
        const hardClass = isHardCover ? ' hard' : '';
        return `
          <div class="${hardClass}" style="width: 100%; height: 100%; border-radius: 0.5rem 0 0 0.5rem; position: relative; background-color: ${coverCustomization.color}; ${texturePattern} ${coverShadow} ${coverBorder}">
            <div style="position: absolute; top: 2rem; right: 2rem; bottom: 2rem; left: 2rem; border: 2px solid rgba(251, 191, 36, 0.3); border-radius: 0.25rem;"></div>
            <div style="position: absolute; bottom: 3rem; left: 0; right: 0; text-align: center; opacity: 0.5;">
              <span style="font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: rgba(255,255,255,0.4);">My Digital Journal</span>
            </div>
          </div>
        `;
      }

      // Inside Back Cover
      if (pageIndex === insideBackCoverIndex) {
        console.log(`Rendering INSIDE BACK COVER for pageIndex ${pageIndex}`);
        return `
          <div style="width: 100%; height: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; border-radius: 0.5rem; background-color: #fdfbf7;"></div>
        `;
      }

      // Inside Front Cover
      if (pageIndex === 1) {
        return `
          <div style="width: 100%; height: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; border-radius: 0.5rem; background-color: #fdfbf7;">
            <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2.5rem; opacity: 0.5;">
              <span style="font-family: serif; font-style: italic; color: #9ca3af;">Ex Libris</span>
            </div>
          </div>
        `;
      }

      // Content Pages
      const contentIndex = pageIndex - 2;
      console.log(`Checking content page: contentIndex=${contentIndex}, pages.length=${pages.length}`);
      if (contentIndex >= 0 && contentIndex < pages.length) {
        const page = pages[contentIndex];
        console.log(`Rendering CONTENT PAGE ${contentIndex} for pageIndex ${pageIndex}`);
        
        // Get font settings from localStorage
        const savedFont = localStorage.getItem('journal-font') || '"Caveat", cursive';
        const savedFontSize = localStorage.getItem('journal-font-size') || '18';
        
        console.log('=== RENDERING CONTENT PAGE ===');
        console.log('Font settings for preview:', { 
          savedFont, 
          savedFontSize, 
          contentIndex,
          pageContent: page.content.substring(0, 50) + '...'
        });
        console.log('localStorage values:', {
          font: localStorage.getItem('journal-font'),
          fontSize: localStorage.getItem('journal-font-size')
        });
        
        // Escape the content to prevent HTML injection but preserve line breaks
        const escapedContent = (page.content || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        
        // Generate material pattern HTML
        let materialPattern = '';
        if (pageCustomization.material === 'lined') {
          const lines = Array.from({ length: 25 }, (_, i) => 
            `<div style="height: 1px; background-color: rgba(147, 197, 253, 0.4);"></div>`
          ).join('');
          materialPattern = `<div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-around; padding: 3rem 2rem; pointer-events: none;">${lines}</div>`;
        } else if (pageCustomization.material === 'dotted') {
          materialPattern = `<div style="position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px); background-size: 24px 24px;"></div>`;
        } else if (pageCustomization.material === 'grid') {
          materialPattern = `<div style="position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px); background-size: 24px 24px;"></div>`;
        }
        
        // Escape quotes in font family for HTML attribute
        const escapedFont = savedFont.replace(/"/g, '&quot;');
        
        return `
          <div style="width: 100%; height: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); position: relative; overflow: hidden; border-radius: 0.5rem; background-color: ${pageCustomization.color};">
            ${materialPattern}
            <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 3rem;">
              <div style="white-space: pre-wrap; font-family: ${escapedFont}; font-size: ${savedFontSize}px; line-height: 1.8; color: #1a1a1a;">
                ${escapedContent}
              </div>
            </div>
          </div>
        `;
      }

      // Filler page
      return `<div class="w-full h-full shadow-2xl relative rounded-lg" style="background-color: ${pageCustomization.color};"></div>`;
    } catch (error) {
      console.error(`Error rendering page ${pageIndex}:`, error);
      return `<div class="w-full h-full bg-red-50 flex items-center justify-center"><p class="text-red-600">Error rendering page</p></div>`;
    }
  };

  /**
   * Render a single page based on its index in the Turn.js book
   * Turn.js uses 1-based indexing, but we'll handle 0-based internally
   * 
   * Page structure:
   * - Index 0: Front Cover (hard page)
   * - Index 1: Inside Front Cover
   * - Index 2 to N: Content Pages
   * - Index N+1: Inside Back Cover
   * - Index N+2: Back Cover (hard page)
   */
  const renderPage = (pageIndex: number): React.ReactElement => {
    try {
      // Front Cover
      if (pageIndex === 0) {
        return renderFrontCover();
      }

      // Inside Front Cover
      if (pageIndex === 1) {
        return renderInsideCover(true);
      }

      // Inside Back Cover
      if (pageIndex === insideBackCoverIndex) {
        return renderInsideCover(false);
      }

      // Back Cover
      if (pageIndex === backCoverIndex) {
        return renderBackCover();
      }

      // Content Pages (indices 2 through insideBackCoverIndex - 1)
      const contentIndex = pageIndex - 2;
      if (contentIndex >= 0 && contentIndex < pages.length) {
        return renderContentPage(contentIndex);
      }

      // Filler page (blank page to maintain even page count)
      return renderFillerPage();
    } catch (error) {
      console.error(`Error rendering page ${pageIndex}:`, error);
      return renderErrorPage(pageIndex);
    }
  };

  /**
   * Render the front cover with customization
   */
  const renderFrontCover = (): React.ReactElement => {
    const isHardCover = coverCustomization.coverType === 'hard';
    
    return (
      <div
        className={`w-full h-full rounded-r-lg relative${isHardCover ? ' hard' : ''}`}
        style={{
          backgroundColor: coverCustomization.color,
          backgroundImage: coverCustomization.texture === 'leather'
            ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)'
            : coverCustomization.texture === 'fabric'
            ? 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px)'
            : 'none',
          boxShadow: isHardCover 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)' 
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          border: isHardCover ? '2px solid rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {/* Decorative border */}
        <div className="absolute inset-8 border-2 border-amber-200/30 rounded" />
        
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
          <div
            key={sticker.id}
            className="absolute select-none pointer-events-none"
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
  };

  /**
   * Render the back cover (matches front cover styling without title)
   */
  const renderBackCover = (): React.ReactElement => {
    const isHardCover = coverCustomization.coverType === 'hard';
    
    return (
      <div
        className={`w-full h-full rounded-l-lg relative${isHardCover ? ' hard' : ''}`}
        style={{
          backgroundColor: coverCustomization.color,
          backgroundImage: coverCustomization.texture === 'leather'
            ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)'
            : coverCustomization.texture === 'fabric'
            ? 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.1) 1px, rgba(255,255,255,.1) 2px)'
            : 'none',
          boxShadow: isHardCover 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)' 
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          border: isHardCover ? '2px solid rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {/* Decorative border */}
        <div className="absolute inset-8 border-2 border-amber-200/30 rounded" />
        
        {/* Subtle branding text */}
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
  };

  /**
   * Render inside cover (front or back)
   */
  const renderInsideCover = (isFront: boolean): React.ReactElement => {
    return (
      <div
        className="w-full h-full shadow-xl relative overflow-hidden rounded-lg"
        style={{ 
          backgroundColor: '#fdfbf7',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* "Ex Libris" text for inside front cover */}
        {isFront && (
          <div className="absolute inset-0 flex items-end justify-center pb-10 opacity-50">
            <span className="font-serif italic text-gray-400">Ex Libris</span>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render a content page with text, images, and videos
   */
  const renderContentPage = (contentIndex: number): React.ReactElement => {
    const page = pages[contentIndex];
    
    // Get font settings from localStorage
    const savedFont = localStorage.getItem('journal-font') || '"Caveat", cursive';
    const savedFontSize = localStorage.getItem('journal-font-size') || '18';

    return (
      <div
        className="w-full h-full shadow-2xl relative overflow-hidden rounded-lg"
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
        <div className="absolute inset-0 p-12">
          {/* Text content with custom font */}
          <div
            className="whitespace-pre-wrap"
            style={{
              fontFamily: savedFont,
              fontSize: `${savedFontSize}px`,
              lineHeight: '1.8',
              color: '#1a1a1a'
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
                onError={(e) => {
                  // Display placeholder on error
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">Image failed to load</div>';
                  }
                }}
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
                onError={(e) => {
                  // Display placeholder on error
                  const target = e.target as HTMLIFrameElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">Video failed to load</div>';
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render a filler page (blank page with page styling)
   */
  const renderFillerPage = (): React.ReactElement => {
    return (
      <div
        className="w-full h-full shadow-2xl relative rounded-lg"
        style={{ backgroundColor: pageCustomization.color }}
      >
        {/* Apply same material pattern as content pages */}
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
      </div>
    );
  };

  /**
   * Render an error page when page rendering fails
   */
  const renderErrorPage = (pageIndex: number): React.ReactElement => {
    return (
      <div className="w-full h-full bg-red-50 shadow-2xl relative flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 font-medium mb-2">Error rendering page {pageIndex}</p>
          <p className="text-red-400 text-sm">Please check the console for details</p>
        </div>
      </div>
    );
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
      {/* Debug/Error Display */}
      {initError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl">
          <p className="font-bold">Turn.js Initialization Error</p>
          <p className="text-sm">{initError}</p>
          <p className="text-xs mt-2">Check browser console for details</p>
        </div>
      )}
      
      {/* Debug Info */}
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded text-sm">
        <p>Debug: Total Pages = {totalPages}, Current Page = {currentPage}, Has Instance = {turnInstanceRef.current ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="flex items-center justify-center gap-6 w-full max-w-7xl px-4">
        {/* Previous Button */}
        <button
          onClick={goToPreviousPage}
          disabled={isPreviousDisabled}
          className="p-3 rounded-full bg-white shadow-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
          aria-label="Previous page"
          aria-disabled={isPreviousDisabled}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Turn.js Book Container */}
        <div 
          ref={turnContainerRef}
          className="relative w-full max-w-5xl bg-white/10 border-2 border-dashed border-white/30"
          style={{ 
            perspective: '2000px',
            height: '600px',
            width: '100%'
          }}
          onDoubleClick={handleDoubleClick}
        >
          {/* Turn.js will be initialized here */}
          <div className="absolute inset-0">
            {/* Placeholder for Turn.js pages - will be populated dynamically */}
            {!turnInstanceRef.current && !initError && (
              <div className="flex items-center justify-center h-full text-white text-lg">
                Initializing Turn.js...
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNextPage}
          disabled={isNextDisabled}
          className="p-3 rounded-full bg-white shadow-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
          aria-label="Next page"
          aria-disabled={isNextDisabled}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Position Indicator */}
      <div className="text-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
        <div className="flex flex-col gap-1">
          <p className="text-gray-800 font-medium text-lg">
            {calculatePositionInfo().label}
          </p>
          <p className="text-gray-600 text-sm">
            Spread {calculatePositionInfo().spreadNumber} of {calculatePositionInfo().totalSpreads}
          </p>
        </div>
      </div>

      {/* Load Google Fonts for preview */}
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Kalam:wght@300;400;700&family=Permanent+Marker&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
