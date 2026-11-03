// Interfaccia degli account: finestra di accesso, menu dell'account, elenco delle chat salvate.
// Usa auth.js per parlare con Supabase e funzioni/variabili di script.js (chatHistory, ecc.).
(function () {
  "use strict";

  const TESTI = {
    it: {
      accedi: "Accedi",
      registrati: "Registrati",
      titoloLogin: "Bentornato",
      titoloSignup: "Crea un account",
      titoloRecupera: "Recupera la password",
      titoloNuova: "Scegli una nuova password",
      email: "Email",
      password: "Password",
      nuovaPassword: "Nuova password (almeno 8 caratteri)",
      invioLogin: "Accedi",
      invioSignup: "Crea account",
      invioRecupera: "Invia il link",
      invioNuova: "Salva password",
      dimenticata: "Password dimenticata?",
      tornaLogin: "Torna all'accesso",
      chiudi: "Chiudi",
      attendi: "Un attimo...",
      daConfermare: "Ti abbiamo scritto: apri l'email e conferma l'indirizzo, poi accedi. Controlla anche lo spam.",
      recuperaInviato: "Se l'indirizzo è registrato, riceverai un'email con il link per scegliere una nuova password.",
      passwordCambiata: "Password aggiornata.",
      benvenuto: "Sei dentro!",
      emailConfermata: "Email confermata: sei dentro!",
      sessioneScaduta: "Sessione scaduta: accedi di nuovo.",
      esciFatto: "Hai effettuato l'uscita.",
      menuChat: "Le mie chat",
      menuAdmin: "Pannello admin",
      menuEsci: "Esci",
      usoOggi: (n, max) => `${n} messaggi su ${max} nelle ultime 24 ore`,
      pannelloTitolo: "Le tue chat",
      nuovaChat: "+ Nuova chat",
      nessunaChat: "Non hai ancora chat salvate. Scrivi un messaggio per cominciare.",
      eliminaChat: "Elimina chat",
      confermaElimina: "Eliminare questa chat? Non si può annullare.",
      chiudiPannello: "Chiudi elenco chat",
      chatSenzaTitolo: "Nuova chat",
      cerca: "Cerca nelle chat…",
      nessunRisultato: "Nessuna chat trovata.",
      fissate: "Fissate",
      senzaCartella: "Senza cartella",
      altreAzioni: "Azioni per questa chat",
      fissa: "📌 Fissa in alto",
      nonFissare: "📌 Non fissare più",
      rinomina: "✏️ Rinomina",
      spostaCartella: "📁 Sposta in una cartella",
      condividi: "🔗 Condividi con un link",
      nomeChat: "Nuovo nome della chat",
      nomeCartella: "Nome della cartella (vuoto = nessuna)",
      salva: "Salva",
      annulla: "Annulla",
      infoCondivisione: "Chiunque abbia il link può leggere questa chat, ma non scrivere né vedere altro.",
      copiaLink: "Copia il link",
      linkCopiato: "Link copiato!",
      smettiCondividere: "Smetti di condividere",
      condivisioneRevocata: "Il link non funziona più.",
      chatCondivisa: "Chat condivisa con un link",
      creoLink: "Creo il link…",
      errori: {
        rete: "Connessione non riuscita. Controlla internet e riprova.",
        credenziali: "Email o password non corrette.",
        nonConfermata: "Prima devi confermare l'email: controlla la posta (anche lo spam).",
        esiste: "Esiste già un account con questa email: prova ad accedere.",
        debole: "Password troppo debole: usa almeno 8 caratteri.",
        stessaPassword: "La nuova password deve essere diversa dalla vecchia.",
        troppi: "Troppi tentativi: aspetta un po' e riprova.",
        registrazioniChiuse: "Le registrazioni sono chiuse al momento.",
        emailNonValida: "Questo indirizzo email non sembra valido.",
        linkScaduto: "Il link è scaduto: richiedine uno nuovo.",
        linkNonValido: "Il link non è valido.",
        sessione: "Sessione scaduta: accedi di nuovo.",
        nonConfigurato: "L'accesso non è ancora configurato su questo sito.",
        campi: "Inserisci email e password.",
        passwordCorta: "La password deve avere almeno 8 caratteri.",
        generico: "Qualcosa è andato storto. Riprova tra poco."
      }
    },
    en: {
      accedi: "Log in",
      registrati: "Sign up",
      titoloLogin: "Welcome back",
      titoloSignup: "Create an account",
      titoloRecupera: "Reset your password",
      titoloNuova: "Choose a new password",
      email: "Email",
      password: "Password",
      nuovaPassword: "New password (at least 8 characters)",
      invioLogin: "Log in",
      invioSignup: "Create account",
      invioRecupera: "Send the link",
      invioNuova: "Save password",
      dimenticata: "Forgot your password?",
      tornaLogin: "Back to log in",
      chiudi: "Close",
      attendi: "One moment...",
      daConfermare: "We sent you an email: open it and confirm your address, then log in. Check spam too.",
      recuperaInviato: "If the address is registered, you'll get an email with a link to choose a new password.",
      passwordCambiata: "Password updated.",
      benvenuto: "You're in!",
      emailConfermata: "Email confirmed: you're in!",
      sessioneScaduta: "Session expired: please log in again.",
      esciFatto: "You've been logged out.",
      menuChat: "My chats",
      menuAdmin: "Admin panel",
      menuEsci: "Log out",
      usoOggi: (n, max) => `${n} of ${max} messages in the last 24 hours`,
      pannelloTitolo: "Your chats",
      nuovaChat: "+ New chat",
      nessunaChat: "No saved chats yet. Send a message to get started.",
      eliminaChat: "Delete chat",
      confermaElimina: "Delete this chat? This can't be undone.",
      chiudiPannello: "Close chat list",
      chatSenzaTitolo: "New chat",
      cerca: "Search your chats…",
      nessunRisultato: "No chats found.",
      fissate: "Pinned",
      senzaCartella: "No folder",
      altreAzioni: "Actions for this chat",
      fissa: "📌 Pin to top",
      nonFissare: "📌 Unpin",
      rinomina: "✏️ Rename",
      spostaCartella: "📁 Move to a folder",
      condividi: "🔗 Share with a link",
      nomeChat: "New name for the chat",
      nomeCartella: "Folder name (empty = none)",
      salva: "Save",
      annulla: "Cancel",
      infoCondivisione: "Anyone with the link can read this chat, but can't write or see anything else.",
      copiaLink: "Copy the link",
      linkCopiato: "Link copied!",
      smettiCondividere: "Stop sharing",
      condivisioneRevocata: "The link no longer works.",
      chatCondivisa: "Chat shared with a link",
      creoLink: "Creating the link…",
      errori: {
        rete: "Connection failed. Check your internet and try again.",
        credenziali: "Wrong email or password.",
        nonConfermata: "Please confirm your email first: check your inbox (and spam).",
        esiste: "An account with this email already exists: try logging in.",
        debole: "Password too weak: use at least 8 characters.",
        stessaPassword: "The new password must be different from the old one.",
        troppi: "Too many attempts: wait a bit and try again.",
        registrazioniChiuse: "Sign-ups are closed right now.",
        emailNonValida: "This email address doesn't look valid.",
        linkScaduto: "The link has expired: request a new one.",
        linkNonValido: "The link is not valid.",
        sessione: "Session expired: please log in again.",
        nonConfigurato: "Login isn't set up on this site yet.",
        campi: "Enter your email and password.",
        passwordCorta: "The password must be at least 8 characters.",
        generico: "Something went wrong. Please try again shortly."
      }
    }
  };

  const linguaAttuale = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");
  const t = chiave => TESTI[linguaAttuale()][chiave];
  const errore = chiave => {
    const e = t("errori");
    return e[chiave] || e.generico;
  };

  const $ = id => document.getElementById(id);
  let modo = "login";           // login | signup | recupera | nuovaPassword
  let datiMe = null;            // risposta di /me
  let elencoChat = [];

  // --- Avvisi brevi --------------------------------------------------------------
  let toastTimer;
  function avviso(testo, errore = false) {
    const el = $("toast");
    if (!el) return;
    el.textContent = testo;
    el.classList.toggle("errore", errore);
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 5000);
  }

  // --- Finestra di accesso ---------------------------------------------------------
  function messaggioModale(testo, tipo) {
    const el = $("authMsg");
    el.textContent = testo || "";
    el.classList.toggle("ok", tipo === "ok");
  }

  function disegnaModale() {
    const login = modo === "login", signup = modo === "signup";
    const recupera = modo === "recupera", nuova = modo === "nuovaPassword";

    $("authTitolo").textContent = login ? t("titoloLogin") : signup ? t("titoloSignup")
      : recupera ? t("titoloRecupera") : t("titoloNuova");
    $("authTabs").hidden = recupera || nuova;
    $("tabLogin").textContent = t("accedi");
    $("tabSignup").textContent = t("registrati");
    $("tabLogin").setAttribute("aria-selected", String(login));
    $("tabSignup").setAttribute("aria-selected", String(signup));

    $("authEmailLabel").hidden = nuova;
    $("authEmailText").textContent = t("email");
    $("authPassLabel").hidden = recupera;
    $("authPassText").textContent = nuova ? t("nuovaPassword") : t("password");
    $("authPassword").autocomplete = login ? "current-password" : "new-password";

    $("authSubmit").textContent = login ? t("invioLogin") : signup ? t("invioSignup")
      : recupera ? t("invioRecupera") : t("invioNuova");
    $("authForgot").textContent = recupera ? t("tornaLogin") : t("dimenticata");
    $("authForgot").hidden = signup || nuova;
    $("authClose").textContent = t("chiudi");
  }

  function apriModale(nuovoModo = "login", testo = "", tipo = "") {
    modo = nuovoModo;
    $("authPassword").value = "";
    disegnaModale();
    messaggioModale(testo, tipo);
    $("authModal").classList.add("show");
    setTimeout(() => ($(modo === "nuovaPassword" ? "authPassword" : "authEmail")).focus(), 50);
  }

  function chiudiModale() {
    $("authModal").classList.remove("show");
    $("authPassword").value = "";
  }

  async function inviaModale(evento) {
    evento.preventDefault();
    const email = $("authEmail").value.trim();
    const password = $("authPassword").value;
    const bottone = $("authSubmit");

    // controlli veloci prima di disturbare il server
    if (modo !== "nuovaPassword" && !email) return messaggioModale(errore("campi"));
    if ((modo === "login" || modo === "signup") && !password) return messaggioModale(errore("campi"));
    if ((modo === "signup" || modo === "nuovaPassword") && password.length < 8) {
      return messaggioModale(errore("passwordCorta"));
    }

    bottone.disabled = true;
    const testoBottone = bottone.textContent;
    bottone.textContent = t("attendi");
    messaggioModale("");

    try {
      if (modo === "login") {
        const r = await MiczyAuth.accedi(email, password);
        if (r.ok) { chiudiModale(); avviso(t("benvenuto")); }
        else messaggioModale(errore(r.errore));
      } else if (modo === "signup") {
        const r = await MiczyAuth.registra(email, password);
        if (!r.ok) messaggioModale(errore(r.errore));
        else if (r.daConfermare) {
          modo = "login"; disegnaModale();
          $("authPassword").value = "";
          messaggioModale(t("daConfermare"), "ok");
        } else { chiudiModale(); avviso(t("benvenuto")); }
      } else if (modo === "recupera") {
        const r = await MiczyAuth.recuperaPassword(email);
        if (r.ok) messaggioModale(t("recuperaInviato"), "ok");
        else messaggioModale(errore(r.errore));
      } else if (modo === "nuovaPassword") {
        const r = await MiczyAuth.cambiaPassword(password);
        if (r.ok) { chiudiModale(); avviso(t("passwordCambiata")); }
        else messaggioModale(errore(r.errore));
      }
    } finally {
      bottone.disabled = false;
      if (bottone.textContent === t("attendi")) bottone.textContent = testoBottone;
      disegnaModale();
    }
  }

  // --- Menu dell'account -------------------------------------------------------------
  function menuAperto(aperto) {
    const wrap = $("accountWrap");
    wrap.classList.toggle("open", aperto);
    $("accountBtn").setAttribute("aria-expanded", String(aperto));
  }

  function aggiornaInterfaccia() {
    const u = MiczyAuth.utente();
    const loggato = !!u;

    $("accountBtn").textContent = loggato ? (u.email || "?").charAt(0).toUpperCase() : t("accedi");
    $("accountBtn").classList.toggle("loggato", loggato);
    $("accountBtn").setAttribute("aria-label", loggato ? (u.email || "") : t("accedi"));
    $("chatsBtn").hidden = !loggato;
    if (!loggato) {
      menuAperto(false);
      chiudiPannello();
      datiMe = null;
    }

    $("accountEmail").textContent = loggato ? u.email : "";
    $("menuChat").textContent = t("menuChat");
    $("menuAdmin").textContent = t("menuAdmin");
    $("menuEsci").textContent = t("menuEsci");
    $("chatsTitolo").textContent = t("pannelloTitolo");
    $("nuovaChatBtn").textContent = t("nuovaChat");
    $("chatsClose").setAttribute("aria-label", t("chiudiPannello"));
    $("chatsBtn").setAttribute("aria-label", t("menuChat"));
    $("chatsBtn").title = t("menuChat");
    disegnaDatiMe();
    if ($("authModal").classList.contains("show")) disegnaModale();
  }

  function disegnaDatiMe() {
    const uso = $("accountUso"), ban = $("accountBan"), admin = $("menuAdmin");
    if (!datiMe) { uso.textContent = ""; ban.textContent = ""; admin.hidden = true; return; }
    uso.textContent = t("usoOggi")(datiMe.messages_24h, datiMe.daily_limit);
    ban.textContent = datiMe.banned && datiMe.ban_message ? datiMe.ban_message : "";
    admin.hidden = !datiMe.is_admin;
  }

  async function caricaMe() {
    if (!MiczyAuth.utente()) return;
    const r = await MiczyAuth.backend("/me");
    if (r.ok && r.dati) datiMe = r.dati;
    else if (r.stato === 401) datiMe = null;
    disegnaDatiMe();
  }

  // --- Pannello "Le mie chat" ----------------------------------------------------------
  let funzioniChat = true;          // false se nel database mancano le colonne nuove (migrazione-chat.sql)
  let condivise = new Set();        // id delle chat che hanno un link
  let cartelleChiuse = new Set();   // cartelle ripiegate (solo finché la pagina resta aperta)
  let menuId = null;                // chat con il menu azioni aperto
  let modifica = null;              // { id, tipo: "rinomina" | "cartella" | "condividi", link? }
  let ricerca = "";                 // testo cercato
  let risultatiRicerca = null;      // null = nessuna ricerca; altrimenti [{ chat, snippet }]
  let timerRicerca;

  function apriPannello() {
    $("chatsPanel").classList.add("open");
    $("chatsPanel").setAttribute("aria-hidden", "false");
    aggiornaElenco();
  }

  function chiudiPannello() {
    $("chatsPanel").classList.remove("open");
    $("chatsPanel").setAttribute("aria-hidden", "true");
  }

  function dataBreve(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(linguaAttuale() === "en" ? "en-GB" : "it-IT", { day: "numeric", month: "short" });
  }

  async function aggiornaElenco() {
    if (!MiczyAuth.utente()) return;
    const base = "/rest/v1/conversations?order=updated_at.desc&limit=200&select=";
    let r = await MiczyAuth.rest("GET", base + "id,title,updated_at,pinned,folder");
    if (r.stato === 401) return sessioneScaduta();
    if (r.ok) {
      funzioniChat = true;
    } else {
      // forse manca la migrazione: si ripiega sull'elenco semplice (senza fissa/cartelle/link)
      r = await MiczyAuth.rest("GET", base + "id,title,updated_at");
      if (r.stato === 401) return sessioneScaduta();
      if (r.ok) funzioniChat = false;
    }
    if (!r.ok || !Array.isArray(r.dati)) return;
    elencoChat = r.dati;
    if (funzioniChat) {
      const c = await MiczyAuth.rest("GET", "/rest/v1/shared_chats?select=conversation_id");
      condivise = new Set(c.ok && Array.isArray(c.dati) ? c.dati.map(x => x.conversation_id) : []);
    } else {
      condivise = new Set();
    }
    disegnaElenco();
  }

  // Cambia un campo di una chat (titolo, fissata, cartella) e aggiorna l'elenco locale
  async function aggiornaChat(id, campi) {
    const r = await MiczyAuth.rest("PATCH", `/rest/v1/conversations?id=eq.${encodeURIComponent(id)}`, campi,
      { Prefer: "return=minimal" });
    if (r.stato === 401) { sessioneScaduta(); return false; }
    if (!r.ok) { avviso(errore("generico"), true); return false; }
    const c = elencoChat.find(x => x.id === id);
    if (c) Object.assign(c, campi);
    return true;
  }

  function pulsante(classe, testo, alClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = classe;
    b.textContent = testo;
    b.addEventListener("click", alClick);
    return b;
  }

  // Piccolo modulo dentro la riga: una casella di testo con Salva/Annulla
  function creaEditor({ etichetta, valore, max, cartelle, alSalvare }) {
    const form = document.createElement("form");
    form.className = "chat-editor";
    const l = document.createElement("label");
    l.textContent = etichetta;
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = max;
    input.value = valore || "";
    input.autocomplete = "off";
    if (cartelle && cartelle.length) {
      const dl = document.createElement("datalist");
      dl.id = "elencoCartelle";
      cartelle.forEach(n => { const o = document.createElement("option"); o.value = n; dl.appendChild(o); });
      form.appendChild(dl);
      input.setAttribute("list", "elencoCartelle");
    }
    l.appendChild(input);
    const riga = document.createElement("div");
    riga.className = "chat-editor-btn";
    const ok = pulsante("chat-azione ok", t("salva"), () => {});
    ok.type = "submit";
    riga.append(ok, pulsante("chat-azione", t("annulla"), () => { modifica = null; disegnaElenco(); }));
    form.append(l, riga);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      ok.disabled = true;
      if (await alSalvare(input.value.trim())) { modifica = null; menuId = null; }
      else ok.disabled = false;
      disegnaElenco();
    });
    setTimeout(() => input.focus(), 0);
    return form;
  }

  function linkDi(token) {
    const base = location.href.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
    return `${base}condivisa/?c=${encodeURIComponent(token)}`;
  }

  async function apriCondivisione(id) {
    modifica = { id, tipo: "condividi", link: null };
    disegnaElenco();
    const r = await MiczyAuth.backend("/chats/share", { metodo: "POST", corpo: { conversation_id: id } });
    if (r.stato === 401) return sessioneScaduta();
    if (!modifica || modifica.id !== id) return;
    if (!r.ok || !r.dati || !r.dati.token) {
      modifica = null;
      avviso((r.dati && r.dati.response) || errore("generico"), true);
    } else {
      modifica.link = linkDi(r.dati.token);
      condivise.add(id);
    }
    disegnaElenco();
  }

  async function smettiDiCondividere(id) {
    const r = await MiczyAuth.backend("/chats/unshare", { metodo: "POST", corpo: { conversation_id: id } });
    if (r.stato === 401) return sessioneScaduta();
    if (!r.ok) return avviso((r.dati && r.dati.response) || errore("generico"), true);
    condivise.delete(id);
    modifica = null; menuId = null;
    avviso(t("condivisioneRevocata"));
    disegnaElenco();
  }

  function creaPannelloCondivisione(c) {
    const box = document.createElement("div");
    box.className = "chat-condividi";
    if (!modifica.link) { box.textContent = t("creoLink"); return box; }
    const info = document.createElement("p");
    info.textContent = t("infoCondivisione");
    const campo = document.createElement("input");
    campo.type = "text"; campo.readOnly = true; campo.value = modifica.link;
    campo.setAttribute("aria-label", t("chatCondivisa"));
    campo.addEventListener("focus", () => campo.select());
    const riga = document.createElement("div");
    riga.className = "chat-editor-btn";
    riga.append(
      pulsante("chat-azione ok", t("copiaLink"), async () => {
        try { await navigator.clipboard.writeText(modifica.link); avviso(t("linkCopiato")); }
        catch (e) { campo.focus(); campo.select(); }
      }),
      pulsante("chat-azione", t("smettiCondividere"), () => smettiDiCondividere(c.id)),
      pulsante("chat-azione", t("chiudi"), () => { modifica = null; disegnaElenco(); })
    );
    box.append(info, campo, riga);
    return box;
  }

  function creaAzioni(c) {
    if (modifica && modifica.id === c.id) {
      if (modifica.tipo === "rinomina") {
        return creaEditor({ etichetta: t("nomeChat"), valore: c.title, max: 120, alSalvare: async nome => {
          if (!nome) return false;
          return aggiornaChat(c.id, { title: nome });
        } });
      }
      if (modifica.tipo === "cartella") {
        const nomi = Array.from(new Set(elencoChat.map(x => x.folder).filter(Boolean))).sort();
        return creaEditor({ etichetta: t("nomeCartella"), valore: c.folder, max: 40, cartelle: nomi, alSalvare: async nome =>
          aggiornaChat(c.id, { folder: nome || null }) });
      }
      return creaPannelloCondivisione(c);
    }
    const box = document.createElement("div");
    box.className = "chat-azioni";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", t("altreAzioni"));
    if (funzioniChat) {
      box.appendChild(pulsante("chat-azione", c.pinned ? t("nonFissare") : t("fissa"), async () => {
        if (await aggiornaChat(c.id, { pinned: !c.pinned })) { menuId = null; disegnaElenco(); }
      }));
    }
    box.appendChild(pulsante("chat-azione", t("rinomina"), () => { modifica = { id: c.id, tipo: "rinomina" }; disegnaElenco(); }));
    if (funzioniChat) {
      box.appendChild(pulsante("chat-azione", t("spostaCartella"), () => { modifica = { id: c.id, tipo: "cartella" }; disegnaElenco(); }));
      box.appendChild(pulsante("chat-azione", t("condividi"), () => apriCondivisione(c.id)));
    }
    box.appendChild(pulsante("chat-azione rosso", "✕ " + t("eliminaChat"), () => eliminaChat(c.id)));
    return box;
  }

  // Una riga dell'elenco. In una ricerca mostra anche il pezzetto di testo trovato.
  function creaRiga(c, snippet) {
    const li = document.createElement("li");
    li.className = "chat-riga" + (c.id === window.conversazioneAttiva() ? " attiva" : "") + (menuId === c.id ? " aperta" : "");

    const apri = document.createElement("button");
    apri.type = "button";
    apri.className = "chat-item";
    const titolo = document.createElement("span");
    titolo.className = "chat-titolo";
    titolo.textContent = (c.pinned && funzioniChat ? "📌 " : "") + (c.title || t("chatSenzaTitolo")); // textContent: niente HTML nei titoli
    apri.appendChild(titolo);
    if (snippet) {
      const sn = document.createElement("span");
      sn.className = "chat-snippet";
      sn.appendChild(conEvidenza(snippet, ricerca));
      apri.appendChild(sn);
    }
    const data = document.createElement("small");
    data.textContent = dataBreve(c.updated_at) + (condivise.has(c.id) ? " · 🔗" : "");
    if (condivise.has(c.id)) data.title = t("chatCondivisa");
    apri.appendChild(data);
    apri.addEventListener("click", () => apriChat(c.id));

    const menu = document.createElement("button");
    menu.type = "button";
    menu.className = "chat-del chat-menu-btn";
    menu.textContent = "⋯";
    menu.title = t("altreAzioni");
    menu.setAttribute("aria-label", t("altreAzioni"));
    menu.setAttribute("aria-expanded", String(menuId === c.id));
    menu.addEventListener("click", () => {
      menuId = menuId === c.id ? null : c.id;
      modifica = null;
      disegnaElenco();
    });

    li.append(apri, menu);
    if (menuId === c.id) li.appendChild(creaAzioni(c));
    return li;
  }

  // Evidenzia nel testo le parole cercate con <mark>, senza innerHTML
  function conEvidenza(testo, q) {
    const frag = document.createDocumentFragment();
    const basso = testo.toLowerCase(), cerca = (q || "").toLowerCase();
    let da = 0, i;
    while (cerca && (i = basso.indexOf(cerca, da)) !== -1) {
      if (i > da) frag.appendChild(document.createTextNode(testo.slice(da, i)));
      const m = document.createElement("mark");
      m.textContent = testo.slice(i, i + cerca.length);
      frag.appendChild(m);
      da = i + cerca.length;
    }
    if (da < testo.length) frag.appendChild(document.createTextNode(testo.slice(da)));
    return frag;
  }

  // Intestazione ripiegabile di una sezione (Fissate / una cartella / Senza cartella)
  function creaSezione(chiave, titolo, chats, ripiegabile) {
    const li = document.createElement("li");
    li.className = "chat-sezione";
    const chiusa = ripiegabile && cartelleChiuse.has(chiave);
    const testa = document.createElement("button");
    testa.type = "button";
    testa.className = "chat-sezione-testa";
    testa.setAttribute("aria-expanded", String(!chiusa));
    testa.textContent = `${chiusa ? "▸" : "▾"} ${titolo} (${chats.length})`;
    testa.addEventListener("click", () => {
      chiusa ? cartelleChiuse.delete(chiave) : cartelleChiuse.add(chiave);
      disegnaElenco();
    });
    li.appendChild(testa);
    if (!chiusa) {
      const ul = document.createElement("ul");
      ul.className = "chats-list interna";
      chats.forEach(c => ul.appendChild(creaRiga(c)));
      li.appendChild(ul);
    }
    return li;
  }

  function disegnaElenco() {
    const lista = $("chatsList");
    lista.textContent = "";
    $("chatsCerca").placeholder = t("cerca");

    if (risultatiRicerca) {
      $("chatsVuoto").hidden = risultatiRicerca.length > 0;
      $("chatsVuoto").textContent = t("nessunRisultato");
      risultatiRicerca.forEach(x => lista.appendChild(creaRiga(x.chat, x.snippet)));
      return;
    }

    $("chatsVuoto").hidden = elencoChat.length > 0;
    $("chatsVuoto").textContent = t("nessunaChat");

    if (!funzioniChat) {
      elencoChat.forEach(c => lista.appendChild(creaRiga(c)));
      return;
    }
    const fissate = elencoChat.filter(c => c.pinned);
    const cartelle = new Map();
    const senza = [];
    elencoChat.filter(c => !c.pinned).forEach(c => {
      if (c.folder) { if (!cartelle.has(c.folder)) cartelle.set(c.folder, []); cartelle.get(c.folder).push(c); }
      else senza.push(c);
    });
    if (fissate.length) lista.appendChild(creaSezione("@fissate", "📌 " + t("fissate"), fissate, true));
    Array.from(cartelle.keys()).sort((a, b) => a.localeCompare(b)).forEach(nome =>
      lista.appendChild(creaSezione("cartella:" + nome, "📁 " + nome, cartelle.get(nome), true)));
    if (fissate.length || cartelle.size) {
      if (senza.length) lista.appendChild(creaSezione("@senza", t("senzaCartella"), senza, true));
    } else {
      senza.forEach(c => lista.appendChild(creaRiga(c)));
    }
  }

  // --- Ricerca nelle chat ---------------------------------------------------------------
  function ritaglia(testo, q) {
    const i = testo.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return testo.slice(0, 80);
    const da = Math.max(0, i - 25), a = Math.min(testo.length, i + q.length + 40);
    return (da > 0 ? "…" : "") + testo.slice(da, a).replace(/\s+/g, " ") + (a < testo.length ? "…" : "");
  }

  function avviaRicerca(testo) {
    clearTimeout(timerRicerca);
    testo = testo.trim();
    if (testo.length < 2) {
      ricerca = ""; risultatiRicerca = null;
      return disegnaElenco();
    }
    timerRicerca = setTimeout(() => eseguiRicerca(testo), 300);
  }

  async function eseguiRicerca(q) {
    ricerca = q;
    // * % , ( ) hanno un significato nei filtri dell'API: si tolgono dalla parola cercata
    const pulita = q.replace(/[*%,()\\]/g, " ").trim();
    if (pulita.length < 2) { risultatiRicerca = []; return disegnaElenco(); }
    const r = await MiczyAuth.rest("GET",
      `/rest/v1/messages?content=ilike.${encodeURIComponent("*" + pulita + "*")}&select=conversation_id,content&order=id.desc&limit=80`);
    if (ricerca !== q) return;   // nel frattempo l'utente ha scritto altro
    if (r.stato === 401) return sessioneScaduta();

    const trovate = new Map();   // id chat -> pezzetto di testo (null se ha trovato solo il titolo)
    elencoChat.forEach(c => { if ((c.title || "").toLowerCase().includes(pulita.toLowerCase())) trovate.set(c.id, null); });
    (r.ok && Array.isArray(r.dati) ? r.dati : []).forEach(m => {
      if (typeof m.content === "string" && !trovate.get(m.conversation_id)) trovate.set(m.conversation_id, ritaglia(m.content, pulita));
    });

    // chat trovate che non sono nell'elenco già caricato: ci serve il titolo
    const mancanti = Array.from(trovate.keys()).filter(id => !elencoChat.some(c => c.id === id));
    let extra = [];
    if (mancanti.length) {
      const c = await MiczyAuth.rest("GET", `/rest/v1/conversations?id=in.(${mancanti.join(",")})&select=id,title,updated_at`);
      if (ricerca !== q) return;
      if (c.ok && Array.isArray(c.dati)) extra = c.dati;
    }
    const chatDi = id => elencoChat.find(c => c.id === id) || extra.find(c => c.id === id);
    risultatiRicerca = Array.from(trovate.entries())
      .map(([id, snippet]) => ({ chat: chatDi(id), snippet }))
      .filter(x => x.chat);
    disegnaElenco();
  }

  // Messaggi di una chat con i voti dati dall'utente (👍/👎)
  async function caricaMessaggi(id) {
    const r = await MiczyAuth.rest("GET",
      `/rest/v1/messages?conversation_id=eq.${encodeURIComponent(id)}&select=id,role,content&order=id.asc&limit=500`);
    if (!r.ok || !Array.isArray(r.dati)) return r;
    const voti = {};
    const ids = r.dati.filter(m => m.role === "assistant" && Number.isInteger(m.id)).map(m => m.id);
    if (ids.length) {
      const v = await MiczyAuth.rest("GET", `/rest/v1/feedback?select=message_id,rating&message_id=in.(${ids.join(",")})`);
      if (v.ok && Array.isArray(v.dati)) v.dati.forEach(x => { voti[x.message_id] = x.rating; });
    }
    return { ok: true, stato: 200, dati: r.dati, voti };
  }

  async function apriChat(id) {
    const r = await caricaMessaggi(id);
    if (r.stato === 401) return sessioneScaduta();
    if (!r.ok || !Array.isArray(r.dati)) return avviso(errore("generico"), true);
    window.mostraConversazione(id, r.dati, r.voti);
    ricordaUltimaChat(id);
    chiudiPannello();
    disegnaElenco();
  }

  async function eliminaChat(id, conferma = true) {
    if (conferma && !confirm(t("confermaElimina"))) return;
    const r = await MiczyAuth.rest("DELETE",
      `/rest/v1/conversations?id=eq.${encodeURIComponent(id)}`, undefined, { Prefer: "return=minimal" });
    if (r.stato === 401) return sessioneScaduta();
    if (!r.ok) return avviso(errore("generico"), true);
    if (id === window.conversazioneAttiva()) {
      window.nuovaChat();
      ricordaUltimaChat(null);
    }
    elencoChat = elencoChat.filter(c => c.id !== id);
    condivise.delete(id);
    if (risultatiRicerca) risultatiRicerca = risultatiRicerca.filter(x => x.chat.id !== id);
    if (menuId === id) menuId = null;
    if (modifica && modifica.id === id) modifica = null;
    disegnaElenco();
  }

  // Usata dal cestino della chat (script.js ha già chiesto conferma)
  async function eliminaAttiva() {
    const id = window.conversazioneAttiva();
    if (id) await eliminaChat(id, false);
  }

  // Ultima chat aperta, per riaprirla quando si ricarica la pagina
  function chiaveUltima() {
    const u = MiczyAuth.utente();
    return u ? `miczy.ultimaChat.${u.id}` : null;
  }
  function ricordaUltimaChat(id) {
    const k = chiaveUltima();
    if (!k) return;
    try { id ? localStorage.setItem(k, id) : localStorage.removeItem(k); } catch (e) { /* ignora */ }
  }
  async function ripristinaUltimaChat() {
    const k = chiaveUltima();
    let id = null;
    try { id = k ? localStorage.getItem(k) : null; } catch (e) { /* ignora */ }
    if (!id) return false;
    const r = await caricaMessaggi(id);
    if (!r.ok || !Array.isArray(r.dati) || !r.dati.length) { ricordaUltimaChat(null); return false; }
    window.mostraConversazione(id, r.dati, r.voti);
    return true;
  }

  // --- Sessione scaduta -------------------------------------------------------------
  async function sessioneScaduta() {
    await MiczyAuth.esci();
    apriModale("login", t("sessioneScaduta"));
  }

  // --- Agganci per script.js -----------------------------------------------------------
  // Chiamato dopo ogni risposta: ricorda la chat, aggiorna elenco e contatore
  function dopoRisposta(idChat) {
    if (!MiczyAuth.utente()) return;
    if (idChat) ricordaUltimaChat(idChat);
    aggiornaElenco();
    caricaMe();
  }

  function aggiornaTesti() {
    aggiornaInterfaccia();
    if (elencoChat.length || $("chatsPanel").classList.contains("open")) disegnaElenco();
  }

  // --- Avvio ------------------------------------------------------------------------------
  async function inizializza() {
    // collegamenti dei pulsanti
    $("accountBtn").addEventListener("click", () => {
      if (!MiczyAuth.utente()) return apriModale("login");
      const aprire = !$("accountWrap").classList.contains("open");
      menuAperto(aprire);
      if (aprire) caricaMe();
    });
    $("menuChat").addEventListener("click", () => { menuAperto(false); apriPannello(); });
    $("menuEsci").addEventListener("click", async () => { menuAperto(false); await MiczyAuth.esci(); avviso(t("esciFatto")); });
    $("chatsBtn").addEventListener("click", () => {
      $("chatsPanel").classList.contains("open") ? chiudiPannello() : apriPannello();
    });
    $("chatsClose").addEventListener("click", chiudiPannello);
    $("chatsCerca").addEventListener("input", e => avviaRicerca(e.target.value));
    $("nuovaChatBtn").addEventListener("click", () => {
      window.nuovaChat();
      ricordaUltimaChat(null);
      chiudiPannello();
      disegnaElenco();
    });

    $("tabLogin").addEventListener("click", () => apriModale("login", ""));
    $("tabSignup").addEventListener("click", () => apriModale("signup", ""));
    $("authForgot").addEventListener("click", () => apriModale(modo === "recupera" ? "login" : "recupera", ""));
    $("authClose").addEventListener("click", chiudiModale);
    $("authForm").addEventListener("submit", inviaModale);

    document.addEventListener("click", e => {
      if (!$("accountWrap").contains(e.target)) menuAperto(false);
    });
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      menuAperto(false);
      chiudiPannello();
      if ($("authModal").classList.contains("show") && modo !== "nuovaPassword") chiudiModale();
    });

    // se l'accesso non è configurato non mostriamo nulla di rotto
    if (!MiczyAuth.configurato()) {
      $("accountWrap").hidden = true;
      $("chatsBtn").hidden = true;
      return false;
    }

    // cambi di sessione (login, logout, sessione scaduta)
    MiczyAuth.onCambio(async utente => {
      window.nuovaChat();
      aggiornaInterfaccia();
      if (utente) {
        caricaMe();
        aggiornaElenco();
        await ripristinaUltimaChat();
      } else {
        elencoChat = [];
        condivise = new Set(); menuId = null; modifica = null; risultatiRicerca = null; ricerca = "";
        $("chatsCerca").value = "";
        disegnaElenco();
        window.caricaCronologiaOspite(); // tornano le chat locali da ospite
      }
    });

    // ritorno da un link nell'email (conferma / recupero password)
    const ritorno = await MiczyAuth.inizializza();
    aggiornaInterfaccia();

    if (ritorno && ritorno.errore) {
      avviso(errore(ritorno.errore), true);
    } else if (ritorno && ritorno.tipo === "recovery") {
      apriModale("nuovaPassword");
    } else if (ritorno && ritorno.tipo) {
      avviso(t("emailConfermata"));
    }

    if (MiczyAuth.utente()) {
      caricaMe();
      aggiornaElenco();
      return ripristinaUltimaChat();
    }
    return false;
  }

  window.Account = { inizializza, aggiornaTesti, dopoRisposta, sessioneScaduta, eliminaAttiva, apriModale, avviso };
})();
