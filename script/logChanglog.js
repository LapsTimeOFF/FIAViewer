var conventionalChangelog = require('conventional-changelog');

const config = require('conventional-changelog-metahub');
conventionalChangelog({config})
  .pipe(process.stdout); // or any writable stream