// CAPTCHA anti-bot (Cloudflare Turnstile) per registrazione, login e recupero password.
// Si attiva da solo se in config.js c'è "turnstileSiteKey"; senza chiave non fa nulla,
// quindi il sito continua a funzionare anche se non l'hai ancora configurato.
// Il widget è "gestito": per quasi tutti gli utenti si risolve da solo, senza click.
(function () {
  "use strict";

  const cfg = window.MICZY_CONFIG || {};
  const CHIAVE = String(cfg.turnstileSiteKey || "").trim();
  const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  const ATTESA_MAX = 12000;   // quanto aspettare il token prima di rinunciare

  const attivo = () => !!CHIAVE && !/^INCOLLA/i.test(CHIAVE);

  let caricamento = null;
  function carica() {
    if (window.turnstile) return Promise.resolve(true);
    if (caricamento) return caricamento;
    caricamento = new Promise(ok => {
      const s = document.createElement("script");
      s.src = SCRIPT; s.async = true; s.defer = true;
      s.onload = () => ok(!!window.turnstile);
      s.onerror = () => { caricamento = null; ok(false); };
      document.head.appendChild(s);
    });
    return caricamento;
  }

  const lingua = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");
  const tema = () => (document.body.classList.contains("dark-mode") ? "dark" : "light");

  // Monta un widget dentro "contenitore". Restituisce { token(), reset(), mostra(bool), rimuovi() }.
  function monta(contenitore) {
    if (!attivo() || !contenitore) return null;
    let id = null, valore = null, attese = [], errore = false;

    const consegna = v => { valore = v; const a = attese; attese = []; a.forEach(f => f(v)); };

    carica().then(pronto => {
      if (!pronto) { errore = true; consegna(null); return; }
      if (id !== null) return;
      id = window.turnstile.render(contenitore, {
        sitekey: CHIAVE,
        theme: tema(),
        language: lingua(),
        appearance: "interaction-only",       // visibile solo se serve un click
        callback: v => { errore = false; consegna(v); },
        "expired-callback": () => { valore = null; },
        "timeout-callback": () => { valore = null; },
        "error-callback": () => { errore = true; consegna(null); }
      });
    });

    return {
      // Promessa col token (o null se non arriva in tempo / il caricamento è fallito).
      token() {
        if (valore) return Promise.resolve(valore);
        if (errore) return Promise.resolve(null);
        return new Promise(ok => {
          const t = setTimeout(() => ok(null), ATTESA_MAX);
          attese.push(v => { clearTimeout(t); ok(v); });
        });
      },
      // Ogni token vale una sola volta: dopo l'invio se ne chiede uno nuovo.
      reset() {
        valore = null;
        if (id !== null && window.turnstile) { try { window.turnstile.reset(id); } catch (e) { /* ignora */ } }
      },
      rimuovi() {
        if (id !== null && window.turnstile) { try { window.turnstile.remove(id); } catch (e) { /* ignora */ } }
        id = null; valore = null; contenitore.textContent = "";
      }
    };
  }

  window.Captcha = { attivo, monta };
})();
