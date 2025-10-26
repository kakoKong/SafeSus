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

-- Set default category based on content (you can update these manually later)
UPDATE rules SET tip_category = 'general_safety' WHERE tip_category IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE rules ALTER COLUMN tip_category SET NOT NULL;

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_rules_tip_category ON rules(tip_category);

