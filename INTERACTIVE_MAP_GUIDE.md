# Interactive Map Features Guide

## Overview
Users can now pin scam locations and draw safety zones directly on interactive maps when submitting contributions.

## New Features

### 1. 📍 Scam Pin Mapping
**What it does**: Users can click on a map to mark the exact location where a scam or incident occurred.

**User Flow**:
1. Select "Scam/Incident" submission type
2. Fill in incident details
3. Click on the map to pin the location
4. Red pin marker appears at the selected location
5. Submit for guardian review

**Technical Details**:
- Uses Mapbox GL with custom marker
- Stores coordinates as PostGIS Point geometry
- Format: `POINT(longitude latitude)`
- Validates coordinates before submission

### 2. 🗺️ Safety Zone Drawing
**What it does**: Users can draw polygons/rectangles on a map to define safety zones.

**User Flow**:
1. Select "Safety Zone" submission type
2. Fill in zone details (name, level, reason)
3. Click "Draw Zone" button on map
4. Click points on map to create polygon
5. Double-click to finish drawing
6. Submit for guardian review

**Technical Details**:
- Uses Mapbox GL Draw library
- Stores coordinates as PostGIS Polygon geometry
- Format: `POLYGON((lng1 lat1, lng2 lat2, ...))`
- Requires minimum 4 points (closed polygon)

## Components

### InteractiveMapDrawer
**Location**: `components/map/InteractiveMapDrawer.tsx`

**Props**:
```typescript
interface InteractiveMapDrawerProps {
  mode: 'point' | 'rectangle';           // Drawing mode
  onLocationSelect?: (coordinates: { lng: number; lat: number }) => void;  // Point callback
  onZoneDrawn?: (coordinates: number[][]) => void;  // Polygon callback
  center?: [number, number];             // Initial map center
  zoom?: number;                         // Initial zoom level
  className?: string;                    // Additional CSS classes
}
```

**Features**:
- Interactive map with navigation controls
- Point mode: Click to place marker
- Rectangle mode: Draw tool for polygons
- Visual instructions overlay
- Clear/reset functionality
- Coordinate display and validation

**Usage Example**:
```tsx
// For point selection (scams)
<InteractiveMapDrawer
  mode="point"
  onLocationSelect={(coords) => setPinLocation(coords)}
  center={[100.5018, 13.7563]}
  zoom={12}
/>

// For zone drawing
<InteractiveMapDrawer
  mode="rectangle"
  onZoneDrawn={(coords) => setZoneCoordinates(coords)}
  center={[100.5018, 13.7563]}
  zoom={12}
/>
```

## API Endpoints

### POST /api/submit-pin
Submits a scam/incident pin with location.

**Request Body**:
```json
{
  "type": "scam" | "harassment" | "overcharge" | "other",
  "title": "Incident title",
  "summary": "Brief description",
  "details": "Full story (optional)",
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Pin submitted successfully for review.",
  "data": { /* submission record */ }
}
```

**Validation**:
- ✅ User must be authenticated
- ✅ Type must be valid pin type
- ✅ Location must be GeoJSON Point
- ✅ Coordinates must be [lng, lat] array

### POST /api/submit-zone
Submits a safety zone with polygon.

**Request Body**:
```json
{
  "label": "Zone name",
  "level": "recommended" | "neutral" | "caution" | "avoid",
  "reason_short": "Why this level",
  "reason_long": "Additional details (optional)",
  "geom": {
    "type": "Polygon",
    "coordinates": [
      [
        [lng1, lat1],
        [lng2, lat2],
        [lng3, lat3],
        [lng1, lat1]  // Must close the polygon
      ]
    ]
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Zone submitted successfully for review.",
  "data": { /* submission record */ }
}
```

**Validation**:
- ✅ User must be authenticated
- ✅ Level must be valid zone level
- ✅ Geometry must be GeoJSON Polygon
- ✅ Minimum 4 coordinate pairs (closed polygon)

## Database Integration

### pin_submissions Table
```sql
CREATE TABLE pin_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  city_id INTEGER REFERENCES cities(id),
  type TEXT CHECK (type IN ('scam','harassment','overcharge','other')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  location GEOMETRY(Point, 4326) NOT NULL,  -- PostGIS Point
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### zone_submissions Table
```sql
CREATE TABLE zone_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  city_id INTEGER REFERENCES cities(id),
  label TEXT NOT NULL,
  level TEXT CHECK (level IN ('recommended','neutral','caution','avoid')),
  reason_short TEXT NOT NULL,
  reason_long TEXT,
  geom GEOMETRY(Polygon, 4326) NOT NULL,  -- PostGIS Polygon
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Installation

### 1. Install Dependencies
```bash
npm install @mapbox/mapbox-gl-draw
npm install --save-dev @types/mapbox__mapbox-gl-draw
```

### 2. Environment Variables
Ensure you have Mapbox token:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Run Database Migration
The schema is already included in `scripts/schema.sql`. If you need to add it manually:

```sql
-- Tables are already defined in schema.sql
-- Just run the full migration:
psql -h your-host -U postgres -d postgres -f scripts/schema.sql
```

## User Interface

### Scam Submission Form
```
┌─────────────────────────────────────┐
│ What Happened: [________________]   │
│ Brief Description: [____________]   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │     Interactive Map         │   │
│ │  [Click to pin location]    │   │
│ │         📍                   │   │
│ │                              │   │
│ │  ✓ Location selected         │   │
│ │  13.75630, 100.50180        │   │
│ └─────────────────────────────┘   │
│                                     │
│ Full Story: [__________________]   │
│ [Submit for Review]                 │
└─────────────────────────────────────┘
```

### Zone Submission Form
```
┌─────────────────────────────────────┐
│ Area Name: [___________________]   │
│ Safety Level: [Recommended ▼]      │
│                                     │
│ ┌─────────────────────────────┐   │
│ │     Interactive Map         │   │
│ │  [Draw Zone Button]         │   │
│ │                              │   │
│ │    ┌──────┐                 │   │
│ │    │▒▒▒▒▒▒│  Drawn zone     │   │
│ │    └──────┘                 │   │
│ │  ✓ Zone drawn (5 points)    │   │
│ └─────────────────────────────┘   │
│                                     │
│ Why this level: [______________]   │
│ [Submit for Review]                 │
└─────────────────────────────────────┘
```

## Guardian Review

Guardians can see submitted pins and zones in their dashboard (`/guardian`) with:
- Preview of location/zone
- All submission details
- Approve/Reject controls
- Notes field

Once approved:
- Pins appear on `/live` map
- Zones appear on city maps
- Submitter earns contribution points

## Tips for Users

### Scam Pin Best Practices
✅ **Do**:
- Pin the exact location where it happened
- Be as specific as possible
- Include time of day if relevant

❌ **Don't**:
- Pin approximate locations
- Submit duplicate pins for same scam
- Pin unverified rumors

### Zone Drawing Best Practices
✅ **Do**:
- Draw boundaries that match actual neighborhoods
- Keep zones reasonably sized (few blocks)
- Be accurate with safety levels

❌ **Don't**:
- Draw entire districts as one zone
- Overlap zones excessively
- Use extreme safety levels without reason

## Troubleshooting

### Map not loading
**Issue**: Map container appears blank
**Solution**:
- Check `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Verify Mapbox token is valid
- Check browser console for errors

### Can't place marker
**Issue**: Clicking map doesn't place marker
**Solution**:
- Ensure you're in point mode
- Check if map has finished loading
- Try refreshing the page

### Draw tool not working
**Issue**: "Draw Zone" button doesn't activate
**Solution**:
- Ensure you're in rectangle mode
- Check if MapboxDraw loaded correctly
- Look for JavaScript errors in console

### Coordinates not saving
**Issue**: Submission fails with coordinate error
**Solution**:
- Verify coordinates are in correct format [lng, lat]
- Check database has PostGIS extension enabled
- Ensure SRID is 4326

## Performance Considerations

- Map lazy loads only when needed
- Single marker/draw instance per map
- Efficient coordinate validation
- Optimized for mobile devices

## Security

- All submissions require authentication
- Server-side coordinate validation
- SQL injection protection via parameterized queries
- Guardian review before publication

## Future Enhancements

### Planned Features
- 🗺️ City auto-detection from coordinates
- 📱 GPS location auto-fill for mobile users
- 🎨 Zone color preview while drawing
- 📊 Heat map visualization
- 🔍 Search location by address
- 📏 Area size calculation and limits

### Possible Improvements
- Multi-polygon support for complex zones
- Line drawing for route warnings
- Radius-based circular zones
- Clustering for dense pin areas
- Offline map caching

## Related Files

**Components**:
- `components/map/InteractiveMapDrawer.tsx` - Main map component
- `components/map/MapView.tsx` - Display-only map

**Pages**:
- `app/submit/page.tsx` - Submission form with maps
- `app/guardian/page.tsx` - Guardian review interface

**API**:
- `app/api/submit-pin/route.ts` - Pin submission endpoint
- `app/api/submit-zone/route.ts` - Zone submission endpoint

**Types**:
- `types/index.ts` - TypeScript definitions

**Database**:
- `scripts/schema.sql` - Full database schema

## Support

For issues or questions:
1. Check this guide first
2. Review `REFINEMENTS.md` for context
3. Check Mapbox GL docs: https://docs.mapbox.com/mapbox-gl-js/
4. Check Mapbox Draw docs: https://github.com/mapbox/mapbox-gl-draw

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready ✅

