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

## Segnalazione «Analisi potenziata»

Voce unica nella checklist Segnalazioni (salvata in `localStorage` come `scacchi-switch-analisi-potenziata`). Calcolo geometrico leggero sulla posizione mostrata, niente Stockfish:

- **Rischi per chi muove** = mosse che l'avversario potrebbe fare se il tratto passasse a lui («se non reagisce»; saltato sotto scacco). **Rischi per l'altro** = mosse legali di chi muove ora.
- Bersaglio di valore: il re (scacco) o un pezzo non pedone che vale più dell'attaccante o non è difeso. Il pezzo mosso conta solo se sulla casa d'arrivo non è in presa (SEE).
- **Forchetta**: cavallo o pedone mosso attacca ≥ 2 bersagli. **Attacco doppio**: alfiere/torre/donna/re mosso attacca ≥ 2 bersagli, oppure 1 bersaglio diretto + 1 scoperto (o scacco doppio). **Scoperta**: la mossa apre la linea di un proprio alfiere/torre/donna su un bersaglio.
- **Pressione** su ogni pezzo attaccato = 10 × n. attaccanti / somma dei valori degli attaccanti (P=1, C=3, A=3, T=5, D=9, re come attaccante = 4). Numero sul pezzo + prime 3 righe per colore.
- Case: tratteggio viola = da dove l'avversario colpirebbe chi muove; puntinato arancio = mosse con cui chi muove colpisce l'altro.
