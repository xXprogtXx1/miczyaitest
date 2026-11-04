// Selettore dei temi nell'intestazione, accanto all'interruttore chiaro/scuro.
// Ospiti: pulsante "+" con invito ad accedere. Registrati: elenco dei temi.
(function () {
  "use strict";
  const P = window.Preferenze, Auth = window.MiczyAuth;
  const wrap = document.getElementById("temiWrap"), btn = document.getElementById("temiBtn"), menu = document.getElementById("temiMenu");
  if (!P || !wrap || !btn || !menu) return;

  const TESTI = {
    it: { titolo: "Temi", invito: "Accedi per più temi", testo: "Con un account puoi scegliere tra 11 temi, come Hacker, Alieno, Arcobaleno e Oro.", accedi: "Accedi", etichetta: "Scegli il tema",
      nomi: { miczy: "Miczy", menta: "Menta", tramonto: "Tramonto", oceano: "Oceano", carta: "Carta", hacker: "Hacker", alieno: "Alieno", arcobaleno: "Arcobaleno", oro: "Oro", sakura: "Sakura", spazio: "Spazio" } },
    en: { titolo: "Themes", invito: "Sign in for more themes", testo: "With an account you can pick from 11 themes, like Hacker, Alien, Rainbow and Gold.", accedi: "Sign in", etichetta: "Choose theme",
      nomi: { miczy: "Miczy", menta: "Mint", tramonto: "Sunset", oceano: "Ocean", carta: "Paper", hacker: "Hacker", alieno: "Alien", arcobaleno: "Rainbow", oro: "Gold", sakura: "Sakura", spazio: "Space" } }
  };
  const CAMPIONI = {
    miczy: ["#d9ccff", "#ffd93d", "#ff5ca8"], menta: ["#c6f3dc", "#6fe3a8", "#ff9a6b"], tramonto: ["#ffd9c2", "#ffb347", "#ff6f91"],
    oceano: ["#cfe6ff", "#7cc4ff", "#ff8f7a"], carta: ["#ececec", "#ffffff", "#d9d9d9"], hacker: ["#000a00", "#1aff55", "#7dff9d"],
    alieno: ["#0a0614", "#b6ff3c", "#a64dff"], arcobaleno: ["#ff6b6b", "#ffe14d", "#4dd2ff"], oro: ["#0b0903", "#f5c542", "#b8860b"],
    sakura: ["#ffe3ee", "#ff9ac8", "#ff5fa2"], spazio: ["#02030f", "#8fb4ff", "#ffb86b"]
  };
  const lingua = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");
  const t = () => TESTI[lingua()];
  const loggato = () => !!(Auth && Auth.utente && Auth.utente());

  function pallini(v) {
    const s = document.createElement("span"); s.className = "temi-pallini"; s.setAttribute("aria-hidden", "true");
    CAMPIONI[v].forEach(c => { const i = document.createElement("i"); i.style.background = c; s.appendChild(i); });
    return s;
  }
  function apriAccesso() {
    chiudi();
    const a = document.getElementById("accountBtn");
    if (a) a.click();
  }
  function disegna() {
    const T = t();
    menu.textContent = "";
    btn.setAttribute("aria-label", T.titolo); btn.title = T.titolo;
    if (!loggato()) {
      btn.textContent = "+"; btn.classList.remove("temi-attivo");
      const box = document.createElement("div"); box.className = "temi-invito";
      const h = document.createElement("h3"); h.textContent = T.invito;
      const p = document.createElement("p"); p.textContent = T.testo;
      const lock = document.createElement("div"); lock.className = "temi-bloccati";
      ["hacker", "alieno", "arcobaleno", "oro"].forEach(v => { const s = document.createElement("span"); s.textContent = "🔒 " + T.nomi[v]; lock.appendChild(s); });
      const b = document.createElement("button"); b.type = "button"; b.className = "temi-accedi"; b.textContent = T.accedi;
      b.addEventListener("click", apriAccesso);
      box.append(h, p, lock, b); menu.appendChild(box);
      return;
    }
    const attuale = P.leggi().stile;
    btn.textContent = ""; btn.appendChild(pallini(attuale));
    const h = document.createElement("h3"); h.textContent = T.etichetta; h.id = "temiTitolo";
    const lista = document.createElement("div"); lista.className = "temi-lista"; lista.setAttribute("role", "radiogroup"); lista.setAttribute("aria-labelledby", "temiTitolo");
    P.opzioni.stile.forEach(v => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "radio"); b.dataset.valore = v;
      b.setAttribute("aria-checked", String(v === attuale)); b.tabIndex = v === attuale ? 0 : -1;
      b.append(pallini(v), document.createTextNode(T.nomi[v]));
      b.addEventListener("click", () => P.imposta({ stile: v }));
      lista.appendChild(b);
    });
    lista.addEventListener("keydown", e => {
      const giu = e.key === "ArrowDown" || e.key === "ArrowRight", su = e.key === "ArrowUp" || e.key === "ArrowLeft";
      if (!giu && !su) return;
      e.preventDefault();
      const bs = [...lista.children], i = bs.findIndex(b => b.getAttribute("aria-checked") === "true");
      const n = bs[(i + (giu ? 1 : -1) + bs.length) % bs.length];
      P.imposta({ stile: n.dataset.valore });
      const dopo = menu.querySelector('[aria-checked="true"]'); if (dopo) dopo.focus();
    });
    menu.append(h, lista);
  }
  function apri() {
    wrap.classList.add("open"); btn.setAttribute("aria-expanded", "true");
    // tiene il menu dentro lo schermo anche quando il pulsante è vicino al bordo sinistro
    menu.style.right = "0"; menu.style.left = "auto";
    const r = menu.getBoundingClientRect(), w = document.documentElement.clientWidth;
    if (r.left < 8) menu.style.right = (r.left - 8) + "px";
    else if (r.right > w - 8) menu.style.right = (r.right - w + 8) + "px";
  }
  function chiudi() { wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  btn.addEventListener("click", e => { e.stopPropagation(); wrap.classList.contains("open") ? chiudi() : apri(); });
  document.addEventListener("click", e => { if (!wrap.contains(e.target)) chiudi(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && wrap.classList.contains("open")) { chiudi(); btn.focus(); } });

  P.onCambio(disegna);
  if (Auth && Auth.onCambio) Auth.onCambio(disegna);
  window.Temi = { aggiornaTesti: disegna };
  disegna();
})();
