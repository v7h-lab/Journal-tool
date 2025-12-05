# Turn.js Integration Design Document

## Overview

This design document outlines the integration of Turn.js library into the Digital Journal Tool's preview mode. Turn.js will replace the current Motion-based page navigation with a realistic page-turning interface that supports touch gestures, keyboard navigation, zoom functionality, and hardware-accelerated animations. The implementation will maintain all existing journal customization features while providing an enhanced, book-like reading experience.

The integration involves installing Turn.js and its dependencies, creating a new React component that wraps Turn.js functionality, migrating existing page rendering logic, and implementing interactive features like zoom and gesture support.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│  (Main application state and mode management)           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ├─── mode === 'preview'
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              TurnJsPreview.tsx (NEW)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Turn.js Initialization & Configuration          │  │
│  │  - Initialize on mount with useEffect            │  │
│  │  - Configure dimensions, animation, acceleration │  │
│  │  - Set up event listeners                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Page Rendering Engine                           │  │
│  │  - renderPage() function                         │  │
│  │  - Cover pages (front/back)                      │  │
│  │  - Inside covers                                 │  │
│  │  - Content pages with customization             │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Navigation Controls                             │  │
│  │  - Previous/Next buttons                         │  │
│  │  - Keyboard event handlers                       │  │
│  │  - Touch gesture support                         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Zoom Controller                                 │  │
│  │  - Double-click zoom handler                     │  │
│  │  - Zoom state management                         │  │
│  │  - Zoom in/out animations                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
└── TurnJsPreview (replaces PreviewMode)
    ├── Background Container
    ├── Turn.js Book Container
    │   ├── Page 0: Front Cover
    │   ├── Page 1: Inside Front Cover
    │   ├── Page 2-N: Content Pages
    │   ├── Page N+1: Inside Back Cover
    │   └── Page N+2: Back Cover
    ├── Navigation Controls
    │   ├── Previous Button
    │   └── Next Button
    └── Position Indicator
```

## Components and Interfaces

### 1. TurnJsPreview Component

**Purpose:** Main component that wraps Turn.js functionality and manages the interactive book preview.

**Props Interface:**
```typescript
interface TurnJsPreviewProps {
  pages: JournalPage[];
  coverCustomization: CoverCustomization;
  pageCustomization: PageCustomization;
}
```

**State:**
```typescript
interface TurnJsPreviewState {
  currentPage: number;
  totalPages: number;
  isZoomed: boolean;
  zoomTarget: { x: number; y: number } | null;
  turnInstance: any | null; // Turn.js instance
}
```

**Key Methods:**
- `initializeTurn()`: Initialize Turn.js with configuration
- `destroyTurn()`: Clean up Turn.js instance
- `handlePageTurn(event)`: Handle page turn events
- `handleZoom(event)`: Handle double-click zoom
- `goToNextPage()`: Navigate to next page
- `goToPreviousPage()`: Navigate to previous page
- `renderPage(pageIndex)`: Render individual page content

### 2. Page Rendering Functions

**renderCoverPage()**
- Renders front or back cover with customization
- Applies texture patterns (leather, fabric)
- Positions title and stickers
- Adds decorative borders

**renderInsideCover()**
- Renders inside front/back cover
- Applies subtle background pattern
- Displays "Ex Libris" text

**renderContentPage(pageIndex)**
- Renders journal content pages
- Applies page color and material (lined, dotted, grid, blank)
- Positions text content with custom fonts
- Embeds images at specified coordinates
- Embeds videos at specified coordinates

### 3. Navigation Controller

**Purpose:** Manages page navigation through multiple input methods.

**Methods:**
- `setupKeyboardNavigation()`: Attach keyboard event listeners
- `setupTouchGestures()`: Configure touch/swipe handlers (handled by Turn.js)
- `handleNavigationClick(direction)`: Handle button clicks
- `updateNavigationState()`: Enable/disable buttons based on position

### 4. Zoom Controller

**Purpose:** Implements double-click zoom functionality.

**Methods:**
- `handleDoubleClick(event)`: Detect double-click and calculate zoom target
- `zoomIn(x, y)`: Zoom into specific coordinates
- `zoomOut()`: Return to normal view
- `disablePageTurning()`: Prevent navigation while zoomed
- `enablePageTurning()`: Re-enable navigation after zoom out

## Data Models

### Turn.js Configuration Object

```typescript
interface TurnJsConfig {
  width: number;              // Total width of the book (both pages)
  height: number;             // Height of each page
  autoCenter: boolean;        // Center the book in container
  display: 'double' | 'single'; // Display mode
  acceleration: boolean;      // Enable hardware acceleration
  gradients: boolean;         // Enable gradient shadows
  elevation: number;          // Shadow elevation (0-50)
  duration: number;           // Animation duration in ms
  pages: number;              // Total number of pages
  when: {
    turning: (event, page, view) => void;
    turned: (event, page, view) => void;
    start: (event, pageObject, corner) => void;
    end: (event, pageObject, turned) => void;
  };
}
```

### Page Index Mapping

```typescript
interface PageMapping {
  // Turn.js uses 1-based indexing
  0: 'front-cover',
  1: 'inside-front-cover',
  2: 'content-page-0',
  // ... content pages
  N: 'inside-back-cover',
  N+1: 'back-cover'
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Prework Analysis

1.1 WHEN a user clicks the next page control THEN the system SHALL animate the page turn with a realistic 3D flip effect
Thoughts: This is about the visual behavior when clicking next. We can test that clicking the next button results in the current page number increasing by the appropriate amount (1 for single page, 2 for double page spread).
Testable: yes - property

1.2 WHEN a user clicks the previous page control THEN the system SHALL animate the page turn in reverse with a realistic 3D flip effect
Thoughts: Similar to 1.1, we can test that clicking previous decreases the page number appropriately.
Testable: yes - property

1.3 WHEN a page is turning THEN the system SHALL display the page curl effect with appropriate shadows and perspective
Thoughts: This is about visual rendering quality during animation, which is difficult to test programmatically.
Testable: no

1.4 WHEN the page turn animation completes THEN the system SHALL display the next spread in a stable state
Thoughts: We can test that after a page turn completes, the displayed page index matches the expected page index.
Testable: yes - property

1.5 WHEN multiple page turn requests occur rapidly THEN the system SHALL queue the animations and execute them sequentially
Thoughts: This is about handling rapid clicks. We can test that multiple rapid navigation calls result in the correct final page position.
Testable: yes - property

2.1 WHEN a user swipes left on a touch device THEN the system SHALL turn to the next page
Thoughts: This is handled by Turn.js internally, but we can test that simulating a swipe event results in page advancement.
Testable: yes - property

2.2 WHEN a user swipes right on a touch device THEN the system SHALL turn to the previous page
Thoughts: Similar to 2.1, test that swipe right decreases page number.
Testable: yes - property

2.3 WHEN a user drags a page corner on a touch device THEN the system SHALL follow the drag motion with a partial page curl
Thoughts: This is about visual feedback during dragging, which is difficult to test programmatically.
Testable: no

2.4 WHEN a user releases a dragged page past the halfway point THEN the system SHALL complete the page turn animation
Thoughts: We can test that a drag-release past halfway results in page advancement.
Testable: yes - property

2.5 WHEN a user releases a dragged page before the halfway point THEN the system SHALL return the page to its original position
Thoughts: We can test that a drag-release before halfway keeps the same page number.
Testable: yes - property

3.1 WHEN a user presses the right arrow key THEN the system SHALL turn to the next page
Thoughts: This is a rule that should apply to all keyboard events. We can simulate key presses and verify page changes.
Testable: yes - property

3.2 WHEN a user presses the left arrow key THEN the system SHALL turn to the previous page
Thoughts: Similar to 3.1, test that left arrow decreases page number.
Testable: yes - property

3.3 WHEN a user is on the first page and presses the left arrow key THEN the system SHALL remain on the first page
Thoughts: This is a boundary condition. We can test that at page 0, left arrow doesn't change the page.
Testable: edge-case

3.4 WHEN a user is on the last page and presses the right arrow key THEN the system SHALL remain on the last page
Thoughts: This is a boundary condition. We can test that at the last page, right arrow doesn't change the page.
Testable: edge-case

4.1 WHEN a user double-clicks on a page area THEN the system SHALL zoom into that specific region
Thoughts: We can test that double-clicking sets the zoom state to true and records the target coordinates.
Testable: yes - property

4.2 WHEN a page is zoomed THEN the system SHALL display the zoomed content at an enlarged scale with smooth animation
Thoughts: This is about visual rendering quality, which is difficult to test programmatically.
Testable: no

4.3 WHEN a user double-clicks on a zoomed page THEN the system SHALL zoom out to the normal view
Thoughts: This is a round-trip property. Zoom in then zoom out should return to the original state.
Testable: yes - property

4.4 WHEN a page is zoomed THEN the system SHALL disable page turning until the user zooms out
Thoughts: We can test that when isZoomed is true, navigation functions don't change the page number.
Testable: yes - property

4.5 WHEN zooming occurs THEN the system SHALL maintain the aspect ratio and quality of images and text
Thoughts: This is about visual quality, which is difficult to test programmatically.
Testable: no

5.1 WHEN the front cover is displayed THEN the system SHALL render it with hard page styling
Thoughts: We can test that the front cover page has the appropriate CSS class or data attribute for hard pages.
Testable: yes - example

5.2 WHEN the back cover is displayed THEN the system SHALL render it with hard page styling
Thoughts: Similar to 5.1, test that back cover has hard page styling.
Testable: yes - example

5.3 WHEN a content page is displayed THEN the system SHALL render it with standard page styling
Thoughts: We can test that content pages don't have the hard page class.
Testable: yes - property

5.4 WHEN a hard page turns THEN the system SHALL use a stiffer animation curve compared to regular pages
Thoughts: This is about animation timing, which is difficult to test programmatically.
Testable: no

5.5 WHEN the inside covers are displayed THEN the system SHALL render them with standard page styling
Thoughts: Test that inside covers don't have hard page styling.
Testable: yes - example

6.1 WHEN the preview mode loads THEN the system SHALL render the cover with the user's selected color, texture, title, and stickers
Thoughts: We can test that the rendered cover contains elements with the correct styles matching the customization object.
Testable: yes - property

6.2 WHEN content pages are displayed THEN the system SHALL render them with the user's selected page color and material pattern
Thoughts: We can test that content pages have the correct background color and material class.
Testable: yes - property

6.3 WHEN pages contain text content THEN the system SHALL display the text with the correct font and formatting
Thoughts: We can test that text elements have the correct font-family and content.
Testable: yes - property

6.4 WHEN pages contain images THEN the system SHALL display the images at their specified positions and sizes
Thoughts: We can test that image elements have the correct src, position, and dimensions.
Testable: yes - property

6.5 WHEN pages contain videos THEN the system SHALL display the video embeds at their specified positions and sizes
Thoughts: We can test that iframe elements have the correct src, position, and dimensions.
Testable: yes - property

7.1 WHEN the preview mode loads THEN the system SHALL display the background using the user's selected preview background setting
Thoughts: We can test that the container has the correct background style.
Testable: yes - property

7.2 WHEN the preview background is set to a custom image THEN the system SHALL render that image as the backdrop
Thoughts: We can test that when a custom background is set, the container has the correct background-image style.
Testable: yes - property

7.3 WHEN the journal is displayed THEN the system SHALL center it within the preview background
Thoughts: We can test that the Turn.js container has centering styles applied.
Testable: yes - example

7.4 WHEN the viewport is resized THEN the system SHALL maintain the journal's aspect ratio and centering
Thoughts: This is about responsive behavior, which requires testing across different viewport sizes.
Testable: yes - property

8.1 WHEN any page spread is displayed THEN the system SHALL show the current spread number
Thoughts: We can test that the position indicator displays the correct spread number based on current page.
Testable: yes - property

8.2 WHEN any page spread is displayed THEN the system SHALL show the total number of spreads
Thoughts: We can test that the position indicator displays the correct total spread count.
Testable: yes - property

8.3 WHEN the front cover is displayed THEN the system SHALL indicate "Front Cover" in the position display
Thoughts: This is testing a specific case - when on page 0, the label should be "Front Cover".
Testable: yes - example

8.4 WHEN the back cover is displayed THEN the system SHALL indicate "Back Cover" in the position display
Thoughts: This is testing a specific case - when on the last page, the label should be "Back Cover".
Testable: yes - example

8.5 WHEN content pages are displayed THEN the system SHALL show the page numbers for both left and right pages
Thoughts: We can test that for content pages, the position display includes both page numbers.
Testable: yes - property

9.1 WHEN the Turn.js library is installed THEN the system SHALL include TypeScript type definitions
Thoughts: This is about the development environment setup, not runtime behavior.
Testable: no

9.2 WHEN the preview component mounts THEN the system SHALL initialize Turn.js with proper React lifecycle management
Thoughts: We can test that after mounting, the Turn.js instance exists and is configured.
Testable: yes - example

9.3 WHEN the preview component unmounts THEN the system SHALL clean up Turn.js instances and event listeners
Thoughts: We can test that after unmounting, the Turn.js instance is destroyed and listeners are removed.
Testable: yes - example

9.4 WHEN journal data changes THEN the system SHALL update the Turn.js display reactively
Thoughts: We can test that changing props triggers a re-render of the affected pages.
Testable: yes - property

9.5 WHEN Turn.js methods are called THEN the system SHALL use type-safe interfaces
Thoughts: This is about TypeScript compile-time checking, not runtime behavior.
Testable: no

10.1 WHEN navigation controls are displayed THEN the system SHALL show previous and next buttons on either side of the journal
Thoughts: This is testing that the UI contains the expected elements.
Testable: yes - example

10.2 WHEN the user is on the first page THEN the system SHALL disable the previous button
Thoughts: We can test that at page 0, the previous button has the disabled attribute.
Testable: yes - example

10.3 WHEN the user is on the last page THEN the system SHALL disable the next button
Thoughts: We can test that at the last page, the next button has the disabled attribute.
Testable: yes - example

10.4 WHEN the user hovers over navigation controls THEN the system SHALL provide visual feedback
Thoughts: This is about CSS hover states, which is difficult to test programmatically.
Testable: no

10.5 WHEN navigation controls are clicked THEN the system SHALL trigger the appropriate page turn animation
Thoughts: We can test that clicking navigation buttons changes the current page.
Testable: yes - property

11.1 WHEN the viewport width changes THEN the system SHALL resize the journal proportionally
Thoughts: We can test that resizing the viewport triggers a recalculation of Turn.js dimensions.
Testable: yes - property

11.2 WHEN the journal is displayed on mobile devices THEN the system SHALL maintain readability and usability
Thoughts: This is about subjective quality on mobile, which is difficult to test programmatically.
Testable: no

11.3 WHEN the journal is displayed on desktop devices THEN the system SHALL utilize available screen space effectively
Thoughts: This is about layout optimization, which is difficult to test programmatically.
Testable: no

11.4 WHEN the viewport is very small THEN the system SHALL ensure navigation controls remain accessible
Thoughts: We can test that at small viewport sizes, navigation buttons are still rendered and clickable.
Testable: yes - property

11.5 WHEN the journal is resized THEN the system SHALL maintain the correct aspect ratio for pages
Thoughts: We can test that after resize, the page dimensions maintain the expected ratio.
Testable: yes - property

12.1 WHEN Turn.js is initialized THEN the system SHALL configure the page width and height based on the journal dimensions
Thoughts: We can test that the Turn.js config object has the correct width and height values.
Testable: yes - example

12.2 WHEN Turn.js is initialized THEN the system SHALL enable hardware acceleration for smooth animations
Thoughts: We can test that the Turn.js config has acceleration set to true.
Testable: yes - example

12.3 WHEN Turn.js is initialized THEN the system SHALL set the display mode to double-page spread
Thoughts: We can test that the Turn.js config has display set to 'double'.
Testable: yes - example

12.4 WHEN Turn.js is initialized THEN the system SHALL configure the animation duration for optimal user experience
Thoughts: We can test that the Turn.js config has a duration value within an acceptable range.
Testable: yes - example

12.5 WHEN Turn.js is initialized THEN the system SHALL enable gradients for realistic page shadows
Thoughts: We can test that the Turn.js config has gradients set to true.
Testable: yes - example

### Property Reflection

After reviewing all testable properties, I've identified the following consolidations:

**Redundant Properties:**
- Properties 1.1 and 1.2 (next/previous navigation) can be combined into a single "navigation changes page" property
- Properties 2.1 and 2.2 (swipe gestures) can be combined into a single "swipe navigation" property
- Properties 3.1 and 3.2 (keyboard navigation) can be combined into a single "keyboard navigation" property
- Properties 6.4 and 6.5 (images and videos positioning) can be combined into a single "media positioning" property
- Properties 8.1 and 8.2 (spread number display) can be combined into a single "position indicator" property

**Properties to Keep:**
- Navigation properties (combined)
- Boundary conditions (edge cases for first/last page)
- Zoom round-trip property
- Zoom disables navigation property
- Customization rendering properties
- Responsive behavior properties
- Initialization and cleanup properties

Property 1: Navigation controls change pages
*For any* valid page position and navigation direction (next/previous), clicking the corresponding navigation button should change the current page by the appropriate amount (2 pages for double-page spread mode)
**Validates: Requirements 1.1, 1.2, 10.5**

Property 2: Page turn completes at correct position
*For any* page turn operation, when the animation completes, the displayed page index should match the target page index
**Validates: Requirements 1.4**

Property 3: Rapid navigation reaches correct final position
*For any* sequence of rapid navigation commands, the final page position should match the cumulative effect of all commands, respecting boundaries
**Validates: Requirements 1.5**

Property 4: Swipe gestures navigate pages
*For any* valid page position, simulating a swipe gesture in a direction (left/right) should change the page in the corresponding direction
**Validates: Requirements 2.1, 2.2**

Property 5: Drag-release past halfway completes turn
*For any* page drag operation released past the halfway point, the page should advance to the next position
**Validates: Requirements 2.4**

Property 6: Drag-release before halfway cancels turn
*For any* page drag operation released before the halfway point, the page should return to the original position
**Validates: Requirements 2.5**

Property 7: Keyboard navigation changes pages
*For any* valid page position, pressing arrow keys (left/right) should change the page in the corresponding direction
**Validates: Requirements 3.1, 3.2**

Property 8: Double-click toggles zoom state
*For any* page, double-clicking should toggle between zoomed and normal states (zoom in if normal, zoom out if zoomed)
**Validates: Requirements 4.1, 4.3**

Property 9: Zoom disables page navigation
*For any* page in zoomed state, attempting to navigate should not change the current page until zoom is disabled
**Validates: Requirements 4.4**

Property 10: Cover customization renders correctly
*For any* cover customization object, the rendered cover should contain elements with styles matching the customization (color, texture, title, stickers)
**Validates: Requirements 6.1**

Property 11: Page customization renders correctly
*For any* page customization object, rendered content pages should have the correct background color and material pattern class
**Validates: Requirements 6.2**

Property 12: Text content renders with correct formatting
*For any* page with text content, the rendered text should have the correct font-family and display the exact content
**Validates: Requirements 6.3**

Property 13: Media elements render at correct positions
*For any* page with images or videos, the rendered media elements should have the correct src, position (x, y), and dimensions (width, height)
**Validates: Requirements 6.4, 6.5**

Property 14: Preview background applies correctly
*For any* preview background setting, the container should have the corresponding background style applied
**Validates: Requirements 7.1, 7.2**

Property 15: Viewport resize maintains aspect ratio
*For any* viewport size change, the journal dimensions should maintain the correct aspect ratio
**Validates: Requirements 7.4, 11.5**

Property 16: Position indicator displays correct information
*For any* page position, the position indicator should display the correct current spread number, total spreads, and appropriate labels for special pages (covers)
**Validates: Requirements 8.1, 8.2, 8.5**

Property 17: Component lifecycle manages Turn.js correctly
*For any* component mount/unmount cycle, Turn.js should be initialized on mount and cleaned up on unmount
**Validates: Requirements 9.2, 9.3**

Property 18: Data changes trigger reactive updates
*For any* change to journal data (pages, customization), the Turn.js display should update to reflect the new data
**Validates: Requirements 9.4**

Property 19: Navigation controls update based on position
*For any* page position, navigation buttons should be enabled/disabled appropriately (previous disabled at first page, next disabled at last page)
**Validates: Requirements 10.2, 10.3**

Property 20: Responsive layout maintains accessibility
*For any* viewport size, navigation controls should remain visible and clickable
**Validates: Requirements 11.4**

## Error Handling

### Turn.js Initialization Failures

**Scenario:** Turn.js fails to initialize due to missing dependencies or incompatible browser.

**Handling:**
- Catch initialization errors in try-catch block
- Display fallback message to user: "Unable to load interactive preview. Please try refreshing the page."
- Log error details to console for debugging
- Optionally fall back to the previous Motion-based preview implementation

### Page Rendering Errors

**Scenario:** Individual page rendering fails due to malformed data or missing resources.

**Handling:**
- Wrap renderPage() in try-catch
- Render placeholder page with error message for that specific page
- Log error with page index and data for debugging
- Continue rendering other pages normally

### Image/Video Loading Failures

**Scenario:** Embedded media fails to load (404, CORS issues, etc.).

**Handling:**
- Use onError handlers on img and iframe elements
- Display placeholder with broken image icon
- Show tooltip with error message on hover
- Don't block page rendering or navigation

### Zoom Calculation Errors

**Scenario:** Zoom coordinates are invalid or out of bounds.

**Handling:**
- Validate zoom coordinates before applying
- Clamp coordinates to valid page bounds
- If validation fails, zoom to page center as fallback
- Log warning for debugging

### Rapid Interaction Conflicts

**Scenario:** User triggers multiple interactions simultaneously (e.g., clicking next while page is turning).

**Handling:**
- Use Turn.js's built-in animation queue
- Disable navigation buttons during active animations
- Ignore duplicate events within short time window (debouncing)
- Ensure state consistency after animation completes

### Responsive Resize Issues

**Scenario:** Rapid viewport resizing causes layout thrashing or incorrect dimensions.

**Handling:**
- Debounce resize event handler (300ms delay)
- Validate calculated dimensions before applying
- Use requestAnimationFrame for smooth updates
- Maintain minimum dimensions to prevent collapse

## Testing Strategy

### Unit Testing

**Framework:** Vitest with React Testing Library

**Test Coverage:**

1. **Component Rendering Tests**
   - TurnJsPreview renders without crashing
   - Navigation buttons render correctly
   - Position indicator displays correct information
   - Background applies correct styles

2. **Page Rendering Tests**
   - Front cover renders with customization
   - Back cover renders with customization
   - Inside covers render correctly
   - Content pages render with text, images, videos
   - Blank/filler pages render correctly

3. **Navigation Tests**
   - Next button advances page
   - Previous button goes back
   - Buttons disable at boundaries
   - Keyboard events trigger navigation

4. **Zoom Tests**
   - Double-click sets zoom state
   - Zoom disables navigation
   - Zoom out re-enables navigation
   - Zoom coordinates are calculated correctly

5. **Lifecycle Tests**
   - Component mounts and initializes Turn.js
   - Component unmounts and cleans up
   - Props changes trigger updates

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:** Each property test should run a minimum of 100 iterations.

**Test Coverage:**

1. **Navigation Properties**
   - Test with random page positions and directions
   - Verify page changes are correct
   - Verify boundaries are respected

2. **Customization Properties**
   - Generate random customization objects
   - Verify rendered output contains expected styles
   - Test with various combinations of colors, textures, materials

3. **Media Positioning Properties**
   - Generate random media arrays with positions/sizes
   - Verify all media elements render at correct coordinates
   - Test with edge cases (0 media, many media, overlapping)

4. **Responsive Properties**
   - Generate random viewport dimensions
   - Verify aspect ratio is maintained
   - Verify controls remain accessible

5. **Zoom Properties**
   - Generate random zoom coordinates
   - Verify zoom state toggles correctly
   - Verify navigation is disabled when zoomed

**Property Test Tags:**
Each property-based test must include a comment tag in this format:
```typescript
// **Feature: turnjs-integration, Property {number}: {property_text}**
```

### Integration Testing

1. **Turn.js Integration**
   - Verify Turn.js initializes with correct config
   - Verify page turns trigger Turn.js animations
   - Verify Turn.js events update React state

2. **End-to-End User Flows**
   - Navigate through entire journal from start to finish
   - Zoom in and out on various pages
   - Switch between keyboard, mouse, and touch navigation
   - Resize viewport and verify responsiveness

3. **Cross-Browser Testing**
   - Test in Chrome, Firefox, Safari, Edge
   - Verify hardware acceleration works
   - Verify touch gestures work on mobile browsers

### Manual Testing Checklist

- [ ] Page turns look smooth and realistic
- [ ] Shadows and gradients appear correctly
- [ ] Touch gestures feel natural on mobile
- [ ] Zoom functionality works smoothly
- [ ] All customizations display correctly
- [ ] Navigation controls are intuitive
- [ ] Performance is acceptable on low-end devices
- [ ] No visual glitches during animations

## Implementation Notes

### Turn.js Installation

Turn.js is not available as an npm package in the standard registry. It must be installed manually:

1. Download Turn.js from http://www.turnjs.com/
2. Place turn.js and turn.min.js in `public/lib/turnjs/`
3. Create TypeScript declarations file: `src/types/turn.d.ts`
4. Load Turn.js via script tag in index.html or dynamically import

Alternative: Use a CDN link or fork/vendor the library into the project.

### jQuery Dependency

Turn.js requires jQuery. Options:
1. Install jQuery as a dependency: `npm install jquery @types/jquery`
2. Load jQuery from CDN before Turn.js
3. Consider using turn.js alternatives that don't require jQuery (e.g., page-flip library)

**Recommendation:** Install jQuery as a dependency for better control and offline support.

### React Integration Pattern

Use refs to access the DOM element for Turn.js initialization:

```typescript
const bookRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (bookRef.current) {
    $(bookRef.current).turn({
      // configuration
    });
  }
  
  return () => {
    if (bookRef.current) {
      $(bookRef.current).turn('destroy');
    }
  };
}, []);
```

### Performance Optimization

- Use `will-change: transform` CSS property on pages
- Enable hardware acceleration in Turn.js config
- Lazy load images on pages not currently visible
- Debounce resize handlers
- Use React.memo for page components to prevent unnecessary re-renders

### Accessibility Considerations

- Add ARIA labels to navigation buttons
- Ensure keyboard navigation works without mouse
- Provide skip links for screen readers
- Add alt text to all images
- Ensure sufficient color contrast on all text

### Mobile Optimization

- Increase touch target sizes for navigation buttons
- Disable zoom on double-tap (conflicts with page zoom)
- Use touch-action CSS property to prevent default gestures
- Test on various mobile devices and screen sizes
- Consider reducing animation duration on mobile for better performance
