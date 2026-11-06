// Barra "quanto è sicura la password" mentre la si scrive. È un consiglio, non un blocco:
// la regola minima (8 caratteri) resta quella del server. Tutto avviene nel browser,
// la password non viene inviata da nessuna parte.
(function () {
  "use strict";

  const COMUNI = ["password", "passw0rd", "qwerty", "qwertyuiop", "azerty", "123456", "12345678", "123456789", "1234567890",
    "111111", "000000", "abc123", "iloveyou", "admin", "letmein", "welcome", "monkey", "dragon", "football", "baseball",
    "ciao", "ciaociao", "italia", "juventus", "milan", "inter", "napoli", "roma", "password1", "qazwsx", "miczyai", "miczy"];
  const SEQUENZE = ["abcdefghijklmnopqrstuvwxyz", "qwertyuiopasdfghjklzxcvbnm", "0123456789", "9876543210"];

  const TESTI = {
    it: {
      livelli: ["Molto debole", "Debole", "Discreta", "Buona", "Ottima"],
      titolo: "Sicurezza della password",
      vuota: "",
      consigli: {
        corta: "Usa almeno 8 caratteri.",
        comune: "È una password molto usata: scegline un'altra.",
        email: "Non usare la tua email nella password.",
        ripetuta: "Evita caratteri ripetuti o in sequenza.",
        lunga: "Più è lunga, meglio è: prova una frase di 3-4 parole.",
        mista: "Mescola maiuscole, minuscole, numeri e simboli."
      }
    },
    en: {
      livelli: ["Very weak", "Weak", "Fair", "Good", "Excellent"],
      titolo: "Password strength",
      vuota: "",
      consigli: {
        corta: "Use at least 8 characters.",
        comune: "This is a very common password: pick another one.",
        email: "Don't use your email in the password.",
        ripetuta: "Avoid repeated or sequential characters.",
        lunga: "The longer the better: try a phrase of 3-4 words.",
        mista: "Mix upper and lower case, numbers and symbols."
      }
    }
  };
  const lingua = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");

  function haSequenza(p) {
    const s = p.toLowerCase();
    for (let i = 0; i + 3 <= s.length; i++) {
      const tre = s.slice(i, i + 3);
      if (SEQUENZE.some(q => q.includes(tre))) return true;
    }
    return false;
  }

  // Restituisce { livello: 0..4, consiglio: chiave|null }. Pura: la si può testare da sola.
  function valuta(password, email) {
    const p = String(password || "");
    if (!p) return { livello: -1, consiglio: null };
    const minuscolo = p.toLowerCase();
    const locale = String(email || "").split("@")[0].toLowerCase();
    if (p.length < 8) return { livello: 0, consiglio: "corta" };
    if (COMUNI.includes(minuscolo) || COMUNI.some(c => c.length >= 6 && minuscolo.replace(/[^a-z0-9]/g, "") === c)) {
      return { livello: 0, consiglio: "comune" };
    }
    const usaEmail = locale.length >= 4 && minuscolo.includes(locale);

    const classi = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(p)).length;
    const distinti = new Set(p).size;
    let punti = 0;
    punti += p.length >= 8 ? 1 : 0;
    punti += p.length >= 12 ? 1 : 0;
    punti += p.length >= 16 ? 1 : 0;
    punti += classi >= 3 ? 1 : 0;
    punti += classi === 4 && p.length >= 10 ? 1 : 0;
    let consiglio = null;
    if (distinti < Math.max(4, p.length / 3) || /(.)\1{2,}/.test(p) || haSequenza(p)) { punti -= 2; consiglio = "ripetuta"; }
    if (usaEmail) { punti -= 2; consiglio = "email"; }
    if (classi === 1) punti -= 1;
    const livello = Math.max(0, Math.min(4, punti - 1));
    if (!consiglio) consiglio = p.length < 12 ? "lunga" : classi < 3 ? "mista" : null;
    return { livello, consiglio: livello >= 4 ? null : consiglio };
  }

  // Aggiunge la barra subito dopo "input". "emailDi" dà l'email corrente, "attivoDi" dice se mostrarla (entrambe facoltative).
  function monta(input, emailDi, attivoDi) {
    const box = document.createElement("div");
    box.className = "forza";
    box.hidden = true;
    const barra = document.createElement("div");
    barra.className = "forza-barra";
    barra.setAttribute("role", "meter");
    barra.setAttribute("aria-valuemin", "0"); barra.setAttribute("aria-valuemax", "4");
    for (let i = 0; i < 5; i++) barra.appendChild(document.createElement("span"));
    const testo = document.createElement("p");
    testo.className = "forza-testo";
    testo.setAttribute("aria-live", "polite");
    box.append(barra, testo);
    input.insertAdjacentElement("afterend", box);

    function aggiorna() {
      const T = TESTI[lingua()];
      const r = valuta(input.value, emailDi ? emailDi() : "");
      box.hidden = r.livello < 0 || (attivoDi ? !attivoDi() : false);
      if (r.livello < 0) { testo.textContent = ""; return; }
      box.dataset.livello = String(r.livello);
      barra.setAttribute("aria-label", T.titolo);
      barra.setAttribute("aria-valuenow", String(r.livello));
      barra.setAttribute("aria-valuetext", T.livelli[r.livello]);
      Array.from(barra.children).forEach((sp, i) => sp.classList.toggle("on", i <= r.livello));
      testo.textContent = "";
      const b = document.createElement("b"); b.textContent = T.livelli[r.livello];
      testo.appendChild(b);
      if (r.consiglio) testo.appendChild(document.createTextNode(" · " + T.consigli[r.consiglio]));
    }
    input.addEventListener("input", aggiorna);
    aggiorna();
    return { aggiorna, elemento: box };
  }

  window.ForzaPassword = { valuta, monta };
})();
