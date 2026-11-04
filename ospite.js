// Contatore dei messaggi gratuiti rimasti agli ospiti, con un invito discreto ad accedere.
(function () {
  "use strict";
  const Auth = window.MiczyAuth;
  const box = document.getElementById("quotaOspite");
  if (!box) return;
  const TESTI = {
    it: { rimasti: "Messaggi gratuiti rimasti oggi:", accedi: "Accedi per averne di più", finiti: "Hai finito i messaggi gratuiti di oggi.", rinnovo: "Si rinnovano tra", ore: "h", min: "min" },
    en: { rimasti: "Free messages left today:", accedi: "Sign in for more", finiti: "You've used today's free messages.", rinnovo: "They renew in", ore: "h", min: "min" }
  };
  const lingua = () => (window.linguaCorrente && window.linguaCorrente() === "en" ? "en" : "it");
  let stato = null, richiesta = 0;

  function disegna() {
    box.textContent = "";
    if (!stato) { box.hidden = true; return; }
    const T = TESTI[lingua()];
    const finiti = stato.remaining <= 0;
    box.hidden = false;
    box.classList.toggle("poco", !finiti && stato.remaining <= 3);
    box.classList.toggle("finiti", finiti);
    const s = document.createElement("span");
    if (finiti) {
      const m = Math.max(1, Math.ceil(stato.reset / 60));
      s.textContent = T.finiti + " " + T.rinnovo + " " + (m >= 60 ? Math.ceil(m / 60) + " " + T.ore : m + " " + T.min) + ".";
    } else {
      s.append(T.rimasti + " ");
      const n = document.createElement("strong"); n.textContent = stato.remaining + "/" + stato.limit; s.appendChild(n);
    }
    const b = document.createElement("button"); b.type = "button"; b.className = "quota-accedi"; b.textContent = T.accedi;
    b.addEventListener("click", () => { const a = document.getElementById("accountBtn"); if (a) a.click(); });
    box.append(s, b);
  }

  async function aggiorna() {
    if (!Auth || !Auth.configurato() || Auth.utente()) { stato = null; disegna(); return; }
    const mio = ++richiesta;
    const r = await Auth.backend("/quota");
    if (mio !== richiesta) return;       // una richiesta più recente ha già risposto
    stato = r.ok && r.dati && r.dati.guest === true && Number.isFinite(r.dati.remaining) ? r.dati : null;
    disegna();
  }

  if (Auth && Auth.onCambio) Auth.onCambio(aggiorna);
  window.Ospite = { aggiorna, aggiornaTesti: disegna };
  aggiorna();
})();
