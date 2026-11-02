// Pannello admin di MiczyAI. Tutto il testo che arriva dal server entra nella pagina con
// textContent (mai innerHTML), quindi email, motivi e messaggi non possono eseguire codice.
// Il controllo vero dei permessi è sul backend: questa pagina da sola non dà alcun potere.
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const el = (tag, classe, testo) => {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (testo !== undefined) e.textContent = testo;
    return e;
  };

  try { if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark-mode"); } catch (e) { /* ignora */ }

  let utenti = [];

  function stato(testo, errore) {
    const s = $("stato");
    s.textContent = testo || "";
    s.hidden = !testo;
    s.classList.toggle("err", !!errore);
  }

  const dataLeggibile = iso => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // Messaggio di errore dal backend: {"error": "..."}
  function erroreDa(r) {
    if (r.stato === 0) return "Il server non risponde. Riprova tra poco.";
    if (r.stato === 401) return "Sessione scaduta: torna al sito e accedi di nuovo.";
    if (r.stato === 403) return "Non hai i permessi di amministratore.";
    return (r.dati && (r.dati.error || r.dati.response)) || "Errore imprevisto.";
  }

  // --- Elenco utenti ------------------------------------------------------------
  function infoBan(u) {
    if (!u.banned_until) return null;
    const fine = new Date(u.banned_until);
    if (isNaN(fine) || fine <= new Date()) return null;
    return { permanente: fine.getFullYear() >= 2900, fine, motivo: u.ban_reason || "" };
  }

  function disegna() {
    const corpo = $("righe");
    corpo.textContent = "";
    $("vuoto").hidden = utenti.length > 0;

    utenti.forEach(u => {
      const tr = document.createElement("tr");

      const tdMail = el("td", "mail", u.email || "(senza email)");
      tdMail.appendChild(el("small", "sub", "Iscritto " + dataLeggibile(u.created_at)));
      tr.appendChild(tdMail);

      const tdStato = el("td");
      const ban = infoBan(u);
      if (u.is_admin) tdStato.appendChild(el("span", "tag adm", "admin"));
      else if (ban) {
        tdStato.appendChild(el("span", "tag ban", ban.permanente ? "sospeso (per sempre)" : "sospeso"));
        if (!ban.permanente) tdStato.appendChild(el("small", "sub", "fino al " + dataLeggibile(ban.fine)));
        if (ban.motivo) tdStato.appendChild(el("small", "sub", "Motivo: " + ban.motivo));
      } else tdStato.appendChild(el("span", "tag ok", "attivo"));
      tr.appendChild(tdStato);

      tr.appendChild(el("td", "", String(u.messages_24h ?? 0)));
      tr.appendChild(el("td", "", String(u.messages_total ?? 0)));
      tr.appendChild(el("td", "", u.daily_limit === null || u.daily_limit === undefined ? "standard" : String(u.daily_limit)));

      const tdAz = el("td");
      const az = el("div", "azioni");
      const bMsg = el("button", "btn", "Messaggi"); bMsg.type = "button";
      bMsg.addEventListener("click", () => apriMessaggi(u));
      az.appendChild(bMsg);
      const bLim = el("button", "btn", "Limite"); bLim.type = "button";
      bLim.addEventListener("click", () => apriLimite(u));
      az.appendChild(bLim);
      if (!u.is_admin) {
        if (ban) {
          const b = el("button", "btn verde", "Riattiva"); b.type = "button";
          b.addEventListener("click", () => riattiva(u, b));
          az.appendChild(b);
        } else {
          const b = el("button", "btn rosso", "Sospendi"); b.type = "button";
          b.addEventListener("click", () => apriSospensione(u));
          az.appendChild(b);
        }
      }
      tdAz.appendChild(az);
      tr.appendChild(tdAz);

      corpo.appendChild(tr);
    });
  }

  async function carica() {
    const q = $("cerca").value.trim();
    const r = await MiczyAuth.backend("/admin/users?limit=100" + (q ? "&q=" + encodeURIComponent(q) : ""));
    if (!r.ok) { stato(erroreDa(r), true); return false; }
    stato("");
    utenti = (r.dati && r.dati.users) || [];
    disegna();
    return true;
  }

  // --- Finestre -----------------------------------------------------------------
  function apriScheda(contenuto) {
    const s = $("scheda");
    s.textContent = "";
    s.appendChild(contenuto);
    $("velo").classList.add("show");
  }
  function chiudiScheda() { $("velo").classList.remove("show"); $("scheda").textContent = ""; }

  $("velo").addEventListener("click", e => { if (e.target === $("velo")) chiudiScheda(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") chiudiScheda(); });

  function bottoniFondo(testoOk, classeOk) {
    const f = el("div", "fondo");
    const annulla = el("button", "btn", "Annulla"); annulla.type = "button";
    annulla.addEventListener("click", chiudiScheda);
    const ok = el("button", "btn " + (classeOk || ""), testoOk); ok.type = "submit";
    f.append(annulla, ok);
    return { f, ok };
  }

  function etichetta(testo, campo) {
    const l = el("label", "", testo);
    l.appendChild(campo);
    campo.style.marginTop = "0.2rem";
    return l;
  }

  function apriSospensione(u) {
    const form = el("form", "form");
    form.appendChild(el("h2", "", "Sospendi " + (u.email || "utente")));

    const durata = document.createElement("select");
    [["1", "1 ora"], ["6", "6 ore"], ["24", "1 giorno"], ["72", "3 giorni"], ["168", "7 giorni"],
     ["720", "30 giorni"], ["permanente", "Per sempre"]].forEach(([v, t]) => {
      const o = document.createElement("option"); o.value = v; o.textContent = t; durata.appendChild(o);
    });
    durata.value = "24";
    form.appendChild(etichetta("Durata", durata));

    const motivo = document.createElement("input");
    motivo.type = "text"; motivo.maxLength = 200; motivo.placeholder = "Es. spam (l'utente lo vedrà)";
    form.appendChild(etichetta("Motivo (facoltativo)", motivo));

    const err = el("p", "msg err"); err.hidden = true;
    form.appendChild(err);
    const { f, ok } = bottoniFondo("Sospendi", "rosso");
    form.appendChild(f);

    form.addEventListener("submit", async e => {
      e.preventDefault();
      ok.disabled = true;
      const corpo = { user_id: u.id, reason: motivo.value.trim() };
      if (durata.value === "permanente") corpo.permanent = true; else corpo.hours = Number(durata.value);
      const r = await MiczyAuth.backend("/admin/ban", { metodo: "POST", corpo });
      if (r.ok) { chiudiScheda(); carica(); }
      else { err.textContent = erroreDa(r); err.hidden = false; ok.disabled = false; }
    });
    apriScheda(form);
  }

  async function riattiva(u, bottone) {
    bottone.disabled = true;
    const r = await MiczyAuth.backend("/admin/unban", { metodo: "POST", corpo: { user_id: u.id } });
    if (r.ok) carica(); else { stato(erroreDa(r), true); bottone.disabled = false; }
  }

  function apriLimite(u) {
    const form = el("form", "form");
    form.appendChild(el("h2", "", "Limite messaggi · " + (u.email || "utente")));
    form.appendChild(el("p", "", "Quanti messaggi può mandare nelle 24 ore. Lascia vuoto per il limite standard del sito."));

    const num = document.createElement("input");
    num.type = "number"; num.min = "0"; num.max = "100000"; num.step = "1";
    num.placeholder = "standard";
    if (u.daily_limit !== null && u.daily_limit !== undefined) num.value = String(u.daily_limit);
    form.appendChild(etichetta("Messaggi al giorno", num));

    const err = el("p", "msg err"); err.hidden = true;
    form.appendChild(err);
    const { f, ok } = bottoniFondo("Salva", "verde");
    form.appendChild(f);

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const testo = num.value.trim();
      let valore = null;
      if (testo !== "") {
        if (!/^\d+$/.test(testo)) { err.textContent = "Inserisci un numero intero."; err.hidden = false; return; }
        valore = Number(testo);
      }
      ok.disabled = true;
      const r = await MiczyAuth.backend("/admin/limit", { metodo: "POST", corpo: { user_id: u.id, daily_limit: valore } });
      if (r.ok) { chiudiScheda(); carica(); }
      else { err.textContent = erroreDa(r); err.hidden = false; ok.disabled = false; }
    });
    apriScheda(form);
  }

  async function apriMessaggi(u) {
    const box = el("div");
    box.appendChild(el("h2", "", "Ultimi messaggi · " + (u.email || "utente")));
    const attesa = el("p", "msg", "Caricamento…");
    box.appendChild(attesa);
    const chiudi = el("button", "btn", "Chiudi"); chiudi.type = "button";
    chiudi.addEventListener("click", chiudiScheda);
    apriScheda(box);

    const r = await MiczyAuth.backend("/admin/messages?limit=60&user_id=" + encodeURIComponent(u.id));
    attesa.remove();
    if (!r.ok) {
      const e = el("p", "msg err", erroreDa(r)); box.appendChild(e);
    } else {
      const lista = (r.dati && r.dati.messages) || [];
      if (!lista.length) box.appendChild(el("p", "msg", "Nessun messaggio salvato."));
      const ul = el("ul", "chat-log");
      lista.forEach(m => {
        const li = el("li", m.role === "user" ? "user" : "ai");
        li.appendChild(el("small", "", (m.role === "user" ? "Utente" : "MiczyAI") + " · " + dataLeggibile(m.created_at)));
        li.appendChild(document.createTextNode(String(m.content || "")));
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }
    const f = el("div", "fondo"); f.appendChild(chiudi); box.appendChild(f);
  }

  // --- Avvio --------------------------------------------------------------------
  async function avvio() {
    if (!MiczyAuth.configurato()) {
      return stato("L'accesso non è ancora configurato: controlla config.js.", true);
    }
    await MiczyAuth.inizializza();
    if (!MiczyAuth.utente()) {
      stato("Per entrare nel pannello devi prima accedere dal sito con il tuo account admin.", true);
      return;
    }
    const me = await MiczyAuth.backend("/me");
    if (!me.ok) return stato(erroreDa(me), true);
    if (!me.dati || !me.dati.is_admin) return stato("Questo account non è un amministratore.", true);

    $("pannello").hidden = false;
    stato("Caricamento utenti…");
    await carica();
  }

  $("cercaForm").addEventListener("submit", e => { e.preventDefault(); carica(); });
  MiczyAuth.onCambio(u => { if (!u) location.reload(); });
  avvio();
})();
