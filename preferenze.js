// Preferenze dell'utente: stile del sito, icone, dimensione del testo, lunghezza delle risposte.
// Si caricano per prime (nell'<head>) così lo stile e il testo giusti compaiono subito, senza lampi.
// Qui non c'è niente di rete: salvataggio nel browser. La sincronizzazione con l'account sta in impostazioni.js.
(function () {
  "use strict";

  const CHIAVE = "miczy.preferenze";

  // Tutto ciò che si può scegliere. Ogni valore letto da fuori (storage, account) viene controllato qui.
  const OPZIONI = {
    stile: ["miczy", "menta", "tramonto", "oceano", "carta", "hacker", "alieno", "arcobaleno", "oro", "sakura", "spazio"],
    testo: ["piccolo", "normale", "grande", "enorme"],
    lunghezza: ["breve", "normale", "lunga"],
    iconaUtente: ["👤", "😎", "🐱", "🦊", "🐼", "🐸", "🦄", "👾", "🧑‍🚀", "🎮"],
    iconaBot: ["🤖", "👽", "🧠", "🔮", "🐙", "🦉", "⚡", "👻", "🛸", "🎲"]
  };
  const PREDEFINITE = { stile: "miczy", testo: "normale", lunghezza: "normale", iconaUtente: "👤", iconaBot: "🤖" };
  const SCALA_TESTO = { piccolo: "87.5%", normale: "100%", grande: "112.5%", enorme: "125%" };

  let valori = Object.assign({}, PREDEFINITE);
  const ascoltatori = [];

  // Tiene solo campi noti con valori ammessi: tutto il resto viene ignorato.
  function pulisci(grezzo) {
    const out = {};
    if (!grezzo || typeof grezzo !== "object" || Array.isArray(grezzo)) return out;
    Object.keys(OPZIONI).forEach(k => {
      if (typeof grezzo[k] === "string" && OPZIONI[k].indexOf(grezzo[k]) !== -1) out[k] = grezzo[k];
    });
    return out;
  }

  function leggiStorage() {
    try { return JSON.parse(localStorage.getItem(CHIAVE) || "{}"); } catch (e) { return {}; }
  }
  function scriviStorage() {
    try { localStorage.setItem(CHIAVE, JSON.stringify(valori)); } catch (e) { /* storage bloccato: resta per questa visita */ }
  }

  function applica() {
    const html = document.documentElement;
    html.setAttribute("data-stile", valori.stile);
    html.style.fontSize = SCALA_TESTO[valori.testo];
    // icone: anche sui messaggi già scritti
    if (document.body) {
      document.querySelectorAll(".msg-wrapper.utente .avatar").forEach(a => { a.textContent = valori.iconaUtente; });
      document.querySelectorAll(".msg-wrapper.ai .avatar").forEach(a => { a.textContent = valori.iconaBot; });
    }
  }

  function avvisa() {
    ascoltatori.forEach(f => { try { f(Object.assign({}, valori)); } catch (e) { /* un ascoltatore rotto non blocca gli altri */ } });
  }

  // Cambia una o più preferenze. { da } = "locale" | "account": dall'account non si riscrive l'account.
  function imposta(campi, da) {
    const nuovi = pulisci(campi);
    if (!Object.keys(nuovi).length) return false;
    Object.assign(valori, nuovi);
    scriviStorage();
    applica();
    avvisa();
    return true;
  }

  // Sostituisce tutto (usato dopo l'accesso, con quello che c'è nell'account)
  function sostituisci(campi) {
    valori = Object.assign({}, PREDEFINITE, pulisci(campi));
    scriviStorage();
    applica();
    avvisa();
  }

  function ripristina() { sostituisci({}); }

  // Solo i valori diversi da quelli predefiniti: è ciò che si salva nell'account
  function personalizzate() {
    const out = {};
    Object.keys(PREDEFINITE).forEach(k => { if (valori[k] !== PREDEFINITE[k]) out[k] = valori[k]; });
    return out;
  }

  // Le preferenze sono per chi ha un account: senza una sessione salvata valgono i valori predefiniti
  let haSessione = false;
  try { haSessione = !!localStorage.getItem("miczy.sessione"); } catch (e) { /* storage bloccato */ }
  valori = haSessione ? Object.assign({}, PREDEFINITE, pulisci(leggiStorage())) : Object.assign({}, PREDEFINITE);
  applica();
  document.addEventListener("DOMContentLoaded", applica);

  window.Preferenze = {
    opzioni: OPZIONI,
    predefinite: PREDEFINITE,
    leggi: () => Object.assign({}, valori),
    imposta, sostituisci, ripristina, personalizzate, pulisci,
    iconaUtente: () => valori.iconaUtente,
    iconaBot: () => valori.iconaBot,
    lunghezza: () => valori.lunghezza,
    onCambio: f => ascoltatori.push(f)
  };
})();
