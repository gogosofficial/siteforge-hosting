# SiteForge

Website von SiteForge – individuelle HTML- & CSS-Websites inklusive Hosting über Cloudflare Pages.

Live: https://siteforge-hosting.pages.dev/

## Struktur

```
public/                  ← Ausgabeordner für Cloudflare Pages
├── index.html           Startseite (Onepager)
├── 404.html             Fehlerseite
├── robots.txt
├── sitemap.xml
├── _headers             Sicherheits- & Cache-Header (Cloudflare Pages)
└── assets/
    ├── css/style.css    Alle Styles (nach Sektionen gegliedert)
    ├── js/main.js       Navigation, aktiver Menüpunkt, Scroll-Effekte, E-Mail kopieren
    ├── fonts/           Überschriften-Schrift „Bricolage Grotesque“ (selbst gehostet, SIL OFL)
    └── img/             Logo, Favicon, Social-Media-Vorschaubild, Screenshots der Referenzen
```

## Nach Änderungen an CSS oder JS

`style.css` und `main.js` werden einen Tag lang im Browser zwischengespeichert. Damit Besucher sofort die neue Version
bekommen, die Versionsnummer in `index.html` und `404.html` hochzählen (`style.css?v=3` → `?v=4`).

## Lokal ansehen

```bash
cd public
python3 -m http.server 8080
# → http://localhost:8080
```

Die Pfade sind absolut (`/assets/...`), deshalb die Seite über einen lokalen Server öffnen, nicht per Doppelklick.

## Veröffentlichen

Cloudflare Pages: Build-Befehl leer lassen, Ausgabeverzeichnis `public`.
Jeder Push auf `main` wird automatisch veröffentlicht.
