// Contenuto dei Termini di Servizio (it/en). Il motore che disegna la pagina è in ../legale/legale.js
(function () {
  const it = {
    titolo: "Termini di Servizio",
    sottotitolo: "Le regole per usare MiczyAI, in parole semplici. Usando il sito le accetti.",
    aggiornato: "4 novembre 2026",
    breve: [
      { icona: "🧪", titolo: "Servizio sperimentale", testo: "Gratuito, fatto per divertimento: può cambiare o fermarsi." },
      { icona: "🤖", titolo: "L'IA sbaglia", testo: "Le risposte possono essere inesatte: verificale prima di fidarti." },
      { icona: "🤝", titolo: "Usalo con rispetto", testo: "Niente contenuti illegali, abusi o tentativi di sovraccaricare il sistema." },
      { icona: "🔑", titolo: "L'account è tuo", testo: "Proteggi la password. Puoi chiedere la cancellazione quando vuoi." }
    ],
    sezioni: [
      { id: "servizio", titolo: "Il servizio", blocchi: [
        { p: "MiczyAI è un chatbot sperimentale basato su intelligenza artificiale, offerto gratuitamente e senza garanzie di continuità. È gestito da una persona fisica (il «gestore») come progetto personale." },
        { p: "Puoi usarlo da **ospite** oppure con un **account**, che dà limiti più ampi, chat salvate e più impostazioni. I dati sono trattati come spiegato nella [Privacy Policy](../privacy/)." }
      ]},
      { id: "requisiti", titolo: "Chi può usarlo", blocchi: [
        { p: "Puoi usare MiczyAI se hai almeno **14 anni**; sotto questa età serve il consenso e la supervisione di un genitore o tutore. Se usi il servizio per conto di altri, dichiari di poterlo fare." }
      ]},
      { id: "account", titolo: "Il tuo account", blocchi: [
        { ul: [
          "Dai un'email valida e la confermi dal messaggio che ricevi.",
          "Sei responsabile di tenere riservata la password e di ciò che avviene con il tuo account.",
          "Un account è per una persona. Non creare più account per aggirare i limiti.",
          "Puoi chiedere la cancellazione in qualsiasi momento da Impostazioni. Ti chiediamo il motivo e la richiesta viene confermata dal gestore."
        ]}
      ]},
      { id: "uso", titolo: "Uso consentito", blocchi: [
        { p: "Usa MiczyAI in modo lecito e rispettoso. **Non è consentito:**" },
        { ul: [
          "inviare contenuti illegali, offensivi, minacciosi, discriminatori o che danneggiano altre persone;",
          "chiedere o usare il servizio per attività illecite, truffe, malware o per violare i diritti di altri;",
          "inserire dati personali o riservati di altre persone senza il loro permesso;",
          "usare bot o sistemi automatici, o cercare di sovraccaricare, aggirare o compromettere il sistema e i suoi limiti;",
          "tentare di accedere ad account, dati o parti del servizio che non sono tuoi;",
          "spacciare le risposte dell'IA per consigli professionali o per fatti verificati."
        ]},
        { nota: "Il servizio non è adatto a emergenze né a consigli medici, legali o finanziari. Per queste cose rivolgiti a un professionista o ai servizi di emergenza.", titolo: "Importante." }
      ]},
      { id: "ia", titolo: "Risposte generate dall'IA", blocchi: [
        { p: "Le risposte sono create automaticamente da un modello di intelligenza artificiale. **Possono essere sbagliate, incomplete, datate o inventate**, anche se sembrano sicure di sé. Verifica sempre le informazioni importanti con fonti affidabili." },
        { p: "Sei responsabile di come usi le risposte. Il gestore non controlla ogni risposta prima che ti venga mostrata." }
      ]},
      { id: "contenuti", titolo: "I tuoi contenuti e le chat condivise", blocchi: [
        { p: "I messaggi che scrivi restano tuoi. Ci dai solo il permesso di elaborarli, salvarli (se hai un account) e mostrarli come descritto nella Privacy Policy, per far funzionare il servizio." },
        { p: "Se condividi una chat con un link, **la rendi leggibile a chiunque abbia il link**. Condividi solo ciò che sei sicuro di poter rendere pubblico. Puoi smettere di condividere eliminando il link." },
        { p: "Le risposte generate possono assomigliare a quelle date ad altri utenti e non possiamo garantire che siano prive di diritti di terzi." }
      ]},
      { id: "limiti", titolo: "Limiti, moderazione e sospensioni", blocchi: [
        { p: "Per tenere il servizio gratuito e stabile applichiamo dei limiti, che possono cambiare (per esempio sul numero di messaggi al giorno o al minuto, più bassi per gli ospiti). Il gestore può inoltre:" },
        { ul: [
          "limitare l'uso o **sospendere**, temporaneamente o in modo permanente, gli account che violano questi Termini o abusano del servizio;",
          "leggere le chat salvate **quando serve** a verificare un abuso o a risolvere un problema;",
          "mettere il servizio in **manutenzione**, modificarlo o interromperlo, anche senza preavviso."
        ]},
        { p: "Se pensi che un provvedimento sia ingiusto scrivi a [miczy690@gmail.com](mailto:miczy690@gmail.com) e lo riesamineremo." }
      ]},
      { id: "proprieta", titolo: "Proprietà del sito", blocchi: [
        { p: "Il design, il nome, il logo e il codice di MiczyAI appartengono al gestore, salvo componenti di terzi che mantengono le loro licenze. Non puoi copiarli o presentarli come tuoi senza permesso." }
      ]},
      { id: "garanzie", titolo: "Nessuna garanzia e responsabilità", blocchi: [
        { p: "Il servizio è fornito **«così com'è»**, senza garanzie di disponibilità, precisione o idoneità a uno scopo specifico." },
        { p: "Nei limiti consentiti dalla legge, il gestore non risponde di danni derivanti dall'uso del servizio, dall'affidamento alle risposte dell'IA, da interruzioni o dalla perdita di dati. Questo non esclude le responsabilità che la legge non permette di escludere, né i tuoi diritti di consumatore." },
        { p: "Per le chat che ti interessano, tieni una copia: puoi esportarle da Impostazioni." }
      ]},
      { id: "fine", titolo: "Chiusura dell'account", blocchi: [
        { p: "Puoi smettere di usare MiczyAI e chiedere la cancellazione dell'account quando vuoi. Il gestore può chiudere un account che viola questi Termini. Alla chiusura i dati vengono trattati come previsto dalla Privacy Policy." }
      ]},
      { id: "modifiche", titolo: "Modifiche ai Termini", blocchi: [
        { p: "Possiamo aggiornare questi Termini. La data in alto mostra l'ultima versione; per cambiamenti importanti mostreremo un avviso sul sito. Continuando a usare MiczyAI dopo una modifica, accetti la nuova versione." }
      ]},
      { id: "legge", titolo: "Legge applicabile e contatti", blocchi: [
        { p: "Questi Termini sono regolati dalla legge italiana. Se sei un consumatore restano validi i tuoi diritti inderogabili e il foro del tuo luogo di residenza." },
        { p: "Per domande o segnalazioni scrivi a [miczy690@gmail.com](mailto:miczy690@gmail.com)." }
      ]}
    ]
  };

  const en = {
    titolo: "Terms of Service",
    sottotitolo: "The rules for using MiczyAI, in plain words. By using the site you accept them.",
    aggiornato: "November 4, 2026",
    breve: [
      { icona: "🧪", titolo: "Experimental service", testo: "Free and made for fun: it may change or stop." },
      { icona: "🤖", titolo: "AI makes mistakes", testo: "Answers may be wrong: check them before relying on them." },
      { icona: "🤝", titolo: "Be respectful", testo: "No illegal content, abuse or attempts to overload the system." },
      { icona: "🔑", titolo: "Your account", testo: "Protect your password. You can ask for deletion any time." }
    ],
    sezioni: [
      { id: "servizio", titolo: "The service", blocchi: [
        { p: "MiczyAI is an experimental AI chatbot, offered free of charge and with no guarantee of continuity. It is run by an individual (the «operator») as a personal project." },
        { p: "You can use it as a **guest** or with an **account**, which gives higher limits, saved chats and more settings. Data is handled as explained in the [Privacy Policy](../privacy/)." }
      ]},
      { id: "requisiti", titolo: "Who can use it", blocchi: [
        { p: "You may use MiczyAI if you are at least **14 years old**; below that age you need the consent and supervision of a parent or guardian. If you use the service on behalf of others, you confirm you are allowed to." }
      ]},
      { id: "account", titolo: "Your account", blocchi: [
        { ul: [
          "Provide a valid email and confirm it from the message you receive.",
          "You are responsible for keeping your password private and for what happens with your account.",
          "One account per person. Don't create several accounts to get around the limits.",
          "You can ask for deletion at any time from Settings. We ask for the reason and the operator confirms the request."
        ]}
      ]},
      { id: "uso", titolo: "Acceptable use", blocchi: [
        { p: "Use MiczyAI lawfully and respectfully. **You may not:**" },
        { ul: [
          "send illegal, offensive, threatening or discriminatory content, or content that harms other people;",
          "use the service for illegal activity, scams, malware or to violate the rights of others;",
          "enter personal or confidential data about other people without their permission;",
          "use bots or automated systems, or try to overload, bypass or compromise the system and its limits;",
          "try to access accounts, data or parts of the service that aren't yours;",
          "pass off AI answers as professional advice or as verified facts."
        ]},
        { nota: "The service is not suitable for emergencies or for medical, legal or financial advice. For those, talk to a professional or emergency services.", titolo: "Important." }
      ]},
      { id: "ia", titolo: "AI-generated answers", blocchi: [
        { p: "Answers are created automatically by an AI model. **They can be wrong, incomplete, outdated or made up**, even when they sound confident. Always check important information with reliable sources." },
        { p: "You are responsible for how you use the answers. The operator does not review every answer before it is shown to you." }
      ]},
      { id: "contenuti", titolo: "Your content and shared chats", blocchi: [
        { p: "The messages you write remain yours. You only give us permission to process them, save them (if you have an account) and display them as described in the Privacy Policy, to make the service work." },
        { p: "If you share a chat with a link, **you make it readable by anyone who has the link**. Only share what you are sure you can make public. You can stop sharing by deleting the link." },
        { p: "Generated answers may resemble those given to other users and we can't guarantee they are free of third-party rights." }
      ]},
      { id: "limiti", titolo: "Limits, moderation and suspensions", blocchi: [
        { p: "To keep the service free and stable we apply limits, which may change (for example on messages per day or per minute, lower for guests). The operator may also:" },
        { ul: [
          "limit use or **suspend**, temporarily or permanently, accounts that break these Terms or abuse the service;",
          "read saved chats **when needed** to check an abuse or solve a problem;",
          "put the service in **maintenance**, change it or stop it, even without notice."
        ]},
        { p: "If you think a decision is unfair write to [miczy690@gmail.com](mailto:miczy690@gmail.com) and we will review it." }
      ]},
      { id: "proprieta", titolo: "Ownership of the site", blocchi: [
        { p: "MiczyAI's design, name, logo and code belong to the operator, except third-party components that keep their own licenses. You may not copy them or present them as your own without permission." }
      ]},
      { id: "garanzie", titolo: "No warranty and liability", blocchi: [
        { p: "The service is provided **«as is»**, with no warranty of availability, accuracy or fitness for a particular purpose." },
        { p: "To the extent allowed by law, the operator is not liable for damages from using the service, relying on AI answers, interruptions or data loss. This does not exclude liability that the law doesn't allow to be excluded, nor your consumer rights." },
        { p: "Keep a copy of chats you care about: you can export them from Settings." }
      ]},
      { id: "fine", titolo: "Closing your account", blocchi: [
        { p: "You can stop using MiczyAI and ask for your account to be deleted whenever you want. The operator may close an account that breaks these Terms. On closure, data is handled as set out in the Privacy Policy." }
      ]},
      { id: "modifiche", titolo: "Changes to the Terms", blocchi: [
        { p: "We may update these Terms. The date above shows the latest version; for important changes we will show a notice on the site. By continuing to use MiczyAI after a change, you accept the new version." }
      ]},
      { id: "legge", titolo: "Governing law and contact", blocchi: [
        { p: "These Terms are governed by Italian law. If you are a consumer, your mandatory rights and the courts of your place of residence remain unaffected." },
        { p: "For questions or reports write to [miczy690@gmail.com](mailto:miczy690@gmail.com)." }
      ]}
    ]
  };

  window.Legale.monta({ it, en }, { altra: { href: "../privacy/", nome: { it: "Privacy Policy →", en: "Privacy Policy →" } } });
})();
