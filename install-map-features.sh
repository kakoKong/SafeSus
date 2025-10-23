#!/bin/bash

echo "🗺️  Installing Interactive Map Features..."
echo ""

# Install npm dependencies
echo "📦 Installing @mapbox/mapbox-gl-draw..."
npm install @mapbox/mapbox-gl-draw
npm install --save-dev @types/mapbox__mapbox-gl-draw

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "📋 Next steps:"
echo "1. Verify your Mapbox token in .env.local:"
echo "   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here"
echo ""
echo "2. Run the database migration if not done yet:"
echo "   psql -h your-host -U postgres -d postgres -f scripts/schema.sql"
echo ""
echo "3. Test the features:"
echo "   - Visit /submit"
echo "   - Try 'Scam/Incident' for pin mapping"
echo "   - Try 'Safety Zone' for zone drawing"
echo ""
echo "📖 Documentation:"
echo "   - Full guide: INTERACTIVE_MAP_GUIDE.md"
echo "   - Quick summary: MAP_FEATURES_SUMMARY.md"
echo ""
echo "🚀 Ready to go!"
