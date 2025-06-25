🥅 Bolzer – Bundesliga-Tippspiel
Projektübersicht

Bolzer ist eine Web-Anwendung (Tech‑Stack: Vite, JavaScript, Tailwind CSS, Firebase), mit der Nutzer:innen auf alle Bundesligaspieltage tippen können.
Nach jedem Spieltag werden die abgegebenen Tipps durch ein Punktesystem (2, 3, 4 Punkte je nach Treffer) bewertet und in der Rangliste angezeigt.

    Automatisierter Datenimport:

        Spieltage, Spielpaarungen und aktuelle Bundesligatabelle werden per GitHub Actions (Cronjob) aus einer externen API ausgelesen und in Firestore geschrieben.

        Zielt darauf ab, API-Aufrufe in der App zu minimieren – Daten werden in Firestore zwischengespeichert und durch Clients abgerufen.

    User-Tipps: Alle Tipp‑Abgaben der Nutzer:innen werden in Firestore gespeichert, abgefragt im Frontend und nach Spieltag mit Punkten versehen.

Inhaltsverzeichnis

    Architektur

    Datenmodell

    Technische Komponenten

    Workflows & Cronjob

    Bewertungssystem

    Front-End / UI

    Setup / Deployment

    Entwickler:innen-Hinweise

    Roadmap & To‑Dos

🏗️ Architektur

    Frontend: Vite + JS + Tailwind CSS

    Backend: Firebase Authentication + Firestore Database

    Automatisierung: GitHub Actions als Cronjob für Datenimport (Spieltag, Spiele, Tabelle)

Datenfluss

[ Externe Bundesliga-API ]
            ↓ (API call via GH Action)
     GitHub Action → Firestore
            ↓
     Bolzer Frontend ← Firestore (Spiele, Tabelle, Tipps, Punkte)

📦 Datenmodell

Firestore Collections & Dokumente

    matchdays

        Dokument-ID = Spieltag-Nummer (z. B. "1", "2", …)

        Felder: date, matches: [ { homeTeam, awayTeam, kickoff, status, score } ]

    table

        Einzelnes Dokument (z. B. "current")

        Feld: standings: [ { team, played, won, draw, lost, points, goalsFor, goalsAgainst } ]

    tips

        Unterdokument-Struktur: /tips/{userId}/{matchdayId}

        Felder: Tipps pro Spiel (z. B. { matchId1: { home, away }, matchId2: … })

    scores

        Nach Bewertung erstellt: /scores/{userId}/{matchdayId}

        Felder: points: number, breakdown: [ { matchId, pointsAwarded } ]

🔧 Technische Komponenten
Bereich	Technologie	Beschreibung
UI-Bausteine	Vite + Tailwind CSS	Schnelle Entwicklung & Styles
Auth & User	Firebase Auth	Anmeldung mit E‑Mail oder Social Logins
Datenpersistenz	Firestore	Echtzeit-Dokumentenspeicherung
Cronjob	GitHub Actions	Automatischer Datenabruf per Scheduler
Externe API	Bundesliga-Service	Liefert Spieltage, Begegnungen, Tabellen
Bewertung	Cloud Function / Script	Punktberechnung nach Spielende
🛠️ Workflows & Cronjob

    GitHub Actions Cronjob (z. B. alle 15 Minuten, oder nach Spieltag-Aktualisierung):

        Ruft GET /matchdays/current und GET /table/current von der Bundesliga-API ab.

        Updated Firestore-Collections matchdays und table.

    Frontend:

        Holt bei App‑Start oder Navigation die neuesten Spieltage & Tabelle aus Firestore (Caching zwecks Performance + Kostenreduktion).

        Zeigt Spiele und Tipp-Formular je Spieltag an.

    Tipp-Abgabe:

        Nutzer:innen tippen pro Spielpaarung.

        Beim Absenden: Speicherung unter /tips/{userId}/{matchdayId} (Firestore).

    Punktevergabe:

        Nach Spieltag (z. B. durch GitHub Action oder manuell): Ruft alle Tipps ab, vergleicht mit Ergebnissen und berechnet Punkte.

        Speichert Punktesumme + Detail-Breakdown unter /scores/{userId}/{matchdayId}.

📊 Bewertungssystem

    Punktevergabe je Tipp:

        4 Punkte: Exaktes Ergebnis (z. B. 2–1 getippt & tatsächlich 2–1)

        3 Punkte: Richtiger Gewinner, anderes Ergebnis (z. B. getippt 3–0, real 2–1)

        2 Punkte: Falsches Ergebnis, aber Tendenz richtig (z. B. Tipp 0–1, real 1–2)

        0 Punkte: Kompletter Fehlschuss (z. B. Tipp Heimsieg, tatsächliche Auswärtssieg umgekehrt)

    Aggregation:

        Punkte je Spiel werden aufs Spieltag-Score aufaddiert.

🎨 Front-End / UI Design

    Reactivity via Vite + Vanilla JS (oder evtl. React/Vue stehen separat im Repo)

    Tailwind CSS: schnelles Styling

    Hauptseiten:

        Login / Registrierung

        Spieltag-Übersicht: Spiele, Tipps, Status

        Tippformular pro Spielpaarung

        Rangliste: Punkte & Vergleich aller Teilnehmer

        Historie & Detail-Ansicht (z. B. vergangene Spieltage)

🚀 Setup & Deployment
Voraussetzungen

    Node.js ≥ 16

    GitHub Account + Repo

    Firebase Projekt (Web‑App registrieren)

Lokaler Start

git clone https://github.com/TimoBahl/bolzer.git
cd bolzer
npm install
npm run dev

Firebase Setup

    firebase init → Hosting, Firestore, ggf. Auth.

    .env mit Firebase Config füllen (apiKey, authDomain etc.).

    firebase deploy

GitHub Actions

    Datei: .github/workflows/update-data.yml

    Crontrigger definieren

    Node-Script oder Curl‑Job zur API-Anbindung → Firestore via Admin‑SDK updaten

🧩 Entwickler:innen-Hinweise

    Firestore-Regeln:

        Nur eigenes tips/{userId}/{matchday} beschreibbar.

        matchdays & table nur durch Cronjob lesbar/schreibbar.

    Offline-Cache:

        Optional: Firestore-Rest-API oder Tailwind offline configs.

    Bewertung (z. B. Cloud Function):

        Funktion calculateScores(matchdayID)

        Iteration über tips → Punkte berechnen → scores schreiben.

    Fehlermonitoring:

        optional Sentry oder einfache Logging in Firestore, z. B. logs/cronjob.

📌 Roadmap & To‑Dos

Cleanup: Tippen nach Anpfiff deaktivieren

UI-Optimierungen: Dark Mode, Mobile Responsiveness

Zusätzlicher Spieltag-Pop‑up-Kalender

Automatisierter E‑Mail-Reminder

    Internationalisierung (i18n), weitere Ligen einbinden

🎯 Zusammenfassung

Bolzer ermöglicht ein schnelles, modernes Fußball-Tippspiel mit automatisierten Daten‑Updates, skalierbarer Infrastruktur (Firebase) und effizienter Bewertung – ideal als MVP und Basis für weitere Features!
