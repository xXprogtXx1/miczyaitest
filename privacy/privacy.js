document.addEventListener("DOMContentLoaded", () => {
  const testi = {
    it: {
      titolo: "Privacy Policy",
      aggiornamento: "Ultimo aggiornamento: Novembre 2026",
      t1: "1. Dati trattati",
      p1: "Quando invii un messaggio, il testo (insieme agli ultimi messaggi della conversazione) viene inviato al server di MiczyAI per generare la risposta. Non è richiesto alcun account. I messaggi sono testo libero: evita di scrivere dati personali o sensibili.",
      t2: "2. Servizi esterni",
      p2: "Per funzionare, il servizio si appoggia a fornitori esterni (hosting del server e servizio di intelligenza artificiale che genera le risposte). I messaggi possono inoltre essere inoltrati a un webhook Discord privato, a scopo di sviluppo e miglioramento del servizio. Questi fornitori trattano i dati secondo le proprie policy.",
      t3: "3. Dati salvati nel browser",
      p3: "MiczyAI non usa cookie di tracciamento né pubblicitari. Salva nel tuo browser (localStorage) solo lingua, tema e cronologia della chat, che restano sul tuo dispositivo e puoi cancellare in qualsiasi momento con il pulsante del cestino.",
      t4: "4. Sicurezza",
      p4: "La connessione è protetta tramite HTTPS. Nessun sistema online è sicuro al 100%: non inserire informazioni riservate nella chat.",
      t5: "5. Diritti",
      p5: "Se ritieni che dei dati che ti riguardano siano stati conservati, puoi chiederne l'accesso o la cancellazione scrivendoci.",
      contatti: "Contattaci:",
      torna: "Torna a MiczyAI",
      lingua: "EN"
    },
    en: {
      titolo: "Privacy Policy",
      aggiornamento: "Last updated: November 2026",
      t1: "1. Data processed",
      p1: "When you send a message, its text (together with the most recent messages of the conversation) is sent to the MiczyAI server to generate the reply. No account is required. Messages are free text: avoid writing personal or sensitive data.",
      t2: "2. External services",
      p2: "To work, the service relies on external providers (server hosting and the artificial intelligence service that generates replies). Messages may also be forwarded to a private Discord webhook for development and service improvement. These providers process data according to their own policies.",
      t3: "3. Data stored in your browser",
      p3: "MiczyAI uses no tracking or advertising cookies. It stores in your browser (localStorage) only language, theme and chat history, which stay on your device and which you can delete at any time with the trash button.",
      t4: "4. Security",
      p4: "The connection is protected via HTTPS. No online system is 100% secure: do not enter confidential information in the chat.",
      t5: "5. Rights",
      p5: "If you believe data about you has been stored, you can ask for access or deletion by writing to us.",
      contatti: "Contact us:",
      torna: "Back to MiczyAI",
      lingua: "IT"
    }
  };

  function leggiLingua() {
    try { return localStorage.getItem("lang") === "en" ? "en" : "it"; } catch (e) { return "it"; }
  }

  function aggiornaTesto(lang) {
    const t = testi[lang];
    document.documentElement.lang = lang;
    document.title = `${t.titolo} - MiczyAI`;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t[el.dataset.i18n];
    });
    document.getElementById("btnLingua").textContent = t.lingua;
  }

  document.getElementById("btnLingua").addEventListener("click", () => {
    const nuova = leggiLingua() === "it" ? "en" : "it";
    try { localStorage.setItem("lang", nuova); } catch (e) { /* ignora */ }
    aggiornaTesto(nuova);
  });

  aggiornaTesto(leggiLingua());
});
