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

Voce unica nella checklist Segnalazioni (salvata in `localStorage` come `scacchi-switch-analisi-potenziata`). Le minacce vengono **solo da Stockfish**, su un terzo worker dedicato (creato quando la voce è attiva), separato dal motore di gioco e da quello della «Mossa migliore».

- Per ogni posizione mostrata: ricerca A (posizione reale) e ricerca B («mossa nulla»: stesso FEN col tratto all'avversario, saltata se chi muove è sotto scacco). MultiPV 3, Skill 20, depth = slider «Profondità Stockfish» (Auto oppure 6–20; Auto = max(12, computer + 2); `scacchi-sf-depth`), solo un tetto di sicurezza di 30 s per ricerca; durante il calcolo «Analisi in corso… profondità n/N». Accanto allo slider il tempo dell'ultima analisi completa a quella profondità (o una stima ×1,6 per livello), salvato in `scacchi-ap-tempi`. Cache per FEN (60 posizioni); se la posizione cambia la ricerca viene fermata. Mentre calcola: «Analisi in corso…».
- Ogni PV (fino a 12 semimosse) è rigiocata con chess.js: bilancio materiale a fine linea (prese + promozioni, scambio statico sull'ultima presa), pezzo perso e **tra quante mosse**, motivo della mossa chiave (forchetta / attacco doppio / scoperta: la geometria serve solo a classificare le mosse di Stockfish), inchiodatura sfruttata, pezzo indifeso, difensore sovraccarico, pezzo intrappolato, matto. Linea mostrata in notazione italiana.
- «Pericoli per chi muove (se non reagisce)» = linee B + la linea migliore A se perde comunque materiale (non per sacrifici: la valutazione deve confermarlo). «Pericoli per l'altro» = linee A. Valutazione A confrontata con B: quanto scende se non reagisce.
- **Pressione** = 10 × n. attaccanti / somma dei valori degli attaccanti (P=1, C=3, A=3, T=5, D=9, re come attaccante = 4); badge sul pezzo, rosso e con ‼ per i pezzi che Stockfish dà in pericolo. Case dei pezzi in pericolo: tratteggio viola (chi muove) / puntinato arancio (l'altro).

Lo slider «Profondità Stockfish» compare sotto «Mossa migliore» / «Analisi potenziata» solo se almeno una delle due è attiva; lo slider «Skill mossa migliore» (Auto oppure 0–20, `scacchi-sf-skill`) solo con «Mossa migliore» attiva. Posizione tutta a sinistra = «Auto»: Mossa migliore usa depth e skill del computer + 2 (max 20). Con un valore esplicito la Mossa migliore usa esattamente quel valore. Sulla TV il riquadro Analisi potenziata riceve il focus: su/giù lo scorrono, ai bordi si passa al controllo vicino.
