const puppeteer = require('puppeteer');
const fs = require('fs');
const { execSync } = require('child_process');
const axios = require('axios');
const path = require('path');

// Hauptlogik des Release-Managers als exportierte Funktion
module.exports = async function (commitType) {
  let config;

  try {
    const configPath = path.resolve(process.cwd(), 'release.config.js');
    config = require(configPath);
  } catch (error) {
    console.error('Fehler: Die Konfigurationsdatei release.config.js konnte nicht gefunden oder geladen werden.');
    process.exit(1);
  }

  const { projectWebsite, gitlabToken, gitlabRepoUrl } = config;

  if (!projectWebsite || !gitlabToken || !gitlabRepoUrl) {
    console.error('Fehler: projectWebsite, gitlabToken und gitlabRepoUrl müssen in release.config.js gesetzt sein.');
    process.exit(1);
  }

  const dummyFeatures = ['Neue Benutzeroberfläche', 'Verbesserte Sicherheit', 'Erhöhte Performance'];
  const dummyBugfixes = ['Fehler bei der Anmeldung behoben', 'Datenvalidierungsfehler behoben'];

  try {
    // 1. Versionsnummer erhöhen (basierend auf dem Commit-Typ)
    const newVersion = updateVersion(commitType);

    // 2. Screenshot erstellen
    const screenshotPath = `screenshot_v${newVersion}.png`;
    await createScreenshot(projectWebsite, screenshotPath);

    // 3. Release Notes erstellen
    const releaseNotesFile = generateReleaseNotes(newVersion, dummyFeatures, dummyBugfixes, screenshotPath);

    // 4. Commit und Push in Git
    commitAndPush(newVersion, releaseNotesFile);

    // 5. Release in GitLab veröffentlichen
    await publishReleaseInGitLab(newVersion, releaseNotesFile, screenshotPath);

    console.log('Release erfolgreich erstellt und in GitLab veröffentlicht!');
  } catch (error) {
    console.error('Fehler bei der Erstellung des Releases:', error);
  }
};

// Funktion zur Versionsnummern-Erhöhung
function updateVersion(commitType) {
  let versionType;

  if (commitType === 'feat') {
    versionType = 'major';
  } else if (commitType === 'fix' || commitType === 'func') {
    versionType = 'patch';
  } else {
    console.error(`Commit-Typ "${commitType}" nicht unterstützt.`);
    process.exit(1);
  }

  const newVersion = execSync(`npm version ${versionType}`).toString().trim();
  console.log(`Version erhöht: ${newVersion}`);
  return newVersion.replace('v', '');
}

// Screenshot-Funktion
async function createScreenshot(url, screenshotPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: screenshotPath });
  await browser.close();
}

// Release Notes erstellen
function generateReleaseNotes(version, features, bugfixes, screenshotPath) {
  const releaseNotes = `
## Version ${version}

### Features
${features.length > 0 ? features.map(f => `- ${f}`).join('\n') : 'Keine neuen Features'}

### Bugfixes
${bugfixes.length > 0 ? bugfixes.map(b => `- ${b}`).join('\n') : 'Keine Bugfixes'}

![Screenshot zur Version ${version}](${screenshotPath})
  `;
  
  const releaseNotesFile = `release_notes_v${version}.md`;
  fs.writeFileSync(releaseNotesFile, releaseNotes);
  return releaseNotesFile;
}

// Commit und Push
function commitAndPush(version, releaseNotesFile) {
  execSync('git add .');
  execSync(`git commit -m "chore(release): Version ${version}"`);
  execSync('git push');
}

// Release in GitLab veröffentlichen
async function publishReleaseInGitLab(version, releaseNotesFile, screenshotPath) {
  const releaseNotes = fs.readFileSync(releaseNotesFile, 'utf8');
  
  const data = {
    name: `Version ${version}`,
    tag_name: `v${version}`,
    description: releaseNotes
  };

  const config = {
    headers: {
      'PRIVATE-TOKEN': gitlabToken,
    }
  };

  try {
    const response = await axios.post(`${gitlabRepoUrl}/releases`, data, config);
  } catch (error) {
    console.error('Fehler beim Veröffentlichen des Releases in GitLab:', error.response?.data || error.message);
  }
}