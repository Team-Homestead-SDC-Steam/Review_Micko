# HR Front End Capstone: Engineering Journal
## Christina Wang - RPT21 Bell Team

Cloning the [Steam](https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/) app. My modules: Reviews, Game Description. This journal concerns the __Reviews__ module.

## Table of Contents

1. [Set up developer environment and dependencies](#pr1-set-up-developer-environment-and-dependencies)
2. [Generate db seed data](#pr2-generate-db-seed-data)
    - [Set up PostgreSQL](#set-up-postgresql)
    - [Seeding](#seeding)
        - [Write SQL seed file](#write-sql-seed-file)
        - [Generate .CSV data](#generate-csv-data)
        - [Pipe generated .csv files into DB](#pipe-generated-csv-files-into-db)
3. [Ensure not all users have a badge id in generated data](#pr3-ensure-not-all-users-have-a-badge-id-in-generated-data)
4. [Change placeholders to hosted image URLs](#pr4-change-placeholders-to-hosted-image-urls)
5. [Automate db seed task with Knex](#pr5-automate-db-seed-task-with-knex)
6. [Setup & write tests, add CI & coverage](#pr6-setup--write-tests-add-ci--coverage)
7. [Complete backend: routes, db, tests](#pr7-complete-backend-routes-db-tests)
8. [Complete Filter Menu, Filter Info portions of React client](#pr8-complete-filter-menu-filter-info-portions-of-react-client)
    - [Create component scaffold](#create-component-scaffold)
    - [Filter menu with dropdowns](#filter-menu-with-dropdowns)
        - [Playtime filter menu](#heavy_check_mark-playtime-filter-menu)
    - [Filter Tags](#filter-tags)
    - [Set up React-Testing-Library, write tests](#set-up-react-testing-library-write-tests)
9. [Main Reviews Menu](#main-reviews-menu)
10. [Recent Reviews Menu](#recent-reviews-menu)
11. [Deployment](#deployment)
12. [Optimizations & Automation](#optimizations-&-automation)
13. [Google Page Speeds](#google-page-speeds)
    - [Steam Reviews](#steam-reviews)
    - [Steam Game Description](#steam-game-description)
    - [Steam Proxy](#steam-proxy)

## [PR1](https://github.com/FEC-Bell/steam-reviews/pull/1): Set up developer environment and dependencies

Decided on webpack-dev-server for its hot reload feature, which will come in handy when coding the frontend. Also good for its proxy server feature for redirecting requests from the frontend to the backend localhost.

## [PR2](https://github.com/FEC-Bell/steam-reviews/pull/2): Generate db seed data

### Set up PostgreSQL
Decided to install PostgreSQL via WSL instead of through Windows, thus had to re-familiarize self with WSL again. Upgraded Ubuntu to v.20.04 & started installing Postgres. These are the steps to install on Linux:

1. Create the file repository configuration:
`sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'`

2. Import the repository signing key:
`wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`

3. Update the package lists:
`sudo apt-get update`

4. Install the latest version of PostgreSQL. If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
`sudo apt-get install postgresql`

Ran into problems in step 2:
`gpg: can't connect to the agent: IPC connect call failed`
Apparently Ubuntu 20.04 is [incompatible](https://discourse.ubuntu.com/t/ubuntu-20-04-and-wsl-1/15291) with WSL1.

[Upgrading to WSL2](https://devblogs.microsoft.com/commandline/wsl2-will-be-generally-available-in-windows-10-version-2004/) (available in beta since March 2020) requires Win10 v2004 at minimum, which one must manually update to, since v2004 doesn't seem to be a general release as of June 2020.

Upgraded Win10 to v2004. This triggered an automatic system backup, taking up most of the remainder of the space on my SSD. (Time to upgrade storage size?) Then, installed WSL2. Problems solved, and PostgreSQL successfully installed.

### Seeding

#### Write SQL seed file

Decided to write the seed file in raw SQL for practice. Had to familiarize self with slight differences in Postgres syntax & command constraints, such as:

1. Connecting via psql CLI without the `-c` flag connects you to the default postgres system DB. Must use `-c` or `\c` from within psql to connect to a certain DB.

2. Small datatype differences. ~~Based on [this SO thread](https://stackoverflow.com/questions/55300370/postgresql-serial-vs-identity), I decided to use the `GENERATED ALWAYS AS IDENTITY` declaration for my primary key fields.~~ *(Note from PR 7: `GENERATED ALWAYS AS IDENTITY` was triggering an error in Travis CI builds, thus switched to `SERIAL`.)*

I didn't want to manually type each row using the `INSERT INTO table_name` command, so needed to find a solution that would allow piping large amounts of generated data into either the raw SQL file or the DB itself. Enter `COPY`:

>COPY moves data between PostgreSQL tables and standard file-system files.

*Via [Postgres 12 docs](https://www.postgresql.org/docs/current/sql-copy.html)*

Most importantly, `COPY` supports copying from files with any format, **including .csv**. CSV would be good for storing large amounts of generated data, possibly in the millions (when SDC rolls around), so it's ideal for data storage. For example, [29 mil rows = ~600MB](https://stackoverflow.com/questions/44362395/how-to-read-huge-csv-file-with-29-million-rows-of-data-using-net). Decided on writing `COPY FROM` statements after my table schema declarations in the SQL file, and after inserting data for the `badges` table, which was only and would only ever be 16 rows.

#### Generate .CSV data

No issues arose.

#### Pipe generated .csv files into DB

Ran into an issue with the `COPY FROM` statement:
```
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
FROM './data-gen/csv-seeds/users.csv'
DELIMITER ','
CSV HEADER;
```
Apparently it's best practice to provide absolute file paths to `COPY FROM`. Relative paths work, but the server is running in a different root than the client, typically `/var/lib/postgresql` instead of `/mnt/c/path/to/my/local/repo`. Thus relative pathing would not find my generated file, which is located in my local repo.

Resolved issue by using absolute path. However, this exposes my local file paths, and furthermore can't be used as a seed file by others without changing the absolute path. TODO: use Knex's migrate/seed functionality to get around this.

## [PR3](https://github.com/FEC-Bell/steam-reviews/pull/3): Ensure not all users have a badge id in generated data

This was a hotfix. I didn't exactly follow GH flow for this, since it was a one-line change & my time difference would have made the process a **lot** longer than it needed to be.

## [PR4](https://github.com/FEC-Bell/steam-reviews/pull/4): Change placeholders to hosted image URLs

Before this PR, I was using placeholder images for my seed data from [picsum.photos](https://picsum.photos/). Per GLearn specs:

>If you are building a media-centric widget, you must transfer original media to and serve those media files from either S3 or Cloudfront. Media is defined as: photos or songs. For movies, it's ok to serve content from the original source such as YouTube or Vimeo.

Set up Cloudinary account, scraped the placeholder images I had from the relevant places ([Site for badge icons](https://steamtreasurehunt.fandom.com/wiki/Badges), [API for cute user avatars](http://avatars.adorable.io/)), uploaded to Cloudinary, used [Cloudinary admin API](http://avatars.adorable.io/) to acquire all the hosted URLs in one go, and updated seeding scripts & CSV files to reflect changes.

## [PR5](https://github.com/FEC-Bell/steam-reviews/pull/5): Automate db seed task with Knex

Currently, seeding has to be done manually by piping seed.sql into Postgres via CLI (psql), and the machine-specific file paths in seed.sql meant that whoever cloned the repo would have to manually change the path, which wasn't ideal.

Knex provides a query building interface, but I didn’t want to rewrite the content I’d already written in seed.sql. Thus I'm using Knex's [raw SQL interface](http://knexjs.org/#Raw-Queries) in conjunction with its [migrate & seed CLI tools](http://knexjs.org/#Migrations-CLI).

Seed.sql contains `COPY FROM` functionality, which Knex doesn't natively have an interface for. [Found](https://github.com/knex/knex/issues/756) that I could copy CSV files into the DB directly with the `pg` package, while using Knex's connection pooling for efficiency. Migrate & seed CLI commands now work as expected.

When other users run my seed script, if Knex isn't installed globally, it'll result in an error. Thus I had to choose between two options for the seed script, currently `"seed": knex migrate:rollback && knex migrate:latest && knex seed:run`:

Options:
1. Preface each of the 3 subcommands with `npx`
2. Install Knex globally before and uninstall globally after (in case user doesn't want global install)

Speed tests of each command showed these results:

**Global**:

![Global Knex Speed](./assets/global-knex-speed.png)

**Npx**:

![Npx Knex Speed](./assets/npx-knex-speed.png)

Thus decided on global install method. Seed script: `"seed": npm i -g knex && knex migrate:rollback && knex migrate:latest && knex seed:run && npm un -g knex`

## [PR6](https://github.com/FEC-Bell/steam-reviews/pull/6): Setup & write tests, add CI & coverage

Installed Cypress and gave it a *test* run, but it was really slow, since each tests opens a headless browser. Makes sense, since Cypress is meant for E2E tests but just happens to support unit/integration testing. Settled on Jest for its nice assertion syntax and compatibility with React-Testing-Library, which I'll be using later to test DOM.

How does one mock the file system for unit testing? Jest has a `.mockImplementation` method, which I'll combine with a virtual file system (really just an object) for checking that the correct contents were written to the file system. Resulted in [this unit test](https://github.com/FEC-Bell/steam-reviews/pull/6/files#diff-196c73e724290f6e7eca5d66a215c127R21) which was a good learning moment for me about mocking.

Excluded some files from Jest test coverage, since they're internal scripts.

**Coverage**:

![Unit Test Coverage - PR6](./assets/unit-test-coverage-pr6.png)

Set a global coverage threshold of 80% in accordance with best practice minimum (said in lecture maybe?)

Set up continuous integration with [Travis CI](https://travis-ci.org/) and coverage reporting with [Coveralls](https://coveralls.io/). First time using CI and coverage reporters, so another good learning moment for me. The .travis.yml script setup was surprisingly simple.

## [PR7](https://github.com/FEC-Bell/steam-reviews/pull/7): Complete backend: routes, db, tests

Wrote DB methods to get review data for a valid `req.params.gameid` from DB. The returned review data had to have user and badge data nested in it, but pg's query interface doesn't support nesting.

So I had to make two separate calls per reviews returned to the users and badges table respectively and in that order, in order to get the complete data shape my tests were expecting. I knew that JS's native `.forEach` didn't handle async callbacks well, and this task would definitely require async, so I wrote my own asyncForEach helper for this purpose.

Base methods were easy, but then had to support `URLSearchParams` querying according to contract set forth in App & Service Plan.

Had to write utils to filter out invalid `req.query` key-value pairs, then build a raw SQL string from remaininig `req.query` pairs to query the DB via Knex. This being done successfully, I had to check if the req.query had a display value of summary or didn't have a display value, and send back a response with two sets of data, sorted according to most helpful and most recent respectively, if that was the case.

Got kind of sidetracked in creating a more feature-complete command line tool for my data generation so I could use it to generate exactly how much test data I wanted. In hindsight, kind of superfluous. TODO: I'll need to create documentation for this.

**First issue I ran into**: integration testing the DB/routes. Originally I had db.test.js and routes.test.js as separate files. Jest being a parallel test runner, this became problematic when these two files referenced the same NODE_ENV=test database while each script had its own migration & seed hooks.

**Solution for this issue**: Considered extending the default jest test runner into a custom file for serial running, and using the projects option in jest.config.js to specify that only my integration tests be run serially while my unit tests be run in parallel. However, this seemed like too much hassle. I ended up removing the `.test.` part from db and routes tests and bringing them into an `index.test.js` file, then calling them synchronously, thus ensuring they run in serial.

**Second issue I ran into**: The newly created `index.test.js` integration test file was hanging for 7+ seconds instead of completing. The error:

`A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --runInBand --detectOpenHandles to find leaks.`

**Solution for this issue**: I used the `--detectOpenHandles` flag, to find that, after bringing my server in and using Supertest to test it, `app.listen` was the hanging process. It seems that the server wasn't shutting down after tests. After trawling through the entirety of [this GitHub issues thread](https://github.com/visionmedia/supertest/issues/520) without any luck, I looked in Express's documentation to find the following line:

>The app.listen() method returns an http.Server object...

The server object has a `.close` method luckily, so I just imported it into my test and called `.close` on it directly in the `afterAll()` hook.

**Third issue I ran into**: After forgetting to include postgresql as a service, including it, and increasing the test timeout of my Jest tests (integration test takes ~7.5 seconds, so set --testTimeout=10000)... During the Travis CI build of my now-completed PR, I ran into a syntax issue in the `GENERATED ALWAYS AS IDENTITY` lines of my Knex migrate scripts.

**Solution for this issue**: Changed `GENERATED ALWAYS AS IDENTITY` to `SERIAL` with the help of Help Desk, which fixed the problem.

**Finally, current test and coverage**:

![Test Coverage PR7](./assets/test-coverage-pr7.PNG)

Biggest PR & journal entry yet! Next up: Complete frontend client.


## [PR8](https://github.com/FEC-Bell/steam-reviews/pull/8): Complete Filter Menu, Filter Info portions of React client

### Create component scaffold

No issues arose.

### Filter menu with dropdowns

Radio input checked attribute in DOM never changes after initial render, despite the DOM's checked property updating to match state. Known issue, React engineers agreed on a workaround for testing in [this GH thread](https://github.com/patternfly/patternfly-react/issues/2879), which is to set the DOM element property according to checked state even if the attribute on the HTML tag doesn't update. I'll be keeping this in mind during DOM testing.

Created modular UI components which accept props I define: radio input with label, hover tooltip, flexbox div. Used keyframes for animating (fade in, fade out) the tooltip on hover.

Something good to know: if you set `position: relative` on the parent element, setting `position: absolute` on the child element and changing `top`, `left`, `bottom`, or `right` values will position the child element relative to the parent element. If `position: relative` is omitted, I believe `position: absolute` will calculate based off the nearest parent `display: block` container.

##### :heavy_check_mark: Playtime filter menu
The fifth filter menu in the filter bar below graphs is a bit of a doozy, and it looks like I'll have to implement it from scratch because no external libraries for this sort of thing are allowed: (**NOTE from present self**: or so I thought at the time, but in hindsight, the TMs said I **could have** used a library instead of implementing it myself. Big oof.)

![Steam Playtime Filter Menu](./assets/playtime-filter-menu.png)

Having to implement from scratch is an issue, because:

1. HTML `<input type="range" />` does NOT support multiple thumbs, otherwise implementing this would be trivial.

2. Implementing this without the complexities of React state & `useEffect` interactions should also be trivial. (i.e. implementing with bare-bones DOM methods, event listeners, and CSS, as was done with ButtonPocalypse)

*Implentation time taken: 1 day*
*[End Result](https://github.com/FEC-Bell/steam-reviews/blob/react-client/client/src/FilterMenu/DoubleEndedSlider.js)*

After implementing the slider, here are the actual issues that arose:

1. Is there a way to adapt HTML input to display 2 thumbs? That would make things so much easier. [As it turns out](https://github.com/whatwg/html/issues/1520), there IS a multiple attribute for `<input type=range>`, it's just *not supported* by all major browsers -- oof.
--
2. Arriving at the conclusion that I'll have to implement a fake slider that syncs to 2 invisible inputs under it, and also responds to state and async updates to state. The async state changes in my `useEffect` hooks in particular caused me some trouble, such as the `left%` and `width%` of my slider range having a state of its own, instead of taking its left & width directly from the `sliderMinMaxVals` state. I learned the value of `useEffect` hooks so much more during this exercise.
--
3. [Because of the way that event bubbling works](https://javascript.info/bubbling-and-capturing), Chrome was [firing an event](https://stackoverflow.com/questions/18449802/chrome-mouse-drag-and-drop-on-overlapping-divs-changes-cursor-to-not-allowed) on drag that selected ALL divs at my current dragging point. This was a problem because my div positioning was always in a place where multiple divs were on top of each other. Enabling `user-select: none` in CSS resolved this.
--
4. My positioning was all messed up. It's hard to explain since it was a really early problem in the slider implementation, but it was something to the effect of my slider range and slider thumbs not being constrained to their expected positions. This was fixed by constraining percent calculations (for slider range width) between 0 and max, or min and 100, depending on which value.
--
5. My `useEffect` hook always ensured that the last thumb clicked had the higher z-index. This became a problem when an external source (read: radio input in parent component was clicked) changed the slider values. In this case, no thumb was clicked, so the z-index for both thumbs remained at 3. Thus if the user clicked the "Over 100 hours" radio option, they would not be able to change the slider values afterward. This was solved by modifying the `useEffect` hook for `checkedOption` to call `setLastDraggedThumbId` if the user clicks "Over 100 hours".

#### Filter Tags

Having implemented all my state within FilterMenu, I had to lift my state up to the parent of FilterMenu AND FilterInfo, ReviewsModule, in order to complete this component.

#### Set up React-Testing-Library, write tests

Good testing library in my opinion. The idea of "testing user behavior instead of implementation" really does allow me to have more confidence in my tests. However, I probably should be doing this before writing all my components for this PR to facilitate TDD. Will definitely switch the order next time.

Issue that arose during testing:

1. I use `Element.prototype.getBoundingClientRect()` in my DoubleEndedSlider for positional accuracy. However, this was impossible to test with Jest's `jsdom` environment, which is only a virtual DOM and does not simulate component positioning. These were the results that came up when I tried to test position with `.getBoundingClientRect()` in one of my tests:

![getBoundingClientRect Method Issue](./assets/getBoundingClientRect-jsdom-issue.png)

Therefore I'll have to use E2E to actually test the behavior of DoubleEndedSlider. This is a TODO for the future, possibly a stretch goal.

**:heavy_check_mark: Final test coverage**:

![PR8 Test Coverage Report](./assets/pr8-test-coverage.png)

**:heavy_check_mark: [Video of functionality thus far](https://www.youtube.com/watch?v=aTD4YtIZhLg)**

With this completed, it's safe to make a PR now. I am falling into the antipattern of making big PRs due to the time difference between me and my team members (-14 to -17 hrs). Most of the time my code is blocking to future code, so to make a PR and have to wait 10-12 or often more hours for a response feels really clunky. I will try to avoid this antipattern with my future PRs.

## Main Reviews Menu

The main reviews menu (left reviews column) was mainly straightforward. I designed the UI, then hooked up the state to my filter menu. I'd stubbed out a useEffect hook previously that would fetch a new set of data on an active filter change in the filter menu, so the auto-updating of the menu on filter change was essentially completed before I'd even touched it. Nice job, past me! Final result, looking pretty pixel-perfect:

![Main Reviews Menu](./assets/main-reviews.PNG)

## Recent Reviews Menu

The recent reviews menu (right revies column, only appears when filter option for Display As is set to 'summary') was completed in much the same way as main reviews. Final result:

![Recent Reviews Menu](./assets/recent-reviews.PNG)

## Deployment

Deployment - a completely new beast for me. I'd previously only deployed via Heroku, so looks like I'll have to learn everything on the fly.

I decided to deploy with Docker, since containerization seems to be revolutionizing this aspect of the industry, and I thought it would be useful to learn.

After watching a few intro videos and reading through Docker's Getting Started guides, had a better understanding. Docker seems to be super useful, and worth learning.

Setting up Docker by itself seemed simple enough. Steps taken:
1. Install as CLI tool
2. Set up Dockerfile in project root dir:
    ```
    FROM node:12
    WORKDIR /usr/src/app

    ENV PORT=3001
    ENV NODE_ENV=development
    ENV PGDB_URI=postgresql://postgres:postgres@reviews_db:5432/steam_reviews

    COPY package*.json ./
    RUN npm install
    COPY . .
    EXPOSE 3001
    RUN npm run build
    CMD npm start
    ```

    Pretty handy to pass environment variables to the node process in this fashion. I decided to set NODE_ENV as development to also get needed devDependencies such as babel or webpack. It's unclear whether running a deployment in development mode has any benefits or downsides.

3. Build image via CLI commands:
    ```
    docker build -t NAME && docker run -d -p PORT --name NAME IMAGE-NAME
    ```

However, I had a PostgreSQL database that also needed to run at the same time as Docker. PostgreSQL conveniently has their own set of images on DockerHub which may be used for this purpose, though setting up two containers that were on the same network with Docker alone is a bit cumbersome.

**Solution: docker-compose**. [Final docker-compose.yml file](../docker-compose.yml)

Some problems I encountered & solved while setting up docker-compose:
1. How to set up username and password which could be passed to service container.

    *Solution*: Allow development mode knex configs in service to accept a URI string instead of individual username and password, and pass the correct PGDB_URI in during container build time.

    ```
    ENV PGDB_URI=postgresql://postgres:postgres@reviews_db:5432/
    ```

    The `reviews_db` alias is the one given to my PostgreSQL container, and it may be passed in to env vars dynamically like above.

2. Ensuring service doesn't start before the PostgreSQL container is up and running

    *Solution*: Took a bit of Googling, but a shell script which waits for port availability took care of this bit. The docker-compose command that solved it:

    ```
    ./scripts/wait-for.sh reviews_db:5432 -- sh -c "npm run seed && exec node server/index.js"
    ```

    wait-for.sh listens on port 5432 of the network in a loop until it can ping the port. Then, two shell cmds are executed: seed, and start the server. `exec` had to be used in this case, since `npm run seed` was finishing with exit code 0, resulting in the container shutting down before the server could start (might have had to do with my restart option in the .yml being `unless-stopped` instead of `on-failure`).

    `Exec` replaces the current program in the current process, so the node process never exits, just gets replaced by `node/server.js` on seed completion. Very handy, and worth remembering for the future.

After all the docker stuff was successfully implemented and working on my local machine, it was a simple matter of `scp`-ing the needed files into my EC2 instance, then running `docker-compose up --build` remotely via SSH.

Of course, I had to set up my instance, and install the needed software, but that was easy enough:

1. Specify allowed TCP/IP addresses and ports (3001 in my case), along with allowed SSH IP connections
2. Run these commands via CLI:

    ```
    chmod 400 yourkeyname.pem

    sudo scp -r -i PEM-KEY MY-FILE-DIR-LIST ec2-user@IP-ADDR:~/steam-reviews/

    sudo ssh -i PEM-KEY ec2-user@IP-ADDR

    sudo yum update

    sudo yum install docker

    sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose

    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    sudo service docker start

    sudo docker-compose up --build -d
    ```

    Keep in mind that all commands must be invoked with `sudo` on the EC2 instance server, since the user is logged in as `ec2-user`, which doesn't have root privileges by default.

## Optimizations & Automation

There were a few optimizations I wanted to make after successful deployment:

1. Automate deployment. I initially looked into Continuous Delivery via AWS CodeDeploy, but fell down a rabbit hole that didn't result in any kind of successful result. After going back to the drawing board, I settled on a simple shell script, which I would run whenever I wanted to update my deployed assets. Here, I learned that one can invoke remote commands when connecting via SSH, like so:

    ```
    ssh -i PEM-KEY ec2-user@IP-ADDR YOUR-COMMAND-HERE
    ```

    Thus I was able to run all my docker commands remotely. The script was also very fast - probably should have gone with it first, it being the simpler option, instead of jumping down the AWS rabbit hole.

2. Fix CSS errors. I was running my services in webpack production mode to minify the delivered bundles, but that was resulting in some CSS class conflicts between the multiple instances of styled-components. This was fixed by with the concept of [Block Element Modifiers](http://getbem.com/introduction/): prepending a root id tag to all CSS. This was done in styled-components like so:

    Parent component (in my case `ReviewsModule.js`):
    ```
    const theme = {
      rootId: 'reviews'
    };
    ...
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}/>
        <OtherChildComponents/>
      </React.Fragment>
    )
    ```

    Child components:
    ```
    const styledDiv = styled.div`
      #${props => props.theme.rootId} & {
        /* styles here */
      }
    `
    ```

## Google Page Speeds

### Steam Reviews:

Steam reviews was actually a pretty big module. It had ~870 DOM elements, as seen below. While the number of DOM elements wasn't ideal, the initial page speed was not bad. I'm not willing to reduce the number of DOM elements, so I'm going to improve page speed in other ways.

Initial speed:

![Steam Reviews Initial Page Speed](./assets/initial-google-page-speed.PNG)

Initial bundle size (production minified):

![Initial Steam Reviews bundle.js size](./assets/initial-prod-bundle-size.PNG)

Initial bundle size distributions (webpack-bundle-analyzer map):

![Initial Steam Reviews bundle.js size distributions](./assets/initial-prod-bundle-mapping.PNG)

Final speed:

![Final Google Page Speed](./assets/final-google-page-speed.PNG)

Notably, mobile speed increased from a score of 19 to a score of 65, though my site isn't mobile-friendly yet (and probably won't be, with the short time remaining).

#### Optimizations made:
I could immediately see two problems: served bundle size was too big, and vendor packages were making up a large portion of that. To solve these problems, I did the following things:

- Simple code splitting with splitChunksPlugin: separate React and ReactDom into a `vendor.bundle.js` bundle. (Used HtmlWebpackPlugin to dynamically inject the scripts for these two bundles at compile time)

    `webpack.config.js`
    ```
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/'
    },
    ...
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    }
    ```

- Compress static files via gzip on server, to reduce file size in network requests. This requires setting the correct headers in my server responses. Final bundle sizes, compressed:

![gzip-compressed-bundle-sizes](./assets/static-bundle-compression-size.PNG)

991 kB became 40kB + 30 kB, a marked improvement for the network file size.

- Changed style.css to be injected into html at webpack build time, removing the extra network request to get style.css. (style.css is for localized global styling, which doesn't get sent when proxies request this service. styled-components GlobalStyle, which I had before, was being sent with service requests, thus resulting potentially conflicting global styles and unnecessary extra code)

- Remove inline devtools source mapping for prod mode, shaving off about 50% from the previous minified bundle size.

#### Other improvements that could be made:
- Serve images in JPG formats for faster loading

Tabling these improvments for later, if I have time. They're not essential, given the optimized final page speed.


### Steam Game Description:

Steam Game Description's initial Google Page Speed score was around 93 or so (unfortunately forgot to get a screenshot), but I decided to make the same improvements to it as Steam Reviews, since the minified webpack bundle was still around ~840kB.

Initial prod bundle mapping:

![Game description bundle mapping](./assets/game-desc-bundle-mapping.PNG)

Final page speed (desktop):

![Game description final Google page speed for desktop](./assets/game-desc-final-page-speed.PNG)

Final page speed (mobile - although this wasn't required, the mobile speed ended up being fairly optimized as well):

![Game description final Google page speed for mobile](./assets/game-desc-mobile-page-speed.PNG)

Minified, gzipped bundle sizes:

![Minified bundle sizes](./assets/game-desc-minified-gzip-bundle-sizes.PNG)

#### Optimizations made:
Same as Steam Reviews' optimizations. Game description was a much smaller module, with an initial bundle size of around 840Kb instead of reviews' ~1Mb (both minified).

#### Other improvements that could be made:
As seen from the bundle mapping, styled-components is also fairly large even when bundled. It might be worth it to code split some other vendor libraries including styled-components.

### Steam Proxy:

There's only so many optimizations I can make to the proxy, since there are multiple services involved that are out of my control.

Initial speed:

![Proxy server initial speed](./assets/steam-proxy-initial-speed.PNG)

Initial bundle mapping:

![Proxy server initial bundle mapping](./assets/steam-proxy-bundle-mapping.PNG)

Speed (as of July 27th, with 2 services offline & most services not optimized):

![Proxy server final speed](./assets/steam-proxy-final-speed.PNG)

#### Optimizations made:
- Webpack development mode was used previously, partially resulting in that abysmal load speed. I switched to production mode, which required implementing BEM on my styled-component styles in the proxy as well.

- Setting scripts from external sites to 'defer' to allow them to load at their own pace without being blocking.

- Code splitting, same as reviews and game description optimizations (moving React/ReactDOM out into a vendor.bundle.js)

- gzip compression on the server, similar to reviews & game description. Final bundle sizes for proxy styling content are similar to reviews & game desc as well.

- Removing source maps, similar to reviews & game description

#### Other improvements that could be made:
- Questionable: removing duplicate instances of ReactDOM and React. This is probably not best practice, as the services will not be able to run independently. For my services, perhaps there's a way to conditionally require vendor scripts, only if React or ReactDOM do not exist as accessible variables.

- Uncertain what to do next, due to the reason I mentioned at the start of this proxy section. I will hold off on further optimizations (since there are definitely some things I can do) until all individual services are online (as of July 27th, 2 of 6 services are not reachable) and optimized (as of July 27th, 2 of 6 services have been reported within our team to be optimized).
