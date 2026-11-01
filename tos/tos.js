document.addEventListener("DOMContentLoaded", () => {
  const testi = {
    it: {
      titolo: "Termini di Servizio",
      aggiornamento: "Ultimo aggiornamento: Novembre 2026",
      t1: "1. Utilizzo del Servizio",
      p1: "MiczyAI è un chatbot sperimentale basato su intelligenza artificiale. È offerto solo per uso personale e legale.",
      t2: "2. Contenuti Generati",
      p2: "Le risposte di MiczyAI sono generate automaticamente e possono contenere imprecisioni. L’utente è responsabile del loro utilizzo.",
      t3: "3. Account e Dati",
      p3: "Non viene richiesto alcun account. I messaggi inviati sono trattati come descritto nella ",
      privacyLink: "Privacy Policy",
      t4: "4. Limitazioni",
      l1: "Non inviare contenuti offensivi, illegali o dannosi.",
      l2: "Non compromettere o sovraccaricare il sistema.",
      l3: "Non utilizzare bot o sistemi automatici.",
      t5: "5. Modifiche",
      p5: "I Termini possono essere aggiornati. Continuando a usare il sito, accetti le eventuali modifiche future.",
      torna: "Torna a MiczyAI",
      lingua: "EN"
    },
    en: {
      titolo: "Terms of Service",
      aggiornamento: "Last updated: November 2026",
      t1: "1. Service Usage",
      p1: "MiczyAI is an experimental AI-based chatbot. It is offered only for personal and legal use.",
      t2: "2. Generated Content",
      p2: "MiczyAI's responses are generated automatically and may contain inaccuracies. Users are responsible for how they use the content.",
      t3: "3. Account and Data",
      p3: "No account is required. Messages you send are handled as described in the ",
      privacyLink: "Privacy Policy",
      t4: "4. Limitations",
      l1: "Do not send offensive, illegal or harmful content.",
      l2: "Do not compromise or overload the system.",
      l3: "Do not use bots or automated systems.",
      t5: "5. Changes",
      p5: "Terms may be updated. By continuing to use the site, you accept any future changes.",
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
