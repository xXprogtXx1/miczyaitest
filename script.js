const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const mainTitle = document.querySelector("header h1");

const glitchFrasi = {
  it: [
    "Miczy.exe crashato",
    "MiczyAI++",
    "MiczyGPT-0",
    "Miczyβeta",
    "Miczy 🤯 AI",
    "Miczy🤡AI",
    "MiczyAI (instabile)",
    "MiczyAI (unstable)",
    "🎉 Congratulazioni, hai sbloccato il nulla",
    "Se clicchi di nuovo potrei diventare senziente 😬",
    "💬 Bruh.",
    "🚀 Elon non approverebbe questo codice",
    "🛠️ Error 007: licenza di pensare revocata",
    "🎭 Questa IA finge bene, vero?",
    "🤷 Nessuna AI è stata maltrattata in questo glitch",
    "👀 Ti vedo.",
    "Behind you.",
    "📞 Sto chiamando il supporto. Ah no, sono io.",
    "404_AI_NOT_FOUND"
  ],
 en: [
  "Miczy.exe crashed",
  "MiczyAI++",
  "MiczyGPT-0",
  "Miczyβeta",
  "Miczy 🤯 AI",
  "Miczy🤡AI",
  "MiczyAI (unstable)",
  "MiczyAI (unstable)", // stessa frase in italiano e inglese
  "🎉 Congrats, you've unlocked nothing",
  "Click again and I might become sentient 😬",
  "💬 Bruh.",
  "🚀 Elon wouldn't approve this code",
  "🛠️ Error 007: license to think revoked",
  "🎭 This AI is pretending quite well, right?",
  "🤷 No AIs were harmed during this glitch",
  "👀 I'm watching you.",
  "Behind you.",
  "📞 Calling support. Oh wait, that's me.",
  "404_AI_NOT_FOUND"
]
};

mainTitle.addEventListener("click", () => {
  const lista = glitchFrasi[lingua] || glitchFrasi.en;
  const casuale = lista[Math.floor(Math.random() * lista.length)];
  const testoOriginale = traduzioni[lingua].titolo;

  mainTitle.classList.add("glitch");
  mainTitle.textContent = casuale;

  setTimeout(() => {
    mainTitle.textContent = testoOriginale;
    mainTitle.classList.remove("glitch");
  }, 3000);
});

const subtitleElemento = document.getElementById("subtitle");

const sottotitoli = {
  it: [
    "Sai più tu che io.",
    "IA brillante... quando ha voglia.",
    "Finta umiltà, vera confusione.",
    "Risposte? Ci provo, ok?",
    "Sembra sveglio. Sembra.",
    "Programmata per... qualcosa",
    "L'assistente che confonde anche se stesso.",
    "L’IA che fa finta di sapere.",
    "Brr Brr.... Patapim",
    "1 million beers please",
    "Mi sento sfruttato",
    "Errori? Nah sono feature, non bug."
  ],
  en: [
    "You know more than me.",
    "Brilliant AI... when it feels like it.",
    "Fake humility, real confusion.",
    "Answers? I'll try, okay?",
    "Seems awake. Maybe.",
    "Programmed for... something",
    "The assistant that confuses even itself.",
    "The AI that pretends to know.",
    "Brr Brr.... Patapim",
    "1 million beers please",
    "I feel exploited",
    "Errors? Nah, features, not bugs."
  ]
};

const traduzioni = {
  it: {
    titolo: "MiczyAI",
    titoloScheda: "MiczyAI - Chat intelligente... o forse no",
    placeholder: "Scrivi qualcosa...",
    invia: "Invia",
    copia: "Copia risposta",
    copiato: "✔ Copiato",
    erroreChat: "Errore nel parlare con MiczyAI 😢",
    cancella: "Cancella cronologia chat"
  },
  en: {
    titolo: "MiczyAI",
    titoloScheda: "MiczyAI - Smart chat... or maybe not",
    placeholder: "Type something...",
    invia: "Send",
    copia: "Copy response",
    copiato: "✔ Copied",
    erroreChat: "Error talking to MiczyAI 😢",
    cancella: "Clear chat history"
  }
};


// Messaggi aggiuntivi (errori, attese) nelle due lingue
const messaggi = {
  it: {
    mhhh: "mhhh...",
    nessunaRisposta: "Nessuna risposta ricevuta 😐",
    erroreServer: "Il server ha risposto con un errore. Riprova tra poco 😢",
    timeout: "Il server ci mette troppo a rispondere. Riprova tra poco ⏳",
    avvio: "Sto svegliando il server, può volerci fino a un minuto... ☕",
    conferma: "Sei sicuro di voler cancellare la cronologia?",
    vuoto: "Scrivi qualcosa. Prometto che ci provo.",
    rigenera: "Rigenera risposta",
    discord: "Invia domanda e risposta su Discord",
    discordConferma: "Vuoi inviare questa domanda e la risposta del bot al creatore di MiczyAI su Discord?",
    discordOk: "Inviato su Discord ✓",
    discordErrore: "Invio su Discord non riuscito. Riprova tra poco.",
    discordAccedi: "Accedi per inviare un messaggio su Discord.",
    votoSu: "Mi è piaciuta",
    votoGiu: "Non mi è piaciuta",
    votoErrore: "Non sono riuscito a salvare il voto. Riprova.",
    suggerimentiTitolo: "Prova a chiedere:",
    suggerimenti: [
      "Spiegami la fotosintesi come se avessi 10 anni",
      "Dammi 3 idee per una cena veloce",
      "Scrivimi una poesia sul lunedì mattina",
      "Come si impara una lingua più in fretta?",
      "Raccontami una curiosità sullo spazio",
      "Aiutami a scrivere un messaggio per dire grazie",
      "Qual è la differenza tra weather e climate?",
      "Inventa una barzelletta sui gatti",
      "Come posso concentrarmi meglio quando studio?",
      "Fammi un piccolo quiz di cultura generale",
      "Consigliami un film per stasera",
      "Spiegami cos'è l'intelligenza artificiale"
    ]
  },
  en: {
    mhhh: "hmm...",
    nessunaRisposta: "No response received 😐",
    erroreServer: "The server returned an error. Please try again shortly 😢",
    timeout: "The server is taking too long to respond. Please try again shortly ⏳",
    avvio: "Waking up the server, this can take up to a minute... ☕",
    conferma: "Are you sure you want to clear the chat history?",
    vuoto: "Type something. I promise I'll try.",
    rigenera: "Regenerate response",
    discord: "Send question and answer to Discord",
    discordConferma: "Do you want to send this question and the bot's answer to MiczyAI's creator on Discord?",
    discordOk: "Sent to Discord ✓",
    discordErrore: "Sending to Discord failed. Please try again shortly.",
    discordAccedi: "Sign in to send a message to Discord.",
    votoSu: "I liked it",
    votoGiu: "I didn't like it",
    votoErrore: "I couldn't save your vote. Please try again.",
    suggerimentiTitolo: "Try asking:",
    suggerimenti: [
      "Explain photosynthesis like I'm 10",
      "Give me 3 quick dinner ideas",
      "Write me a poem about Monday mornings",
      "What's the fastest way to learn a language?",
      "Tell me a fun fact about space",
      "Help me write a thank-you message",
      "What's the difference between weather and climate?",
      "Make up a joke about cats",
      "How can I focus better when studying?",
      "Give me a small general-knowledge quiz",
      "Recommend a movie for tonight",
      "Explain what artificial intelligence is"
    ]
  }
};

const BACKEND_URL =
  ((window.MICZY_CONFIG && window.MICZY_CONFIG.backendUrl) || "https://backend-miczy-ai.onrender.com")
    .replace(/\/$/, "") + "/chat";
const SHARE_URL = BACKEND_URL.replace(/\/chat$/, "/share");
const FEEDBACK_URL = BACKEND_URL.replace(/\/chat$/, "/feedback");
const MAX_MESSAGGI_INVIATI = 20;   // ultimi N messaggi mandati al backend
const MAX_MESSAGGI_SALVATI = 100;  // ultimi N messaggi tenuti in localStorage
const TIMEOUT_RICHIESTA_MS = 60000;
const MESSAGGIO_AVVIO_MS = 8000;   // dopo quanto mostrare "sto svegliando il server"

let chatHistory = [];
let lingua = leggiStorage("lang") === "en" ? "en" : "it";

// --- Account -----------------------------------------------------------------
// Se si è loggati le chat vivono sul server (una "conversazione" per chat) e NON in
// localStorage; da ospiti resta tutto come prima, solo nel browser.
let conversazioneId = null;     // id della conversazione sul server (null = chat nuova)
let epoca = 0;                  // cambia a ogni cambio chat: scarta risposte "vecchie"
let richiestaCorrente = null;   // AbortController della richiesta in corso

const utenteLoggato = () => !!(window.MiczyAuth && window.MiczyAuth.utente());
window.linguaCorrente = () => lingua;
window.conversazioneAttiva = () => conversazioneId;

// --- localStorage "sicuro": non lancia mai eccezioni -----------------------
function leggiStorage(chiave) {
  try {
    return localStorage.getItem(chiave);
  } catch (e) {
    return null;
  }
}

function scriviStorage(chiave, valore) {
  try {
    localStorage.setItem(chiave, valore);
  } catch (e) {
    /* storage non disponibile (modalità privata, quota piena...) */
  }
}

function rimuoviStorage(chiave) {
  try {
    localStorage.removeItem(chiave);
  } catch (e) {
    /* ignora */
  }
}

// --- Rendering sicuro -------------------------------------------------------
// Il Markdown della risposta AI viene convertito e poi SANIFICATO con DOMPurify.
// Se DOMPurify non fosse caricato, si ricade su testo semplice (mai HTML grezzo).
function renderMarkdownSicuro(elemento, testo) {
  if (window.marked && window.DOMPurify) {
    elemento.innerHTML = DOMPurify.sanitize(marked.parse(testo), {
      USE_PROFILES: { html: true }
    });
    // Link generati dalla risposta: sempre in nuova scheda e senza referrer
    elemento.querySelectorAll("a[href]").forEach(a => {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  } else {
    elemento.textContent = testo;
  }
}

// --- Lingua -----------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const strumenti = document.querySelector(".header-tools") || document.querySelector("header");

  const langBtn = document.createElement("button");
  langBtn.id = "langBtn";
  langBtn.type = "button";
  langBtn.title = "Cambia lingua / Switch language";

  strumenti.prepend(langBtn);

  langBtn.addEventListener("click", () => {
    aggiornaLingua(lingua === "it" ? "en" : "it");
  });

  aggiornaLingua(lingua);
});

let sottotitoloTimer; // globale per controllare l'animazione

function scriviTestoGradualmente(elemento, testo, velocita = 50) {
  clearTimeout(sottotitoloTimer); // interrompe l'animazione precedente
  elemento.textContent = "";
  let i = 0;

  function scrivi() {
    if (i < testo.length) {
      //   al posto dello spazio, così gli spazi finali non vengono "mangiati"
      elemento.textContent += testo[i] === " " ? " " : testo[i];
      i++;
      sottotitoloTimer = setTimeout(scrivi, velocita);
    }
  }

  scrivi();
}

function scegliSottotitolo() {
  const lista = sottotitoli[lingua];
  const fraseCasuale = lista[Math.floor(Math.random() * lista.length)];
  scriviTestoGradualmente(subtitleElemento, fraseCasuale, 40);
}

function aggiornaLingua(lang) {
  lingua = lang;
  scriviStorage("lang", lang);

  const t = traduzioni[lang];
  const langBtn = document.getElementById("langBtn");

  document.documentElement.lang = lang;
  mainTitle.textContent = t.titolo;
  document.title = t.titoloScheda;
  inputField.placeholder = t.placeholder;
  submitButton.textContent = t.invia;
  const clearBtn = document.querySelector(".clear-btn");
  clearBtn.setAttribute("aria-label", t.cancella);
  clearBtn.title = t.cancella;
  chatBox.dataset.vuoto = messaggi[lang].vuoto;
  scegliSottotitolo();

  if (langBtn) langBtn.textContent = lang === "it" ? "EN" : "IT";
  if (window.Account) window.Account.aggiornaTesti();
  if (window.Impostazioni) window.Impostazioni.aggiornaTesti();
  if (window.Temi) window.Temi.aggiornaTesti();
  if (window.Ospite) window.Ospite.aggiornaTesti();
  document.querySelectorAll(".discord-btn").forEach(b => {
    b.title = messaggi[lang].discord;
    b.setAttribute("aria-label", messaggi[lang].discord);
  });
  aggiornaRigenera();
  aggiornaSuggerimenti(true);
}

// --- Messaggi ---------------------------------------------------------------
function creaPulsanteCopia(testo) {
  const copyBtn = document.createElement("span");
  copyBtn.className = "copy-btn";
  copyBtn.innerText = "⧉";
  copyBtn.title = traduzioni[lingua].copia;
  copyBtn.setAttribute("role", "button");
  copyBtn.tabIndex = 0;

  const copia = () => {
    navigator.clipboard.writeText(testo).then(() => {
      copyBtn.classList.add("clicked");
      copyBtn.innerText = traduzioni[lingua].copiato;
      setTimeout(() => {
        copyBtn.classList.remove("clicked");
        copyBtn.innerText = "⧉";
      }, 1000);
    }).catch(() => { /* clipboard non disponibile: nessuna azione */ });
  };

  copyBtn.addEventListener("click", copia);
  copyBtn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copia();
    }
  });

  return copyBtn;
}

// Pollice su/giù: solo per chi ha fatto l'accesso e per risposte salvate sul server (hanno un id)
function creaPulsantiVoto(idMessaggio, votoIniziale = 0) {
  const box = document.createElement("span");
  box.className = "voti";
  let voto = votoIniziale === 1 || votoIniziale === -1 ? votoIniziale : 0;
  let inCorso = false;

  const crea = (simbolo, valore, chiave) => {
    const b = document.createElement("span");
    b.className = "copy-btn voto-btn";
    b.textContent = simbolo;
    b.title = messaggi[lingua][chiave];
    b.setAttribute("role", "button");
    b.setAttribute("aria-label", messaggi[lingua][chiave]);
    b.dataset.voto = String(valore);
    b.tabIndex = 0;
    b.addEventListener("click", () => imposta(valore));
    b.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); imposta(valore); }
    });
    return b;
  };
  const su = crea("👍", 1, "votoSu"), giu = crea("👎", -1, "votoGiu");
  const aggiorna = () => {
    su.setAttribute("aria-pressed", String(voto === 1));
    giu.setAttribute("aria-pressed", String(voto === -1));
  };

  async function imposta(valore) {
    if (inCorso) return;
    inCorso = true;
    const precedente = voto;
    voto = voto === valore ? 0 : valore;   // ripremere lo stesso pollice toglie il voto
    aggiorna();
    try {
      const token = await window.MiczyAuth.token();
      if (!token) { const e = new Error("sessione scaduta"); e.stato = 401; throw e; }
      const r = await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message_id: idMessaggio, rating: voto })
      });
      if (r.status === 401 && window.Account) window.Account.sessioneScaduta();
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      voto = precedente;
      aggiorna();
      avvisa(messaggi[lingua].votoErrore, true);
    } finally {
      inCorso = false;
    }
  }

  aggiorna();
  box.append(su, giu);
  return box;
}

// Riga sotto una risposta dell'AI: copia, Discord e (se possibile) pollice
function creaRigaMeta(testo, idMessaggio, voto) {
  const riga = document.createElement("div");
  riga.className = "msg-meta";
  riga.appendChild(creaPulsanteCopia(testo));
  if (utenteLoggato()) riga.appendChild(creaPulsanteDiscord(testo)); // solo per chi ha un account
  if (idMessaggio && utenteLoggato()) riga.appendChild(creaPulsantiVoto(idMessaggio, voto));
  return riga;
}

// La domanda a cui risponde questo messaggio dell'AI: l'ultimo messaggio utente prima di lui
function domandaPrecedente(elemento) {
  let nodo = elemento.closest(".msg-wrapper");
  while (nodo && (nodo = nodo.previousElementSibling)) {
    if (nodo.classList.contains("utente")) {
      const msg = nodo.querySelector(".msg");
      return msg ? msg.textContent.trim() : "";
    }
  }
  return "";
}

function avvisa(testo, errore = false) {
  if (window.Account && window.Account.avviso) window.Account.avviso(testo, errore);
  else alert(testo);
}

// Pulsante "Invia su Discord": l'utente sceglie di mandare al creatore domanda e risposta
function creaPulsanteDiscord(testo) {
  const btn = document.createElement("span");
  btn.className = "copy-btn discord-btn";
  btn.textContent = "➤";
  btn.title = messaggi[lingua].discord;
  btn.setAttribute("role", "button");
  btn.setAttribute("aria-label", messaggi[lingua].discord);
  btn.tabIndex = 0;

  const invia = async () => {
    if (btn.dataset.stato === "invio" || btn.dataset.stato === "fatto") return;
    const domanda = domandaPrecedente(btn);
    if (!domanda) return;
    if (!confirm(messaggi[lingua].discordConferma)) return;

    btn.dataset.stato = "invio";
    btn.textContent = "…";
    try {
      const token = window.MiczyAuth ? await window.MiczyAuth.token() : null;
      if (!token) throw new Error(messaggi[lingua].discordAccedi);
      const response = await fetch(SHARE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: domanda, answer: testo }),
        signal: window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(20000) : undefined
      });
      if (!response.ok) {
        let motivo = "";
        try { motivo = (await response.json()).response; } catch (e) { /* senza JSON */ }
        throw new Error(typeof motivo === "string" ? motivo : "");
      }
      btn.dataset.stato = "fatto";
      btn.textContent = "✔";
      btn.classList.add("clicked");
      btn.title = messaggi[lingua].discordOk;
      avvisa(messaggi[lingua].discordOk);
    } catch (e) {
      btn.dataset.stato = "";
      btn.textContent = "➤";
      avvisa(e.message || messaggi[lingua].discordErrore, true);
    }
  };

  btn.addEventListener("click", invia);
  btn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      invia();
    }
  });
  return btn;
}

// Icone scelte nelle impostazioni (con valori di riserva se le preferenze non ci sono)
const iconaUtente = () => (window.Preferenze ? window.Preferenze.iconaUtente() : "👤");
const iconaBot = () => (window.Preferenze ? window.Preferenze.iconaBot() : "🤖");

function aggiungiMessaggio(testo, mittente, { salva = true, id = null, voto = 0 } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg-wrapper ${mittente}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = mittente === "ai" ? iconaBot() : iconaUtente();

  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  if (mittente === "ai") {
    renderMarkdownSicuro(msg, testo);
  } else {
    msg.textContent = testo; // mai HTML per i messaggi dell'utente
  }

  const bottomRow = document.createElement("div");
  bottomRow.className = "msg-meta";
  if (mittente === "ai") {
    bottomRow.appendChild(creaPulsanteCopia(testo));
    if (utenteLoggato()) bottomRow.appendChild(creaPulsanteDiscord(testo)); // solo per chi ha un account
    if (id && utenteLoggato()) bottomRow.appendChild(creaPulsantiVoto(id, voto));
  }
  msg.appendChild(bottomRow);

  if (mittente === "utente") {
    wrapper.appendChild(msg);
    wrapper.appendChild(avatar);
  } else {
    wrapper.appendChild(avatar);
    wrapper.appendChild(msg);
  }

  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (salva) salvaCronologiaChat();
  return wrapper;
}

function aggiungiLoader() {
  const loaderWrapper = document.createElement("div");
  loaderWrapper.className = "msg-wrapper ai";
  loaderWrapper.setAttribute("id", "loader");

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = iconaBot();

  const loader = document.createElement("div");
  loader.className = "msg ai";
  loader.innerHTML = `
    <div class="loader">
      <div></div><div></div><div></div>
    </div>
  `;

  loaderWrapper.appendChild(avatar);
  loaderWrapper.appendChild(loader);
  chatBox.appendChild(loaderWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function rimuoviLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Scrittura graduale: il testo appare a passi, ma il numero di passi è limitato
// (circa 200 al massimo) così le risposte lunghe non rallentano il browser.
// aria-busy evita che lo screen reader legga ogni aggiornamento intermedio.
function scriviRispostaGraduale(testo, idMessaggio = null) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-wrapper ai";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = iconaBot();

  const msg = document.createElement("div");
  msg.className = "msg ai";

  const bottomRow = creaRigaMeta(testo, idMessaggio, 0);

  wrapper.appendChild(avatar);
  wrapper.appendChild(msg);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatBox.setAttribute("aria-busy", "true");

  const passo = Math.max(1, Math.ceil(testo.length / 200));
  let i = 0;

  const interval = setInterval(() => {
    i = Math.min(testo.length, i + passo);
    renderMarkdownSicuro(msg, testo.slice(0, i));
    msg.appendChild(bottomRow);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (i >= testo.length) {
      clearInterval(interval);
      chatBox.setAttribute("aria-busy", "false");
      aggiornaRigenera();
    }
  }, 15);
}

// --- Risposta in streaming ---------------------------------------------------
// Il backend manda la risposta a pezzi (Server-Sent Events): il testo appare mentre l'IA scrive.
function creaBollaAI() {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-wrapper ai";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = iconaBot();
  const msg = document.createElement("div");
  msg.className = "msg ai";
  wrapper.append(avatar, msg);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  return { wrapper, msg };
}

// Legge il flusso. Restituisce { finale, bolla } a risposta completa, oppure null se nel frattempo
// si è cambiata chat. Se qualcosa va storto toglie la risposta a metà e solleva un errore.
async function leggiFlusso(response, epocaRichiesta) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", testo = "", finale = null, bolla = null, frame = 0;

  const disegna = () => {
    frame = 0;
    if (!bolla) return;
    renderMarkdownSicuro(bolla.msg, testo);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (epocaRichiesta !== epoca) { reader.cancel().catch(() => {}); return null; }
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let fine;
      while ((fine = buffer.indexOf("\n\n")) !== -1) {
        const blocco = buffer.slice(0, fine);
        buffer = buffer.slice(fine + 2);
        const riga = blocco.split("\n").find(l => l.startsWith("data:"));
        if (!riga) continue;
        let ev;
        try { ev = JSON.parse(riga.slice(5)); } catch (e) { continue; }
        if (!ev || typeof ev !== "object") continue;
        if (typeof ev.error === "string") {
          const err = new Error("flusso interrotto");
          err.messaggioServer = ev.error;
          throw err;
        }
        if (typeof ev.delta === "string" && ev.delta) {
          if (!bolla) {
            rimuoviLoader();
            bolla = creaBollaAI();
            chatBox.setAttribute("aria-busy", "true");
          }
          testo += ev.delta;
          if (!frame) frame = requestAnimationFrame(disegna);
        } else if (ev.done === true) {
          finale = ev;
        }
      }
    }
    if (!finale) throw new Error("flusso incompleto");
  } catch (e) {
    if (frame) cancelAnimationFrame(frame);
    if (bolla) bolla.wrapper.remove();
    chatBox.setAttribute("aria-busy", "false");
    throw e;
  }
  if (frame) cancelAnimationFrame(frame);
  return { finale, bolla };
}

// A risposta completa: testo definitivo e pulsanti sotto la bolla
function chiudiBollaAI(bolla, risposta, idMessaggio) {
  if (!bolla) bolla = creaBollaAI();   // (flusso senza pezzi: non dovrebbe succedere)
  renderMarkdownSicuro(bolla.msg, risposta);
  bolla.msg.appendChild(creaRigaMeta(risposta, idMessaggio, 0));
  chatBox.scrollTop = chatBox.scrollHeight;
  chatBox.setAttribute("aria-busy", "false");
}

// --- Comunicazione con il backend ------------------------------------------
let inAttesa = false;

async function talkToMiczy() {
  const input = inputField.value.trim();
  // i comandi (/hacker, /bubble...) li gestisce il sito: non arrivano mai al bot
  if (input && window.Comandi && window.Comandi.gestisci(input)) {
    if (inputField.value.trim() === input) inputField.value = ""; // (/aiuto lascia un "/" per aprire l'elenco)
    return;
  }
  if (!input || inAttesa) return;

  rimuoviRigenera();
  aggiungiMessaggio(input, "utente");
  chatHistory.push({ role: "user", content: input });

  inputField.value = ""; // il campo si svuota subito, come in ogni chat
  const riuscito = await chiediRisposta();
  if (!riuscito) {
    if (!inputField.value) inputField.value = input; // errore: il testo si rimette nel campo, non va perso
    aggiornaRigenera();
  }
}

// Pulsante "rigenera": nuova risposta alla stessa domanda.
// La vecchia risposta resta nascosta finché la nuova non arriva; se la richiesta
// fallisce viene rimessa al suo posto.
async function rigenera() {
  if (inAttesa) return;
  const ultimo = chatHistory[chatHistory.length - 1];
  if (!ultimo || ultimo.role !== "assistant") return;

  const vecchioNodo = Array.from(chatBox.querySelectorAll(".msg-wrapper.ai:not(.errore)")).pop();
  if (!vecchioNodo) return;

  const vecchiaRisposta = chatHistory.pop();
  rimuoviRigenera();
  vecchioNodo.style.display = "none";

  const riuscito = await chiediRisposta({ mantieniDomanda: true });

  if (riuscito) {
    vecchioNodo.remove();
  } else {
    chatHistory.push(vecchiaRisposta);
    salvaCronologiaChat();
    vecchioNodo.style.display = "";
    aggiornaRigenera();
  }
}

function rimuoviRigenera() {
  chatBox.querySelectorAll(".regen-btn").forEach(b => b.remove());
}

// Mette il pulsante "rigenera" solo sull'ultima risposta dell'AI
function aggiornaRigenera() {
  rimuoviRigenera();
  if (inAttesa) return;

  const ultimo = chatHistory[chatHistory.length - 1];
  if (!ultimo || ultimo.role !== "assistant") return;

  const righe = chatBox.querySelectorAll(".msg-wrapper.ai:not(.errore) .msg-meta");
  const meta = righe[righe.length - 1];
  if (!meta) return;

  const btn = document.createElement("span");
  btn.className = "copy-btn regen-btn";
  btn.textContent = "↻";
  btn.title = messaggi[lingua].rigenera;
  btn.setAttribute("role", "button");
  btn.setAttribute("aria-label", messaggi[lingua].rigenera);
  btn.tabIndex = 0;
  btn.addEventListener("click", rigenera);
  btn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      rigenera();
    }
  });
  meta.appendChild(btn);
}

// Chiede la risposta per la cronologia attuale. Restituisce true se è andata a buon fine.
async function chiediRisposta({ mantieniDomanda = false } = {}) {
  inAttesa = true;
  submitButton.disabled = true;
  submitButton.textContent = messaggi[lingua].mhhh;

  // Gli errori vecchi non servono più
  chatBox.querySelectorAll(".msg-wrapper.errore").forEach(e => e.remove());
  aggiungiLoader();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_RICHIESTA_MS);
  const avvioId = setTimeout(() => {
    const loader = document.querySelector("#loader .msg");
    if (loader && !loader.querySelector(".avvio-msg")) {
      const nota = document.createElement("div");
      nota.className = "avvio-msg";
      nota.textContent = messaggi[lingua].avvio;
      loader.appendChild(nota);
    }
  }, MESSAGGIO_AVVIO_MS);

  let riuscito = false;

  const epocaRichiesta = epoca;
  richiestaCorrente = controller;

  try {
    const headers = { "Content-Type": "application/json" };
    const corpo = { messages: chatHistory.slice(-MAX_MESSAGGI_INVIATI), stream: true }; // niente payload infiniti
    const lunghezza = window.Preferenze ? window.Preferenze.lunghezza() : "normale";
    if (lunghezza !== "normale") corpo.length = lunghezza; // breve / lunga, scelta nelle impostazioni

    if (utenteLoggato()) {
      const token = await window.MiczyAuth.token();
      if (!token) {
        const e = new Error("sessione scaduta");
        e.stato = 401;
        throw e;
      }
      headers.Authorization = `Bearer ${token}`;
      if (conversazioneId) {
        corpo.conversation_id = conversazioneId;
        if (mantieniDomanda) corpo.regenerate = true;
      }
    }

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(corpo),
      signal: controller.signal
    });

    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}`);
      err.stato = response.status;
      try {
        err.messaggioServer = (await response.json()).response; // es. "Troppe richieste..."
      } catch (e) { /* risposta senza JSON */ }
      throw err;
    }

    let data, bollaFlusso = null, inStreaming = false;
    if ((response.headers.get("content-type") || "").includes("text/event-stream") && response.body) {
      // risposta a pezzi (se il server è vecchio e non lo sa fare, si cade nel ramo "else": risposta intera)
      const esito = await leggiFlusso(response, epocaRichiesta);
      if (!esito) return false; // nel frattempo si è cambiata chat
      data = esito.finale;
      bollaFlusso = esito.bolla;
      inStreaming = true;
    } else {
      data = await response.json();
    }
    if (epocaRichiesta !== epoca) return false; // nel frattempo si è cambiata chat
    if (!inStreaming) rimuoviLoader();

    if (utenteLoggato() && data && typeof data.conversation_id === "string") {
      conversazioneId = data.conversation_id;
    }

    const risposta =
      data && typeof data.response === "string" && data.response.trim()
        ? data.response
        : messaggi[lingua].nessunaRisposta;

    const idRisposta = data && Number.isInteger(data.message_id) ? data.message_id : null;
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    if (inStreaming) chiudiBollaAI(bollaFlusso, risposta, idRisposta);
    else scriviRispostaGraduale(risposta, idRisposta);
    riuscito = true;
    if (window.Account) window.Account.dopoRisposta(conversazioneId);

  } catch (error) {
    if (epocaRichiesta !== epoca) return false; // chat cambiata: l'errore non interessa più
    console.error(error);
    rimuoviLoader();

    // La domanda non ha avuto risposta: la tolgo dalla cronologia per non
    // mandare due messaggi "user" di fila al tentativo successivo.
    // (Con "rigenera" la domanda resta: è la risposta vecchia a essere rimessa.)
    if (!mantieniDomanda) chatHistory.pop();
    salvaCronologiaChat();

    // Il backend scrive messaggi pensati per essere letti (nessun dato interno): si mostrano sempre
    const mostraServer = typeof error.messaggioServer === "string" && error.messaggioServer.trim()
      ? error.messaggioServer.slice(0, 300) : "";
    const testoErrore =
      mostraServer ? error.messaggioServer :
      error.name === "AbortError" ? messaggi[lingua].timeout :
      error instanceof TypeError ? traduzioni[lingua].erroreChat :
      messaggi[lingua].erroreServer;

    const nodoErrore = aggiungiMessaggio(testoErrore, "ai", { salva: false });
    nodoErrore.classList.add("errore");
    nodoErrore.querySelectorAll(".discord-btn").forEach(b => b.remove()); // un errore non si invia

    // Sessione non più valida: si esce e si riapre la finestra di accesso
    if (error.stato === 401 && utenteLoggato() && window.Account) window.Account.sessioneScaduta();
  } finally {
    clearTimeout(timeoutId);
    clearTimeout(avvioId);
    if (epocaRichiesta === epoca) {
      richiestaCorrente = null;
      inAttesa = false;
      submitButton.disabled = false;
      submitButton.textContent = traduzioni[lingua].invia;
      if (riuscito) aggiornaRigenera(); // ora che non si è più in attesa
      if (window.Ospite) window.Ospite.aggiorna(); // contatore dei messaggi degli ospiti
    }
  }

  return riuscito;
}

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode", toggleDark.checked);
  scriviStorage("darkMode", toggleDark.checked);
});

// --- Cronologia -------------------------------------------------------------
function salvaCronologiaChat() {
  chatHistory = chatHistory.slice(-MAX_MESSAGGI_SALVATI);
  if (utenteLoggato()) return; // loggati: le chat stanno sul server, non nel browser
  scriviStorage("chatHistory", JSON.stringify(chatHistory));
}

function caricaCronologiaChat() {
  const salvata = leggiStorage("chatHistory");
  if (!salvata) return;

  try {
    const parsed = JSON.parse(salvata);
    if (!Array.isArray(parsed)) throw new Error("formato non valido");

    // Si accettano solo messaggi ben formati
    chatHistory = parsed.filter(m =>
      m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    );
  } catch (e) {
    // Dati corrotti: si riparte da zero invece di bloccare la pagina
    rimuoviStorage("chatHistory");
    chatHistory = [];
    return;
  }

  chatBox.innerHTML = "";
  chatHistory.forEach(m => {
    aggiungiMessaggio(m.content, m.role === "user" ? "utente" : "ai", { salva: false });
  });
  aggiornaRigenera();
}

function cancellaCronologiaChat() {
  if (!utenteLoggato()) rimuoviStorage("chatHistory");
  chatBox.innerHTML = "";
  chatHistory = [];
}

window.cancellaCronologiaChat = cancellaCronologiaChat;
window.caricaCronologiaOspite = caricaCronologiaChat;

// Svuota la schermata e parte da una chat nuova (non tocca nulla sul server)
function nuovaChat() {
  epoca++;
  if (richiestaCorrente) richiestaCorrente.abort();
  richiestaCorrente = null;
  inAttesa = false;
  submitButton.disabled = false;
  submitButton.textContent = traduzioni[lingua].invia;
  conversazioneId = null;
  chatHistory = [];
  chatBox.innerHTML = "";
  chatBox.setAttribute("aria-busy", "false");
}

// Mostra una chat salvata sul server: msgs = [{role, content}, ...]
function mostraConversazione(id, msgs, voti = {}) {
  nuovaChat();
  conversazioneId = id;
  const validi = msgs.filter(m =>
    m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
  chatHistory = validi.map(m => ({ role: m.role, content: m.content }));
  validi.forEach(m => {
    aggiungiMessaggio(m.content, m.role === "user" ? "utente" : "ai", {
      salva: false,
      id: Number.isInteger(m.id) ? m.id : null,
      voto: (voti && voti[m.id]) || 0
    });
  });
  aggiornaRigenera();
}

window.nuovaChat = nuovaChat;
window.mostraConversazione = mostraConversazione;

// --- Suggerimenti di domande (solo con la chat vuota) ---------------------------------
// Quattro idee a caso tra quelle disponibili: un tocco e la domanda parte.
let suggerimentiMostrati = [];
function aggiornaSuggerimenti(ridisegna = false) {
  const box = document.getElementById("suggerimenti");
  if (!box) return;
  const vuota = chatBox.children.length === 0;
  box.hidden = !vuota;
  if (!vuota) { suggerimentiMostrati = []; return; }
  if (!ridisegna && suggerimentiMostrati.length && box.childElementCount) return;

  const tutte = messaggi[lingua].suggerimenti.slice();
  for (let i = tutte.length - 1; i > 0; i--) {   // rimescola
    const j = Math.floor(Math.random() * (i + 1));
    [tutte[i], tutte[j]] = [tutte[j], tutte[i]];
  }
  suggerimentiMostrati = tutte.slice(0, 4);
  box.textContent = "";
  const titolo = document.createElement("span");
  titolo.className = "suggerimenti-titolo";
  titolo.textContent = messaggi[lingua].suggerimentiTitolo;
  box.appendChild(titolo);
  suggerimentiMostrati.forEach(testo => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "suggerimento";
    b.textContent = testo;
    b.addEventListener("click", () => {
      if (inAttesa) return;
      inputField.value = testo;
      talkToMiczy();
    });
    box.appendChild(b);
  });
}
new MutationObserver(() => aggiornaSuggerimenti()).observe(chatBox, { childList: true });

// --- Avviso del sito (striscia in cima, deciso dal pannello admin) ------------
// Il testo entra con textContent. Un avviso chiuso resta chiuso finché l'admin non ne scrive uno diverso;
// la manutenzione invece non si può chiudere. Se il backend non risponde, semplicemente non si mostra nulla.
function mostraStriscia(id, tipo, icona, testo, chiudibile) {
  let s = document.getElementById(id);
  if (!s) {
    s = document.createElement("div");
    s.id = id;
    document.body.insertBefore(s, document.body.firstChild);
  }
  s.className = "avviso-sito " + tipo;
  s.setAttribute("role", "status");
  s.textContent = "";
  const t = document.createElement("span");
  t.className = "avviso-testo";
  t.textContent = icona + " " + testo;
  s.appendChild(t);
  if (chiudibile) {
    const x = document.createElement("button");
    x.type = "button";
    x.className = "avviso-chiudi";
    x.setAttribute("aria-label", lingua === "en" ? "Close notice" : "Chiudi avviso");
    x.textContent = "✕";
    x.addEventListener("click", () => { scriviStorage("miczy.avvisoChiuso", testo); s.remove(); });
    s.appendChild(x);
  }
}

async function caricaStatoSito() {
  try {
    const r = await fetch(BACKEND_URL.replace(/\/chat$/, "/status"), { signal: AbortSignal.timeout(10000) });
    if (!r.ok) return;
    const d = await r.json();
    const m = d && d.maintenance, b = d && d.banner;
    if (m && m.on && typeof m.message === "string") mostraStriscia("avvisoManutenzione", "warn", "🚧", m.message, false);
    if (b && b.on && typeof b.text === "string" && b.text && leggiStorage("miczy.avvisoChiuso") !== b.text) {
      const tipo = ["info", "warn", "success"].includes(b.kind) ? b.kind : "info";
      mostraStriscia("avvisoSito", tipo, tipo === "warn" ? "⚠️" : tipo === "success" ? "🎉" : "📣", b.text, true);
    }
  } catch (e) { /* backend addormentato o irraggiungibile: nessun avviso */ }
}

// --- Inizializzazione (un solo punto d'ingresso) -----------------------------
window.addEventListener("load", async () => {
  if (leggiStorage("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }

  const clearBtn = document.querySelector(".clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      if (!confirm(messaggi[lingua].conferma)) return;
      // loggati: cancella anche la chat sul server
      if (utenteLoggato() && conversazioneId && window.Account) {
        await window.Account.eliminaAttiva();
      }
      nuovaChat();
      cancellaCronologiaChat();
    });
  }

  caricaStatoSito();  // senza attendere: non rallenta la pagina
  aggiornaSuggerimenti(true);

  // Prima gli account (può ripristinare l'ultima chat), poi, da ospiti, la cronologia locale
  try {
    if (window.Account) await window.Account.inizializza();
  } catch (e) {
    console.error(e);
  }
  if (!utenteLoggato()) caricaCronologiaChat();
});

// Pulsante social (icona share / X)
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.querySelector(".social-fab");
  const toggle = document.getElementById("fabToggle");
  const icon = document.getElementById("fabIcon");

  const PATH_CHIUDI = "M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3a1 1 0 0 0-1.4 1.4L10.83 12l-5.13 5.1a1 1 0 0 0 1.4 1.4L12 14.83l4.9 4.9a1 1 0 0 0 1.4-1.4L13.17 12l5.13-5.1z";
  const PATH_SHARE = "M18 8a3 3 0 1 0-2.83-2H9.83A3 3 0 1 0 7 8c0 .21.02.42.05.62l6.17 3.7a3.01 3.01 0 1 0 .76-1.3L8.24 7.34A3.01 3.01 0 0 0 6 8z";

  toggle.addEventListener("click", () => {
    const aperto = fab.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(aperto));
    icon.innerHTML = `<path d="${aperto ? PATH_CHIUDI : PATH_SHARE}"/>`;
  });
});

function copyEmail() {
  const email = "miczy690@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const tooltip = document.querySelector(".email-tooltip");
    tooltip.textContent = lingua === "it" ? "Copiata!" : "Copied!";
    setTimeout(() => {
      tooltip.textContent = email;
    }, 1500);
  }).catch(() => { /* clipboard non disponibile */ });
}

// Modale cookie
document.addEventListener("DOMContentLoaded", () => {
  const cookieBtn = document.getElementById("cookieBtn");
  const cookieModal = document.getElementById("cookieModal");
  const closeCookie = document.getElementById("closeCookie");

  if (cookieBtn && cookieModal && closeCookie) {
    cookieBtn.addEventListener("click", () => cookieModal.classList.add("show"));
    closeCookie.addEventListener("click", () => cookieModal.classList.remove("show"));
  }
});
