// Accesso a MiczyAI: parla con Supabase Auth (registrazione, login, recupero password)
// e con il backend, senza librerie esterne. Non tocca la pagina: ci pensa account.js.
(function () {
  "use strict";

  const cfg = window.MICZY_CONFIG || {};
  const CHIAVE_SESSIONE = "miczy.sessione";

  let sessione = null;        // { access_token, refresh_token, expires_at, user: {id, email} }
  let rinnovoInCorso = null;  // promessa condivisa, così non si rinnova due volte insieme
  const ascoltatori = [];

  const configurato = () =>
    !!(cfg.supabaseUrl && cfg.supabaseAnonKey && !/^INCOLLA/i.test(cfg.supabaseAnonKey));

  // --- Salvataggio della sessione nel browser ---------------------------------
  function leggiSessione() {
    try {
      const s = JSON.parse(localStorage.getItem(CHIAVE_SESSIONE));
      if (s && s.access_token && s.refresh_token && s.user && s.user.id) return s;
    } catch (e) { /* storage non disponibile o dati rovinati */ }
    return null;
  }

  function salvaSessione(s) {
    try {
      if (s) localStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(s));
      else localStorage.removeItem(CHIAVE_SESSIONE);
    } catch (e) { /* ignora */ }
  }

  function impostaSessione(nuova) {
    const prima = sessione && sessione.user ? sessione.user.id : null;
    sessione = nuova;
    salvaSessione(nuova);
    const dopo = nuova && nuova.user ? nuova.user.id : null;
    if (prima !== dopo) ascoltatori.forEach(f => { try { f(utente()); } catch (e) { console.error(e); } });
  }

  function daRispostaToken(d) {
    return {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      user: d.user ? { id: d.user.id, email: d.user.email } : (sessione ? sessione.user : null)
    };
  }

  // --- Chiamate a Supabase -----------------------------------------------------
  async function chiama(percorso, { metodo = "GET", corpo, token, extra } = {}) {
    const headers = Object.assign({ apikey: cfg.supabaseAnonKey, "Content-Type": "application/json" }, extra);
    if (token) headers.Authorization = `Bearer ${token}`;
    let risposta;
    try {
      risposta = await fetch(cfg.supabaseUrl + percorso, {
        method: metodo,
        headers,
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
        signal: window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(15000) : undefined
      });
    } catch (e) {
      return { ok: false, stato: 0, dati: null };
    }
    let dati = null;
    try { dati = await risposta.json(); } catch (e) { /* risposta vuota */ }
    return { ok: risposta.ok, stato: risposta.status, dati };
  }

  // Trasforma un errore di Supabase in una chiave breve; il testo lo sceglie account.js
  function tipoErrore(r) {
    const d = r.dati || {};
    const codice = String(d.error_code || d.error || "").toLowerCase();
    const testo = String(d.msg || d.message || d.error_description || "").toLowerCase();
    if (r.stato === 0) return "rete";
    if (codice === "invalid_credentials" || testo.includes("invalid login")) return "credenziali";
    if (codice === "email_not_confirmed" || testo.includes("not confirmed")) return "nonConfermata";
    if (codice === "user_already_exists" || testo.includes("already registered")) return "esiste";
    if (codice === "weak_password" || testo.includes("password should")) return "debole";
    if (codice === "same_password" || testo.includes("different from the old")) return "stessaPassword";
    if (codice.includes("rate_limit") || r.stato === 429) return "troppi";
    if (codice === "signup_disabled") return "registrazioniChiuse";
    if (codice === "email_address_invalid" || testo.includes("valid email")) return "emailNonValida";
    return "generico";
  }

  // --- Funzioni pubbliche -------------------------------------------------------
  const utente = () => (sessione && sessione.user) || null;

  async function accedi(email, password) {
    if (!configurato()) return { ok: false, errore: "nonConfigurato" };
    const r = await chiama("/auth/v1/token?grant_type=password", { metodo: "POST", corpo: { email, password } });
    if (r.ok && r.dati && r.dati.access_token) {
      impostaSessione(daRispostaToken(r.dati));
      return { ok: true };
    }
    return { ok: false, errore: tipoErrore(r) };
  }

  async function registra(email, password) {
    if (!configurato()) return { ok: false, errore: "nonConfigurato" };
    // Dopo il click nell'email si torna alla pagina "confermato/" di questo sito
    const dopo = encodeURIComponent(location.origin + location.pathname.replace(/[^/]*$/, "") + "confermato/");
    const r = await chiama("/auth/v1/signup?redirect_to=" + dopo, { metodo: "POST", corpo: { email, password } });
    if (!r.ok) return { ok: false, errore: tipoErrore(r) };
    if (r.dati && r.dati.access_token) {            // conferma email disattivata: si è già dentro
      impostaSessione(daRispostaToken(r.dati));
      return { ok: true, daConfermare: false };
    }
    return { ok: true, daConfermare: true };        // arriva un'email con il link di conferma
  }

  async function recuperaPassword(email) {
    if (!configurato()) return { ok: false, errore: "nonConfigurato" };
    const r = await chiama("/auth/v1/recover", { metodo: "POST", corpo: { email } });
    return r.ok ? { ok: true } : { ok: false, errore: tipoErrore(r) };
  }

  async function cambiaPassword(nuova) {
    const t = await token();
    if (!t) return { ok: false, errore: "sessione" };
    const r = await chiama("/auth/v1/user", { metodo: "PUT", corpo: { password: nuova }, token: t });
    return r.ok ? { ok: true } : { ok: false, errore: tipoErrore(r) };
  }

  async function esci() {
    const t = sessione ? sessione.access_token : null;
    impostaSessione(null);
    if (t && configurato()) await chiama("/auth/v1/logout", { metodo: "POST", token: t }); // se fallisce non importa
  }

  // Token valido: lo rinnova da solo se sta per scadere. Restituisce null se non si è loggati.
  async function token() {
    if (!sessione) return null;
    const ora = Math.floor(Date.now() / 1000);
    if (sessione.expires_at - ora > 60) return sessione.access_token;
    return rinnova();
  }

  function rinnova() {
    if (rinnovoInCorso) return rinnovoInCorso;
    rinnovoInCorso = (async () => {
      try {
        const r = await chiama("/auth/v1/token?grant_type=refresh_token", {
          metodo: "POST", corpo: { refresh_token: sessione.refresh_token }
        });
        if (r.ok && r.dati && r.dati.access_token) {
          impostaSessione(daRispostaToken(r.dati));
          return sessione.access_token;
        }
        if (r.stato === 0) {  // niente rete: si prova col vecchio token finché non scade davvero
          return sessione.expires_at > Date.now() / 1000 ? sessione.access_token : null;
        }
        impostaSessione(null); // il server dice che la sessione non vale più
        return null;
      } finally {
        rinnovoInCorso = null;
      }
    })();
    return rinnovoInCorso;
  }

  // Chiamata al database (PostgREST) con il token dell'utente: le regole RLS fanno vedere solo le sue chat.
  async function rest(metodo, percorso, corpo, extra) {
    const t = await token();
    if (!t) return { ok: false, stato: 401, dati: null };
    return chiama(percorso, { metodo, corpo, token: t, extra });
  }

  // Chiamata al backend di MiczyAI (/me, /admin/...) con il token dell'utente.
  async function backend(percorso, { metodo = "GET", corpo } = {}) {
    const base = String(cfg.backendUrl || "").replace(/\/$/, "");
    const headers = { "Content-Type": "application/json" };
    const t = await token();
    if (t) headers.Authorization = `Bearer ${t}`;
    let risposta;
    try {
      risposta = await fetch(base + percorso, {
        method: metodo,
        headers,
        body: corpo === undefined ? undefined : JSON.stringify(corpo)
      });
    } catch (e) {
      return { ok: false, stato: 0, dati: null };
    }
    let dati = null;
    try { dati = await risposta.json(); } catch (e) { /* ignora */ }
    return { ok: risposta.ok, stato: risposta.status, dati };
  }

  // Link nelle email (conferma registrazione, recupero password): Supabase riporta qui con i
  // dati nell'indirizzo, dopo il "#". Li leggiamo, entriamo e ripuliamo l'indirizzo.
  async function gestisciRitorno() {
    const h = location.hash.replace(/^#/, "");
    if (!h) return null;
    const p = new URLSearchParams(h);

    if (p.get("error") || p.get("error_code")) {
      pulisciIndirizzo();
      return { errore: p.get("error_code") === "otp_expired" ? "linkScaduto" : "linkNonValido" };
    }

    const at = p.get("access_token");
    const rt = p.get("refresh_token");
    if (!at || !rt) return null;

    pulisciIndirizzo();
    const r = await chiama("/auth/v1/user", { token: at });
    if (!r.ok || !r.dati || !r.dati.id) return { errore: "linkNonValido" };

    const scade = Number(p.get("expires_at")) ||
      Math.floor(Date.now() / 1000) + (Number(p.get("expires_in")) || 3600);
    impostaSessione({
      access_token: at, refresh_token: rt, expires_at: scade,
      user: { id: r.dati.id, email: r.dati.email }
    });
    return { tipo: p.get("type") || "" };
  }

  function pulisciIndirizzo() {
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* ignora */ }
  }

  // Da chiamare una volta all'avvio della pagina.
  async function inizializza() {
    sessione = leggiSessione();
    if (!configurato()) return null;
    const ritorno = await gestisciRitorno();
    if (sessione) await token(); // se il token è scaduto lo rinnova (o esce, se non vale più)
    return ritorno;
  }

  sessione = leggiSessione(); // subito, così la pagina sa già se sei dentro

  window.MiczyAuth = {
    configurato, inizializza, utente, token, accedi, registra, recuperaPassword,
    cambiaPassword, esci, rest, backend,
    onCambio: f => ascoltatori.push(f)
  };
})();
