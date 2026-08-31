export type Locale = "it" | "en";

export const locales: Locale[] = ["it", "en"];
export const defaultLocale: Locale = "it";

export type Dictionary = typeof dictionaries.it;

export const dictionaries = {
  it: {
    nav: {
      home: "Home",
      menu: "Menù",
      about: "La Nostra Storia",
      contact: "Contatti",
      location: "Dove Siamo",
      call: "Chiama",
      reserve: "Prenota un Tavolo",
    },
    hero: {
      eyebrow: "Bologna, Italia",
      title: "La Praia",
      subtitle: "Italian restaurant & pizzeria in Bologna",
      ctaMenu: "Scopri il menu",
      ctaContact: "Prenota un tavolo",
    },
    home: {
      introEyebrow: "Chi Siamo",
      introTitle: "Una tavola che profuma di mare",
      introBody:
        "Da La Praia portiamo a Bologna i sapori della Costiera Amalfitana: impasti lievitati con cura, pesce fresco e una lunga carta di pizze, dai grandi classici alle specialità della casa.",
      introCta: "Leggi la nostra storia",
      highlightsTitle: "Perché scegliere La Praia",
      highlights: [
        {
          title: "Pizza Napoletana",
          body: "Oltre 50 pizze, dai grandi classici alle specialità firmate La Praia, cotte al momento.",
        },
        {
          title: "Cucina di Mare",
          body: "Antipasti, primi e secondi di mare: cozze, vongole, calamari e il pescato del giorno.",
        },
        {
          title: "Ispirazione Costiera",
          body: "Piatti che portano il nome dei borghi della Costiera Amalfitana: Amalfi, Positano, Ravello, Tramonti.",
        },
      ],
      menuPreviewEyebrow: "Assaggi dal Menù",
      menuPreviewTitle: "Alcuni dei nostri piatti",
      menuPreviewCta: "Vedi il menù completo",
    },
    about: {
      eyebrow: "La Nostra Storia",
      title: "Dalla Costiera alla Bolognina",
      intro:
        "La Praia nasce dal desiderio di portare a Bologna l'atmosfera e i sapori della Costiera Amalfitana: pizza fatta con cura, piatti di mare generosi e un'accoglienza semplice, senza fronzoli.",
      philosophyTitle: "La nostra filosofia",
      philosophyBody:
        "In cucina lavoriamo ogni giorno impasti lievitati e materie prime semplici: pomodoro, mozzarella, verdure di stagione e un pescato scelto con attenzione. Il menù unisce i grandi classici della pizzeria italiana a specialità che portano i nomi dei borghi della Costiera — Amalfi, Positano, Ravello, Atrani, Tramonti — un omaggio ai sapori del sud.",
      ingredientsTitle: "Pizza e mare, senza compromessi",
      ingredientsBody:
        "Dalla Marinara alla Diavola, dalle pizze speciali della casa fino a cozze, vongole, calamari e pesce alla griglia: la nostra carta è pensata per chi ama sia la pizzeria di quartiere sia una cena di mare più ricercata.",
      photoNote: "Foto del locale in arrivo",
    },
    menuPage: {
      eyebrow: "Il Menù",
      title: "La Nostra Carta",
      subtitle:
        "Tutti i piatti sono preparati al momento. I prezzi sono espressi in euro (€), per porzione.",
      glutenFreeNote: "senza glutine",
      allergenNote:
        "Per intolleranze o allergie non indicate in carta, il nostro staff è a disposizione per ogni chiarimento.",
      priceLabel: "Prezzo",
    },
    contact: {
      eyebrow: "Prenotazioni",
      title: "Vieni a Trovarci",
      subtitle:
        "Prenota online oppure chiamaci o scrivici su WhatsApp: ti confermiamo subito la disponibilità.",
      callCta: "Chiama Ora",
      whatsappCta: "Scrivi su WhatsApp",
      hoursTitle: "Orari di Apertura",
      addressTitle: "Indirizzo",
      phoneTitle: "Telefono",
      directionsCta: "Apri su Google Maps",
      closedLabel: "Chiuso",
      deliveryNote:
        "Consegna a domicilio disponibile per i CAP 40121, 40122, 40129 e 40131. Pagamento in contanti alla consegna o al ritiro.",
      days: {
        monday: "Lunedì",
        tuesday: "Martedì",
        wednesday: "Mercoledì",
        thursday: "Giovedì",
        friday: "Venerdì",
        saturday: "Sabato",
        sunday: "Domenica",
      },
    },
    location: {
      eyebrow: "Dove Siamo",
      title: "La Nostra Sede",
      subtitle:
        "Ci trovi in Via Camillo Casarini 10, nel quartiere Bolognina a Bologna.",
    },
    reservation: {
      eyebrow: "Prenota Online",
      title: "Prenota un Tavolo",
      subtitle:
        "Compila il modulo e ti confermeremo la disponibilità. Per gruppi numerosi o richieste urgenti, chiamaci direttamente.",
      onlineNote: "Puoi anche prenotare online",
      nameLabel: "Nome e cognome",
      phoneLabel: "Telefono",
      emailLabel: "Email (facoltativa)",
      partySizeLabel: "Numero di persone",
      dateLabel: "Data e ora",
      notesLabel: "Richieste particolari (facoltativo)",
      allergiesLabel: "Allergie o intolleranze (facoltativo)",
      submitLabel: "Invia richiesta",
      submittingLabel: "Invio in corso…",
      successTitle: "Richiesta inviata!",
      successBody:
        "Ti contatteremo al più presto per confermare. Per qualsiasi urgenza, chiamaci o scrivici su WhatsApp.",
      confirmationCodeLabel: "Il tuo codice di conferma",
      confirmationCodeNote: "Conservalo per modificare o annullare la prenotazione in seguito.",
      newRequestCta: "Invia un'altra richiesta",
      errorOutsideHours: "L'orario scelto è fuori dagli orari di apertura. Scegli un altro orario.",
      errorGeneric: "Qualcosa è andato storto. Riprova o contattaci telefonicamente.",
      largePartyNote: "Per gruppi di oltre 20 persone, chiamaci direttamente.",
    },
    footer: {
      typeLabel: "Ristorante Pizzeria Italiana",
      cityLabel: "Bologna, Italia",
      tagline: "Pizza e cucina di mare nel cuore di Bologna.",
      linksTitle: "Naviga",
      contactTitle: "Contatti",
      hoursTitle: "Orari",
      rights: "Tutti i diritti riservati.",
      noticeTitle: "Nota",
      notice:
        "Menù, prezzi e orari possono variare: per conferme, contattare direttamente il ristorante.",
    },
    common: {
      languageToggleLabel: "Lingua",
      skipToContent: "Vai al contenuto",
      country: "Italia",
    },
    chat: {
      bubbleLabel: "Chatta con noi",
      title: "Assistente La Praia",
      greeting:
        "Ciao! Posso aiutarti con il menù, gli orari o a preparare un ordine da confermare su WhatsApp. Come posso aiutarti?",
      placeholder: "Scrivi un messaggio…",
      sendLabel: "Invia",
      closeLabel: "Chiudi chat",
      disclaimer:
        "Assistente automatico — non gestiamo ordini online: per confermare, scrivici su WhatsApp o chiama.",
      errorMessage: "Qualcosa è andato storto. Riprova o scrivici su WhatsApp.",
    },
  },
  en: {
    nav: {
      home: "Home",
      menu: "Menu",
      about: "Our Story",
      contact: "Contact",
      location: "Find Us",
      call: "Call",
      reserve: "Book a Table",
    },
    hero: {
      eyebrow: "Bologna, Italy",
      title: "La Praia",
      subtitle: "Italian restaurant & pizzeria in Bologna",
      ctaMenu: "Explore the menu",
      ctaContact: "Book a table",
    },
    home: {
      introEyebrow: "About Us",
      introTitle: "A table that smells of the sea",
      introBody:
        "At La Praia we bring the flavors of the Amalfi Coast to Bologna: carefully leavened dough, fresh seafood, and a long menu of pizzas — from the classics to our house specialties.",
      introCta: "Read our story",
      highlightsTitle: "Why choose La Praia",
      highlights: [
        {
          title: "Neapolitan-style Pizza",
          body: "Over 50 pizzas, from the classics to La Praia's own specialties, baked fresh to order.",
        },
        {
          title: "Seafood Kitchen",
          body: "Starters, pastas and mains from the sea: mussels, clams, squid, and the daily catch.",
        },
        {
          title: "Coastal Inspiration",
          body: "Dishes named after the towns of the Amalfi Coast: Amalfi, Positano, Ravello, Tramonti.",
        },
      ],
      menuPreviewEyebrow: "Tastes from the Menu",
      menuPreviewTitle: "A few of our dishes",
      menuPreviewCta: "See the full menu",
    },
    about: {
      eyebrow: "Our Story",
      title: "From the Coast to the Bolognina",
      intro:
        "La Praia was born from a wish to bring the atmosphere and flavors of the Amalfi Coast to Bologna: pizza made with care, generous seafood dishes, and a simple, no-frills welcome.",
      philosophyTitle: "Our Philosophy",
      philosophyBody:
        "Every day in the kitchen we work with carefully leavened dough and simple ingredients: tomato, mozzarella, seasonal vegetables, and a thoughtfully chosen catch. The menu blends the great classics of the Italian pizzeria with house specialties named after towns on the Amalfi Coast — Amalfi, Positano, Ravello, Atrani, Tramonti — a tribute to the flavors of the south.",
      ingredientsTitle: "Pizza and Sea, No Compromises",
      ingredientsBody:
        "From the Marinara to the Diavola, from our house specialty pizzas to mussels, clams, squid and grilled fish: our menu is built for both the neighborhood pizzeria lover and a more refined seafood dinner.",
      photoNote: "Restaurant photos coming soon",
    },
    menuPage: {
      eyebrow: "The Menu",
      title: "Our Menu",
      subtitle:
        "Everything is prepared to order. Prices are in euros (€), per portion.",
      glutenFreeNote: "gluten-free",
      allergenNote:
        "For intolerances or allergies not noted on the menu, our staff is happy to help with any questions.",
      priceLabel: "Price",
    },
    contact: {
      eyebrow: "Reservations",
      title: "Come Visit Us",
      subtitle:
        "Book online, or call us or message us on WhatsApp — we'll confirm availability right away.",
      callCta: "Call Now",
      whatsappCta: "Message on WhatsApp",
      hoursTitle: "Opening Hours",
      addressTitle: "Address",
      phoneTitle: "Phone",
      directionsCta: "Open in Google Maps",
      closedLabel: "Closed",
      deliveryNote:
        "Delivery is available to postal codes 40121, 40122, 40129 and 40131. Cash payment on delivery or pickup.",
      days: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
      },
    },
    location: {
      eyebrow: "Where We Are",
      title: "Find Us",
      subtitle:
        "You'll find us at Via Camillo Casarini 10, in the Bolognina district of Bologna.",
    },
    reservation: {
      eyebrow: "Book Online",
      title: "Reserve a Table",
      subtitle:
        "Fill in the form and we'll confirm availability. For large groups or urgent requests, please call us directly.",
      onlineNote: "You can also book online",
      nameLabel: "Full name",
      phoneLabel: "Phone",
      emailLabel: "Email (optional)",
      partySizeLabel: "Party size",
      dateLabel: "Date and time",
      notesLabel: "Special requests (optional)",
      allergiesLabel: "Allergies or intolerances (optional)",
      submitLabel: "Send request",
      submittingLabel: "Sending…",
      successTitle: "Request sent!",
      successBody:
        "We'll be in touch shortly to confirm. For anything urgent, call us or message us on WhatsApp.",
      confirmationCodeLabel: "Your confirmation code",
      confirmationCodeNote: "Keep this to change or cancel your reservation later.",
      newRequestCta: "Send another request",
      errorOutsideHours: "That time is outside our opening hours. Please choose another time.",
      errorGeneric: "Something went wrong. Please try again or contact us by phone.",
      largePartyNote: "For parties larger than 20, please call us directly.",
    },
    footer: {
      typeLabel: "Italian Restaurant & Pizzeria",
      cityLabel: "Bologna, Italy",
      tagline: "Pizza and seafood cooking in the heart of Bologna.",
      linksTitle: "Explore",
      contactTitle: "Contact",
      hoursTitle: "Hours",
      rights: "All rights reserved.",
      noticeTitle: "Note",
      notice:
        "Menu, prices and hours may vary: please contact the restaurant directly to confirm.",
    },
    common: {
      languageToggleLabel: "Language",
      skipToContent: "Skip to content",
      country: "Italy",
    },
    chat: {
      bubbleLabel: "Chat with us",
      title: "La Praia Assistant",
      greeting:
        "Hi! I can help with the menu, hours, or putting together an order to confirm on WhatsApp. How can I help?",
      placeholder: "Type a message…",
      sendLabel: "Send",
      closeLabel: "Close chat",
      disclaimer:
        "Automated assistant — we don't handle orders online: to confirm, message us on WhatsApp or call.",
      errorMessage: "Something went wrong. Try again or message us on WhatsApp.",
    },
  },
} as const;
