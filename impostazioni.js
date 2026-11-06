// Finestra "Impostazioni": aspetto (stile, testo, icone), lunghezza delle risposte e, se si è dentro,
// cambio password, esportazione dei dati e richiesta di eliminazione dell'account.
// Usa preferenze.js (scelte), auth.js (account) e funzioni di script.js (lingua).
(function () {
  "use strict";

  const P = window.Preferenze;
  if (!P) return;

  const TESTI = {
    it: {
      titolo: "Impostazioni",
      chiudi: "Chiudi",
      aspetto: "Aspetto",
      anteprima: "Anteprima",
      anteprimaUtente: "Ciao! Come stai?",
      anteprimaBot: "Tutto bene! Ecco come appaiono i messaggi.",
      stile: "Stile del sito",
      stili: { miczy: "Miczy", menta: "Menta", tramonto: "Tramonto", oceano: "Oceano", carta: "Carta (bianco e nero)", hacker: "Hacker", alieno: "Alieno", arcobaleno: "Arcobaleno", oro: "Oro", sakura: "Sakura", spazio: "Spazio" },
      testo: "Dimensione del testo",
      testi: { piccolo: "Piccolo", normale: "Normale", grande: "Grande", enorme: "Enorme" },
      iconaUtente: "La tua icona",
      iconaBot: "Icona di MiczyAI",
      risposte: "Risposte",
      lunghezza: "Lunghezza delle risposte",
      lunghezze: { breve: "Breve", normale: "Normale", lunga: "Dettagliata" },
      aiutoLunghezza: "“Breve” risponde in poche frasi, “Dettagliata” si prende più spazio e può metterci un po' di più.",
      account: "Il tuo account",
      invitoTitolo: "Personalizza MiczyAI",
      invito: "Accedi per avere più impostazioni: scegli lo stile del sito, le icone tue e del bot, la dimensione del testo e la lunghezza delle risposte, e gestisci il tuo account (password, dati, eliminazione).",
      accedi: "Accedi",
      password: "Cambia password",
      attualePassword: "Password attuale",
      dimenticata: "Non ricordi la password attuale? Ricevi un link per email",
      linkInviato: "Ti abbiamo scritto: apri il link nell'email per scegliere una nuova password.",
      attualeMancante: "Scrivi la password attuale.",
      nuovaPassword: "Nuova password (almeno 8 caratteri)",
      ripetiPassword: "Ripeti la nuova password",
      salvaPassword: "Salva la password",
      passwordCorta: "La password deve avere almeno 8 caratteri.",
      passwordDiverse: "Le due password non coincidono.",
      passwordFatta: "Password aggiornata.",
      dati: "I tuoi dati",
      aiutoDati: "Scarica un file con le tue chat, i messaggi, i voti alle risposte e le impostazioni.",
      scarica: "Scarica i miei dati",
      scaricoIn: n => `Raccolgo i dati… (${n} messaggi)`,
      scaricoFatto: "File scaricato.",
      elimina: "Elimina l'account",
      aiutoElimina: "Scrivici perché vuoi andartene: la richiesta viene letta dall'amministratore, che la conferma. Quando l'account viene eliminato, chat e dati spariscono per sempre: scarica prima quello che ti serve.",
      motivo: "Perché vuoi eliminare l'account?",
      richiedi: "Richiedi l'eliminazione",
      confermaRichiesta: "Inviare la richiesta di eliminazione dell'account? Potrai ritirarla finché non viene confermata.",
      motivoCorto: "Scrivi il motivo (almeno 3 caratteri).",
      inAttesaTitolo: "Richiesta in attesa",
      inAttesaTesto: data => `Inviata il ${data}. Aspetta la conferma dell'amministratore: finché non arriva, l'account resta com'è.`,
      rifiutataTitolo: "La tua ultima richiesta è stata rifiutata",
      notaAdmin: "Messaggio dell'amministratore:",
      annullaRichiesta: "Ritira la richiesta",
      richiestaInviata: "Richiesta inviata.",
      richiestaRitirata: "Richiesta ritirata.",
      nonDisponibile: "Questa funzione non è ancora disponibile.",
      ripristina: "Ripristina le impostazioni predefinite",
      sincLocale: "Le impostazioni sono salvate in questo browser.",
      sincAccount: "Le impostazioni sono salvate nel tuo account e ti seguono su ogni dispositivo.",
      carico: "Carico…",
      errori: {
        attualeErrata: "La password attuale non è corretta.",
        debole: "Password troppo debole: scegline una più lunga.",
        stessaPassword: "La nuova password deve essere diversa da quella attuale.",
        troppi: "Troppi tentativi: riprova tra qualche minuto.",
        captcha: "Verifica anti-bot non riuscita. Ricarica la pagina e riprova.",
        rete: "Non riesco a connettermi: controlla la rete e riprova.",
        sessione: "Sessione scaduta: accedi di nuovo.",
        generico: "Qualcosa è andato storto. Riprova."
      }
    },
    en: {
      titolo: "Settings",
      chiudi: "Close",
      aspetto: "Look",
      anteprima: "Preview",
      anteprimaUtente: "Hi! How are you?",
      anteprimaBot: "All good! This is how messages look.",
      stile: "Site style",
      stili: { miczy: "Miczy", menta: "Mint", tramonto: "Sunset", oceano: "Ocean", carta: "Paper (black & white)", hacker: "Hacker", alieno: "Alien", arcobaleno: "Rainbow", oro: "Gold", sakura: "Sakura", spazio: "Space" },
      testo: "Text size",
      testi: { piccolo: "Small", normale: "Normal", grande: "Large", enorme: "Huge" },
      iconaUtente: "Your icon",
      iconaBot: "MiczyAI's icon",
      risposte: "Answers",
      lunghezza: "Answer length",
      lunghezze: { breve: "Short", normale: "Normal", lunga: "Detailed" },
      aiutoLunghezza: "“Short” answers in a few sentences; “Detailed” takes more room and may take a little longer.",
      account: "Your account",
      invitoTitolo: "Make MiczyAI yours",
      invito: "Sign in for more settings: pick the site style, your icon and the bot's, the text size and the answer length, and manage your account (password, data, deletion).",
      accedi: "Sign in",
      password: "Change password",
      attualePassword: "Current password",
      dimenticata: "Don't remember your current password? Get a link by email",
      linkInviato: "We've emailed you: open the link in the message to choose a new password.",
      attualeMancante: "Enter your current password.",
      nuovaPassword: "New password (at least 8 characters)",
      ripetiPassword: "Repeat the new password",
      salvaPassword: "Save password",
      passwordCorta: "The password must be at least 8 characters long.",
      passwordDiverse: "The two passwords don't match.",
      passwordFatta: "Password updated.",
      dati: "Your data",
      aiutoDati: "Download a file with your chats, messages, answer ratings and settings.",
      scarica: "Download my data",
      scaricoIn: n => `Collecting your data… (${n} messages)`,
      scaricoFatto: "File downloaded.",
      elimina: "Delete account",
      aiutoElimina: "Tell us why you're leaving: the request is read by the administrator, who confirms it. Once the account is deleted, your chats and data are gone for good: download what you need first.",
      motivo: "Why do you want to delete your account?",
      richiedi: "Request deletion",
      confermaRichiesta: "Send the account deletion request? You can withdraw it until it is confirmed.",
      motivoCorto: "Write the reason (at least 3 characters).",
      inAttesaTitolo: "Request pending",
      inAttesaTesto: data => `Sent on ${data}. Wait for the administrator's confirmation: until then your account stays as it is.`,
      rifiutataTitolo: "Your last request was declined",
      notaAdmin: "Message from the administrator:",
      annullaRichiesta: "Withdraw the request",
      richiestaInviata: "Request sent.",
      richiestaRitirata: "Request withdrawn.",
      nonDisponibile: "This feature isn't available yet.",
      ripristina: "Restore default settings",
      sincLocale: "Settings are saved in this browser.",
      sincAccount: "Settings are saved in your account and follow you on every device.",
      carico: "Loading…",
      errori: {
        attualeErrata: "The current password is not correct.",
        debole: "Password too weak: choose a longer one.",
        stessaPassword: "The new password must be different from the current one.",
        troppi: "Too many attempts: try again in a few minutes.",
        captcha: "Anti-bot check failed. Reload the page and try again.",
        rete: "I can't connect: check your network and try again.",
        sessione: "Session expired: sign in again.",
        generico: "Something went wrong. Try again."
      }
    }
  };

  // Colori dei piccoli campioni accanto al nome di ogni stile (sfondo, barra, accento)
  const CAMPIONI = {
    miczy: ["#d9ccff", "#ffd93d", "#ff5ca8"],
    menta: ["#c6f3dc", "#6fe3a8", "#ff9a6b"],
    tramonto: ["#ffd9c2", "#ffb347", "#ff6f91"],
    oceano: ["#cfe6ff", "#7cc4ff", "#ff8f7a"],
    carta: ["#ececec", "#ffffff", "#d9d9d9"],
    hacker: ["#000a00", "#1aff55", "#7dff9d"],
    alieno: ["#0a0614", "#b6ff3c", "#a64dff"],
    arcobaleno: ["#ff6b6b", "#ffe14d", "#4dd2ff"],
    oro: ["#0b0903", "#f5c542", "#b8860b"],
    sakura: ["#ffe3ee", "#ff9ac8", "#ff5fa2"],
    spazio: ["#02030f", "#8fb4ff", "#ffb86b"]
  };

  const linguaAttuale = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");
  const t = chiave => TESTI[linguaAttuale()][chiave];
  const $ = id => document.getElementById(id);

  function el(tag, classe, testo) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (testo != null) n.textContent = testo;
    return n;
  }

  function avviso(testo, errore) {
    if (window.Account && window.Account.avviso) window.Account.avviso(testo, !!errore);
  }

  const Auth = window.MiczyAuth;
  const loggato = () => !!(Auth && Auth.utente());

  let aperta = false;
  let ultimoFuoco = null;
  let controlli = [];        // funzioni che rimettono a posto i controlli dopo un cambio di preferenze
  let anteprima = null;

  // ------------------------------------------------------------------------------------------
  // Controlli
  // ------------------------------------------------------------------------------------------

  // Gruppo di scelte "una sola": pulsanti con role=radio, frecce per spostarsi
  function gruppo({ etichetta, id, chiave, valori, nome, classe, contenuto }) {
    const box = el("div", "set-riga");
    const lab = el("span", "set-etichetta", etichetta);
    lab.id = id + "Lab";
    box.appendChild(lab);

    const cont = el("div", classe);
    cont.setAttribute("role", "radiogroup");
    cont.setAttribute("aria-labelledby", lab.id);
    const bottoni = valori.map(v => {
      const b = el("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.dataset.valore = v;
      contenuto(b, v);
      b.addEventListener("click", () => P.imposta({ [chiave]: v }));
      return b;
    });
    bottoni.forEach(b => cont.appendChild(b));

    cont.addEventListener("keydown", e => {
      const giu = e.key === "ArrowRight" || e.key === "ArrowDown";
      const su = e.key === "ArrowLeft" || e.key === "ArrowUp";
      if (!giu && !su) return;
      e.preventDefault();
      const i = bottoni.findIndex(b => b.getAttribute("aria-checked") === "true");
      const prossimo = bottoni[(i + (giu ? 1 : -1) + bottoni.length) % bottoni.length];
      P.imposta({ [chiave]: prossimo.dataset.valore });
      prossimo.focus();
    });

    controlli.push(() => {
      const attuale = P.leggi()[chiave];
      bottoni.forEach(b => {
        const sel = b.dataset.valore === attuale;
        b.setAttribute("aria-checked", String(sel));
        b.tabIndex = sel ? 0 : -1; // una sola tappa con Tab
        if (nome) b.setAttribute("aria-label", nome(b.dataset.valore));
      });
    });
    box.appendChild(cont);
    return box;
  }

  function creaAnteprima() {
    const box = el("div", "set-anteprima");
    box.setAttribute("aria-label", t("anteprima"));
    const riga = (mittente, testo) => {
      const w = el("div", "msg-wrapper " + mittente);
      const a = el("div", "avatar");
      const m = el("div", "msg " + mittente, testo);
      if (mittente === "utente") { w.appendChild(m); w.appendChild(a); } else { w.appendChild(a); w.appendChild(m); }
      return w;
    };
    box.appendChild(riga("utente", t("anteprimaUtente")));
    box.appendChild(riga("ai", t("anteprimaBot")));
    controlli.push(() => {
      const v = P.leggi();
      box.querySelector(".msg-wrapper.utente .avatar").textContent = v.iconaUtente;
      box.querySelector(".msg-wrapper.ai .avatar").textContent = v.iconaBot;
    });
    return box;
  }

  function sezione(titolo) {
    const s = el("section", "set-sezione");
    s.appendChild(el("h3", null, titolo));
    return s;
  }

  function messaggio() {
    const m = el("p", "set-msg");
    m.setAttribute("role", "status");
    return m;
  }
  function mostra(m, testo, ok) {
    m.textContent = testo || "";
    m.classList.toggle("ok", !!ok);
  }

  function campo(tipo, etichetta, autocomplete) {
    const input = el("input");
    input.type = tipo;
    input.autocomplete = autocomplete;
    input.setAttribute("aria-label", etichetta);
    input.placeholder = etichetta;
    return input;
  }

  // ------------------------------------------------------------------------------------------
  // Sezioni
  // ------------------------------------------------------------------------------------------

  function sezioneAspetto() {
    const s = sezione(t("aspetto"));
    s.appendChild(creaAnteprima());

    s.appendChild(gruppo({
      etichetta: t("stile"), id: "setStile", chiave: "stile", valori: P.opzioni.stile, classe: "set-seg set-stili",
      nome: v => t("stili")[v],
      contenuto: (b, v) => {
        const c = el("span", "set-campione");
        c.setAttribute("aria-hidden", "true");
        CAMPIONI[v].forEach(col => { const i = el("i"); i.style.background = col; c.appendChild(i); });
        b.appendChild(c);
        b.appendChild(el("span", null, t("stili")[v]));
      }
    }));

    s.appendChild(gruppo({
      etichetta: t("testo"), id: "setTesto", chiave: "testo", valori: P.opzioni.testo, classe: "set-seg",
      contenuto: (b, v) => { b.textContent = t("testi")[v]; }
    }));

    const icone = (etichetta, id, chiave, valori) => gruppo({
      etichetta, id, chiave, valori, classe: "set-icone", nome: v => v,
      contenuto: (b, v) => { b.textContent = v; }
    });
    s.appendChild(icone(t("iconaUtente"), "setIconaU", "iconaUtente", P.opzioni.iconaUtente));
    s.appendChild(icone(t("iconaBot"), "setIconaB", "iconaBot", P.opzioni.iconaBot));
    return s;
  }

  function sezioneRisposte() {
    const s = sezione(t("risposte"));
    s.appendChild(gruppo({
      etichetta: t("lunghezza"), id: "setLung", chiave: "lunghezza", valori: P.opzioni.lunghezza, classe: "set-seg",
      contenuto: (b, v) => { b.textContent = t("lunghezze")[v]; }
    }));
    s.appendChild(el("p", "set-aiuto", t("aiutoLunghezza")));
    return s;
  }

  // --- Cambio password
  function formPassword() {
    const f = el("form", "set-form");
    f.noValidate = true;
    f.appendChild(el("span", "set-etichetta", t("password")));
    const vecchia = campo("password", t("attualePassword"), "current-password");
    const a = campo("password", t("nuovaPassword"), "new-password");
    const b = campo("password", t("ripetiPassword"), "new-password");
    const msg = messaggio();
    const invia = el("button", "set-azione", t("salvaPassword"));
    invia.type = "submit";
    const link = el("button", "set-reset", t("dimenticata"));
    link.type = "button";
    const capBox = el("div", "captcha-box");
    capBox.hidden = !(window.Captcha && Captcha.attivo());
    f.append(vecchia, a);
    if (window.ForzaPassword) ForzaPassword.monta(a, () => (Auth.utente() || {}).email || "");
    f.append(b, capBox, msg, invia, link);
    const cap = window.Captcha ? Captcha.monta(capBox) : null;
    const prendiToken = async () => {
      if (!cap) return { ok: true, token: undefined };
      const tk = await cap.token();
      return tk ? { ok: true, token: tk } : { ok: false };
    };

    f.addEventListener("submit", async e => {
      e.preventDefault();
      mostra(msg, "");
      if (!vecchia.value) return mostra(msg, t("attualeMancante"));
      if (a.value.length < 8) return mostra(msg, t("passwordCorta"));
      if (a.value !== b.value) return mostra(msg, t("passwordDiverse"));
      invia.disabled = true;
      const tk = await prendiToken();
      if (!tk.ok) { invia.disabled = false; cap.reset(); return mostra(msg, t("errori").captcha); }
      const r = await Auth.cambiaPassword(a.value, vecchia.value, tk.token);
      if (cap) cap.reset();
      invia.disabled = false;
      if (r.ok) {
        vecchia.value = ""; a.value = ""; b.value = "";
        mostra(msg, t("passwordFatta"), true);
      } else {
        const err = t("errori");
        mostra(msg, err[r.errore] || err.generico);
      }
    });

    // Password attuale dimenticata: link per email (Supabase lo manda all'indirizzo dell'account)
    link.addEventListener("click", async () => {
      mostra(msg, "");
      const u = Auth.utente();
      if (!u || !u.email) return;
      link.disabled = true;
      const tk = await prendiToken();
      if (!tk.ok) { link.disabled = false; cap.reset(); return mostra(msg, t("errori").captcha); }
      const r = await Auth.recuperaPassword(u.email, tk.token);
      if (cap) cap.reset();
      link.disabled = false;
      if (r.ok) mostra(msg, t("linkInviato"), true);
      else { const err = t("errori"); mostra(msg, err[r.errore] || err.generico); }
    });
    return f;
  }

  // --- Esportazione dei dati: tutto dal browser, con l'accesso dell'utente (le regole del database mostrano solo i suoi dati)
  const PAGINA = 1000;

  async function leggiTutto(percorso, { opzionale = false, perOgniPagina } = {}) {
    const tutto = [];
    for (let offset = 0; offset < PAGINA * 200; offset += PAGINA) {
      const r = await Auth.rest("GET", `${percorso}&limit=${PAGINA}&offset=${offset}`);
      if (r.stato === 401) { const e = new Error("sessione"); e.sessione = true; throw e; }
      if (!r.ok || !Array.isArray(r.dati)) {
        if (opzionale) return null;
        throw new Error("lettura");
      }
      tutto.push(...r.dati);
      if (perOgniPagina) perOgniPagina(tutto.length);
      if (r.dati.length < PAGINA) break;
    }
    return tutto;
  }

  async function costruisciEsportazione(avanzamento) {
    const u = Auth.utente();
    const idU = encodeURIComponent(u.id);
    let profilo = await leggiTutto(`/rest/v1/profiles?select=email,created_at,settings&id=eq.${idU}`, { opzionale: true });
    if (!profilo) profilo = await leggiTutto(`/rest/v1/profiles?select=email,created_at&id=eq.${idU}`, { opzionale: true });
    let chat = await leggiTutto("/rest/v1/conversations?select=id,title,created_at,updated_at,pinned,folder&order=created_at.asc", { opzionale: true });
    if (!chat) chat = await leggiTutto("/rest/v1/conversations?select=id,title,created_at,updated_at&order=created_at.asc");
    const messaggi = await leggiTutto("/rest/v1/messages?select=id,conversation_id,role,content,created_at&order=id.asc", { perOgniPagina: avanzamento });
    const voti = (await leggiTutto("/rest/v1/feedback?select=message_id,rating,created_at&order=created_at.asc", { opzionale: true })) || [];
    const link = (await leggiTutto("/rest/v1/shared_chats?select=conversation_id,token,created_at&order=created_at.asc", { opzionale: true })) || [];

    const perChat = {};
    messaggi.forEach(m => { (perChat[m.conversation_id] = perChat[m.conversation_id] || []).push({ id: m.id, ruolo: m.role, testo: m.content, data: m.created_at }); });
    const condivise = {};
    link.forEach(l => { condivise[l.conversation_id] = l.token; });

    return {
      esportato_il: new Date().toISOString(),
      versione: 1,
      account: { email: (profilo && profilo[0] && profilo[0].email) || u.email, creato_il: profilo && profilo[0] ? profilo[0].created_at : null },
      impostazioni: (profilo && profilo[0] && profilo[0].settings) || P.personalizzate(),
      chat: chat.map(c => ({
        id: c.id, titolo: c.title, creata_il: c.created_at, aggiornata_il: c.updated_at,
        fissata: c.pinned === true, cartella: c.folder || null,
        link_di_condivisione: condivise[c.id] || null,
        messaggi: perChat[c.id] || []
      })),
      voti_alle_risposte: voti.map(v => ({ id_messaggio: v.message_id, voto: v.rating, data: v.created_at }))
    };
  }

  function scaricaFile(oggetto) {
    const blob = new Blob([JSON.stringify(oggetto, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = el("a");
    a.href = url;
    a.download = `miczyai-dati-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  function boxDati() {
    const box = el("div", "set-form");
    box.appendChild(el("span", "set-etichetta", t("dati")));
    box.appendChild(el("p", "set-aiuto", t("aiutoDati")));
    const bottone = el("button", "set-azione", t("scarica"));
    bottone.type = "button";
    const msg = messaggio();
    box.append(bottone, msg);

    bottone.addEventListener("click", async () => {
      bottone.disabled = true;
      mostra(msg, t("scaricoIn")(0));
      try {
        const dati = await costruisciEsportazione(n => mostra(msg, t("scaricoIn")(n)));
        scaricaFile(dati);
        mostra(msg, t("scaricoFatto"), true);
      } catch (e) {
        mostra(msg, e && e.sessione ? t("errori").sessione : t("errori").generico);
        if (e && e.sessione && window.Account) window.Account.sessioneScaduta();
      } finally {
        bottone.disabled = false;
      }
    });
    return box;
  }

  // --- Richiesta di eliminazione dell'account
  const dataLeggibile = iso => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString(linguaAttuale() === "en" ? "en-GB" : "it-IT", { day: "numeric", month: "long", year: "numeric" });
  };

  function boxElimina() {
    const box = el("div", "set-form");
    box.appendChild(el("span", "set-etichetta", t("elimina")));
    const contenuto = el("div", "set-form");
    contenuto.appendChild(el("p", "set-aiuto", t("carico")));
    box.appendChild(contenuto);

    function messaggioServer(r) {
      return r && r.dati && typeof r.dati.response === "string" && r.dati.response ? r.dati.response : t("errori").generico;
    }

    function disegnaForm(precedente) {
      contenuto.replaceChildren();
      if (precedente && precedente.status === "rejected") {
        const c = el("div", "set-casella");
        c.appendChild(el("strong", null, t("rifiutataTitolo")));
        if (precedente.admin_note) {
          c.appendChild(el("span", null, t("notaAdmin")));
          c.appendChild(el("q", null, precedente.admin_note));
        }
        contenuto.appendChild(c);
      }
      contenuto.appendChild(el("p", "set-aiuto", t("aiutoElimina")));
      const area = el("textarea");
      area.maxLength = 500;
      area.setAttribute("aria-label", t("motivo"));
      area.placeholder = t("motivo");
      const msg = messaggio();
      const invia = el("button", "set-azione pericolo", t("richiedi"));
      invia.type = "button";
      contenuto.append(area, msg, invia);
      invia.addEventListener("click", async () => {
        const motivo = area.value.trim();
        if (motivo.length < 3) return mostra(msg, t("motivoCorto"));
        if (!window.confirm(t("confermaRichiesta"))) return;
        invia.disabled = true;
        const r = await Auth.backend("/account/delete-request", { metodo: "POST", corpo: { reason: motivo } });
        invia.disabled = false;
        if (r.ok && r.dati && r.dati.request) {
          avviso(t("richiestaInviata"));
          disegnaAttesa(r.dati.request);
        } else if (r.stato === 401 && window.Account) {
          window.Account.sessioneScaduta();
        } else if (r.stato === 409) {
          caricaStato();
        } else {
          mostra(msg, r.stato === 0 ? t("errori").rete : messaggioServer(r));
        }
      });
    }

    function disegnaAttesa(richiesta) {
      contenuto.replaceChildren();
      const c = el("div", "set-casella");
      c.appendChild(el("strong", null, t("inAttesaTitolo")));
      c.appendChild(el("span", null, t("inAttesaTesto")(dataLeggibile(richiesta.created_at))));
      if (richiesta.reason) c.appendChild(el("q", null, richiesta.reason));
      const msg = messaggio();
      const annulla = el("button", "set-azione secondaria", t("annullaRichiesta"));
      annulla.type = "button";
      contenuto.append(c, msg, annulla);
      annulla.addEventListener("click", async () => {
        annulla.disabled = true;
        const r = await Auth.backend("/account/delete-request/cancel", { metodo: "POST", corpo: {} });
        annulla.disabled = false;
        if (r.ok || r.stato === 404) {
          if (r.ok) avviso(t("richiestaRitirata"));
          disegnaForm(null);
        } else if (r.stato === 401 && window.Account) {
          window.Account.sessioneScaduta();
        } else {
          mostra(msg, r.stato === 0 ? t("errori").rete : messaggioServer(r));
        }
      });
    }

    async function caricaStato() {
      const r = await Auth.backend("/account/delete-request");
      if (!aperta) return;
      if (r.ok && r.dati) {
        const ric = r.dati.request;
        if (ric && ric.status === "pending") disegnaAttesa(ric);
        else disegnaForm(ric && ric.status === "rejected" ? ric : null);
      } else if (r.stato === 401) {
        if (window.Account) window.Account.sessioneScaduta();
      } else {
        contenuto.replaceChildren(el("p", "set-aiuto", r.stato === 0 ? t("errori").rete : t("nonDisponibile")));
      }
    }
    caricaStato();
    return box;
  }

  function sezioneAccount() {
    const s = sezione(t("account"));
    s.appendChild(el("p", "set-aiuto", Auth.utente().email || ""));
    const blocchi = [formPassword(), boxDati(), boxElimina()];
    blocchi.forEach(b => { b.style.marginBottom = "1.1rem"; s.appendChild(b); });
    s.lastChild.style.marginBottom = "0";
    return s;
  }

  // Per chi non ha un account: niente impostazioni, solo un invito ad accedere
  function sezioneInvito() {
    const s = sezione(t("invitoTitolo"));
    s.appendChild(el("p", "set-aiuto", t("invito")));
    const b = el("button", "set-azione", t("accedi"));
    b.type = "button";
    b.id = "setAccedi";
    b.addEventListener("click", () => {
      chiudi(false);
      if (window.Account) window.Account.apriModale("login");
    });
    s.appendChild(b);
    return s;
  }

  function piede() {
    const f = el("div", "set-sezione");
    const stato = el("p", "set-aiuto");
    stato.id = "setSync";
    const b = el("button", "set-link", t("ripristina"));
    b.type = "button";
    b.addEventListener("click", () => P.ripristina());
    const riga = el("div", "set-fondo");
    riga.appendChild(b);
    f.append(stato, riga);
    return f;
  }

  function aggiornaStatoSync() {
    const n = $("setSync");
    if (n) n.textContent = loggato() && !soloLocale ? t("sincAccount") : t("sincLocale");
  }

  // ------------------------------------------------------------------------------------------
  // Apertura e chiusura
  // ------------------------------------------------------------------------------------------

  function disegna() {
    controlli = [];
    const corpo = $("setCorpo");
    if (loggato()) corpo.replaceChildren(sezioneAspetto(), sezioneRisposte(), sezioneAccount(), piede());
    else corpo.replaceChildren(sezioneInvito());
    $("setTitolo").textContent = t("titolo");
    $("setChiudi").setAttribute("aria-label", t("chiudi"));
    $("settingsBtn").setAttribute("aria-label", t("titolo"));
    $("settingsBtn").title = t("titolo");
    controlli.forEach(f => f());
    aggiornaStatoSync();
  }

  function apri() {
    if (aperta) return;
    ultimoFuoco = document.activeElement;
    aperta = true;
    disegna();
    $("setCorpo").scrollTop = 0;
    $("setModal").classList.add("show");
    $("setChiudi").focus();
    if (loggato()) sincronizza();
    else if ($("setAccedi")) $("setAccedi").focus();
  }

  function chiudi(ripristinaFuoco = true) {
    if (!aperta) return;
    aperta = false;
    $("setModal").classList.remove("show");
    if (ripristinaFuoco && ultimoFuoco && ultimoFuoco.focus) ultimoFuoco.focus();
  }

  function elementiFocalizzabili() {
    return Array.from($("setModal").querySelectorAll("button, input, textarea, a[href], [tabindex]"))
      .filter(n => !n.disabled && n.tabIndex !== -1 && n.offsetParent !== null);
  }

  document.addEventListener("keydown", e => {
    if (!aperta) return;
    if (e.key === "Escape") {
      e.preventDefault();
      chiudi();
      return;
    }
    if (e.key !== "Tab") return;
    const f = elementiFocalizzabili();
    if (!f.length) return;
    const primo = f[0], ultimo = f[f.length - 1];
    if (!$("setModal").contains(document.activeElement)) { e.preventDefault(); primo.focus(); }
    else if (e.shiftKey && document.activeElement === primo) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primo.focus(); }
  });

  // un clic fuori dalla finestra la chiude
  document.addEventListener("mousedown", e => {
    if (!aperta) return;
    if ($("setModal").contains(e.target) || $("settingsBtn").contains(e.target)) return;
    if (e.target.closest && e.target.closest(".toast")) return;
    chiudi(false);
  });

  // ------------------------------------------------------------------------------------------
  // Sincronizzazione con l'account (colonna profiles.settings)
  // ------------------------------------------------------------------------------------------

  let soloLocale = false;          // true se nel database manca la colonna (migrazione non fatta)
  let applicandoDaAccount = false; // per non rimandare su ciò che si è appena ricevuto
  let timerSalva = null;

  async function sincronizza() {
    const u = Auth && Auth.utente();
    if (!u || !Auth.configurato()) return;
    const r = await Auth.rest("GET", `/rest/v1/profiles?select=settings&id=eq.${encodeURIComponent(u.id)}`);
    if (!r.ok || !Array.isArray(r.dati)) { soloLocale = true; aggiornaStatoSync(); return; }
    soloLocale = false;
    const remote = P.pulisci(r.dati[0] && r.dati[0].settings);
    if (Object.keys(remote).length) {
      applicandoDaAccount = true;
      try { P.sostituisci(remote); } finally { applicandoDaAccount = false; }
    } else if (Object.keys(P.personalizzate()).length) {
      salvaSuAccount(true); // l'account è vuoto: ci mettiamo quello che si ha già su questo browser
    }
    aggiornaStatoSync();
  }

  function salvaSuAccount(subito) {
    clearTimeout(timerSalva);
    const u = Auth && Auth.utente();
    if (!u || soloLocale) return;
    const invia = async () => {
      const r = await Auth.rest("PATCH", `/rest/v1/profiles?id=eq.${encodeURIComponent(u.id)}`,
        { settings: P.personalizzate() }, { Prefer: "return=minimal" });
      if (!r.ok && r.stato !== 401) { soloLocale = true; aggiornaStatoSync(); }
    };
    if (subito) invia(); else timerSalva = setTimeout(invia, 700);
  }

  P.onCambio(() => {
    if (aperta) { controlli.forEach(f => f()); }
    if (!applicandoDaAccount) salvaSuAccount(false);
  });

  // ------------------------------------------------------------------------------------------
  // Avvio
  // ------------------------------------------------------------------------------------------

  function aggiornaTesti() {
    const b = $("settingsBtn");
    if (b) { b.setAttribute("aria-label", t("titolo")); b.title = t("titolo"); }
    if (aperta) disegna();
  }

  $("settingsBtn").addEventListener("click", () => (aperta ? chiudi() : apri()));
  $("setChiudi").addEventListener("click", () => chiudi());

  if (Auth) {
    Auth.onCambio(utente => {
      soloLocale = false;
      if (utente) sincronizza();
      else {
        // uscendo, il sito torna come per tutti gli ospiti (le scelte restano salvate nell'account)
        clearTimeout(timerSalva);
        applicandoDaAccount = true;
        try { P.ripristina(); } finally { applicandoDaAccount = false; }
      }
      if (aperta) disegna();
    });
    if (Auth.utente()) sincronizza();
    else P.ripristina();
    // se l'accesso non è configurato non c'è niente da personalizzare
    if (!Auth.configurato()) $("settingsBtn").hidden = true;
  } else {
    $("settingsBtn").hidden = true;
  }
  aggiornaTesti();

  window.Impostazioni = { apri, chiudi, aggiornaTesti, sincronizza };
})();
