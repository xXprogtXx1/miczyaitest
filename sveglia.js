// Sveglia il server (Render gratuito si addormenta dopo 15 minuti): appena la pagina si apre,
// e di nuovo quando si torna sulla scheda dopo un po'. Parte dall'<head>, prima del resto del sito.
(function () {
  "use strict";
  const base = ((window.MICZY_CONFIG && window.MICZY_CONFIG.backendUrl) || "https://backend-miczy-ai.onrender.com").replace(/\/$/, "");
  const INTERVALLO = 10 * 60 * 1000;   // dopo quanto, tornando sulla scheda, richiamare
  let ultima = 0, inCorso = false;

  function sveglia() {
    if (inCorso) return;
    inCorso = true; ultima = Date.now();
    // no-cors: basta far arrivare la richiesta; non serve leggere la risposta
    fetch(base + "/health", { mode: "no-cors", cache: "no-store" })
      .catch(() => { /* irraggiungibile: se ne accorgerà la chat */ })
      .then(() => { inCorso = false; });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && Date.now() - ultima > INTERVALLO) sveglia();
  });
  window.Sveglia = { chiama: sveglia, inCorso: () => inCorso };
  sveglia();
})();
