-- Add a new column for ts_vector
ALTER TABLE users ADD COLUMN tsv tsvector;

-- Update the ts_vector column with concatenated text
UPDATE users SET tsv =
                     setweight(to_tsvector(coalesce(firstname, '')), 'A') ||
                     setweight(to_tsvector(coalesce(lastname, '')), 'A') ||
                     setweight(to_tsvector(coalesce(email, '')), 'B') ||
                     setweight(to_tsvector(coalesce(profession, '')), 'C') ||
                     setweight(to_tsvector(coalesce(country, '')), 'D') ||
                     setweight(to_tsvector(coalesce(city, '')), 'D');

-- Create a trigger to update the ts_vector column on data change
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
   ON users FOR EACH ROW EXECUTE FUNCTION
   tsvector_update_trigger(tsv, 'pg_catalog.english', firstname, lastname, email, profession, country, city);

-- Create GIN index on the ts_vector column
CREATE INDEX idx_users_tsv ON users USING gin(tsv);