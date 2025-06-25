# Bolzer – Bundesliga-Tippspiel

## Projektübersicht

**Bolzer** ist eine Web-Anwendung (Tech-Stack: Vite, JavaScript, Tailwind CSS, Firebase), mit der Nutzer:innen auf alle Bundesligaspieltage tippen können.  
Nach jedem Spieltag werden die abgegebenen Tipps durch ein Punktesystem (2, 3, 4 Punkte je nach Treffer) bewertet und in der Rangliste angezeigt.

- **Automatisierter Datenimport**  
  - Spieltage, Spielpaarungen und die aktuelle Bundesligatabelle werden per GitHub Actions (Cronjob) aus einer externen API ausgelesen und in Firestore gespeichert.
  - Dies minimiert direkte API-Aufrufe im Frontend – Daten werden aus Firestore geladen.

- **User-Tipps**  
  - Nutzer:innen tippen vor Spielbeginn. Die Tipps werden in Firestore gespeichert und nach Spielende automatisch ausgewertet.

---

## Inhaltsverzeichnis

1. [Architektur](#-architektur)  
2. [Datenmodell](#-datenmodell)  
3. [Technische Komponenten](#-technische-komponenten)  
4. [Workflows & Cronjob](#-workflows--cronjob)  
5. [Bewertungssystem](#-bewertungssystem)  
6. [Frontend / UI](#-frontend--ui)  
7. [Setup & Deployment](#-setup--deployment)  
8. [Entwickler:innen-Hinweise](#-entwicklerinnen-hinweise)  
9. [Roadmap](#-roadmap)

---

## Architektur

- **Frontend**: Vite + JavaScript + Tailwind CSS  
- **Backend**: Firebase Authentication + Firestore Database  
- **Automatisierung**: GitHub Actions für geplante Datenaktualisierungen (z. B. jede Nacht)

---

## 🛠️ Workflows & Cronjob

### 🔄 GitHub Actions – Datenaktualisierung

Die Webapplikation nutzt GitHub Actions, um regelmäßig Spieltags- und Tabellendaten automatisiert zu aktualisieren. Dies reduziert die API-Last und sorgt für aktuelle Daten in Firestore.

#### Ablauf:

- **Zeitplan:** täglich um **02:00 Uhr (UTC)** via Cronjob
- **Manueller Start** zusätzlich über `workflow_dispatch` möglich
- **API-Aufrufe:**
  - `GET /matchdays` → Spieltage und Spiele
  - `GET /table` → aktuelle Bundesliga-Tabelle
- **Speicherung in Firestore:**
  - `spieltage/{nummer}` mit Subcollection `spiele`
  - `bundesligaTabelle/{platz}` für Tabelle

---

## Datenmodell

**bundesligaTabelle**

**Collection**: `bundesligaTabelle`  
**Dokument-ID**: `"1"`

```json
{
  "teamName": "Bayer Leverkusen",
  "points": 16,
  "teamGoals": 18,
  "opponentGoals": 5,
  "diff": 13,
  "matches": 6,
  "teamIconUrl": "https://.../leverkusen.png"
}
```

**spieltage**

**Collection**: `spieltage`
**Dokument-ID**: `"1"` 

```json
{
  "spieltagNummer": 1,
  "ersterZeitpunkt": "2024-08-20T18:30:00Z",
  "letzterZeitpunkt": "2024-08-22T20:45:00Z"
}
```
**Subcolection**: `spiele`
**Subdokument-ID**: `72214``

```json
{
  "heim": "FC Bayern",
  "gast": "RB Leipzig",
  "datum": "2024-08-20T18:30:00Z",
  "ergebnis": {
    "toreHeim": 2,
    "toreGast": 1
  }
}
```

**users**

**Collection**: `users`
**Dokument-ID**: `0z9WM3m9GVhz58oBFOhag8S4M4B3`

```json
{
  "createdAt": "2025-06-25T08:05:50Z",
  "displayName": "Timo Bahl",
  "email": "timo.bahl@freenet.ag",
  "lastLogin": "2025-06-25T08:05:50Z"
}
```

**Subcolection**: `tipps`
**Subdokument-ID**: `72214`

```json
{
  "awayTeam": "VfB Stuttgart",
  "ergebnis": {
    "toreGast": 3,
    "toreHeim": 2
  },
  "gameday": "34",
  "homeTeam": "RB Leipzig",
  "points": 0,
  "predictionAway": 1,
  "predictionHome": 1,
  "timestamp": "2025-05-26T20:06:49Z" 
}
```

---

## Bewertungssystem

| Treffer                         | Punkte |
| ------------------------------- | ------ |
| Exaktes Ergebnis                | 4      |
| Richtiger Sieger + Tordifferenz | 3      |
| Richtiger Sieger                | 2      |
| Falscher Tipp                   | 0      |
