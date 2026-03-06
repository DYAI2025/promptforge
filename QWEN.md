# PromptForge — QWEN.md

## Projektübersicht

PromptForge ist eine Single-Page-Webanwendung zur Entwicklung und Optimierung von AI-Prompt-Systemen. Das Projekt bietet eine visuelle Oberfläche mit 3D-Tesseract-Darstellung (Three.js) und einem Prompt-Builder mit drei Modi (Specification, Lite, Strict).

**Ursprung:** Exportiert aus Google AI Studio  
**Standort:** https://ai.studio/apps/drive/11ch7xXJAW5dW4DW08yneUvay2s--MfRC

## Verzeichnisstruktur

```
PromptForge/
├── prompt-forge/              # Hauptanwendung
│   ├── index.html             # Single-File-App (HTML, CSS, JS)
│   ├── index.tsx              # Vite Entry-Point (leer)
│   ├── package.json           # Dependencies & Scripts
│   ├── vite.config.ts         # Vite-Konfiguration
│   ├── tsconfig.json          # TypeScript-Einstellungen
│   ├── CLAUDE.md              # Claude-spezifische Doku
│   └── .claude/               # Claude-Konfigurationen
├── forge-generator.jsx        # React-Komponente für FORGE-Prompt-Generator
├── forge-generator_1.jsx      # Alternative Version
└── prompt-forge.zip           # Archiv der Anwendung
```

## Building & Running

### Voraussetzungen
- Node.js (aktuelle LTS-Version empfohlen)
- Gemini API Key (für API-Features)

### Installation & Entwicklung

```bash
cd prompt-forge
npm install              # Abhängigkeiten installieren
```

### Umgebungsvariablen

Erstelle `.env.local` im `prompt-forge/`-Verzeichnis:

```bash
GEMINI_API_KEY=dein_api_key_hier
```

### Befehle

```bash
npm run dev              # Dev-Server starten (Vite, Port 3000, Host 0.0.0.0)
npm run build            # Produktions-Build
npm run preview          # Produktions-Build vorschauen
```

## Architektur

### Single-File-Ansatz

Die gesamte Anwendung befindet sich in `prompt-forge/index.html`:
- **CSS** (eingebettet): Custom Properties, Responsive Design, Scroll-Animationen
- **JavaScript** (eingebettet): Three.js-Szene, UI-Logik, Prompt-Builder
- **HTML**: Semantische Sektionen (Hero, Features, Builder, Footer)

### Hauptkomponenten

| Bereich | Beschreibung |
|---------|--------------|
| **Three.js Tesseract** | Rotierender Wireframe-Tesseract (Innen- + Außenwürfel mit Verbindern), Gold-zu-Grün-Farbwechsel, Maus-Parallaxe |
| **Prompt Builder** | `forgePrompt(input, mode)` generiert strukturierte Prompts in 3 Modi |
| **UI-System** | IntersectionObserver für Scroll-Reveals, Copy-to-Clipboard |

### Prompt-Modi

1. **Specification (Std)**: Vollständige Prompt-Struktur mit allen Metadaten
2. **Lite (Min)**: Minimalistische Version für schnelle Iterationen
3. **Strict (Sec)**: Strikte Constraints und Sicherheitsrichtlinien

### FORGE-Prompt-Generator

Die Datei `forge-generator.jsx` enthält eine React-Komponente zur Generierung detaillierter Website-Spezifikationen nach dem **F.O.R.G.E.**-Schema:

- **F**oundation: Ästhetik, Typografie, Farbsystem, Layer-Architektur
- **O**bjects: 3D-Zentrumstück, Partikelsystem, UI-Komponenten
- **R**eactions: Interaktionsmuster, Physik-Engine, Scroll-Verhalten
- **G**ateway: API-Endpoints, Datenstrukturen, Error-Handling
- **E**xclusions: Technische Constraints, Performance-Ziele

## Entwicklungskonventionen

### Code-Stil
- **Typografie**: Inter (Sans-Serif) + Space Mono (Code-Akzente)
- **Farbpalette**: Gold (`#d4af37`), Neon-Grün (`#b6ff4a`), dunkler Hintergrund (`#06080c`)
- **Responsive**: 768px Breakpoint für Mobile-Optimierung

### Testing
- Keine Test-Suite konfiguriert
- Manuelle Überprüfung über Dev-Server empfohlen

### Git
- `.gitignore` schließt `*.local` (Umgebungsvariablen) aus
- `prompt-forge.zip` als Backup-Archiv

## Wichtige Dateien

| Datei | Inhalt |
|-------|--------|
| `prompt-forge/index.html` | Vollständige Anwendung (924 Zeilen) |
| `prompt-forge/vite.config.ts` | API-Key-Exposure als `process.env.API_KEY` |
| `forge-generator.jsx` | React-Komponente für FORGE-Prompt-Architektur (1500 Zeilen) |
| `prompt-forge/CLAUDE.md` | Claude-spezifische Entwicklungshinweise |

## Design-Prinzipien

1. **Layered Architecture**: Z-Index-Schichtung für 3D-Effekte
2. **Performance**: `prefers-reduced-motion`-Support, Pixel-Ratio-Begrenzung
3. **Accessibility**: Aria-Labels, Fokus-Zustände, Kontrastverhältnisse
4. **No External Images**: Nur Inline-SVGs für Grafiken

## Erweiterungsmöglichkeiten

- API-Integration für Gemini (API-Key ist konfiguriert, aber nicht genutzt)
- Zusätzliche Prompt-Modi im Builder
- Export-Funktionen (JSON, Markdown)
- Versionierung von Prompt-Entwürfen
