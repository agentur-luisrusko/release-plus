# Release Manager

Ein einfaches CLI-Tool zum Automatisieren von Releases und Release-Notizen mit Screenshots für GitLab-Repositorys.

## Features

- Automatische Versionsverwaltung basierend auf Commit-Typen.
- Erstellung von Screenshots der Projekt-Webseite für jede neue Hauptversion.
- Erstellung von Release-Notizen und Veröffentlichung auf GitLab.
- Integration in Projekte durch eine einfache Konfigurationsdatei.

## Installation

Um `release-manager` in deinem Projekt zu installieren, führe folgenden Befehl aus:

`npm install release-manager --save-dev`

## Konfiguration

Erstelle eine release.config.js-Datei im Hauptverzeichnis deines Projekts. Diese Datei enthält die Konfigurationsdetails für das Tool. Hier ein Beispiel für den Inhalt:

module.exports = {
  projectWebsite: 'https://dein-projekt-webseite.com',
  gitlabToken: 'dein_gitlab_token',
  gitlabRepoUrl: 'https://gitlab.com/api/v4/projects/<project_id>'
};

projectWebsite: Die URL der Webseite deines Projekts, von der ein Screenshot erstellt werden soll.
gitlabToken: Dein GitLab Personal Access Token zur Authentifizierung bei der GitLab API.
gitlabRepoUrl: Die API-URL deines GitLab-Projekts. Ersetze <project_id> durch die tatsächliche Projekt-ID.

## Unterstützte Commit-Typen

Der Release Manager unterstützt die folgenden Commit-Typen:

feat: Erhöht die Hauptversionsnummer (Major Version). Wird verwendet, wenn neue, bedeutende Funktionen oder Änderungen eingeführt werden.
fix: Erhöht die Patch-Version. Wird verwendet, wenn Fehler (Bugs) behoben werden.
func: Erhöht die Patch-Version. Wird verwendet, um kleinere, neue Funktionen oder Verbesserungen hinzuzufügen.

Beispiel für Commit-Nachricht:

Für eine neue Hauptversion
`git commit -m "feat: Einführung einer neuen Benutzeroberfläche"`

Für einen Bugfix
`git commit -m "fix: Behebung des Anmeldefehlers"`

Für neue Funktionen
`git commit -m "func: Hinzufügen einer neuen API-Endpunkt"`

## Nutzung

Verwende den folgenden Befehl, um eine neue Version basierend auf dem Commit-Typ zu erstellen:

`npx release-manager release <commitType>`

Ersetze <commitType> durch einen der unterstützten Typen (feat, fix, func).

Beispiele

Um eine neue Hauptversion (feat) zu erstellen:
`npx release-manager release feat`

Um einen Bugfix (fix) oder eine neue Funktion (func) hinzuzufügen:
`npx release-manager release fix`
`npx release-manager release func`

## CLI-Skripte

Du kannst das CLI-Skript auch in den scripts-Abschnitt deiner package.json einfügen, um es einfacher auszuführen:

{
  "scripts": {
    "release": "release-manager release"
  }
}

Führe dann das Release-Skript mit folgendem Befehl aus:
`npm run release <commitType>`

## Autor

Luis Rusko