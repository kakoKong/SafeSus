# Navigation & Rules Category Updates

## Changes Made

### 1. Navigation Updates

**Header.tsx Changes:**
- Removed "Live" navigation item
- Renamed "Planning" → "Map"
- Navigation now: **Map | Tips | About Us**

**Homepage CTA Updates:**
- Changed "Try Live Mode" → "Browse Tips"
- Changed "Start Exploring" → "View Map"
- Removed references to Live Mode features

### 2. Rules (Do's & Don'ts) Now Have Categories

**Database Migration:**
- Created `scripts/add-category-to-rules.sql`
- Adds `tip_category` column to `rules` table
- Supports all 9 tip categories:
  - Transportation
  - Shopping
  - Dining & Food
  - Accommodation
  - General Safety
  - Attractions
  - Culture & Etiquette
  - Communication
  - Money & Banking

**New Component:**
- `components/city/RulesWithCategories.tsx`
- Displays category badges next to each rule
- Shows icon + label for each category
- Maintains existing show more/less functionality

**Type Updates:**
- Added `tip_category?: string` to Rule interface

### 3. UI Improvements

**Do's & Don'ts Display:**
```
✓ Use Grab app for taxis    [🚗 Transportation]
✓ Visit temples early        [🏛️ Attractions]
✗ Don't exchange at airport  [💰 Money & Banking]
```

Each rule now shows its category with:
- Icon
- Category name
- Color-coded badge

## How to Apply Database Changes

Run this SQL in your Supabase SQL Editor:

```sql
-- Add tip_category column to rules table
ALTER TABLE rules 
ADD COLUMN IF NOT EXISTS tip_category TEXT 
CHECK (tip_category IN (
  'transportation',
  'shopping',
  'dining',
  'accommodation',
  'general_safety',
  'attractions',
  'cultural',
  'communication',
  'money'
));

-- Set default category
UPDATE rules SET tip_category = 'general_safety' WHERE tip_category IS NULL;

-- Make column NOT NULL
ALTER TABLE rules ALTER COLUMN tip_category SET NOT NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_rules_tip_category ON rules(tip_category);
```

## Navigation Structure

### Before:
```
Safesus | Planning | Live | Tips | About Us
```

### After:
```
Safesus | Map | Tips | About Us
```

Cleaner, simpler, more focused!

## Benefits

1. **Clearer Navigation**: "Map" is more descriptive than "Planning"
2. **Simplified**: Removed "Live Mode" which was causing confusion
3. **Better Organization**: Do's and don'ts now categorized for easier browsing
4. **Consistent System**: Rules use same category system as tips
5. **Visual Clarity**: Category badges make scanning faster

## Files Changed

1. `components/shared/Header.tsx` - Navigation updates
2. `app/page.tsx` - Homepage CTA updates
3. `types/index.ts` - Added tip_category to Rule interface
4. `components/city/RulesWithCategories.tsx` - New component
5. `app/city/[slug]/page.tsx` - Use new rules component
6. `scripts/add-category-to-rules.sql` - Database migration

## Example Usage

When viewing a city page, do's and don'ts now appear as:

**Things to Do:**
- ✓ **Use Grab or Bolt** `[Transportation]`
  Always use metered taxis or ride-sharing apps

- ✓ **Visit Grand Palace early** `[Attractions]`
  Go before 9am to avoid crowds and heat

**Things to Avoid:**
- ✗ **Don't exchange at airport** `[Money & Banking]`
  Rates are 10-15% worse than in the city

Much easier to find relevant advice!

