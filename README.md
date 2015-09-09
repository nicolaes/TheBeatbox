# The Beatbox

Demo music player with persistent playlist.

## Installation

### Requirements

- Chrome browser
- Node.JS with NPM
- Compass (http://compass-style.org/install/)
- Java (http://www.oracle.com/technetwork/java/javase/downloads/index.html)

### Dependencies

```
npm install
bower install
```

### Run with `gulp serve`

### Test with `gulp test`


## Technical description

The app includes three primary directives and a component directive:

- `songs` - Displays all songs in the database (data/db.json)
  - `song-rating` - Mock rating widget for each song (between 0 and 5)
- `playlist` - Main playlist, persisted on the JSON server
- `play-widget` - Handles the song currently playing

The directives are supported by underlying services and one helper:

- `songs` - Handles interaction with the song DB (read-only)
- `playlist` - CRUD operations with the playlist and caching
- `play-widget-helper` - Method storage for instance-independent PlayWidget functions

The server architecture is standard:

- `gulp` for running tasks
- Gulp plugins for asset management and dev server; most important are:
  - `babel` for ES6 compilation
  - `gulp-sass` for Compass compilation
  - `webpack` for JS bundle handling
- `json-server` as a RESTful server to handle the JSON database
- `jasmine` as the testing framework
- `protractor` for E2E testing
- `karma` for running the tests
  - `phantomjs` to run unit tests
  - `karma-chrome-launcher` to run E2E tests



