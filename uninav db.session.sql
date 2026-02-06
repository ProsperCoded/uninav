-- Select all materials
-- SELECT * FROM "material";


-- Update all materials where type is 'other' to 'gdrive'
UPDATE "material"
SET "type" = 'youtube'
WHERE "type" = 'video';