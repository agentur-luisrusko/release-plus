#!/usr/bin/env node

const { program } = require('commander');
const releaseManager = require('../lib/index');

// CLI-Befehl zur Versionserhöhung und Release
program
  .command('release <commitType>')
  .description('Erhöht die Version, erstellt einen Screenshot und veröffentlicht Release Notes im GitLab')
  .action(async (commitType) => {
    try {
      await releaseManager(commitType);
    } catch (error) {
      console.error('Fehler beim Ausführen des Release-Managers:', error);
    }
  });

program.parse(process.argv);