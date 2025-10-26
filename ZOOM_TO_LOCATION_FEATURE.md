# Click-to-Zoom Map Feature

## Overview
Implemented interactive click-to-zoom functionality where clicking on any safety zone, scam alert, or tip in the sidebar automatically zooms the map to that location.

## What's New

### 1. **MapView Component Updates** (`components/map/MapView.tsx`)

#### Added Ref Interface
```typescript
export interface MapViewRef {
  zoomToZone: (zone: Zone) => void;
  zoomToPin: (pin: Pin) => void;
}
```

#### Converted to ForwardRef Component
- Used `forwardRef` to expose zoom methods to parent components
- Implemented `useImperativeHandle` to provide controlled access

#### Zoom Methods
1. **`zoomToZone(zone)`**
   - Calculates bounding box for zone polygon
   - Fits map to zone bounds with padding
   - Max zoom level: 15
   - Smooth animation: 1 second

2. **`zoomToPin(pin)`**
   - Flies to exact pin coordinates
   - Zoom level: 16 (closer view)
   - Smooth animation: 1 second

### 2. **City Page Updates** (`app/city/[slug]/page.tsx`)

#### Added Map Reference
```typescript
const mapRef = useRef<MapViewRef>(null);
```

#### Enhanced Click Handlers
- `handleZoneClick(zone, shouldZoom)` - Optional zoom parameter
- `handlePinClick(pin, shouldZoom)` - Optional zoom parameter
- Sidebar clicks: `shouldZoom = true` (zooms to location)
- Map clicks: `shouldZoom = false` (just opens detail sheet)

#### Visual Improvements
- Added MapPin icon to each clickable item
- Shows visual indicator that items are interactive
- Maintains hover states and transitions

### 3. **User Experience**

#### Before
- Click item → Opens detail sheet
- Map stays in current position
- Users had to manually find location

#### After
- Click item in sidebar → Map zooms + Opens detail sheet
- Click item on map → Just opens detail sheet (no zoom)
- Smooth animated transitions
- Automatic bounds calculation for zones
- Precise centering for pin locations

## Implementation Details

### Zone Zoom Logic
```typescript
// Calculate bounds from polygon coordinates
const coordinates = zone.geom.coordinates[0] as number[][];
const bounds = coordinates.reduce((bounds, coord) => {
  return bounds.extend(coord as [number, number]);
}, new mapboxgl.LngLatBounds(...));

// Fit to bounds with padding
map.fitBounds(bounds, {
  padding: 50,
  maxZoom: 15,
  duration: 1000,
});
```

### Pin Zoom Logic
```typescript
// Fly to exact coordinates
const [lng, lat] = pin.location.coordinates;
map.flyTo({
  center: [lng, lat],
  zoom: 16,
  duration: 1000,
});
```

## Affected Components

### Modified Files
1. `/components/map/MapView.tsx`
   - Converted to forwardRef component
   - Added zoom methods
   - Exported MapViewRef interface

2. `/app/city/[slug]/page.tsx`
   - Added mapRef
   - Updated click handlers
   - Added MapPin icons to clickable items
   - Connected zoom functionality

### No Breaking Changes
- Backward compatible with existing map functionality
- All existing features work as before
- Optional zoom parameter (defaults to false)

## Usage Example

```typescript
// In parent component
const mapRef = useRef<MapViewRef>(null);

// Pass ref to MapView
<MapView ref={mapRef} zones={zones} pins={pins} />

// Zoom programmatically
mapRef.current?.zoomToZone(selectedZone);
mapRef.current?.zoomToPin(selectedPin);
```

## Testing Checklist

✅ Click safe zone in sidebar → Map zooms to zone
✅ Click avoid zone in sidebar → Map zooms to zone  
✅ Click scam alert in sidebar → Map zooms to pin
✅ Click zone on map → Opens sheet (no zoom)
✅ Click pin on map → Opens sheet (no zoom)
✅ Smooth animations (1 second)
✅ Proper zoom levels (zones: 15, pins: 16)
✅ Works on mobile (responsive)
✅ No console errors
✅ Maintains existing functionality

## Performance Notes

- No performance impact
- Animations are GPU-accelerated by Mapbox
- Ref-based approach avoids unnecessary re-renders
- Lazy evaluation (only zooms when requested)

## Future Enhancements (Optional)

1. **Search Integration**
   - When user searches, zoom to matching locations
   
2. **URL Deep Linking**
   - Add `?zoom=zone-id` or `?zoom=pin-id` to URL
   - Auto-zoom on page load
   
3. **Multi-Select Zoom**
   - Select multiple items
   - Zoom to fit all selected locations
   
4. **Zoom Preview**
   - Hover over item → Preview zoom (subtle)
   - Click → Full zoom

5. **Keyboard Navigation**
   - Arrow keys to navigate items
   - Enter to zoom to selected item

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

All modern browsers with Mapbox GL JS support.

