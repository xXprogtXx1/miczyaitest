// Pannello admin di MiczyAI. Tutto il testo che arriva dal server entra nella pagina con
// textContent (mai innerHTML), quindi email, motivi e messaggi non possono eseguire codice.
// Il controllo vero dei permessi è sul backend: questa pagina da sola non dà alcun potere.
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (tag, classe, testo) => {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (testo !== undefined) e.textContent = testo;
    return e;
  };
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  };

  try { if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark-mode"); } catch (e) { /* ignora */ }

  const numero = n => Number(n || 0).toLocaleString("it-IT");
  const dollari = v => {
    v = Number(v || 0);
    return "$" + v.toLocaleString("it-IT", { minimumFractionDigits: v < 1 ? 4 : 2, maximumFractionDigits: v < 1 ? 4 : 2 });
  };
  const dataLeggibile = iso => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };
  // "2026-11-03" -> Date a mezzanotte locale (senza slittamenti di fuso)
  const giornoDa = s => { const p = String(s).split("-").map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1); };

  function stato(testo, errore) {
    const s = $("stato");
    s.textContent = testo || "";
    s.hidden = !testo;
    s.classList.toggle("err", !!errore);
  }

  // Messaggio di errore dal backend: {"error": "..."}
  function erroreDa(r) {
    if (r.stato === 0) return "Il server non risponde. Riprova tra poco.";
    if (r.stato === 401) return "Sessione scaduta: torna al sito e accedi di nuovo.";
    if (r.stato === 403) return "Non hai i permessi di amministratore.";
    return (r.dati && (r.dati.error || r.dati.response)) || "Errore imprevisto.";
  }
  function mostraErrore(box, testo) {
    box.textContent = testo || "";
    box.hidden = !testo;
  }

  // Il server gratuito di Render si addormenta: se non risponde (stato 0) si riprova
  // ogni pochi secondi, avvisando chi guarda, invece di arrendersi subito.
  async function backendPaziente(percorso, opzioni) {
    let r = await MiczyAuth.backend(percorso, opzioni);
    for (let i = 0; i < 8 && r.stato === 0; i++) {
      stato("Sto svegliando il server, può volerci fino a un minuto… ☕");
      await new Promise(ok => setTimeout(ok, 8000));
      r = await MiczyAuth.backend(percorso, opzioni);
    }
    return r;
  }

  // ===========================================================================
  // Schede
  // ===========================================================================
  const caricatori = {};   // nome scheda -> funzione di caricamento
  const giaCaricate = {};

  function apriTab(nome) {
    document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === nome)));
    document.querySelectorAll(".pannello-tab").forEach(s => { s.hidden = s.id !== "sez-" + nome; });
    if (!giaCaricate[nome] && caricatori[nome]) {
      giaCaricate[nome] = true;
      caricatori[nome]();
    }
    if (nome === "panoramica") ridisegnaGrafici();
  }
  document.querySelectorAll(".tab").forEach(b => {
    b.addEventListener("click", () => apriTab(b.dataset.tab));
    b.addEventListener("keydown", e => {   // frecce destra/sinistra tra le schede
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const tabs = Array.from(document.querySelectorAll(".tab"));
      const i = tabs.indexOf(b) + (e.key === "ArrowRight" ? 1 : -1);
      const prossima = tabs[(i + tabs.length) % tabs.length];
      prossima.focus();
      apriTab(prossima.dataset.tab);
    });
  });

  // ===========================================================================
  // Finestre
  // ===========================================================================
  function apriScheda(contenuto) {
    const s = $("scheda");
    s.textContent = "";
    s.appendChild(contenuto);
    $("velo").classList.add("show");
  }
  function chiudiScheda() { $("velo").classList.remove("show"); $("scheda").textContent = ""; }
  $("velo").addEventListener("click", e => { if (e.target === $("velo")) chiudiScheda(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") chiudiScheda(); });

  function bottoniFondo(testoOk, classeOk) {
    const f = el("div", "fondo");
    const annulla = el("button", "btn", "Annulla"); annulla.type = "button";
    annulla.addEventListener("click", chiudiScheda);
    const ok = el("button", "btn " + (classeOk || ""), testoOk); ok.type = "submit";
    f.append(annulla, ok);
    return { f, ok };
  }
  function etichetta(testo, campo) {
    const l = el("label", "", testo);
    l.appendChild(campo);
    campo.style.marginTop = "0.2rem";
    return l;
  }

  // ===========================================================================
  // Panoramica
  // ===========================================================================
  const METRICHE = [
    { id: "messages", nome: "Messaggi", fmt: numero, intero: true },
    { id: "users", nome: "Utenti attivi", fmt: numero, intero: true },
    { id: "signups", nome: "Nuove iscrizioni", fmt: numero, intero: true },
    { id: "cost", nome: "Costo stimato", fmt: dollari, intero: false },
  ];
  let metrica = "messages", giorniGrafico = 30, giorniDati = [], mappaDati = [], vistaTabella = false;

  function segmenti(box, voci, attivo, alCambio) {
    box.textContent = "";
    voci.forEach(v => {
      const b = el("button", "", v.nome); b.type = "button";
      b.setAttribute("aria-pressed", String(v.id === attivo));
      b.addEventListener("click", () => alCambio(v.id));
      box.appendChild(b);
    });
  }

  function tile(numeroTesto, etichettaTesto, sotto) {
    const t = el("div", "tile");
    t.appendChild(el("span", "n", numeroTesto));
    t.appendChild(el("span", "l", etichettaTesto));
    if (sotto) t.appendChild(el("span", "s", sotto));
    return t;
  }

  function disegnaNumeri(o) {
    const t = $("tiles");
    t.textContent = "";
    t.append(
      tile(numero(o.users_total), "Utenti", "+" + numero(o.users_new_24h) + " oggi · +" + numero(o.users_new_7d) + " in 7 giorni"),
      tile(numero(o.users_active_24h), "Attivi (24 ore)", "hanno scritto al bot"),
      tile(numero(o.messages_24h), "Messaggi (24 ore)", numero(o.guest_messages_24h) + " da ospiti"),
      tile(numero(o.messages_7d), "Messaggi (7 giorni)", "in tutto " + numero(o.messages_total)),
      tile(numero(o.users_banned), "Sospesi ora"),
      tile(numero(o.conversations_total), "Chat salvate")
    );

    const c = o.cost || { usd: {} }, tk = o.tokens || {};
    const box = $("costi");
    box.textContent = "";
    [["24h", "24 ore"], ["7d", "7 giorni"], ["30d", "30 giorni"], ["total", "Totale"]].forEach(([k, nome]) => {
      box.appendChild(tile(dollari((c.usd || {})[k]), nome, numero((tk["in_" + k] || 0) + (tk["out_" + k] || 0)) + " token"));
    });
    $("notaCosti").textContent = (tk.in_total || tk.out_total)
      ? "È una stima: token × prezzo (" + dollari(c.price_in_per_m) + " per milione in ingresso, " + dollari(c.price_out_per_m)
        + " in uscita, modello " + (c.model || "?") + "). Il costo vero lo vedi su OpenRouter."
      : "Ancora nessun dato: i token si contano dalle risposte date dopo l'aggiornamento.";
  }

  // --- Grafico a barre (SVG) ----------------------------------------------------
  // Barre sottili (max 24px) con la parte alta arrotondata di 4px, griglia sottile, tooltip e
  // frecce da tastiera. Una sola serie, quindi niente legenda: il titolo dice cosa si vede.
  function scalaAgevole(max, intero, minimoTop) {
    if (max <= 0) return { top: minimoTop, passo: minimoTop / 4, n: 4 };
    let passo = max / 4;
    const p = Math.pow(10, Math.floor(Math.log10(passo))), f = passo / p;
    passo = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
    if (intero) passo = Math.max(1, Math.round(passo));
    const n = Math.max(1, Math.ceil(max / passo - 1e-9));
    return { top: n * passo, passo, n };
  }

  function creaTip(box) {
    const tip = el("div", "tip");
    tip.hidden = true;
    tip.setAttribute("role", "status");
    box.appendChild(tip);
    return tip;
  }
  function posizionaTip(box, tip, x, y) {
    tip.hidden = false;
    const w = tip.offsetWidth, W = box.clientWidth;
    tip.style.left = Math.max(0, Math.min(W - w, x - w / 2)) + "px";
    tip.style.top = Math.max(0, y - tip.offsetHeight - 8) + "px";
  }

  function disegnaBarre(box, punti, m) {
    box.textContent = "";
    const W = Math.max(280, box.clientWidth || 600), H = 230;
    const mg = { l: 46, r: 8, t: 12, b: 26 };
    const iw = W - mg.l - mg.r, ih = H - mg.t - mg.b;
    const max = Math.max.apply(null, punti.map(p => p.v).concat([0]));
    const sc = scalaAgevole(max, m.intero, m.intero ? 4 : 0.01);
    const N = punti.length, slot = iw / N, bw = Math.min(24, Math.max(2, slot - 2));
    const y0 = mg.t + ih;
    const totale = punti.reduce((a, p) => a + p.v, 0);

    const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, width: W, height: H, role: "img", tabindex: "0",
      "aria-label": m.nome + ", grafico a barre degli ultimi " + N + " giorni. Totale " + m.fmt(totale)
        + ". Usa le frecce sinistra e destra per leggere un giorno alla volta." });

    for (let i = 0; i <= sc.n; i++) {
      const y = y0 - (i * sc.passo / sc.top) * ih;
      svg.appendChild(svgEl("line", { x1: mg.l, x2: W - mg.r, y1: y, y2: y, stroke: i === 0 ? "var(--c-axis)" : "var(--c-grid)",
        "stroke-width": 1, "stroke-opacity": i === 0 ? 0.5 : 1 }));
      const t = svgEl("text", { x: mg.l - 6, y: y, "text-anchor": "end", dy: "0.35em" });
      t.textContent = m.fmt(i * sc.passo);
      svg.appendChild(t);
    }

    const evid = svgEl("rect", { y: mg.t, height: ih, width: slot, fill: "var(--c-hover)", visibility: "hidden", rx: 3 });
    svg.appendChild(evid);

    punti.forEach((p, i) => {
      if (p.v <= 0) return;
      const x = mg.l + i * slot + (slot - bw) / 2, h = Math.max(2, p.v / sc.top * ih), y = y0 - h, r = Math.min(4, bw / 2, h);
      svg.appendChild(svgEl("path", { fill: "var(--c-bar)",
        d: "M" + x + "," + y0 + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y + "H" + (x + bw - r)
          + "Q" + (x + bw) + "," + y + " " + (x + bw) + "," + (y + r) + "V" + y0 + "Z" }));
    });

    const passoEtich = Math.max(1, Math.ceil(64 / slot));
    punti.forEach((p, i) => {
      if ((N - 1 - i) % passoEtich !== 0) return;
      const t = svgEl("text", { x: mg.l + i * slot + slot / 2, y: H - 8, "text-anchor": "middle" });
      t.textContent = giornoDa(p.giorno).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
      svg.appendChild(t);
    });

    const tip = creaTip(box);
    let scelto = -1;
    function mostra(i) {
      i = Math.max(0, Math.min(N - 1, i));
      scelto = i;
      const p = punti[i];
      evid.setAttribute("x", mg.l + i * slot);
      evid.setAttribute("visibility", "visible");
      tip.textContent = "";
      tip.appendChild(el("b", "", giornoDa(p.giorno).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })));
      tip.appendChild(document.createTextNode(m.nome + ": " + m.fmt(p.v)));
      const h = Math.max(2, p.v / sc.top * ih);
      posizionaTip(box, tip, mg.l + i * slot + slot / 2, y0 - h);
    }
    function nascondi() { evid.setAttribute("visibility", "hidden"); tip.hidden = true; scelto = -1; }
    const indiceDa = e => {
      const r = svg.getBoundingClientRect();
      return Math.floor(((e.clientX - r.left) * (W / r.width) - mg.l) / slot);
    };
    svg.addEventListener("pointermove", e => { const i = indiceDa(e); if (i >= 0 && i < N) mostra(i); else nascondi(); });
    svg.addEventListener("pointerdown", e => { const i = indiceDa(e); if (i >= 0 && i < N) mostra(i); });
    svg.addEventListener("pointerleave", nascondi);
    svg.addEventListener("blur", nascondi);
    svg.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { mostra(scelto < 0 ? 0 : scelto + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { mostra(scelto < 0 ? N - 1 : scelto - 1); e.preventDefault(); }
      else if (e.key === "Home") { mostra(0); e.preventDefault(); }
      else if (e.key === "End") { mostra(N - 1); e.preventDefault(); }
      else if (e.key === "Escape") nascondi();
    });
    box.insertBefore(svg, tip);
  }

  function disegnaTabellaDati(box, punti, m) {
    box.textContent = "";
    const tab = document.createElement("table");
    const th = document.createElement("thead"), tr = document.createElement("tr");
    [["Giorno", ""], [m.nome, "num"]].forEach(([t, c]) => tr.appendChild(el("th", c, t)));
    th.appendChild(tr); tab.appendChild(th);
    const tb = document.createElement("tbody");
    punti.slice().reverse().forEach(p => {
      const r = document.createElement("tr");
      r.appendChild(el("td", "", giornoDa(p.giorno).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })));
      r.appendChild(el("td", "num", m.fmt(p.v)));
      tb.appendChild(r);
    });
    tab.appendChild(tb);
    box.appendChild(tab);
  }

  function ridisegnaGrafico() {
    const m = METRICHE.find(x => x.id === metrica);
    const punti = giorniDati.map(g => ({ giorno: g.day, v: Number(g[metrica] || 0) }));
    segmenti($("segMetrica"), METRICHE, metrica, id => { metrica = id; ridisegnaGrafico(); });
    segmenti($("segGiorni"), [{ id: 14, nome: "14 giorni" }, { id: 30, nome: "30 giorni" }, { id: 90, nome: "90 giorni" }], giorniGrafico, id => {
      giorniGrafico = id; caricaGiornaliero();
    });
    $("graficoBox").hidden = vistaTabella;
    $("graficoTab").hidden = !vistaTabella;
    $("vistaTabella").setAttribute("aria-pressed", String(vistaTabella));
    $("vistaTabella").textContent = vistaTabella ? "Vedi come grafico" : "Vedi come tabella";
    if (!punti.length) return;
    if (vistaTabella) disegnaTabellaDati($("graficoTab"), punti, m);
    else disegnaBarre($("graficoBox"), punti, m);
  }

  // --- Mappa degli orari di punta ----------------------------------------------------
  const GIORNI = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const GIORNI_LUNGHI = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];

  function disegnaMappa() {
    const box = $("heatBox");
    box.textContent = "";
    const W = Math.max(280, box.clientWidth || 360), mg = { l: 32, t: 16, r: 2, b: 2 };
    const cw = (W - mg.l - mg.r) / 24, ch = Math.min(cw, 24), H = mg.t + 7 * ch + mg.b;
    const celle = {};
    let max = 0, punta = null;
    mappaDati.forEach(c => { celle[c.dow + "-" + c.hour] = c.n; if (c.n > max) { max = c.n; punta = c; } });

    const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, width: W, height: H, role: "img",
      "aria-label": punta ? "Mappa degli orari di punta. Il momento più attivo è " + GIORNI_LUNGHI[punta.dow] + " alle " + punta.hour + ", con " + punta.n + " messaggi."
                         : "Mappa degli orari di punta: ancora nessun messaggio." });
    for (let h = 0; h < 24; h += 3) {
      const t = svgEl("text", { x: mg.l + h * cw + cw / 2, y: 11, "text-anchor": "middle" });
      t.textContent = String(h);
      svg.appendChild(t);
    }
    GIORNI.forEach((g, d) => {
      const t = svgEl("text", { x: mg.l - 5, y: mg.t + d * ch + ch / 2, "text-anchor": "end", dy: "0.35em" });
      t.textContent = g;
      svg.appendChild(t);
      for (let h = 0; h < 24; h++) {
        const n = celle[d + "-" + h] || 0;
        const r = n / (max || 1);
        const passo = n === 0 ? 0 : r <= 0.25 ? 1 : r <= 0.5 ? 2 : r <= 0.75 ? 3 : 4;
        const c = svgEl("rect", { x: mg.l + h * cw + 1, y: mg.t + d * ch + 1, width: Math.max(1, cw - 2), height: Math.max(1, ch - 2), rx: 3 });
        c.style.fill = "var(--h" + passo + ")";
        if (n === 0) { c.style.stroke = "var(--c-grid)"; c.style.strokeWidth = "1"; }
        c.dataset.d = d; c.dataset.h = h; c.dataset.n = n;
        svg.appendChild(c);
      }
    });
    const tip = creaTip(box);
    svg.addEventListener("pointerover", e => {
      const t = e.target;
      if (!t.dataset || t.dataset.n === undefined) { tip.hidden = true; return; }
      const h = Number(t.dataset.h), n = Number(t.dataset.n);
      tip.textContent = "";
      tip.appendChild(el("b", "", GIORNI_LUNGHI[Number(t.dataset.d)] + ", " + String(h).padStart(2, "0") + ":00–" + String(h).padStart(2, "0") + ":59"));
      tip.appendChild(document.createTextNode(numero(n) + (n === 1 ? " messaggio" : " messaggi")));
      posizionaTip(box, tip, mg.l + h * cw + cw / 2, mg.t + Number(t.dataset.d) * ch);
    });
    svg.addEventListener("pointerleave", () => { tip.hidden = true; });
    box.insertBefore(svg, tip);
  }

  // --- Classifica --------------------------------------------------------------------
  let periodoTop = 30;
  async function caricaClassifica() {
    segmenti($("segTop"), [{ id: 7, nome: "7 giorni" }, { id: 30, nome: "30 giorni" }, { id: 0, nome: "Sempre" }], periodoTop, id => {
      periodoTop = id; caricaClassifica();
    });
    const r = await backendPaziente("/admin/top?days=" + periodoTop);
    const ol = $("classifica");
    ol.textContent = "";
    if (!r.ok) { ol.appendChild(el("li", "", erroreDa(r))); return; }
    const lista = (r.dati && r.dati.top) || [];
    if (!lista.length) { ol.appendChild(el("li", "", "Ancora nessuno: tutti zitti 🤐")); }
    const max = Math.max.apply(null, lista.map(x => x.messages).concat([1]));
    const medaglie = ["🥇", "🥈", "🥉"];
    lista.forEach((x, i) => {
      const li = document.createElement("li");
      li.appendChild(el("span", "pos", i < 3 ? medaglie[i] : String(i + 1)));
      const chi = el("div", "chi");
      chi.appendChild(el("span", "", x.email || "(senza email)"));
      const asta = el("div", "asta");
      asta.style.width = Math.max(1, Math.round(x.messages / max * 100)) + "%";
      chi.appendChild(asta);
      li.appendChild(chi);
      li.appendChild(el("span", "num", numero(x.messages)));
      ol.appendChild(li);
    });
    $("notaTop").textContent = "Messaggi inviati da utenti registrati.";
  }

  // --- Domanda più strana --------------------------------------------------------------
  async function caricaStrana() {
    $("stranaAltra").disabled = true;
    const r = await backendPaziente("/admin/random-message");
    $("stranaAltra").disabled = false;
    if (!r.ok) { $("stranaTesto").textContent = erroreDa(r); $("stranaChi").textContent = ""; return; }
    const m = r.dati && r.dati.message;
    if (!m) { $("stranaTesto").textContent = "Nessuna domanda nelle ultime 24 ore 😴"; $("stranaChi").textContent = ""; return; }
    $("stranaTesto").textContent = String(m.content || "");
    $("stranaChi").textContent = "— " + (m.email || "ospite") + " · " + dataLeggibile(m.created_at);
  }

  async function caricaGiornaliero() {
    const r = await backendPaziente("/admin/daily?days=" + giorniGrafico);
    if (!r.ok) { mostraErrore($("erroriPan"), erroreDa(r)); return; }
    giorniDati = (r.dati && r.dati.days) || [];
    ridisegnaGrafico();
  }

  async function caricaPanoramica() {
    mostraErrore($("erroriPan"), "");
    const [o, d, h] = await Promise.all([
      backendPaziente("/admin/overview"),
      backendPaziente("/admin/daily?days=" + giorniGrafico),
      backendPaziente("/admin/heatmap?days=30"),
    ]);
    stato("");
    if (!o.ok) { mostraErrore($("erroriPan"), erroreDa(o)); }
    else disegnaNumeri(o.dati);
    if (d.ok) { giorniDati = (d.dati && d.dati.days) || []; }
    if (h.ok) { mappaDati = (h.dati && h.dati.cells) || []; }
    ridisegnaGrafico();
    disegnaMappa();
    caricaClassifica();
    caricaStrana();
  }
  caricatori.panoramica = caricaPanoramica;
  $("aggiornaPan").addEventListener("click", caricaPanoramica);
  $("stranaAltra").addEventListener("click", caricaStrana);
  $("vistaTabella").addEventListener("click", () => { vistaTabella = !vistaTabella; ridisegnaGrafico(); });

  function ridisegnaGrafici() {
    if (document.getElementById("sez-panoramica").hidden) return;
    if (giorniDati.length) ridisegnaGrafico();
    if (mappaDati.length) disegnaMappa();
  }
  let attesaResize = null, larghezzaPrima = 0;
  window.addEventListener("resize", () => {
    clearTimeout(attesaResize);
    attesaResize = setTimeout(() => {
      const w = $("graficoBox").clientWidth;
      if (w !== larghezzaPrima) { larghezzaPrima = w; ridisegnaGrafici(); }
    }, 150);
  });

  // ===========================================================================
  // Utenti
  // ===========================================================================
  let utenti = [];

  function infoBan(u) {
    if (!u.banned_until) return null;
    const fine = new Date(u.banned_until);
    if (isNaN(fine) || fine <= new Date()) return null;
    return { permanente: fine.getFullYear() >= 2900, fine, motivo: u.ban_reason || "" };
  }

  function disegnaUtenti() {
    const corpo = $("righe");
    corpo.textContent = "";
    $("vuoto").hidden = utenti.length > 0;

    utenti.forEach(u => {
      const tr = document.createElement("tr");

      const tdMail = el("td", "mail", u.email || "(senza email)");
      tdMail.appendChild(el("small", "sub", "Iscritto " + dataLeggibile(u.created_at)));
      tr.appendChild(tdMail);

      const tdStato = el("td");
      const ban = infoBan(u);
      if (u.is_admin) tdStato.appendChild(el("span", "tag adm", "admin"));
      else if (ban) {
        tdStato.appendChild(el("span", "tag ban", ban.permanente ? "sospeso (per sempre)" : "sospeso"));
        if (!ban.permanente) tdStato.appendChild(el("small", "sub", "fino al " + dataLeggibile(ban.fine)));
        if (ban.motivo) tdStato.appendChild(el("small", "sub", "Motivo: " + ban.motivo));
      } else tdStato.appendChild(el("span", "tag ok", "attivo"));
      tr.appendChild(tdStato);

      tr.appendChild(el("td", "num", String(u.messages_24h ?? 0)));
      tr.appendChild(el("td", "num", String(u.messages_total ?? 0)));
      tr.appendChild(el("td", "", u.daily_limit === null || u.daily_limit === undefined ? "standard" : String(u.daily_limit)));

      const tdAz = el("td");
      const az = el("div", "azioni");
      const bMsg = el("button", "btn", "Messaggi"); bMsg.type = "button";
      bMsg.addEventListener("click", () => apriMessaggiUtente(u));
      az.appendChild(bMsg);
      const bLim = el("button", "btn", "Limite"); bLim.type = "button";
      bLim.addEventListener("click", () => apriLimite(u));
      az.appendChild(bLim);
      if (!u.is_admin) {
        if (ban) {
          const b = el("button", "btn verde", "Riattiva"); b.type = "button";
          b.addEventListener("click", () => riattiva(u, b));
          az.appendChild(b);
        } else {
          const b = el("button", "btn rosso", "Sospendi"); b.type = "button";
          b.addEventListener("click", () => apriSospensione(u));
          az.appendChild(b);
        }
        const bDel = el("button", "btn rosso", "Elimina"); bDel.type = "button";
        bDel.addEventListener("click", () => apriEliminazione(u));
        az.appendChild(bDel);
      }
      tdAz.appendChild(az);
      tr.appendChild(tdAz);

      corpo.appendChild(tr);
    });
  }

  async function caricaUtenti() {
    const q = $("cerca").value.trim();
    const r = await backendPaziente("/admin/users?limit=100" + (q ? "&q=" + encodeURIComponent(q) : ""));
    if (!r.ok) { mostraErrore($("erroriUtenti"), erroreDa(r)); return false; }
    stato("");
    mostraErrore($("erroriUtenti"), "");
    utenti = (r.dati && r.dati.users) || [];
    disegnaUtenti();
    return true;
  }
  caricatori.utenti = caricaUtenti;
  $("cercaForm").addEventListener("submit", e => { e.preventDefault(); caricaUtenti(); });

  function apriSospensione(u) {
    const form = el("form", "form");
    form.appendChild(el("h2", "", "Sospendi " + (u.email || "utente")));

    const durata = document.createElement("select");
    [["1", "1 ora"], ["6", "6 ore"], ["24", "1 giorno"], ["72", "3 giorni"], ["168", "7 giorni"],
     ["720", "30 giorni"], ["permanente", "Per sempre"]].forEach(([v, t]) => {
      const o = document.createElement("option"); o.value = v; o.textContent = t; durata.appendChild(o);
    });
    durata.value = "24";
    form.appendChild(etichetta("Durata", durata));

    const motivo = document.createElement("input");
    motivo.type = "text"; motivo.maxLength = 200; motivo.placeholder = "Es. spam (l'utente lo vedrà)";
    form.appendChild(etichetta("Motivo (facoltativo)", motivo));

    const err = el("p", "msg err"); err.hidden = true;
    form.appendChild(err);
    const { f, ok } = bottoniFondo("Sospendi", "rosso");
    form.appendChild(f);

    form.addEventListener("submit", async e => {
      e.preventDefault();
      ok.disabled = true;
      const corpo = { user_id: u.id, reason: motivo.value.trim() };
      if (durata.value === "permanente") corpo.permanent = true; else corpo.hours = Number(durata.value);
      const r = await MiczyAuth.backend("/admin/ban", { metodo: "POST", corpo });
      if (r.ok) { chiudiScheda(); caricaUtenti(); giaCaricate.registro = false; }
      else { err.textContent = erroreDa(r); err.hidden = false; ok.disabled = false; }
    });
    apriScheda(form);
  }

  async function riattiva(u, bottone) {
    bottone.disabled = true;
    const r = await MiczyAuth.backend("/admin/unban", { metodo: "POST", corpo: { user_id: u.id } });
    if (r.ok) { caricaUtenti(); giaCaricate.registro = false; }
    else { mostraErrore($("erroriUtenti"), erroreDa(r)); bottone.disabled = false; }
  }

  function apriLimite(u) {
    const form = el("form", "form");
    form.appendChild(el("h2", "", "Limite messaggi · " + (u.email || "utente")));
    form.appendChild(el("p", "", "Quanti messaggi può mandare nelle 24 ore. Lascia vuoto per il limite standard del sito."));

    const num = document.createElement("input");
    num.type = "number"; num.min = "0"; num.max = "100000"; num.step = "1";
    num.placeholder = "standard";
    if (u.daily_limit !== null && u.daily_limit !== undefined) num.value = String(u.daily_limit);
    form.appendChild(etichetta("Messaggi al giorno", num));

    const err = el("p", "msg err"); err.hidden = true;
    form.appendChild(err);
    const { f, ok } = bottoniFondo("Salva", "verde");
    form.appendChild(f);

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const testo = num.value.trim();
      let valore = null;
      if (testo !== "") {
        if (!/^\d+$/.test(testo)) { err.textContent = "Inserisci un numero intero."; err.hidden = false; return; }
        valore = Number(testo);
      }
      ok.disabled = true;
      const r = await MiczyAuth.backend("/admin/limit", { metodo: "POST", corpo: { user_id: u.id, daily_limit: valore } });
      if (r.ok) { chiudiScheda(); caricaUtenti(); giaCaricate.registro = false; }
      else { err.textContent = erroreDa(r); err.hidden = false; ok.disabled = false; }
    });
    apriScheda(form);
  }

  // Eliminazione: si deve scrivere l'email dell'utente, come conferma. Il backend lo ricontrolla.
  function apriEliminazione(u) {
    const form = el("form", "form");
    const attesa = (u.email || u.id || "").trim();
    form.appendChild(el("h2", "", "Elimina " + (u.email || "utente")));
    form.appendChild(el("p", "msg err", "Attenzione: l'account, le chat e i messaggi di questa persona vengono cancellati per sempre. Non si può annullare."));
    form.appendChild(el("p", "", "Per confermare scrivi qui sotto: " + attesa));

    const conferma = document.createElement("input");
    conferma.type = "text"; conferma.autocomplete = "off"; conferma.spellcheck = false;
    form.appendChild(etichetta("Conferma", conferma));

    const err = el("p", "msg err"); err.hidden = true;
    form.appendChild(err);
    const { f, ok } = bottoniFondo("Elimina per sempre", "rosso");
    ok.disabled = true;
    form.appendChild(f);
    conferma.addEventListener("input", () => { ok.disabled = conferma.value.trim().toLowerCase() !== attesa.toLowerCase(); });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      ok.disabled = true;
      const r = await MiczyAuth.backend("/admin/delete-user", { metodo: "POST", corpo: { user_id: u.id, confirm_email: conferma.value.trim() } });
      if (r.ok) { chiudiScheda(); caricaUtenti(); giaCaricate.registro = false; }
      else { err.textContent = erroreDa(r); err.hidden = false; ok.disabled = false; }
    });
    apriScheda(form);
    conferma.focus();
  }

  async function apriMessaggiUtente(u) {
    const box = el("div");
    box.appendChild(el("h2", "", "Ultimi messaggi · " + (u.email || "utente")));
    const attesa = el("p", "msg", "Caricamento…");
    box.appendChild(attesa);
    const chiudi = el("button", "btn", "Chiudi"); chiudi.type = "button";
    chiudi.addEventListener("click", chiudiScheda);
    apriScheda(box);

    const r = await MiczyAuth.backend("/admin/messages?limit=60&user_id=" + encodeURIComponent(u.id));
    attesa.remove();
    if (!r.ok) {
      box.appendChild(el("p", "msg err", erroreDa(r)));
    } else {
      const lista = (r.dati && r.dati.messages) || [];
      if (!lista.length) box.appendChild(el("p", "msg", "Nessun messaggio salvato."));
      const ul = el("ul", "chat-log");
      lista.forEach(m => {
        const li = el("li", m.role === "user" ? "user" : "ai");
        li.appendChild(el("small", "", (m.role === "user" ? "Utente" : "MiczyAI") + " · " + dataLeggibile(m.created_at)));
        li.appendChild(document.createTextNode(String(m.content || "")));
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }
    const f = el("div", "fondo"); f.appendChild(chiudi); box.appendChild(f);
  }

  // ===========================================================================
  // Ricerca nei messaggi
  // ===========================================================================
  // Evidenzia le parole cercate costruendo nodi di testo e <mark>: niente innerHTML.
  function conEvidenza(testo, q) {
    const frag = document.createDocumentFragment();
    const basso = testo.toLowerCase(), cerca = q.toLowerCase();
    let da = 0, i;
    while (cerca && (i = basso.indexOf(cerca, da)) !== -1) {
      if (i > da) frag.appendChild(document.createTextNode(testo.slice(da, i)));
      frag.appendChild(el("mark", "", testo.slice(i, i + cerca.length)));
      da = i + cerca.length;
    }
    if (da < testo.length) frag.appendChild(document.createTextNode(testo.slice(da)));
    return frag;
  }

  $("cercaMsgForm").addEventListener("submit", async e => {
    e.preventDefault();
    const q = $("cercaMsg").value.trim();
    const out = $("risultatiMsg");
    out.textContent = "";
    if (q.length < 2) { mostraErrore($("erroriMsg"), "Scrivi almeno 2 caratteri."); return; }
    mostraErrore($("erroriMsg"), "");
    out.appendChild(el("p", "msg", "Cerco…"));
    const r = await backendPaziente("/admin/search?q=" + encodeURIComponent(q));
    out.textContent = "";
    if (!r.ok) { mostraErrore($("erroriMsg"), erroreDa(r)); return; }
    const lista = (r.dati && r.dati.results) || [];
    if (!lista.length) { out.appendChild(el("p", "msg", "Nessun risultato per «" + q + "»."));  return; }
    out.appendChild(el("p", "nota", lista.length + (lista.length === 1 ? " risultato" : " risultati") + " (i più recenti prima)"));
    const ul = el("ul", "chat-log");
    lista.forEach(m => {
      const li = el("li", m.role === "user" ? "user" : "ai");
      li.appendChild(el("small", "", (m.role === "user" ? "Utente" : "MiczyAI") + " · " + (m.email || "—") + " · " + dataLeggibile(m.created_at)));
      li.appendChild(conEvidenza(String(m.content || ""), q));
      ul.appendChild(li);
    });
    out.appendChild(ul);
  });

  // ===========================================================================
  // Impostazioni del sito
  // ===========================================================================
  async function salvaImpostazione(chiave, valore, esito, bottone) {
    bottone.disabled = true;
    esito.textContent = "Salvo…";
    const r = await MiczyAuth.backend("/admin/settings", { metodo: "POST", corpo: { key: chiave, value: valore } });
    bottone.disabled = false;
    if (r.ok) {
      esito.textContent = "Salvato ✓";
      giaCaricate.registro = false;
      setTimeout(() => { if (esito.textContent === "Salvato ✓") esito.textContent = ""; }, 3500);
    } else esito.textContent = "⚠️ " + erroreDa(r);
  }

  function riquadroForm(titolo, descrizione) {
    const f = el("form", "form riquadro");
    f.appendChild(el("h3", "", titolo));
    if (descrizione) f.appendChild(el("p", "nota", descrizione));
    return f;
  }
  function rigaCheck(testo, id, selezionato) {
    const r = el("div", "riga");
    const c = document.createElement("input"); c.type = "checkbox"; c.id = id; c.checked = !!selezionato;
    const l = el("label", "", testo); l.htmlFor = id;
    r.append(c, l);
    return { r, c };
  }
  function piede(testoBottone) {
    const f = el("div", "fondo");
    const esito = el("span", "esito"); esito.setAttribute("role", "status");
    const b = el("button", "btn verde", testoBottone || "Salva"); b.type = "submit";
    f.append(esito, b);
    return { f, esito, b };
  }

  function costruisciImpostazioni(dati) {
    const s = dati.settings, box = $("formSito");
    box.textContent = "";

    // Manutenzione
    {
      const f = riquadroForm("🚧 Modalità manutenzione", "Quando è accesa nessuno può chattare, e vede il messaggio qui sotto. Tu, da admin, puoi continuare a usare il bot per provare.");
      const c = rigaCheck("Manutenzione accesa", "manOn", s.maintenance.on);
      const msg = document.createElement("textarea"); msg.maxLength = 300; msg.value = s.maintenance.message || "";
      f.append(c.r, etichetta("Messaggio mostrato", msg));
      const p = piede();
      f.appendChild(p.f);
      f.addEventListener("submit", e => { e.preventDefault(); salvaImpostazione("maintenance", { on: c.c.checked, message: msg.value }, p.esito, p.b); });
      box.appendChild(f);
    }

    // Avviso
    {
      const f = riquadroForm("📣 Avviso in cima al sito", "Una striscia visibile a tutti, che chi vuole può chiudere. Ottima per annunci o novità.");
      const c = rigaCheck("Avviso acceso", "banOn", s.banner.on);
      const tipo = document.createElement("select");
      [["info", "Informazione (azzurro)"], ["warn", "Attenzione (giallo)"], ["success", "Buona notizia (verde)"]].forEach(([v, t]) => {
        const o = document.createElement("option"); o.value = v; o.textContent = t; tipo.appendChild(o);
      });
      tipo.value = s.banner.kind || "info";
      const testo = document.createElement("input"); testo.type = "text"; testo.maxLength = 300; testo.value = s.banner.text || "";
      testo.placeholder = "Es. Nuova funzione: ora puoi inviare le risposte su Discord!";
      const anteprima = el("div", "anteprima");
      const agg = () => { anteprima.className = "anteprima " + tipo.value; anteprima.textContent = testo.value.trim() || "Anteprima dell'avviso"; };
      tipo.addEventListener("change", agg); testo.addEventListener("input", agg); agg();
      f.append(c.r, etichetta("Tipo", tipo), etichetta("Testo", testo), anteprima);
      const p = piede();
      f.appendChild(p.f);
      f.addEventListener("submit", e => { e.preventDefault(); salvaImpostazione("banner", { on: c.c.checked, text: testo.value, kind: tipo.value }, p.esito, p.b); });
      box.appendChild(f);
    }

    // Personalità
    {
      const f = riquadroForm("🎭 Personalità del bot", "Cambia al volo il carattere con cui risponde, senza toccare il codice. Si aggiunge alle istruzioni fisse del backend.");
      const scelte = el("div", "scelte");
      const custom = document.createElement("textarea"); custom.maxLength = 500; custom.value = s.personality.custom || "";
      custom.placeholder = "Es. Rispondi come un gatto filosofo.";
      const rigaCustom = etichetta("Istruzioni personalizzate", custom);
      const aggiorna = () => { rigaCustom.hidden = !(f.querySelector("input[name=pers]:checked") || {}).value || f.querySelector("input[name=pers]:checked").value !== "custom"; };
      dati.personalities.forEach(p => {
        const l = el("label"); l.title = p.label;
        const r = document.createElement("input"); r.type = "radio"; r.name = "pers"; r.value = p.id; r.checked = p.id === s.personality.id;
        r.addEventListener("change", aggiorna);
        l.append(r, document.createTextNode(p.label));
        scelte.appendChild(l);
      });
      f.append(scelte, rigaCustom);
      aggiorna();
      const p = piede();
      f.appendChild(p.f);
      f.addEventListener("submit", e => {
        e.preventDefault();
        const scelta = f.querySelector("input[name=pers]:checked");
        salvaImpostazione("personality", { id: scelta ? scelta.value : "normale", custom: custom.value }, p.esito, p.b);
      });
      box.appendChild(f);
    }

    // Limiti
    {
      const f = riquadroForm("🚦 Limiti di messaggi", "Valgono subito. Lascia un campo vuoto per usare il valore standard di Render. Il limite personale dato a un utente ha sempre la precedenza.");
      const campi = {};
      [["guest_per_day", "Ospiti: messaggi al giorno (per ogni IP)", dati.defaults.guest_per_day],
       ["user_per_day", "Utenti registrati: messaggi nelle 24 ore", dati.defaults.user_per_day],
       ["per_minute", "Messaggi al minuto (ospiti e utenti)", dati.defaults.per_minute]].forEach(([k, testo, std]) => {
        const i = document.createElement("input"); i.type = "number"; i.min = "1"; i.step = "1"; i.placeholder = "standard (" + std + ")";
        if (s.limits[k] !== undefined) i.value = String(s.limits[k]);
        campi[k] = i;
        f.appendChild(etichetta(testo, i));
      });
      const p = piede();
      f.appendChild(p.f);
      f.addEventListener("submit", e => {
        e.preventDefault();
        const v = {};
        for (const k in campi) {
          const t = campi[k].value.trim();
          if (t === "") continue;
          if (!/^\d+$/.test(t)) { p.esito.textContent = "⚠️ Usa solo numeri interi."; return; }
          v[k] = Number(t);
        }
        salvaImpostazione("limits", v, p.esito, p.b);
      });
      box.appendChild(f);
    }
  }

  async function caricaSito() {
    const r = await backendPaziente("/admin/settings");
    if (!r.ok) { mostraErrore($("erroriSito"), erroreDa(r)); giaCaricate.sito = false; return; }
    stato("");
    mostraErrore($("erroriSito"), "");
    costruisciImpostazioni(r.dati);
  }
  caricatori.sito = caricaSito;

  // ===========================================================================
  // Registro
  // ===========================================================================
  const NOMI_AZIONI = {
    ban: "Sospensione", unban: "Riattivazione", limit: "Limite utente", delete_user: "Account eliminato",
    "settings:maintenance": "Manutenzione", "settings:banner": "Avviso", "settings:limits": "Limiti del sito",
    "settings:personality": "Personalità",
  };

  async function caricaRegistro() {
    const r = await backendPaziente("/admin/log?limit=150");
    const corpo = $("righeReg");
    corpo.textContent = "";
    if (!r.ok) { mostraErrore($("erroriReg"), erroreDa(r)); giaCaricate.registro = false; return; }
    stato("");
    mostraErrore($("erroriReg"), "");
    const lista = (r.dati && r.dati.log) || [];
    $("vuotoReg").hidden = lista.length > 0;
    lista.forEach(x => {
      const tr = document.createElement("tr");
      tr.appendChild(el("td", "", dataLeggibile(x.created_at)));
      tr.appendChild(el("td", "mail", x.admin_email || "—"));
      tr.appendChild(el("td", "", NOMI_AZIONI[x.action] || String(x.action || "")));
      tr.appendChild(el("td", "mail", x.target_email || "—"));
      tr.appendChild(el("td", "", x.details || ""));
      corpo.appendChild(tr);
    });
  }
  caricatori.registro = caricaRegistro;
  $("aggiornaReg").addEventListener("click", caricaRegistro);
  // il registro si ricarica da solo quando si torna sulla scheda dopo aver fatto azioni
  document.querySelector("[data-tab=registro]").addEventListener("click", () => { if (giaCaricate.registro === false) { giaCaricate.registro = true; caricaRegistro(); } });

  // ===========================================================================
  // Avvio
  // ===========================================================================
  async function avvio() {
    if (!MiczyAuth.configurato()) {
      return stato("L'accesso non è ancora configurato: controlla config.js.", true);
    }
    await MiczyAuth.inizializza();
    if (!MiczyAuth.utente()) {
      stato("Per entrare nel pannello devi prima accedere dal sito con il tuo account admin.", true);
      return;
    }
    const me = await backendPaziente("/me");
    if (!me.ok) return stato(erroreDa(me), true);
    if (!me.dati || !me.dati.is_admin) return stato("Questo account non è un amministratore.", true);

    $("pannello").hidden = false;
    stato("Caricamento…");
    apriTab("panoramica");
  }

  MiczyAuth.onCambio(u => { if (!u) location.reload(); });
  avvio();
})();
