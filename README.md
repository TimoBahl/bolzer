# 🥅 Bolzer – Bundesliga-Tippspiel

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

## 🏗️ Architektur

- **Frontend**: Vite + JavaScript + Tailwind CSS  
- **Backend**: Firebase Authentication + Firestore Database  
- **Automatisierung**: GitHub Actions für geplante Datenaktualisierungen (z. B. jede Nacht)


