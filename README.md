# miczyAI

Chat web (IT/EN) che dialoga con un backend AI. Sito statico: HTML, CSS e JavaScript, nessuna build.

## Avvio in locale
Apri `index.html` nel browser, oppure servi la cartella con un server statico:

```bash
python3 -m http.server 8000
```

## Come funziona
- `script.js` invia gli ultimi 20 messaggi a `https://backend-miczy-ai.onrender.com/chat` (POST, JSON `{ messages: [...] }`) e si aspetta `{ response: "..." }`.
- Le risposte sono Markdown: vengono convertite con [marked](https://github.com/markedjs/marked) e sanificate con [DOMPurify](https://github.com/cure53/DOMPurify) prima di essere mostrate.
- Lingua, tema e cronologia sono salvati nel `localStorage` del browser.
- `privacy/` e `tos/` contengono le pagine legali (testi in `privacy.js` e `tos.js`, chiavi `data-i18n`).

## Nota
Il backend è su Render (piano free): la prima richiesta dopo un periodo di inattività può richiedere fino a un minuto.
