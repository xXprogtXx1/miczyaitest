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
    rigenera: "Rigenera risposta"
  },
  en: {
    mhhh: "hmm...",
    nessunaRisposta: "No response received 😐",
    erroreServer: "The server returned an error. Please try again shortly 😢",
    timeout: "The server is taking too long to respond. Please try again shortly ⏳",
    avvio: "Waking up the server, this can take up to a minute... ☕",
    conferma: "Are you sure you want to clear the chat history?",
    vuoto: "Type something. I promise I'll try.",
    rigenera: "Regenerate response"
  }
};

const BACKEND_URL =
  ((window.MICZY_CONFIG && window.MICZY_CONFIG.backendUrl) || "https://backend-miczy-ai.onrender.com")
    .replace(/\/$/, "") + "/chat";
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
  aggiornaRigenera();
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

function aggiungiMessaggio(testo, mittente, { salva = true } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg-wrapper ${mittente}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = mittente === "ai" ? "🤖" : "👤";

  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  if (mittente === "ai") {
    renderMarkdownSicuro(msg, testo);
  } else {
    msg.textContent = testo; // mai HTML per i messaggi dell'utente
  }

  const bottomRow = document.createElement("div");
  bottomRow.className = "msg-meta";
  if (mittente === "ai") bottomRow.appendChild(creaPulsanteCopia(testo));
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
  avatar.textContent = "🤖";

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
function scriviRispostaGraduale(testo) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-wrapper ai";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "🤖";

  const msg = document.createElement("div");
  msg.className = "msg ai";

  const bottomRow = document.createElement("div");
  bottomRow.className = "msg-meta";
  bottomRow.appendChild(creaPulsanteCopia(testo));

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

// --- Comunicazione con il backend ------------------------------------------
let inAttesa = false;

async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input || inAttesa) return;

  rimuoviRigenera();
  aggiungiMessaggio(input, "utente");
  chatHistory.push({ role: "user", content: input });

  const riuscito = await chiediRisposta();
  if (riuscito) inputField.value = ""; // in caso di errore il testo non si perde
  else aggiornaRigenera();
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
    const corpo = { messages: chatHistory.slice(-MAX_MESSAGGI_INVIATI) }; // niente payload infiniti

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

    const data = await response.json();
    if (epocaRichiesta !== epoca) return false; // nel frattempo si è cambiata chat
    rimuoviLoader();

    if (utenteLoggato() && data && typeof data.conversation_id === "string") {
      conversazioneId = data.conversation_id;
    }

    const risposta =
      data && typeof data.response === "string" && data.response.trim()
        ? data.response
        : messaggi[lingua].nessunaRisposta;

    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    scriviRispostaGraduale(risposta);
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

    const mostraServer = [400, 401, 403, 404, 429, 503].includes(error.stato) && error.messaggioServer;
    const testoErrore =
      mostraServer ? error.messaggioServer :
      error.name === "AbortError" ? messaggi[lingua].timeout :
      error instanceof TypeError ? traduzioni[lingua].erroreChat :
      messaggi[lingua].erroreServer;

    aggiungiMessaggio(testoErrore, "ai", { salva: false }).classList.add("errore");

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
function mostraConversazione(id, msgs) {
  nuovaChat();
  conversazioneId = id;
  chatHistory = msgs.filter(m =>
    m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  ).map(m => ({ role: m.role, content: m.content }));
  chatHistory.forEach(m => {
    aggiungiMessaggio(m.content, m.role === "user" ? "utente" : "ai", { salva: false });
  });
  aggiornaRigenera();
}

window.nuovaChat = nuovaChat;
window.mostraConversazione = mostraConversazione;

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
