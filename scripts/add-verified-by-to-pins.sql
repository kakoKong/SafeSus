-- Add verified_by column to pins table to track who approved the pin
ALTER TABLE pins
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add reviewed_by column to submission tables to track who reviewed
ALTER TABLE pin_submissions
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE zone_submissions
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE tip_submissions
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_pins_verified_by ON pins(verified_by);
CREATE INDEX IF NOT EXISTS idx_pin_submissions_reviewed_by ON pin_submissions(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_zone_submissions_reviewed_by ON zone_submissions(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_tip_submissions_reviewed_by ON tip_submissions(reviewed_by);

