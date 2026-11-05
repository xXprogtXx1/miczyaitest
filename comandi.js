// Comandi della chat: scrivi "/" per vedere il menu. Cambiano solo l'aspetto del sito, non arrivano al bot.
(function () {
  "use strict";
  const P = window.Preferenze, Auth = window.MiczyAuth;
  const campo = document.getElementById("userInput"), menu = document.getElementById("cmdMenu");
  if (!P || !campo || !menu) return;

  const SOLO_REGISTRATI = true; // false = i comandi funzionano anche per gli ospiti

  const COMANDI = [
    { nome: "hacker", it: "Terminale verde, stile hacker", en: "Green hacker terminal", modo: "hacker" },
    { nome: "bubble", alias: ["nuvola", "cloud"], it: "I messaggi diventano nuvole", en: "Messages become clouds", modo: "bubble" },
    { nome: "crt", it: "Vecchio monitor ambra", en: "Old amber monitor", modo: "crt" },
    { nome: "pixel", it: "Bordi a scalini, 8-bit", en: "Stepped borders, 8-bit", modo: "pixel" },
    { nome: "neon", it: "Luci al neon", en: "Neon lights", modo: "neon" },
    { nome: "pergamena", alias: ["parchment"], it: "Carta antica e inchiostro", en: "Old paper and ink", modo: "pergamena" },
    { nome: "normale", alias: ["normal", "reset"], it: "Torna all'aspetto normale", en: "Back to normal", modo: "normale" },
    { nome: "confetti", it: "Una festa di coriandoli", en: "A burst of confetti", azione: "confetti" },
    { nome: "aiuto", alias: ["help"], it: "Mostra tutti i comandi", en: "Show all commands", azione: "aiuto" }
  ];
  const TESTI = {
    it: { attivo: "Modo attivo. Scrivi /normale per uscire.", normale: "Aspetto normale.", sconosciuto: "Comando sconosciuto. Scrivi / per vedere l'elenco.", accedi: "Accedi per usare i comandi", accediBtn: "Accedi", bloccato: "I comandi sono per chi ha un account: accedi per usarli.", menu: "Comandi", movimento: "Coriandoli disattivati: il sistema chiede meno movimento." },
    en: { attivo: "Mode on. Type /normal to leave.", normale: "Back to normal.", sconosciuto: "Unknown command. Type / to see the list.", accedi: "Sign in to use commands", accediBtn: "Sign in", bloccato: "Commands are for people with an account: sign in to use them.", menu: "Commands", movimento: "Confetti off: your system asks for less motion." }
  };
  const lingua = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");
  const loggato = () => !!(Auth && Auth.utente && Auth.utente());
  const avvisa = (t, err) => { if (window.Account && window.Account.avviso) window.Account.avviso(t, !!err); };
  const trova = nome => COMANDI.find(c => c.nome === nome || (c.alias || []).indexOf(nome) !== -1);

  let elenco = [], scelto = 0;

  function chiudi() { menu.hidden = true; menu.textContent = ""; elenco = []; campo.removeAttribute("aria-activedescendant"); campo.setAttribute("aria-expanded", "false"); }

  function disegna() {
    menu.textContent = "";
    const l = lingua(), T = TESTI[l], blocca = SOLO_REGISTRATI && !loggato();
    elenco.forEach((c, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "cmd-voce" + (blocca ? " bloccato" : ""); b.id = "cmd-" + c.nome; b.setAttribute("role", "option");
      b.setAttribute("aria-selected", String(i === scelto)); b.tabIndex = -1;
      const n = document.createElement("b"); n.textContent = (blocca ? "🔒 " : "") + "/" + c.nome;
      const d = document.createElement("span"); d.textContent = c[l];
      b.append(n, d);
      b.addEventListener("mousedown", e => e.preventDefault()); // il campo non perde il focus
      b.addEventListener("click", () => { campo.value = "/" + c.nome; esegui("/" + c.nome); campo.value = ""; chiudi(); campo.focus(); });
      menu.appendChild(b);
    });
    if (blocca) {
      const nota = document.createElement("p"); nota.className = "cmd-nota"; nota.append(T.accedi + " · ");
      const a = document.createElement("button"); a.type = "button"; a.textContent = T.accediBtn;
      a.addEventListener("mousedown", e => e.preventDefault());
      a.addEventListener("click", () => { chiudi(); const x = document.getElementById("accountBtn"); if (x) x.click(); });
      nota.appendChild(a); menu.appendChild(nota);
    }
    menu.setAttribute("aria-label", T.menu);
    menu.hidden = !elenco.length;
    campo.setAttribute("aria-expanded", String(!menu.hidden));
    const att = elenco[scelto]; if (att) campo.setAttribute("aria-activedescendant", "cmd-" + att.nome);
  }

  function aggiorna() {
    const v = campo.value;
    if (!/^\/[^\s/]*$/.test(v)) return chiudi();
    const q = v.slice(1).toLowerCase();
    elenco = COMANDI.filter(c => c.nome.indexOf(q) === 0 || (c.alias || []).some(a => a.indexOf(q) === 0));
    scelto = Math.min(scelto, Math.max(0, elenco.length - 1));
    disegna();
  }

  // --- effetti
  function coriandoli() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return avvisa(TESTI[lingua()].movimento);
    const cv = document.createElement("canvas"); cv.className = "coriandoli"; cv.setAttribute("aria-hidden", "true");
    cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
    const g = cv.getContext("2d"), col = ["#ff5ca8", "#ffd93d", "#3ddcff", "#43e8a0", "#b48cff"];
    const pezzi = Array.from({ length: 140 }, () => ({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.5, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      vy: 2 + Math.random() * 3.5, vx: -1.5 + Math.random() * 3, r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4, c: col[(Math.random() * col.length) | 0] }));
    const fine = performance.now() + 3200;
    (function giro(t) {
      g.clearRect(0, 0, cv.width, cv.height);
      pezzi.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); });
      if (t < fine) requestAnimationFrame(giro); else cv.remove();
    })(performance.now());
  }

  // Esegue un comando; restituisce true se il testo era un comando (anche sconosciuto o bloccato)
  function esegui(testo) {
    const m = /^\/([^\s/]+)$/.exec(String(testo).trim().toLowerCase());
    if (!m) return false;
    chiudi();
    const T = TESTI[lingua()], c = trova(m[1]);
    if (!c) { avvisa(T.sconosciuto, true); return true; }
    if (SOLO_REGISTRATI && !loggato()) { avvisa(T.bloccato, true); return true; }
    if (c.azione === "aiuto") { campo.value = "/"; campo.focus(); aggiorna(); return true; }
    if (c.azione === "confetti") { coriandoli(); return true; }
    P.imposta({ modo: c.modo });
    avvisa(c.modo === "normale" ? T.normale : T.attivo);
    return true;
  }

  campo.setAttribute("aria-autocomplete", "list"); campo.setAttribute("aria-controls", "cmdMenu"); campo.setAttribute("aria-expanded", "false");
  campo.addEventListener("input", () => { scelto = 0; aggiorna(); });
  campo.addEventListener("blur", () => setTimeout(chiudi, 120));
  // in fase di cattura: deve decidere prima del gestore di Invio di script.js
  campo.addEventListener("keydown", e => {
    if (menu.hidden || !elenco.length) return;
    const ferma = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { ferma(); scelto = (scelto + (e.key === "ArrowDown" ? 1 : -1) + elenco.length) % elenco.length; disegna(); }
    else if (e.key === "Tab" || (e.key === "Enter" && campo.value.trim().toLowerCase() !== "/" + elenco[scelto].nome)) {
      ferma(); campo.value = "/" + elenco[scelto].nome; aggiorna();   // completa; un secondo Invio esegue
    } else if (e.key === "Escape") { ferma(); chiudi(); }
  }, true);
  if (Auth && Auth.onCambio) Auth.onCambio(() => { if (!menu.hidden) aggiorna(); });

  window.Comandi = { gestisci: esegui, elenco: () => COMANDI.map(c => c.nome) };
})();
