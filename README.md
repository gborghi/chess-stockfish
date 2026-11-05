# Scacchi vs. Stockfish

Web app di scacchi con Stockfish (CDN `stockfish.js` 10.0.2), look medievale.

## Cartelle

- `apps-script/` — progetto Google Apps Script (`Codice.gs`, `index.html`, `Style.html`, `JavaScript.html`). Copia questi file nell’editor GAS. Salvataggio partite su Sheet «Partite».
- `cloudflare/` — sito statico per Cloudflare Pages (`index.html` già assemblato + `_headers` + `archivio.json`). Stesso UI; le partite vanno in `localStorage`.
- `pieces/` — PNG dei set HD, serviti da jsDelivr:

```
https://cdn.jsdelivr.net/gh/gborghi/chess-stockfish@main/pieces/<tema>/<file>.png
```

Live: https://scacchi-stockfish.pages.dev

Stockfish: `https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js`

Ricostruire `cloudflare/` (e `~/ICT/scacchi-stockfish/dist`) da `apps-script/`:

```
python3 /Users/g.borghi/ICT/scacchi-stockfish/build.py
```

Deploy: push su `main` → GitHub Actions (`.github/workflows/deploy.yml`) pubblica `cloudflare/` su Cloudflare Pages. Non usare wrangler in locale.
