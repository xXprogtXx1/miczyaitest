// Contenuto della Privacy Policy (it/en). Il motore che disegna la pagina è in ../legale/legale.js
// Formattazione ammessa nei testi: **grassetto**, `codice`, [testo](link).
(function () {
  const it = {
    titolo: "Privacy Policy",
    sottotitolo: "Quali dati usa MiczyAI, perché, dove finiscono e come puoi controllarli. Scritta in modo semplice.",
    aggiornato: "4 novembre 2026",
    breve: [
      { icona: "🚫", titolo: "Niente pubblicità", testo: "Nessun cookie di tracciamento, nessuna pubblicità, nessuna vendita di dati." },
      { icona: "👤", titolo: "Account facoltativo", testo: "Puoi usare MiczyAI da ospite. Con l'account salvi chat e impostazioni." },
      { icona: "📦", titolo: "I tuoi dati sono tuoi", testo: "Dalle Impostazioni puoi esportarli e chiederne la cancellazione." },
      { icona: "⚠️", titolo: "Non scrivere segreti", testo: "I messaggi passano da servizi esterni: evita dati personali o sensibili." }
    ],
    sezioni: [
      { id: "chi-siamo", titolo: "Chi gestisce MiczyAI", blocchi: [
        { p: "MiczyAI è un chatbot sperimentale gestito da una persona fisica, il creatore del sito (di seguito «il gestore»). Per qualsiasi richiesta sui dati scrivi a [miczy690@gmail.com](mailto:miczy690@gmail.com)." },
        { p: "Questa pagina spiega come vengono trattati i dati personali di chi usa il sito. Va letta insieme ai [Termini di Servizio](../tos/)." }
      ]},
      { id: "dati", titolo: "Quali dati trattiamo", blocchi: [
        { p: "Dipende da come usi il sito. Ecco il quadro completo:" },
        { tabella: { testata: ["Dato", "Quando", "A cosa serve"], righe: [
          ["Messaggi della chat", "Ogni volta che invii un messaggio", "Generare la risposta. Insieme al messaggio viene inviata anche una parte della conversazione recente, per dare contesto."],
          ["Email e password", "Solo se crei un account", "Accedere al servizio. La password è gestita dal servizio di accesso in forma cifrata: il gestore non la vede."],
          ["Chat salvate, titoli, cartelle", "Solo se sei loggato", "Ritrovare le tue conversazioni su ogni dispositivo."],
          ["Voti 👍/👎", "Solo se li dai", "Capire quali risposte funzionano. Sono visibili al gestore."],
          ["Link di condivisione", "Solo se condividi una chat", "Mostrare quella chat, in sola lettura, a chi ha il link."],
          ["Impostazioni dell'account", "Solo se sei loggato", "Ricordare stile, icone, dimensione del testo e lunghezza delle risposte."],
          ["Conteggio messaggi e uso dell'IA", "Ogni richiesta", "Applicare i limiti di utilizzo e controllare i costi. Si registra quanti messaggi e quanti token, non il testo."],
          ["Ultimo accesso e browser", "Quando accedi con un account", "Sicurezza: il gestore può vedere la data dell'ultimo accesso, quante sessioni hai aperte e il tipo di browser o dispositivo, per accorgersi di accessi anomali. Non vede il tuo indirizzo IP."],
          ["Indirizzo IP", "Ogni richiesta", "Limitare gli abusi da parte degli ospiti. Resta nella memoria del server per poco tempo e non viene salvato nel database."],
          ["Richiesta di cancellazione", "Solo se chiedi di eliminare l'account", "Gestire la tua richiesta: motivo, email, esito. Questo registro resta anche dopo la cancellazione."],
          ["Ultimo accesso e browser", "Quando fai login", "Sicurezza dell'account: il gestore vede la data dell'ultimo accesso e il tipo di browser, mai l'indirizzo IP. Li conserva il servizio di accesso."],
          ["Registro delle azioni del gestore", "Quando il gestore modifica un account", "Tenere traccia di blocchi, limiti e cancellazioni, per sicurezza e correttezza."]
        ]}},
        { nota: "I messaggi sono testo libero: **non scrivere password, documenti, dati di salute o altre informazioni riservate**, tue o di altre persone.", titolo: "Attenzione." }
      ]},
      { id: "basi", titolo: "Perché li trattiamo", blocchi: [
        { ul: [
          "**Erogare il servizio** che hai richiesto: rispondere ai messaggi, salvare le chat, gestire l'account. Base giuridica: esecuzione del servizio richiesto.",
          "**Sicurezza e abusi**: limiti d'uso, blocco degli account che violano i Termini, prevenzione dei sovraccarichi. Base giuridica: legittimo interesse del gestore.",
          "**Miglioramento del servizio**: leggere i voti e, quando serve per capire un problema, le chat. Base giuridica: legittimo interesse.",
          "**Obblighi di legge**, se un'autorità competente ne facesse richiesta."
        ]},
        { p: "Non facciamo profilazione commerciale e non prendiamo decisioni automatizzate che producano effetti legali su di te." }
      ]},
      { id: "esterni", titolo: "Servizi esterni coinvolti", blocchi: [
        { p: "MiczyAI non funziona da solo: si appoggia a fornitori che ricevono i dati necessari al loro compito, ciascuno con la propria informativa." },
        { tabella: { testata: ["Fornitore", "Ruolo", "Cosa riceve"], righe: [
          ["GitHub Pages", "Ospita le pagine del sito", "Il tuo indirizzo IP e i dati tecnici normali di una visita web."],
          ["Render", "Ospita il server di MiczyAI", "I messaggi e i dati delle richieste, mentre vengono elaborati."],
          ["Supabase", "Database e accesso degli account", "Email, password cifrata, chat, voti, impostazioni e registri."],
          ["OpenRouter e il fornitore del modello", "Genera le risposte con l'intelligenza artificiale", "Il testo della conversazione inviata per la risposta."],
          ["Discord", "Canale privato del gestore", "Solo la domanda e la risposta che scegli di inviare con il pulsante di condivisione. In configurazioni di sviluppo le domande possono essere inoltrate anche in automatico."]
        ]}},
        { p: "Alcuni fornitori possono trattare i dati anche fuori dallo Spazio Economico Europeo, in base alle garanzie previste da ciascuno (per esempio le clausole contrattuali standard)." }
      ]},
      { id: "conservazione", titolo: "Per quanto tempo", blocchi: [
        { ul: [
          "**Chat da ospite**: non vengono salvate sul server. Restano nel tuo browser finché non le cancelli.",
          "**Chat e dati dell'account**: restano finché non le elimini o finché l'account esiste.",
          "**Account eliminato**: email, chat, voti, link condivisi e impostazioni vengono rimossi. Restano soltanto il registro della richiesta di cancellazione e dei provvedimenti del gestore, per sicurezza.",
          "**Backup e log dei fornitori**: possono conservare copie per un breve periodo secondo le loro regole."
        ]}
      ]},
      { id: "browser", titolo: "Cookie e dati nel browser", blocchi: [
        { p: "MiczyAI non usa cookie di tracciamento né pubblicitari e non carica strumenti di analisi di terze parti. Usa soltanto la memoria locale del browser (`localStorage`), che serve al funzionamento e resta sul tuo dispositivo:" },
        { ul: [
          "lingua, tema chiaro/scuro e la tua scelta sul banner dei cookie;",
          "la cronologia della chat in corso, cancellabile in qualsiasi momento con il pulsante del cestino;",
          "se sei loggato, la sessione di accesso e una copia delle tue preferenze di aspetto."
        ]},
        { p: "Poiché si tratta solo di dati tecnici necessari, non serve un consenso preventivo; puoi comunque svuotarli dalle impostazioni del browser." }
      ]},
      { id: "condivisione", titolo: "Chat condivise", blocchi: [
        { p: "Se premi «Condividi» su una chat, viene creato un link pubblico: **chiunque lo abbia può leggere quella chat**, senza accedere. Non contiene la tua email né il tuo nome." },
        { p: "Puoi smettere di condividere in qualsiasi momento eliminando il link o la chat: il link smette di funzionare." }
      ]},
      { id: "sicurezza", titolo: "Sicurezza", blocchi: [
        { p: "La connessione è protetta con HTTPS. I dati degli account sono protetti da regole di accesso a livello di database, così ogni utente vede solo i propri. Le chiavi segrete restano sul server e non sono mai nel sito." },
        { p: "Nessun sistema è sicuro al 100%. Per questo ti chiediamo di non inserire informazioni riservate." }
      ]},
      { id: "diritti", titolo: "I tuoi diritti", blocchi: [
        { p: "Secondo il GDPR (Regolamento UE 2016/679) puoi:" },
        { ul: [
          "**accedere** ai tuoi dati e **riceverne una copia**: da Impostazioni → Esporta i miei dati, in formato JSON;",
          "**correggerli** o **modificare le impostazioni** direttamente dal sito;",
          "**cancellarli**: elimina le singole chat dal sito oppure, da Impostazioni, chiedi la cancellazione dell'account. Ti chiediamo il motivo e la richiesta viene confermata dal gestore;",
          "**opporti** al trattamento o chiederne la **limitazione**, scrivendo al gestore;",
          "**presentare reclamo** al Garante per la protezione dei dati personali ([garanteprivacy.it](https://www.garanteprivacy.it))."
        ]},
        { p: "Per esercitare un diritto che non trovi nel sito scrivi a [miczy690@gmail.com](mailto:miczy690@gmail.com). Rispondiamo di norma entro 30 giorni." }
      ]},
      { id: "minori", titolo: "Minori", blocchi: [
        { p: "MiczyAI non è pensato per bambini sotto i **14 anni**. Se hai meno di 14 anni, usalo solo con il consenso e la supervisione di un genitore o tutore, e non creare un account da solo." }
      ]},
      { id: "modifiche", titolo: "Modifiche a questa pagina", blocchi: [
        { p: "Se cambiamo il modo in cui trattiamo i dati aggiorniamo questa pagina e la data in alto. Per modifiche importanti mostreremo un avviso sul sito." }
      ]}
    ]
  };

  const en = {
    titolo: "Privacy Policy",
    sottotitolo: "What data MiczyAI uses, why, where it goes and how you can control it. Written in plain language.",
    aggiornato: "November 4, 2026",
    breve: [
      { icona: "🚫", titolo: "No ads", testo: "No tracking cookies, no advertising, no selling of data." },
      { icona: "👤", titolo: "Optional account", testo: "Use MiczyAI as a guest, or sign up to save chats and settings." },
      { icona: "📦", titolo: "Your data is yours", testo: "Export it or ask for deletion from Settings." },
      { icona: "⚠️", titolo: "Don't share secrets", testo: "Messages pass through external services: avoid personal or sensitive data." }
    ],
    sezioni: [
      { id: "chi-siamo", titolo: "Who runs MiczyAI", blocchi: [
        { p: "MiczyAI is an experimental chatbot run by an individual, the site's creator (the «operator»). For any request about your data write to [miczy690@gmail.com](mailto:miczy690@gmail.com)." },
        { p: "This page explains how personal data of people using the site is handled. Read it together with the [Terms of Service](../tos/)." }
      ]},
      { id: "dati", titolo: "What data we handle", blocchi: [
        { p: "It depends on how you use the site. Here is the full picture:" },
        { tabella: { testata: ["Data", "When", "What it is for"], righe: [
          ["Chat messages", "Each time you send a message", "To generate the reply. Part of the recent conversation is sent along with it, to give context."],
          ["Email and password", "Only if you create an account", "To sign in. The password is handled by the sign-in service in encrypted form: the operator cannot see it."],
          ["Saved chats, titles, folders", "Only when signed in", "To find your conversations on every device."],
          ["Votes 👍/👎", "Only if you give them", "To understand which answers work. Visible to the operator."],
          ["Share links", "Only if you share a chat", "To show that chat, read-only, to whoever has the link."],
          ["Account settings", "Only when signed in", "To remember style, icons, text size and answer length."],
          ["Message count and AI usage", "Every request", "To apply usage limits and control costs. We log how many messages and tokens, not the text."],
          ["Last sign-in and browser", "When you sign in with an account", "Security: the operator can see the date of your last sign-in, how many sessions you have open and the browser or device type, to spot unusual access. The operator does not see your IP address."],
          ["IP address", "Every request", "To limit abuse by guests. It stays in server memory for a short time and is not saved in the database."],
          ["Deletion request", "Only if you ask to delete your account", "To handle your request: reason, email, outcome. This record is kept even after deletion."],
          ["Last sign-in and browser", "When you sign in", "Account security: the operator sees the date of your last sign-in and the browser type, never the IP address. Kept by the sign-in service."],
          ["Operator action log", "When the operator changes an account", "To keep track of blocks, limits and deletions, for security and fairness."]
        ]}},
        { nota: "Messages are free text: **do not write passwords, documents, health data or other confidential information**, yours or anyone else's.", titolo: "Careful." }
      ]},
      { id: "basi", titolo: "Why we handle it", blocchi: [
        { ul: [
          "**Providing the service** you asked for: answering messages, saving chats, managing your account. Legal basis: performance of the requested service.",
          "**Security and abuse prevention**: usage limits, blocking accounts that break the Terms, preventing overload. Legal basis: the operator's legitimate interest.",
          "**Improving the service**: reading votes and, when needed to understand a problem, chats. Legal basis: legitimate interest.",
          "**Legal obligations**, if a competent authority requires it."
        ]},
        { p: "We do no commercial profiling and make no automated decisions with legal effects on you." }
      ]},
      { id: "esterni", titolo: "External services involved", blocchi: [
        { p: "MiczyAI doesn't run alone: it relies on providers that receive the data needed for their task, each with its own privacy notice." },
        { tabella: { testata: ["Provider", "Role", "What it receives"], righe: [
          ["GitHub Pages", "Hosts the site pages", "Your IP address and the normal technical data of a web visit."],
          ["Render", "Hosts the MiczyAI server", "Messages and request data while they are processed."],
          ["Supabase", "Database and account sign-in", "Email, encrypted password, chats, votes, settings and logs."],
          ["OpenRouter and the model provider", "Generates answers with AI", "The conversation text sent to produce the reply."],
          ["Discord", "The operator's private channel", "Only the question and answer you choose to send with the share button. In development setups, questions may also be forwarded automatically."]
        ]}},
        { p: "Some providers may process data outside the European Economic Area, under the safeguards each of them provides (for example standard contractual clauses)." }
      ]},
      { id: "conservazione", titolo: "How long we keep it", blocchi: [
        { ul: [
          "**Guest chats**: not saved on the server. They stay in your browser until you clear them.",
          "**Chats and account data**: kept until you delete them or while the account exists.",
          "**Deleted account**: email, chats, votes, share links and settings are removed. Only the record of the deletion request and of the operator's actions is kept, for security.",
          "**Provider backups and logs**: may keep copies for a short time under their own rules."
        ]}
      ]},
      { id: "browser", titolo: "Cookies and browser storage", blocchi: [
        { p: "MiczyAI uses no tracking or advertising cookies and loads no third-party analytics. It only uses the browser's local storage (`localStorage`), which is needed for the site to work and stays on your device:" },
        { ul: [
          "language, light/dark theme and your choice on the cookie banner;",
          "the current chat history, which you can clear any time with the trash button;",
          "when signed in, the login session and a copy of your appearance preferences."
        ]},
        { p: "Since this is only technical data that is strictly necessary, no prior consent is needed; you can still clear it from your browser settings." }
      ]},
      { id: "condivisione", titolo: "Shared chats", blocchi: [
        { p: "If you press «Share» on a chat, a public link is created: **anyone who has it can read that chat**, without signing in. It doesn't include your email or name." },
        { p: "You can stop sharing at any time by deleting the link or the chat: the link stops working." }
      ]},
      { id: "sicurezza", titolo: "Security", blocchi: [
        { p: "The connection is protected with HTTPS. Account data is protected by database-level access rules, so each user only sees their own. Secret keys stay on the server and are never in the site." },
        { p: "No system is 100% secure. That's why we ask you not to enter confidential information." }
      ]},
      { id: "diritti", titolo: "Your rights", blocchi: [
        { p: "Under the GDPR (EU Regulation 2016/679) you can:" },
        { ul: [
          "**access** your data and **get a copy**: Settings → Export my data, as JSON;",
          "**correct** it or **change your settings** directly on the site;",
          "**delete** it: remove single chats on the site or, from Settings, ask to delete the account. We ask for the reason and the operator confirms the request;",
          "**object** to the processing or ask to **restrict** it, by writing to the operator;",
          "**lodge a complaint** with your data protection authority (in Italy: [garanteprivacy.it](https://www.garanteprivacy.it))."
        ]},
        { p: "To exercise a right you can't find on the site write to [miczy690@gmail.com](mailto:miczy690@gmail.com). We normally reply within 30 days." }
      ]},
      { id: "minori", titolo: "Children", blocchi: [
        { p: "MiczyAI is not meant for children under **14**. If you are under 14, use it only with the consent and supervision of a parent or guardian, and don't create an account on your own." }
      ]},
      { id: "modifiche", titolo: "Changes to this page", blocchi: [
        { p: "If we change how we handle data we update this page and the date above. For important changes we will show a notice on the site." }
      ]}
    ]
  };

  window.Legale.monta({ it, en }, { altra: { href: "../tos/", nome: { it: "Termini di Servizio →", en: "Terms of Service →" } } });
})();
