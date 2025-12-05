# Touch Gesture Testing Guide for Turn.js Integration

## Overview
This guide helps verify that touch gestures work correctly on mobile devices for the Digital Journal Tool's Turn.js preview mode.

## Testing Environment Setup

### Option 1: Physical Mobile Device
1. Start the dev server: `npm run dev`
2. Find your local IP address
3. Access the app from your mobile device: `http://[YOUR_IP]:3000`
4. Navigate to preview mode

### Option 2: Browser DevTools (Chrome/Edge)
1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000` in Chrome or Edge
3. Open DevTools (F12)
4. Click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
5. Select a mobile device from the dropdown
6. Navigate to preview mode

## Test Cases

### Test 1: Swipe Left (Next Page)
**Requirement**: 2.1 - WHEN a user swipes left on a touch device THEN the system SHALL turn to the next page

**Steps**:
1. Open the journal in preview mode
2. Place finger on the right side of the page
3. Swipe left across the screen
4. **Expected**: Page should turn to the next page with animation

**Status**: ☐ Pass ☐ Fail

---

### Test 2: Swipe Right (Previous Page)
**Requirement**: 2.2 - WHEN a user swipes right on a touch device THEN the system SHALL turn to the previous page

**Steps**:
1. Navigate to any page after the first page
2. Place finger on the left side of the page
3. Swipe right across the screen
4. **Expected**: Page should turn to the previous page with animation

**Status**: ☐ Pass ☐ Fail

---

### Test 3: Drag Page Corner
**Requirement**: 2.3 - WHEN a user drags a page corner on a touch device THEN the system SHALL follow the drag motion with a partial page curl

**Steps**:
1. Open the journal in preview mode
2. Touch and hold the corner of a page
3. Drag slowly without releasing
4. **Expected**: Page should curl and follow your finger movement

**Status**: ☐ Pass ☐ Fail

---

### Test 4: Drag Past Halfway (Complete Turn)
**Requirement**: 2.4 - WHEN a user releases a dragged page past the halfway point THEN the system SHALL complete the page turn animation

**Steps**:
1. Touch and hold a page corner
2. Drag past the center of the book (more than 50%)
3. Release your finger
4. **Expected**: Page should complete the turn animation automatically
5. Check browser console for: "Page turn ended, completed: true"

**Status**: ☐ Pass ☐ Fail

---

### Test 5: Drag Before Halfway (Cancel Turn)
**Requirement**: 2.5 - WHEN a user releases a dragged page before the halfway point THEN the system SHALL return the page to its original position

**Steps**:
1. Touch and hold a page corner
2. Drag less than halfway (less than 50%)
3. Release your finger
4. **Expected**: Page should snap back to original position
5. Check browser console for: "Page turn ended, completed: false"

**Status**: ☐ Pass ☐ Fail

---

## Implementation Details

### Turn.js Touch Support
Turn.js automatically detects touch-capable devices and enables touch event handling. The library handles:

- **Touch Events**: Automatically listens to `touchstart`, `touchmove`, and `touchend` events
- **Swipe Detection**: Recognizes horizontal swipe gestures for page navigation
- **Drag Threshold**: Internal logic determines when a drag should complete or cancel (typically 50% of page width)
- **Sensitivity**: Optimized for natural touch interactions

### Event Handlers
The implementation includes event handlers to track touch interactions:

```javascript
start: (event, pageObject, corner) => {
  // Called when user starts dragging a page corner
  console.log('Page turn started', { page: pageObject, corner });
}

end: (event, pageObject, turned) => {
  // Called when drag ends
  // turned=true: drag passed halfway, page turn completed
  // turned=false: drag released before halfway, page returned
  console.log('Page turn ended', { page: pageObject, completed: turned });
}
```

## Troubleshooting

### Touch Events Not Working
- Ensure you're testing on a touch-capable device or using browser DevTools touch emulation
- Check browser console for any JavaScript errors
- Verify Turn.js library is loaded (check for jQuery and Turn.js in Network tab)

### Page Turns Too Sensitive/Not Sensitive Enough
- Turn.js uses internal thresholds that are optimized for most devices
- The 50% threshold for completing turns is standard and cannot be easily adjusted
- Ensure you're testing with realistic touch gestures (not too fast or too slow)

### Console Logs Not Appearing
- Open browser DevTools console (F12)
- Ensure console is set to show all log levels
- The logs should appear when you interact with pages

## Success Criteria

All 5 test cases should pass for the touch gesture implementation to be considered complete:
- ☐ Swipe left advances pages
- ☐ Swipe right goes back
- ☐ Drag follows finger movement
- ☐ Release past halfway completes turn
- ☐ Release before halfway cancels turn

## Notes

- Turn.js handles touch gestures automatically without requiring additional configuration
- The implementation is compatible with both iOS and Android devices
- Browser touch emulation may not perfectly replicate physical device behavior
- For best results, test on actual mobile devices when possible
