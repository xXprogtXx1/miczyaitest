// Motore condiviso di Privacy Policy e Termini: costruisce la pagina dal contenuto (privacy.js / tos.js).
// Il testo non passa mai da innerHTML: solo nodi DOM, con un minimo di formattazione (**grassetto**, `codice`, [testo](link)).
(function () {
  "use strict";

  const UI = {
    it: {
      indice: "Indice", salta: "Vai al contenuto", su: "Torna su", copia: "Copia il link a questa sezione", copiato: "Link copiato",
      stampa: "Stampa", tema: "Cambia tema chiaro/scuro", lingua: "EN", linguaTitolo: "Switch to English", torna: "← Torna a MiczyAI",
      aggiornato: "Aggiornato", leggi: "min di lettura", contatto: "Domande? Scrivici:", mostraIndice: "Indice della pagina", finestra: "miczy.exe — "
    },
    en: {
      indice: "Contents", salta: "Skip to content", su: "Back to top", copia: "Copy link to this section", copiato: "Link copied",
      stampa: "Print", tema: "Toggle light/dark theme", lingua: "IT", linguaTitolo: "Passa all'italiano", torna: "← Back to MiczyAI",
      aggiornato: "Updated", leggi: "min read", contatto: "Questions? Write to us:", mostraIndice: "Page contents", finestra: "miczy.exe — "
    }
  };

  const leggi = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const scrivi = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage bloccato */ } };
  const el = (tag, classe, testo) => { const e = document.createElement(tag); if (classe) e.className = classe; if (testo != null) e.textContent = testo; return e; };

  // --- testo con un po' di formattazione, senza innerHTML
  const RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  function inline(testo, padre) {
    String(testo).split(RE).forEach(pezzo => {
      if (!pezzo) return;
      let m;
      if (pezzo.startsWith("**") && pezzo.endsWith("**") && pezzo.length > 4) padre.appendChild(el("strong", null, pezzo.slice(2, -2)));
      else if (pezzo.startsWith("`") && pezzo.endsWith("`") && pezzo.length > 2) padre.appendChild(el("code", null, pezzo.slice(1, -1)));
      else if ((m = pezzo.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/))) {
        const url = m[2];
        if (!/^(https?:|mailto:|\.\.?\/|#)/.test(url)) { padre.appendChild(document.createTextNode(m[1])); return; }
        const a = el("a", null, m[1]); a.href = url;
        if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        padre.appendChild(a);
      } else padre.appendChild(document.createTextNode(pezzo));
    });
    return padre;
  }
  const conTesto = (tag, classe, testo) => inline(testo, el(tag, classe));

  function blocco(b) {
    if (b.p) return conTesto("p", null, b.p);
    if (b.h3) return el("h3", null, b.h3);
    if (b.ul) { const ul = el("ul"); b.ul.forEach(v => ul.appendChild(conTesto("li", null, v))); return ul; }
    if (b.nota) {
      const d = el("div", "nota"); d.setAttribute("role", "note");
      if (b.titolo) { d.appendChild(el("b", null, b.titolo + " ")); }
      return inline(b.nota, d);
    }
    if (b.tabella) {
      const t = el("table", "tabella"), th = el("thead"), tr = el("tr");
      b.tabella.testata.forEach(h => { const c = el("th", null, h); c.scope = "col"; tr.appendChild(c); });
      th.appendChild(tr); t.appendChild(th);
      const tb = el("tbody");
      b.tabella.righe.forEach(r => { const rr = el("tr"); r.forEach((c, i) => { const cell = i === 0 ? el("th") : el("td"); if (i === 0) { cell.scope = "row"; cell.style.fontWeight = "700"; cell.style.background = "transparent"; cell.style.textTransform = "none"; cell.style.letterSpacing = "0"; cell.style.fontSize = "inherit"; cell.style.color = "inherit"; } if (i > 0) cell.dataset.label = b.tabella.testata[i]; inline(c, cell); rr.appendChild(cell); }); tb.appendChild(rr); });
      t.appendChild(tb); return t;
    }
    return el("span");
  }

  let toastTimer;
  function toast(testo) {
    let t = document.getElementById("legaleToast");
    if (!t) { t = el("div", "toast"); t.id = "legaleToast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = testo; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
  }

  function monta(contenuti, opzioni) {
    const radice = document.getElementById("legale");
    if (!radice) return;
    let osservatore = null, rimuoviScroll = null;

    // tema: stessa chiave del sito; senza scelta si segue il sistema
    const salvato = leggi("darkMode");
    const scuro = salvato === null ? !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) : salvato === "true";
    document.body.classList.toggle("dark-mode", scuro);

    function disegna() {
      const lang = leggi("lang") === "en" ? "en" : "it";
      const c = contenuti[lang], u = UI[lang];
      document.documentElement.lang = lang;
      document.title = c.titolo + " · MiczyAI";
      if (osservatore) osservatore.disconnect();
      if (rimuoviScroll) rimuoviScroll();
      radice.textContent = "";

      const progresso = el("div", "progresso"); progresso.setAttribute("aria-hidden", "true"); const barra = el("i"); progresso.appendChild(barra);
      const salta = el("a", "salta", u.salta); salta.href = "#contenuto";

      const fin = el("div", "finestra");
      const bar = el("div", "barra");
      const sem = el("span", "semafori"); sem.setAttribute("aria-hidden", "true"); sem.append(el("i"), el("i"), el("i"));
      bar.append(sem, el("span", "titolo-finestra", u.finestra + c.titolo.toLowerCase()));
      const str = el("div", "strumenti");
      const bTema = el("button", null, "🌓"); bTema.type = "button"; bTema.title = u.tema; bTema.setAttribute("aria-label", u.tema);
      bTema.addEventListener("click", () => { const s = document.body.classList.toggle("dark-mode"); scrivi("darkMode", String(s)); });
      const bStampa = el("button", null, "🖨"); bStampa.type = "button"; bStampa.title = u.stampa; bStampa.setAttribute("aria-label", u.stampa);
      bStampa.addEventListener("click", () => window.print());
      const bLingua = el("button", null, u.lingua); bLingua.type = "button"; bLingua.title = u.linguaTitolo; bLingua.setAttribute("aria-label", u.linguaTitolo);
      bLingua.addEventListener("click", () => { scrivi("lang", lang === "it" ? "en" : "it"); disegna(); });
      const bHome = el("a", null, "🏠"); bHome.href = "../"; bHome.title = u.torna; bHome.setAttribute("aria-label", u.torna);
      str.append(bLingua, bTema, bStampa, bHome); bar.appendChild(str);

      const layout = el("div", "layout");
      const testata = el("header", "testata");
      testata.appendChild(el("h1", null, c.titolo));
      testata.appendChild(el("p", "sottotitolo", c.sottotitolo));
      const et = el("ul", "etichette");
      const parole = c.sezioni.reduce((n, s) => n + JSON.stringify(s).split(/\s+/).length, 0);
      const li1 = el("li", "data", u.aggiornato + ": " + c.aggiornato); const li2 = el("li", null, "~" + Math.max(1, Math.round(parole / 220)) + " " + u.leggi);
      et.append(li1, li2); testata.appendChild(et); layout.appendChild(testata);

      if (c.breve && c.breve.length) {
        const ul = el("ul", "breve");
        c.breve.forEach(b => { const li = el("li"); li.append(el("span", "ico", b.icona), el("strong", null, b.titolo), conTesto("span", "t", b.testo)); ul.appendChild(li); });
        layout.appendChild(ul);
      }

      const voci = c.sezioni.map((s, i) => ({ id: s.id, titolo: s.titolo, n: i + 1 }));
      const lista = (ol) => voci.forEach(v => { const li = el("li"); const a = el("a", null, v.n + ". " + v.titolo); a.href = "#" + v.id; li.appendChild(a); ol.appendChild(li); });
      const mob = el("details", "indice-mobile"); mob.appendChild(el("summary", null, u.mostraIndice)); const olM = el("ol"); lista(olM); mob.appendChild(olM);
      mob.addEventListener("click", e => { if (e.target.tagName === "A") mob.open = false; });
      layout.appendChild(mob);
      const nav = el("nav", "indice"); nav.setAttribute("aria-label", u.indice); nav.appendChild(el("h2", null, u.indice)); const ol = el("ol"); lista(ol); nav.appendChild(ol); layout.appendChild(nav);

      const main = el("main", "contenuto"); main.id = "contenuto"; main.tabIndex = -1;
      c.sezioni.forEach((s, i) => {
        const sec = el("section", "sezione"); sec.id = s.id; sec.setAttribute("aria-labelledby", s.id + "-t");
        const h = el("h2"); h.id = s.id + "-t"; h.append(el("span", "num", String(i + 1)), el("span", null, s.titolo));
        const an = el("button", "ancora", "#"); an.type = "button"; an.title = u.copia; an.setAttribute("aria-label", u.copia + ": " + s.titolo);
        an.addEventListener("click", () => {
          const url = location.origin + location.pathname + "#" + s.id;
          history.replaceState(null, "", "#" + s.id);
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => toast(u.copiato), () => toast(url)); else toast(url);
        });
        h.appendChild(an); sec.appendChild(h);
        s.blocchi.forEach(b => sec.appendChild(blocco(b)));
        main.appendChild(sec);
      });
      layout.appendChild(main);

      const fondo = el("footer", "fondo");
      const ct = el("p", "contatto"); ct.append(u.contatto + " "); const mail = el("a", null, "miczy690@gmail.com"); mail.href = "mailto:miczy690@gmail.com"; ct.appendChild(mail);
      const nv = el("nav"); nv.setAttribute("aria-label", "Link");
      const altra = el("a", null, opzioni.altra.nome[lang]); altra.href = opzioni.altra.href;
      const home = el("a", "principale", u.torna); home.href = "../";
      nv.append(altra, home); fondo.append(ct, nv); layout.appendChild(fondo);

      fin.append(bar, layout);
      const su = el("button", "su", "↑"); su.type = "button"; su.title = u.su; su.setAttribute("aria-label", u.su);
      su.addEventListener("click", () => window.scrollTo({ top: 0 }));
      radice.append(progresso, salta, fin, su);

      // barra di avanzamento + pulsante "torna su"
      let attesa = false;
      const aggiorna = () => {
        attesa = false;
        const max = document.documentElement.scrollHeight - innerHeight;
        barra.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + "%";
        su.classList.toggle("visibile", scrollY > 600);
      };
      const suScroll = () => { if (!attesa) { attesa = true; requestAnimationFrame(aggiorna); } };
      addEventListener("scroll", suScroll, { passive: true }); addEventListener("resize", suScroll);
      rimuoviScroll = () => { removeEventListener("scroll", suScroll); removeEventListener("resize", suScroll); };
      aggiorna();

      // sezione attiva nell'indice
      const link = [...nav.querySelectorAll("a")];
      const attiva = id => link.forEach(a => { const s = a.getAttribute("href") === "#" + id; a.classList.toggle("attiva", s); if (s) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
      if ("IntersectionObserver" in window) {
        osservatore = new IntersectionObserver(voci2 => { voci2.forEach(v => { if (v.isIntersecting) attiva(v.target.id); }); }, { rootMargin: "-15% 0px -75% 0px" });
        main.querySelectorAll(".sezione").forEach(s => osservatore.observe(s));
      }
      attiva(c.sezioni[0].id);
      if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView(); }
    }
    disegna();
  }

  window.Legale = { monta };
})();
