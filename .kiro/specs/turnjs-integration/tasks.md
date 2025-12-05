# Implementation Plan

- [x] 1. Install and configure Turn.js dependencies
  - Install jQuery and its TypeScript types
  - Download and integrate Turn.js library files
  - Create TypeScript declaration file for Turn.js
  - Add Turn.js script loading to index.html
  - _Requirements: 9.1, 12.1_

- [x] 2. Create TurnJsPreview component structure
  - Create new file `src/components/turnjs-preview.tsx`
  - Define component props interface matching existing PreviewMode
  - Set up component state for Turn.js instance, current page, and zoom
  - Create ref for Turn.js container element
  - Add background container with preview background styling
  - _Requirements: 6.1, 7.1, 9.2_

- [x] 3. Implement Turn.js initialization and lifecycle
- [x] 3.1 Create Turn.js initialization function
  - Calculate book dimensions based on viewport
  - Configure Turn.js options (width, height, display mode, acceleration, gradients)
  - Initialize Turn.js on component mount using useEffect
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 3.2 Write property test for Turn.js initialization
  - **Property 17: Component lifecycle manages Turn.js correctly**
  - **Validates: Requirements 9.2, 9.3**

- [x] 3.3 Implement cleanup function
  - Destroy Turn.js instance on component unmount
  - Remove event listeners
  - Clear state references
  - _Requirements: 9.3_

- [x] 3.4 Add reactive updates for data changes
  - Watch for changes to pages, coverCustomization, pageCustomization props
  - Trigger Turn.js refresh when data changes
  - _Requirements: 9.4_

- [ ]* 3.5 Write property test for reactive updates
  - **Property 18: Data changes trigger reactive updates**
  - **Validates: Requirements 9.4**

- [x] 4. Implement page rendering engine
- [x] 4.1 Create renderPage function with page index mapping
  - Map Turn.js page indices to journal structure (cover, inside covers, content, back)
  - Handle 1-based indexing from Turn.js
  - _Requirements: 6.1, 6.2_

- [x] 4.2 Implement front cover rendering
  - Apply cover color and texture patterns
  - Position and style title text
  - Render stickers with positions and rotations
  - Add decorative border
  - Mark as hard page for Turn.js
  - _Requirements: 5.1, 6.1_

- [x] 4.3 Implement back cover rendering
  - Match front cover styling without title
  - Add subtle branding text
  - Mark as hard page for Turn.js
  - _Requirements: 5.2, 6.1_

- [x] 4.4 Implement inside cover rendering
  - Apply subtle background pattern
  - Add "Ex Libris" text for inside front cover
  - _Requirements: 5.5, 6.1_

- [x] 4.5 Implement content page rendering
  - Apply page color from customization
  - Render material patterns (lined, dotted, grid, blank)
  - Display text content with custom font
  - Position and render images
  - Position and render video embeds
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [ ]* 4.6 Write property test for cover customization rendering
  - **Property 10: Cover customization renders correctly**
  - **Validates: Requirements 6.1**

- [ ]* 4.7 Write property test for page customization rendering
  - **Property 11: Page customization renders correctly**
  - **Validates: Requirements 6.2**

- [ ]* 4.8 Write property test for text content rendering
  - **Property 12: Text content renders with correct formatting**
  - **Validates: Requirements 6.3**

- [ ]* 4.9 Write property test for media positioning
  - **Property 13: Media elements render at correct positions**
  - **Validates: Requirements 6.4, 6.5**

- [x] 5. Implement navigation controls
- [x] 5.1 Create navigation button components
  - Add previous button with ChevronLeft icon
  - Add next button with ChevronRight icon
  - Position buttons on either side of the book
  - Style with hover effects
  - _Requirements: 10.1, 10.4_

- [x] 5.2 Implement navigation button click handlers
  - Create goToNextPage function that calls Turn.js next()
  - Create goToPreviousPage function that calls Turn.js previous()
  - Connect handlers to button onClick events
  - _Requirements: 1.1, 1.2, 10.5_

- [x] 5.3 Implement navigation button state management
  - Disable previous button when on first page
  - Disable next button when on last page
  - Update button states on page turn events
  - _Requirements: 10.2, 10.3_

- [ ]* 5.4 Write property test for navigation controls
  - **Property 1: Navigation controls change pages**
  - **Validates: Requirements 1.1, 1.2, 10.5**

- [ ]* 5.5 Write property test for navigation button states
  - **Property 19: Navigation controls update based on position**
  - **Validates: Requirements 10.2, 10.3**

- [x] 6. Implement keyboard navigation
- [x] 6.1 Create keyboard event handler
  - Listen for ArrowLeft and ArrowRight key presses
  - Call goToPreviousPage on ArrowLeft
  - Call goToNextPage on ArrowRight
  - Respect page boundaries
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6.2 Attach keyboard listener on mount
  - Add event listener in useEffect
  - Remove event listener on cleanup
  - _Requirements: 3.1, 3.2_

- [ ]* 6.3 Write property test for keyboard navigation
  - **Property 7: Keyboard navigation changes pages**
  - **Validates: Requirements 3.1, 3.2**

- [x] 7. Implement zoom functionality
- [x] 7.1 Create zoom state management
  - Add isZoomed state variable
  - Add zoomTarget state for coordinates
  - _Requirements: 4.1, 4.3_

- [x] 7.2 Implement double-click zoom handler
  - Detect double-click events on pages
  - Calculate click coordinates relative to page
  - Toggle zoom state
  - Call Turn.js zoom method with coordinates
  - _Requirements: 4.1, 4.3_

- [x] 7.3 Implement zoom in/out functions
  - Create zoomIn function that enables Turn.js zoom
  - Create zoomOut function that disables Turn.js zoom
  - Animate zoom transitions smoothly
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 7.4 Disable navigation when zoomed
  - Check isZoomed state in navigation functions
  - Prevent page turns when zoom is active
  - Disable navigation buttons when zoomed
  - _Requirements: 4.4_

- [ ]* 7.5 Write property test for zoom toggle
  - **Property 8: Double-click toggles zoom state**
  - **Validates: Requirements 4.1, 4.3**

- [ ]* 7.6 Write property test for zoom disabling navigation
  - **Property 9: Zoom disables page navigation**
  - **Validates: Requirements 4.4**

- [x] 8. Implement touch gesture support
- [x] 8.1 Configure Turn.js touch event handlers
  - Enable Turn.js built-in touch support
  - Configure swipe sensitivity
  - Set up drag threshold for page turns
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 8.2 Test touch gestures on mobile devices
  - Verify swipe left advances pages
  - Verify swipe right goes back
  - Verify drag-and-release behavior
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [ ]* 8.3 Write property test for swipe navigation
  - **Property 4: Swipe gestures navigate pages**
  - **Validates: Requirements 2.1, 2.2**

- [ ]* 8.4 Write property test for drag-release past halfway
  - **Property 5: Drag-release past halfway completes turn**
  - **Validates: Requirements 2.4**

- [ ]* 8.5 Write property test for drag-release before halfway
  - **Property 6: Drag-release before halfway cancels turn**
  - **Validates: Requirements 2.5**

- [-] 9. Implement position indicator
- [x] 9.1 Create position indicator component
  - Display current spread number
  - Display total number of spreads
  - Show descriptive labels for special pages (covers)
  - Style with background and shadow
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9.2 Implement position calculation logic
  - Calculate spread number from current page index
  - Determine if current page is a cover
  - Generate appropriate label text
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9.3 Update position indicator on page turns
  - Listen to Turn.js turned event
  - Update position display when page changes
  - _Requirements: 8.1, 8.2, 8.5_

- [ ]* 9.4 Write property test for position indicator
  - **Property 16: Position indicator displays correct information**
  - **Validates: Requirements 8.1, 8.2, 8.5**

- [ ] 10. Implement responsive behavior
- [ ] 10.1 Create resize handler
  - Calculate new dimensions based on viewport
  - Update Turn.js size using size() method
  - Maintain aspect ratio
  - Debounce resize events (300ms)
  - _Requirements: 7.4, 11.1, 11.5_

- [ ] 10.2 Attach resize listener
  - Add window resize event listener in useEffect
  - Remove listener on cleanup
  - _Requirements: 11.1_

- [ ] 10.3 Ensure controls remain accessible on small screens
  - Use responsive CSS for button sizing
  - Maintain minimum touch target sizes (44x44px)
  - Test on various viewport sizes
  - _Requirements: 11.4_

- [ ]* 10.4 Write property test for viewport resize
  - **Property 15: Viewport resize maintains aspect ratio**
  - **Validates: Requirements 7.4, 11.5**

- [ ]* 10.5 Write property test for control accessibility
  - **Property 20: Responsive layout maintains accessibility**
  - **Validates: Requirements 11.4**

- [ ] 11. Implement error handling
- [ ] 11.1 Add Turn.js initialization error handling
  - Wrap initialization in try-catch
  - Display fallback message on error
  - Log error details to console
  - _Requirements: 9.2_

- [ ] 11.2 Add page rendering error handling
  - Wrap renderPage in try-catch
  - Render placeholder page on error
  - Log error with page index
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 11.3 Add media loading error handlers
  - Add onError to img elements
  - Add onError to iframe elements
  - Display broken image placeholder
  - _Requirements: 6.4, 6.5_

- [ ] 11.4 Add zoom coordinate validation
  - Validate zoom coordinates are within bounds
  - Clamp invalid coordinates to page bounds
  - Fall back to center zoom if validation fails
  - _Requirements: 4.1_

- [ ] 12. Implement Turn.js event handlers
- [ ] 12.1 Add turning event handler
  - Listen to Turn.js turning event
  - Update component state with new page
  - Disable navigation during animation
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 12.2 Add turned event handler
  - Listen to Turn.js turned event
  - Re-enable navigation after animation
  - Update position indicator
  - _Requirements: 1.4_

- [ ] 12.3 Add start and end event handlers
  - Track drag start position
  - Determine if drag completes or cancels
  - _Requirements: 2.3, 2.4, 2.5_

- [ ]* 12.4 Write property test for page turn completion
  - **Property 2: Page turn completes at correct position**
  - **Validates: Requirements 1.4**

- [ ]* 12.5 Write property test for rapid navigation
  - **Property 3: Rapid navigation reaches correct final position**
  - **Validates: Requirements 1.5**

- [x] 13. Replace PreviewMode with TurnJsPreview in App.tsx
- [x] 13.1 Update import statement
  - Import TurnJsPreview instead of PreviewMode
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13.2 Replace component usage
  - Use TurnJsPreview in preview mode
  - Pass same props (pages, coverCustomization, pageCustomization)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13.3 Test integration
  - Verify preview mode loads correctly
  - Verify all customizations display
  - Verify navigation works
  - _Requirements: 1.1, 1.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 14. Add preview background support
- [ ] 14.1 Apply preview background to container
  - Use coverCustomization.previewBackground
  - Apply as background-image style
  - Ensure book is centered over background
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]* 14.2 Write property test for preview background
  - **Property 14: Preview background applies correctly**
  - **Validates: Requirements 7.1, 7.2**

- [ ] 15. Optimize performance
- [ ] 15.1 Add will-change CSS property to pages
  - Apply will-change: transform to page elements
  - Improve animation performance
  - _Requirements: 1.3, 12.2_

- [ ] 15.2 Implement lazy loading for images
  - Add loading="lazy" to img elements
  - Only load images on visible pages
  - _Requirements: 6.4_

- [ ] 15.3 Memoize page components
  - Use React.memo for page rendering
  - Prevent unnecessary re-renders
  - _Requirements: 9.4_

- [ ] 16. Add accessibility features
- [ ] 16.1 Add ARIA labels to navigation buttons
  - Add aria-label="Previous page" to previous button
  - Add aria-label="Next page" to next button
  - Add aria-disabled when buttons are disabled
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 16.2 Ensure keyboard navigation is fully functional
  - Test tab navigation to buttons
  - Test Enter/Space to activate buttons
  - Test arrow keys for page navigation
  - _Requirements: 3.1, 3.2_

- [ ] 16.3 Add alt text to all images
  - Use descriptive alt text for cover stickers
  - Use "Journal media" for user-uploaded images
  - _Requirements: 6.4_

- [ ] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Clean up old PreviewMode component
- [ ] 18.1 Remove or archive PreviewMode.tsx
  - Delete src/components/preview-mode.tsx or move to archive
  - Remove any unused Motion imports from package.json if no longer needed
  - _Requirements: N/A (cleanup)_

- [ ] 18.2 Update documentation
  - Update README if it references the old preview implementation
  - Document Turn.js integration and usage
  - _Requirements: N/A (documentation)_

- [ ] 19. Final testing and polish
- [ ] 19.1 Test complete user flow
  - Create a journal with multiple pages
  - Add customizations (cover, pages, content)
  - Navigate through entire journal
  - Test zoom functionality
  - Test on mobile device
  - _Requirements: All_

- [ ] 19.2 Cross-browser testing
  - Test in Chrome, Firefox, Safari, Edge
  - Verify animations work smoothly
  - Verify touch gestures work on mobile browsers
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [ ] 19.3 Performance testing
  - Test with large journals (50+ pages)
  - Verify smooth animations on low-end devices
  - Check memory usage
  - _Requirements: 12.2_

- [ ] 20. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
