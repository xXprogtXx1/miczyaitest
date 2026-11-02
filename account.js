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
    const r = await MiczyAuth.rest("GET",
      "/rest/v1/conversations?select=id,title,updated_at&order=updated_at.desc&limit=100");
    if (r.stato === 401) return sessioneScaduta();
    if (!r.ok || !Array.isArray(r.dati)) return;
    elencoChat = r.dati;
    disegnaElenco();
  }

  function disegnaElenco() {
    const lista = $("chatsList");
    lista.textContent = "";
    $("chatsVuoto").hidden = elencoChat.length > 0;
    $("chatsVuoto").textContent = t("nessunaChat");

    elencoChat.forEach(c => {
      const li = document.createElement("li");
      li.className = "chat-riga" + (c.id === window.conversazioneAttiva() ? " attiva" : "");

      const apri = document.createElement("button");
      apri.type = "button";
      apri.className = "chat-item";
      const titolo = document.createElement("span");
      titolo.className = "chat-titolo";
      titolo.textContent = c.title || t("chatSenzaTitolo"); // textContent: i titoli non possono contenere HTML
      const data = document.createElement("small");
      data.textContent = dataBreve(c.updated_at);
      apri.append(titolo, data);
      apri.addEventListener("click", () => apriChat(c.id));

      const del = document.createElement("button");
      del.type = "button";
      del.className = "chat-del";
      del.textContent = "✕";
      del.title = del.ariaLabel = t("eliminaChat");
      del.addEventListener("click", () => eliminaChat(c.id));

      li.append(apri, del);
      lista.appendChild(li);
    });
  }

  async function apriChat(id) {
    const r = await MiczyAuth.rest("GET",
      `/rest/v1/messages?conversation_id=eq.${encodeURIComponent(id)}&select=role,content&order=id.asc&limit=500`);
    if (r.stato === 401) return sessioneScaduta();
    if (!r.ok || !Array.isArray(r.dati)) return avviso(errore("generico"), true);
    window.mostraConversazione(id, r.dati);
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
    const r = await MiczyAuth.rest("GET",
      `/rest/v1/messages?conversation_id=eq.${encodeURIComponent(id)}&select=role,content&order=id.asc&limit=500`);
    if (!r.ok || !Array.isArray(r.dati) || !r.dati.length) { ricordaUltimaChat(null); return false; }
    window.mostraConversazione(id, r.dati);
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
