-- NOTE: This is a legacy file. Seeding is now being handled by knex
-- migrations & seeds functionalities (in /server/db)

-- Before running seed script:
-- 1. Ensure PostgreSQL service is running on port 5432
-- 2. Run 'CREATE DATABASE steam_reviews'
-- 3. Connect to database 'steam_reviews' using '\c steam_reviews' in psql CLI

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TYPE IF EXISTS p_type CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE badges (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(50),
  xp SMALLINT,
  badge_url TEXT
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(50),
  profile_url TEXT,
  is_online BOOLEAN,
  num_products SMALLINT,
  num_reviews SMALLINT,
  steam_level SMALLINT,
  id_badge INTEGER REFERENCES badges(id),
  is_in_game BOOLEAN,
  -- in_game_id declaration here mocks Foreign Key constraint referencing games(id),
  -- since I don't actually need the games table aside from its primary key column
  in_game_id INTEGER CONSTRAINT game_id_range CHECK (in_game_id >= 1 AND in_game_id <= 30000),
  in_game_status TEXT
);

CREATE TYPE p_type AS ENUM ('direct', 'key');

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_user INTEGER REFERENCES users(id),
  -- id_game declaration here mocks Foreign Key constraint referencing games(id),
  -- since I don't actually need the games table aside from its primary key column
  id_game INTEGER NOT NULL CONSTRAINT game_id_range CHECK (id_game >= 1 AND id_game <= 30000),
  is_recommended BOOLEAN,
  -- Numeric(precision, scale): precision indicates total number of digits in float,
  -- while scale indicates digits to the right of the decimal. I.E. #####.# format
  hours_on_record NUMERIC(5, 1),
  hours_at_review_time NUMERIC(5, 1) CHECK (hours_at_review_time <= hours_on_record),
  -- Equivalent to MySQL SET (see type declaration on line 34)
  purchase_type p_type,
  date_posted DATE,
  received_free BOOLEAN,
  review_text TEXT,
  num_found_helpful SMALLINT,
  num_found_funny SMALLINT,
  num_comments SMALLINT
);

/*
-- TODO: Badge URLs might need to be hosted in media bucket instead of taken from lorem picsum site. Wait for answer from TM's.
INSERT INTO badges (title, xp, badge_url)
  VALUES
    ('Product Registration', 100, 'https://picsum.photos/seed/product/100'),
    ('Pillar of Community', 100, 'https://picsum.photos/seed/pillar/100'),
    ('Community Ambassador', 200, 'https://picsum.photos/seed/ambassador/100'),
    ('Community Leader', 500, 'https://picsum.photos/seed/leader/100'),
    ('1 Year of Service', 50, 'https://picsum.photos/seed/1/100'),
    ('2 Years of Service', 100, 'https://picsum.photos/seed/2/100'),
    ('3 Years of Service', 150, 'https://picsum.photos/seed/3/100'),
    ('4 Years of Service', 200, 'https://picsum.photos/seed/4/100'),
    ('5 Years of Service', 250, 'https://picsum.photos/seed/5/100'),
    ('One-Stop Shopper', 100, 'https://picsum.photos/seed/one/100'),
    ('Select Collector', 125, 'https://picsum.photos/seed/select/100'),
    ('Adept Accumulator', 150, 'https://picsum.photos/seed/adept/100'),
    ('Sharp-Eyed Stockpiler', 200, 'https://picsum.photos/seed/sharp/100'),
    ('Collection Agent', 250, 'https://picsum.photos/seed/collection/100'),
    ('Power Player', 325, 'https://picsum.photos/seed/power/100'),
    ('Game Mechanic', 500, 'https://picsum.photos/seed/game/100');

-- TODO: profile_urls of users table might need to be hosted, same as badge URLs. Wait for answer from TM's.
-- NOTE: file path specified on line 94 and 112 must be an absolute path. If using relative pathing,
--       the dot route (./) location is the installed location of your postgresql package,
--       mostly likely /var/lib/postgresql. This line must be changed to the location of
--       YOUR generated .csv files if planning to seed your PostgreSQL DB locally.
COPY users(
  username,
  profile_url,
  is_online,
  num_products,
  num_reviews,
  steam_level,
  id_badge,
  is_in_game,
  in_game_id,
  in_game_status
)
FROM '/mnt/c/Users/Christina Wang/Documents/Coding/hack-reactor/front-end-capstone/steam-reviews/data-gen/csv-seeds/users.csv'
DELIMITER ','
CSV HEADER;

COPY reviews(
  id_user,
  id_game,
  is_recommended,
  hours_on_record,
  hours_at_review_time,
  purchase_type,
  date_posted,
  received_free,
  review_text,
  num_found_helpful,
  num_found_funny,
  num_comments
)
FROM '/mnt/c/Users/Christina Wang/Documents/Coding/hack-reactor/front-end-capstone/steam-reviews/data-gen/csv-seeds/reviews.csv'
DELIMITER ','
CSV HEADER;
*/