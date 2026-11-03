// Pagina di sola lettura per una chat condivisa con un link.
// Mostra solo titolo e messaggi: niente email né dati di chi l'ha condivisa.
(function () {
  "use strict";

  var corpo = document.getElementById("corpo");
  var config = window.MICZY_CONFIG || {};
  var backend = String(config.backendUrl || "").replace(/\/+$/, "");

  try {
    if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark-mode");
  } catch (e) { /* senza storage resta il tema chiaro */ }

  function el(tag, classe, testo) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (testo != null) n.textContent = testo;
    return n;
  }

  function stato(icona, testo, conPulsante) {
    corpo.replaceChildren();
    var box = el("div", "stato");
    box.appendChild(el("div", "icona", icona));
    box.appendChild(el("p", null, testo));
    if (conPulsante) box.appendChild(vaiAlSito("Vai a MiczyAI"));
    corpo.appendChild(box);
  }

  function vaiAlSito(testo) {
    var a = el("a", "btn", testo);
    a.href = "../";
    return a;
  }

  function markdownSicuro(testo) {
    if (window.marked && window.DOMPurify) {
      return window.DOMPurify.sanitize(window.marked.parse(testo, { breaks: true }));
    }
    return null; // librerie non caricate: si mostra come testo semplice
  }

  function mostra(dati) {
    document.title = "MiczyAI · " + String(dati.title || "Chat condivisa").slice(0, 80);
    corpo.replaceChildren();
    corpo.appendChild(el("h1", null, dati.title || "Chat condivisa"));

    var sotto = "";
    if (dati.created_at) {
      var d = new Date(dati.created_at);
      if (!isNaN(d)) sotto = "Chat del " + d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) + " · ";
    }
    corpo.appendChild(el("p", "sotto", sotto + "puoi solo leggerla"));

    var chat = el("div", "chat");
    (dati.messages || []).forEach(function (m) {
      if (!m || typeof m.content !== "string") return;
      if (m.role === "user") {
        chat.appendChild(el("div", "msg utente", m.content)); // testo puro
      } else if (m.role === "assistant") {
        var nodo = el("div", "msg ai");
        var html = markdownSicuro(m.content);
        if (html === null) nodo.style.whiteSpace = "pre-wrap", nodo.textContent = m.content;
        else nodo.innerHTML = html;
        nodo.querySelectorAll("a").forEach(function (a) {
          a.target = "_blank";
          a.rel = "noopener noreferrer nofollow";
        });
        chat.appendChild(nodo);
      }
    });
    if (!chat.children.length) {
      stato("🫥", "Questa chat è vuota.", true);
      return;
    }
    corpo.appendChild(chat);
    corpo.appendChild(el("p", "nota", "Le risposte sono generate da un'IA e possono contenere errori."));
    var az = el("div", "azioni");
    az.appendChild(vaiAlSito("Prova MiczyAI"));
    corpo.appendChild(az);
  }

  var token = (new URLSearchParams(location.search).get("c") || "").trim();
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(token)) {
    stato("🔗", "Questo link non è valido.", true);
    return;
  }
  if (!backend) {
    stato("😬", "Il sito non è configurato correttamente.", false);
    return;
  }

  // Il server gratuito può dormire: si riprova qualche volta prima di arrendersi
  var tentativo = 0;
  function carica() {
    tentativo++;
    fetch(backend + "/shared/" + encodeURIComponent(token), { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { stato: r.status, dati: j }; });
      })
      .then(function (r) {
        if (r.stato === 200) return mostra(r.dati);
        if (r.stato === 404) return stato("🔗", "Questo link non esiste o non è più condiviso.", true);
        if (r.stato === 429) return stato("⏱️", "Troppe richieste: riprova tra un minuto.", false);
        throw new Error("HTTP " + r.stato);
      })
      .catch(function () {
        if (tentativo < 4) {
          stato("⏳", "Sto svegliando il server, ci vuole qualche secondo…", false);
          setTimeout(carica, 4000);
        } else {
          stato("😬", "Non riesco a caricare la chat. Riprova più tardi.", true);
        }
      });
  }
  carica();
})();
