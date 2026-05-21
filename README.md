# Scacchi vs. Stockfysshe

Web app di scacchi su Google Apps Script con Stockfish, navigazione mosse, salvataggio partite su Google Sheet, e un look medievale ispirato al Claude Design.

## Struttura

- `Codice.gs` — backend Apps Script (handler `doGet`, salvataggio partite su Sheet)
- `index.html` — markup principale (incluso da `doGet` via template HTML service)
- `Style.html` — CSS, stile medievale "Illuminated" (parchment + ink)
- `JavaScript.html` — logica client (chessboard.js + chess.js + Stockfish + UI)
- `pieces/` — asset PNG dei set di pezzi personalizzati (Fable / Sci-fi / Elven / Orcish)
- `grok_prompts.txt` — 48 prompt pronti per generare i PNG dei pezzi con Grok / Aurora

## Pezzi personalizzati (HD)

Le sottocartelle `pieces/<tema>/` ospitano PNG 1024×1024 con alpha trasparente.
Naming: `wK.png wQ.png wR.png wB.png wN.png wP.png` per i pezzi bianchi,
`bK.png bQ.png bR.png bB.png bN.png bP.png` per i neri.

Vengono serviti via **jsDelivr CDN** direttamente da questo repo, con il pattern:

```
https://cdn.jsdelivr.net/gh/gborghi/chess-stockfish@main/pieces/<tema>/<file>.png
```

Aggiungere/sostituire un pezzo = `git push` + attendere il refresh cache CDN
(~10 min) o forzare con la [purge tool](https://www.jsdelivr.com/tools/purge).

## Deploy Apps Script

I file `.gs` e `.html` vanno copiati nel project editor di Apps Script — il
repo qui è solo per backup, versioning e hosting degli asset.
