# Steam Reviews Service

[![Build Status](https://travis-ci.org/FEC-Bell/steam-reviews.svg?branch=master)](https://travis-ci.org/FEC-Bell/steam-reviews) [![Coverage Status](https://coveralls.io/repos/github/FEC-Bell/steam-reviews/badge.svg?branch=master)](https://coveralls.io/github/FEC-Bell/steam-reviews?branch=master)

Reviews service for Team Bell's Steam app clone. [Here](https://github.com/FEC-Bell/steam-reviews/blob/master/fec-engineering-journal/JOURNAL.md) is a journal documenting my entire process for creating this service.

## Media

### Steam Reviews

[Link to deployed site](http://ec2-13-59-202-34.us-east-2.compute.amazonaws.com:3001/)

![Steam Reviews GIF Demo](https://media.giphy.com/media/YpxTxyg8giWXhlGMsM/giphy.gif)

### [Steam Game Description](https://github.com/FEC-Bell/steam-game-description):

[Link to deployed site](http://ec2-13-59-202-34.us-east-2.compute.amazonaws.com:3005/)

![Steam Game Description GIF Demo](https://media.giphy.com/media/RlZgP43KhKByiG7nxo/giphy.gif)

*Note that some display images do not work because the target API service has not completely implemented support for them yet.*

### [Steam Proxy](https://github.com/FEC-Bell/christina-proxy):

[Link to deployed site](http://ec2-13-59-202-34.us-east-2.compute.amazonaws.com:3000/)

![Steam Proxy GIF Demo](https://media.giphy.com/media/JpqiSUO3Ctoykg0Vt4/giphy.gif)

## Related Projects

These are the related Steam services, of which [Game Description](https://github.com/FEC-Bell/steam-game-description) and the [reverse proxy](https://github.com/FEC-Bell/christina-proxy) were also developed by me individually.

- [Reviews Graph](https://github.com/FEC-Bell/steam-reviews-graph)
- [Downloadable Content](https://github.com/FEC-Bell/downloadable_content)
- [Photo Carousel](https://github.com/FEC-Bell/photo-carousel)
- [User Tags](https://github.com/FEC-Bell/steam-user-tags)
- [Game Description](https://github.com/FEC-Bell/steam-game-description)
- [Steam Clone - Reverse Proxy](https://github.com/FEC-Bell/christina-proxy)

## Table of Contents

1. [Usage](#usage)
2. [Requirements](#requirements)
3. [Development](#development)
4. [Service Endpoints](#service-endpoints)
    - [GET /api/gamereviews/:gameid](#get-apireviewsgameid)
    - [Query parameters](#query-parameters-urlsearchparams-for-apireviewsgameid)
5. [Troubleshooting](#troubleshooting)
    - [Troubleshooting PostgreSQL](#troubleshooting-postgresql)
6. [CRUD Documentation](#CRUD)


## Usage

The Steam Reviews microservice is intended to be used in conjunction with its [Related Projects](#related-projects) to create a realistic Steam item details page clone using Docker and AWS. [Here](https://github.com/FEC-Bell/christina-proxy) is an example of a proxy server created with this service.

```
git clone https://github.com/FEC-Bell/steam-reviews.git`
cd steam-reviews
npm install
```

## Requirements

- Node JS v12
- PostgreSQL v12

## Development

1. Clone repo & install dependencies:
    ```
    git clone https://github.com/FEC-Bell/steam-reviews.git`
    cd steam-reviews
    npm install
    npx install-peerdeps knex
    ```

2. **PostgreSQL v12** must be set up before continuing:
    - [Linux setup](https://www.postgresql.org/download/linux/ubuntu/) (assuming Ubuntu v16.04+)
    - [MacOS setup](https://www.postgresql.org/download/macosx/)
    - [Windows setup](https://www.postgresql.org/download/windows/)

    If using Windows, you may also install PostgreSQL as a Linux service via Windows Subsystem for Linux. However, you'll need to upgrade to WSL 2.0 if using Ubuntu v20.04. [See this journal post](https://github.com/FEC-Bell/steam-reviews/blob/master/fec-engineering-journal/JOURNAL.md#set-up-postgresql) for details on how this can be done.

    [Verify](https://linuxize.com/post/how-to-check-postgresql-version/) that PostgreSQL is version 12.

    PostgreSQL service commands for Windows WSL or Linux:
    ```
    sudo service postgresql start
    sudo service postgresql stop
    sudo service postgresql status
    ```

    PostgreSQL service commands for Mac:
    ```
    brew services start postgresql
    brew services stop postgresql
    brew services
    ```

    Further development assumes that PostgreSQL is running on its default port, 5432, and has been installed with the default settings otherwise.

3. Create file named `.env` in local repo root containing the following lines:
    ```
    PORT=3001
    PG_PASS=your_password_here
    PG_USER=your_username_here
    ```
    The PG_PASS line is the password for accessing your PostgreSQL service. You may add other environment variables to this file, and access them throughout your code via adding the line `require('dotenv').config()` in your code. If you did not provide a password during PostgreSQL installation, delete `your_password_here` from the above line. The `.env` file has been `.gitignore`d for your convenience.

    Your username for accessing PG_USER on Windows WSL or Linux should be `postgres`. On Mac, it should be your username as displayed in zsh:  `your_username@MacBook-Pro ~ %`

4. Create the `steam_reviews` database in your CLI:
    ```
    createdb steam_reviews
    ```

    Or from inside psql:
    ```
    CREATE DATABASE steam_reviews;
    ```

    Make sure you're entering the above command as the user `postgres` (or whatever your username is on Mac). See [Troubleshooting PostgreSQL](#troubleshooting-postgresql) for more information.

5. Seed the database with `npm run seed`.
    - **If using Mac**: instead of `npm run seed`, run:
    ```
    sudo npm i -g knex
    npm run seed:internal
    ```

    - You may check that the DB has the proper entries via `psql` CLI tool:
    ```
    psql -d steam_reviews         // connect to steam_reviews database
    \dt                           // describe tables
    select count(*) from badges;  // 16
    select count(*) from users;   // 750
    select count(*) from reviews; // 1000
    \q                            // quit psql
    ```

6. Ensure that all tests pass with `npm run test`.

7. Start the server with `npm run server:dev`.
    - Alternatively, start a production server with `npm run start`.

8. Start the client with `npm run client:dev`.
    - Alternatively, build a production-ready minified `bundle.js` with `npm run build`.

## Service Endpoints

### `GET /api/gamereviews/:gameid`

Data shape:
```
{
  steamPurchasedCount: Number,
  otherPurchasedCount: Number,
  data: [
    {
        "id": Number,
        "id_user": Number,
        "user": {
            "id": Number, // matches id_user
            "username": String,
            "profile_url": String,
            "is_online": Boolean,
            "num_products": Number,
            "num_reviews": Number,
            "steam_level": Number,
            "id_badge": Number, // id may be null, in which case badge entry won't be present
            "badge": Null || {
                "id": Number, // matches id_badge
                "title": String,
                "xp": Number,
                "badge_url": String
            }
            "is_in_game": Boolean,
            "in_game_id": Null || Number,
            "in_game_status": Null || String
        },
        "id_game": Number,
        "is_recommended": Boolean,
        "hours_on_record": Single-precision Float String (“1800.3”),
        "hours_at_review_time": Single-precision Float String (“1800.3”),
        "purchase_type": String (either `direct` or `key`),
        "date_posted": ISODateString ("2020-06-03T15:00:00.000Z"),
        "received_free": Boolean,
        "review_text": String,
        "num_found_helpful": Number,
        "num_found_funny": Number,
        "num_comments": Number
    },
    {
      id: Number
      ... etc etc. Total data count will be 10 or less every time
    }
  ],
  recent: [
    ...
    // Same content as data, but ordered by date. Recent will only appear when the endpoint is hit with a display=summary query, or when the display query is absent (defaults to summary in that case).
  ]
}

```

### Query parameters ([URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)) for `/api/gamereviews/:gameid`:

- Review type param:
    - `review_type={all || positive || negative}`
    - Default: `all`

- Purchase type param:
    - `purchase_type={all || steam || other}`
    - Default: `all`

- Date range params:
    - `from={yyyy-mm-dd}`
    - `to={yyyy-mm-dd}`
    - Default: omit this query param to get the default search range, which is all reviews -- only 10 reviews per game are in the dataset
    - `from={yyyy-mm-dd}` & `to={yyyy-mm-dd}` are both optional
    - Interacts with [Reviews Graph](https://github.com/FEC-Bell/steam-reviews-graph) service

- Exclude date range param:
    - `exclude={true || false}`
    - Default: `false`
    - If true, filter results will be of dates EXCLUDING the range parameter specified above. If no date range parameter with `from={yyyy-mm-dd}` AND `to={yyyy-mm-dd}` is specified, this parameter does nothing.

- Playtime params:
    - `play_min={[0-100]}`
    - `play_max={[0-100]}`
    - Default: you may omit these queries to get the default, which is no min & no max
    - One or both queries may be used to specify upper/lower range
    - Valid ranges from client UI are:
        - No minimum
        - Over 1 hour: `play_min=1`
        - Over 10 hours: `play_min=10`
        - Over 100 hours: `play_min=100`
        - More granular filter options with double-ended slider

- Display as param:
    - `display={summary || helpful || recent || funny}`
    - Default: `summary`
    - ONLY Summary will bring up the right-sided "Recently Posted" reviews sub-module

- Example:
    - `/api/gamereviews/:gameid?review_type=negative&from=2019-06-01&play_min=50`
    - Get all negative reviews from last June 1st until now from people who`ve played at least 50 hours


## Troubleshooting

Any uncovered problems, or errors that you solved and want to share? Feel free to [open a issue](https://github.com/FEC-Bell/steam-reviews/issues/new).

### Troubleshooting PostgreSQL
1. If using `psql -d steam_reviews` via CLI to check that the database was seeded properly, an error
    ```
    psql: error: could not connect to server: FATAL:  role "<USERNAME>" does not exist
    ```
    might appear. If this happens, use `sudo su postgres` to switch to the postgres account, and run `psql -d steam_reviews` again. If user 'postgres' does not exist in your system, you may create this user *with superuser permissions* by typing `CREATE USER postgres SUPERUSER;` in psql CLI. See [this post](https://stackoverflow.com/questions/15301826/psql-fatal-role-postgres-does-not-exist) for more details. Typing `sudo su YOUR_USERNAME` will switch you back to your user account.

## CRUD

- GET
    - Endpoint: /api/gamereviews/:gameid
    - Output:
```
  {
  steamPurchasedCount: Number,
  otherPurchasedCount: Number,
  data: [
    {
        "id": Number,
        "id_user": Number,
        "user": {
            "id": Number, // matches id_user
            "username": String,
            "profile_url": String,
            "is_online": Boolean,
            "num_products": Number,
            "num_reviews": Number,
            "steam_level": Number,
            "id_badge": Number, // id may be null, in which case badge entry won't be present
            "badge": Null || {
                "id": Number, // matches id_badge
                "title": String,
                "xp": Number,
                "badge_url": String
            }
            "is_in_game": Boolean,
            "in_game_id": Null || Number,
            "in_game_status": Null || String
        },
        "id_game": Number,
        "is_recommended": Boolean,
        "hours_on_record": Single-precision Float String (“1800.3”),
        "hours_at_review_time": Single-precision Float String (“1800.3”),
        "purchase_type": String (either ‘direct’ or ‘key’),
        "date_posted": ISODateString ("2020-06-03T15:00:00.000Z"),
        "received_free": Boolean,
        "review_text": String,
        "num_found_helpful": Number,
        "num_found_funny": Number,
        "num_comments": Number
    }
```
- CREATE
    - Endpoint: /api/create/:gameid
    - Required Query Params:
```
id_user,
is_recommended,
hours_on_record,
hours_at_review_time,
purchase_type,
date_posted,
received_free,
review_text
```

```- Ex: /api/create/1?id_user=1&is_recommended=true&hours_on_record=100.10&hours_at_review_time=59.9&purchase_type=direct&date_posted=2020-05-22T18:37:02.382Z&received_free=false&review_text=I am so cool for reals ```

- UPDATE:
    - Endpoint: /api/update/:review_id
    - Required Query Params:
```
id_user,
is_recommended,
hours_on_record,
hours_at_review_time,
purchase_type,
date_posted,
received_free,
review_text
```
```- Ex: /api/update/1?id_user=1&is_recommended=true&hours_on_record=100.10&hours_at_review_time=59.9&purchase_type=direct&date_posted=2020-05-22T18:37:02.382Z&received_free=false&review_text=I am updating the review text! ```
- Note: User must provide all of the parameter keys and its values and only change the values of keys that needs to be changed/updated (Keys listed above)

- DELETE:
    - Endpoint: /api/delete/:review_id

```- Ex: /api/delete/1 ```


