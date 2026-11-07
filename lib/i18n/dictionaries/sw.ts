// DRAFT: Swahili copy must be reviewed by a native speaker before launch (SEO recommendations, section 4.6).
import type { Dictionary } from "./en";

export const sw: Dictionary = {
  a11y: {
    skipToContent: "Ruka hadi maudhui makuu",
    openMenu: "Fungua menyu",
    closeMenu: "Funga menyu",
    primaryNav: "Menyu kuu",
    footerNav: "Viungo vya chini",
    breadcrumb: "Njia ya ukurasa",
  },
  nav: {
    home: "Mwanzo",
    services: "Huduma",
    yourVisit: "Cha kutarajia",
    tips: "Ushauri wa afya ya kinywa",
    visitUs: "Mawasiliano",
    referrals: "Rufaa",
    book: "Panga miadi",
  },
  language: {
    label: "Lugha",
    switchTo: "English",
    switchToShort: "EN",
  },
  common: {
    call: (phone: string) => `Piga ${phone}`,
    bookAppointment: "Panga miadi",
    requestCallback: "Omba tukupigie",
    readArticle: "Soma makala",
    learnMore: "Soma zaidi",
    reviewedBy: "Imepitiwa na timu ya kitabibu ya DECMA",
    allServices: "Huduma zote",
    allTips: "Ushauri wote wa afya ya kinywa",
  },

  home: {
    eyebrow: "Tunafungua hivi karibuni",
    h1: "Kliniki ya meno Mwanyamala, Dar es Salaam",
    tagline: { lead: "Tunajali kila", accent: "tabasamu." },
    intro:
      "DECMA Dental Clinic inatoa huduma za meno za kawaida, za kurekebisha na za urembo kwa familia nzima. Katika ziara yako ya kwanza tunachunguza meno yako, tunakueleza chaguo zako na tunakupa makadirio ya gharama kwa maandishi kabla ya matibabu yoyote kuanza.",
    quickServices: "Uchunguzi na kusafisha meno · Kujaza meno · Kung'arisha meno · Meno ya watoto",
    heroImageAlt:
      "Mchoro wa jino kubwa jeupe likisafishwa na kung'arishwa na timu iliyovaa sare za buluu",
    servicesIntro:
      "Kuanzia uchunguzi wa kawaida hadi vipandikizi na braces. Chagua huduma kuona inachohusisha.",
    explore: {
      eyebrow: "Panga ziara yako",
      title: "Kila unachohitaji kabla ya kuja",
      cards: {
        visit: {
          title: "Cha kutarajia",
          text: "Kinachotokea katika miadi yako, hatua kwa hatua, na majibu ya maswali ya kawaida.",
        },
        tips: {
          title: "Ushauri wa afya ya kinywa",
          text: "Tabia rahisi za kila siku kwa meno na fizi zenye afya, zimepitiwa na timu yetu ya kitabibu.",
        },
        visitUs: {
          title: "Mawasiliano na maelekezo",
          text: "Anwani, saa za kazi na maelekezo ya kufika Mwanyamala, au tuombe tukupigie.",
        },
        referrals: {
          title: "Kwa wataalamu",
          text: "Mpe mgonjwa rufaa kwa DECMA na upokee muhtasari wa matibabu baadaye.",
        },
      },
    },
    info: {
      hoursTitle: "Saa za kazi",
      hoursText: (weekdays: string, saturday: string) =>
        `Jumatatu hadi Ijumaa ${weekdays}. Jumamosi ${saturday}. Unaweza kufika bila miadi. Dharura kwa simu.`,
      whereTitle: "Tulipo",
      whereText: (street: string, landmark: string) =>
        `${street}, Mwanyamala, Dar es Salaam. ${landmark}`,
      paymentTitle: "Malipo na bima",
      paymentText: (insurers: string) =>
        `Makadirio ya gharama kwa maandishi kabla ya matibabu. Bima tunazopokea: ${insurers}.`,
    },
  },

  services: {
    eyebrow: "Huduma",
    title: "Matibabu tunayotoa",
    intro:
      "Kila matibabu huanza na uchunguzi. Tunapendekeza kile tu unachohitaji, na wewe ndiye unaamua kama utaendelea.",
    detail: {
      involves: "Matibabu yanahusisha nini",
      whoFor: "Ni kwa ajili ya nani",
      cost: "Kinachoathiri gharama",
      costNote:
        "Hatuweki bei mtandaoni kwa sababu matibabu sahihi hutegemea uchunguzi wako. Kila mara utapata makadirio ya gharama kwa maandishi kabla ya matibabu kuanza.",
      timing: "Huchukua muda gani",
      faq: "Maswali yanayoulizwa mara kwa mara",
      ctaTitle: "Anza na uchunguzi",
      ctaText:
        "Panga miadi, tutachunguza meno yako, tutakueleza chaguo zako na kukupa makadirio ya gharama kwa maandishi.",
      otherServices: "Huduma nyingine",
    },
  },

  visit: {
    eyebrow: "Cha kutarajia",
    title: "Kinachotokea, hatua kwa hatua",
    h1: "Kinachotokea katika ziara yako",
    intro:
      "Tunataka ujue hasa cha kutarajia. Hakuna kinachofanyika bila ridhaa yako, na kila mara unapata makadirio ya gharama kwa maandishi kabla ya matibabu.",
    steps: [
      {
        title: "Panga miadi au fika moja kwa moja",
        text: "Panga miadi mtandaoni au kwa simu, au fika kliniki wakati wa saa za kazi.",
      },
      {
        title: "Uchunguzi",
        text: "Uchunguzi kamili wa kinywa, na X-ray pale tu zinapohitajika.",
      },
      {
        title: "Chaguo na makadirio",
        text: "Tunakueleza chaguo zako na kukupa makadirio kwa maandishi. Matibabu huanza tu kwa ridhaa yako.",
      },
      {
        title: "Matibabu na ufuatiliaji",
        text: "Matibabu yako, kisha miadi ya ufuatiliaji ikihitajika.",
      },
    ],
    bringTitle: "Unachopaswa kuleta",
    bring: [
      "Kadi yako ya bima au taarifa za uanachama, kama unatumia bima.",
      "Orodha ya dawa zozote unazotumia.",
      "X-ray au kumbukumbu za meno za hivi karibuni, kama unazo.",
      "Kwa watoto: mzazi au mlezi anapaswa kuhudhuria miadi.",
    ],
    faqTitle: "Maswali yanayoulizwa mara kwa mara",
    faqs: (p: { cancellation: string; insurers: string; length: number }) => [
      {
        q: "Je, ninahitaji miadi?",
        a: "Hapana. Unaweza kufika kliniki moja kwa moja wakati wa saa za kazi, au kupanga miadi mapema mtandaoni au kwa simu ili kuchagua muda unaokufaa.",
      },
      {
        q: "Nifanye nini nikipata dharura ya meno?",
        a: "Piga simu kliniki wakati wa saa za kazi, tutakushauri na, inapowezekana, kukuona siku hiyo hiyo. Ukiwa na uvimbe mkubwa, shida ya kupumua au kumeza, au damu nyingi, nenda idara ya dharura ya hospitali iliyo karibu.",
      },
      {
        q: "Ziara ya kwanza huchukua muda gani?",
        a: `Panga takriban dakika ${p.length}. Muda huu unajumuisha uchunguzi, X-ray zinazohitajika na muda wa kujadili chaguo zako.`,
      },
      {
        q: "Ninaweza kulipa vipi?",
        a: `Unapata makadirio ya gharama kwa maandishi kabla ya matibabu. Bima tunazopokea: ${p.insurers}. Tafadhali uliza mapokezi kuhusu malipo kwa fedha taslimu, pesa kwa simu na kadi.`,
      },
      {
        q: "Je, kuna maegesho ya magari?",
        a: "Taarifa za maegesho zitathibitishwa kabla kliniki haijafunguliwa. Tafadhali tupigie ukihitaji maelekezo au njia isiyo na ngazi.",
      },
      {
        q: "Ninaweza kubadilisha au kughairi miadi yangu?",
        a: `Ndiyo. Tumia kiungo kilicho kwenye barua pepe ya uthibitisho, nenda "Angalia miadi yako" ukiwa na namba ya miadi na namba ya simu, au piga simu kliniki. Mabadiliko na kughairi: ${p.cancellation}`,
      },
    ],
  },

  tips: {
    eyebrow: "Ushauri wa afya ya kinywa",
    title: "Tabia ndogo, meno yenye afya",
    h1: "Ushauri wa afya ya kinywa",
    intro:
      "Ushauri wa vitendo wa kila siku wa kutunza meno na fizi zako kati ya ziara. Kila makala imepitiwa na timu ya kitabibu ya DECMA.",
  },

  openingSoon: {
    eyebrow: "Tunafungua hivi karibuni",
    title: (date: string) => `Tunafungua Mwanyamala. Miadi itaanza ${date}.`,
    text: "Acha namba yako ya simu, tutakupigia miadi itakapoanza.",
  },

  referralBand: {
    eyebrow: "Kwa wataalamu wengine",
    title: "Kumpa mgonjwa rufaa",
    text: "Tunapokea rufaa kutoka kwa wataalamu wengine. Tafadhali tuma barua ya rufaa pamoja na ridhaa ya mgonjwa. Kwa idhini ya mgonjwa, tutakutumia muhtasari wa matibabu baadaye.",
    cta: "Wasiliana na dawati la rufaa",
  },

  referrals: {
    h1: "Kumpa mgonjwa rufaa",
    intro:
      "Tunakaribisha rufaa kutoka kwa madaktari, madaktari wa meno na wataalamu wengine wa Dar es Salaam na kwingineko.",
    howTitle: "Jinsi rufaa zinavyofanya kazi",
    how: [
      "Omba ridhaa ya mgonjwa kabla ya kutushirikisha taarifa zake.",
      "Tuma barua ya rufaa kwa dawati la rufaa kwa barua pepe, au mwombe mgonjwa aje nayo kwenye miadi.",
      "Tunawasiliana na mgonjwa kupanga uchunguzi.",
      "Kwa idhini ya mgonjwa, tunakutumia muhtasari wa matibabu baadaye.",
    ],
    emailTitle: "Dawati la rufaa",
    emailText: "Tuma barua za rufaa kwa:",
    formTitle: "Omba dawati la rufaa likuwasiliane",
    formText:
      "Tumia fomu hii kwa maswali au kupanga rufaa. Tafadhali usiandike majina ya wagonjwa wala taarifa za kitabibu hapa; tuma hizo kwa barua.",
    fields: {
      practitionerName: "Jina lako",
      practice: "Kituo au zahanati",
      phone: "Namba ya simu",
      email: "Barua pepe",
      message: "Ujumbe",
      consent:
        "Ninathibitisha kuwa nitashirikisha taarifa za mgonjwa kwa ridhaa yake tu, kama ilivyoelezwa katika taarifa ya faragha.",
    },
    submit: "Tuma kwa dawati la rufaa",
    success: "Asante. Dawati la rufaa litawasiliana nawe.",
  },

  visitUs: {
    eyebrow: "Mawasiliano",
    title: "Pata kliniki",
    h1: "Wasiliana nasi, Mwanyamala",
    labels: {
      address: "Anwani",
      phone: "Simu",
      email: "Barua pepe",
      monFri: "Jtatu–Ijumaa",
      saturday: "Jumamosi",
      sunday: "Jumapili",
      landmark: "Alama ya eneo",
      plusCode: "Plus code",
    },
    directions: "Pata maelekezo",
    openInMaps: "Fungua kwenye Google Maps",
    walkIns: "Huhitaji miadi: fika moja kwa moja wakati wa saa za kazi, au panga miadi mapema kuchagua muda wako.",
    mapPlaceholder: "Ramani inakuja hivi karibuni",
    mapTitle: "Ramani inayoonyesha DECMA Dental Clinic, Mwanyamala, Dar es Salaam",
    registrationsTitle: "Usajili",
    facilityReg: (no: string) => `Kituo cha afya kilichosajiliwa, namba ${no}`,
  },

  callback: {
    title: "Ungependa tukupigie?",
    textBefore: "Acha taarifa zako, tutakupigia kupanga muda, au ",
    bookOnline: "panga miadi mtandaoni",
    textAfter: ".",
    noMedical: "Tafadhali usiandike taarifa za kitabibu hapa.",
    fields: {
      fullName: "Jina kamili",
      phone: "Namba ya simu",
      appointmentType: "Aina ya miadi",
      preferredDate: "Tarehe unayopendelea",
    },
    consentBefore:
      "Ninakubali DECMA Dental Clinic itumie taarifa hizi kuwasiliana nami kuhusu miadi hii, kama ilivyoelezwa katika ",
    privacyNotice: "taarifa ya faragha",
    consentAfter: ".",
    submit: "Omba tukupigie",
    success: "Asante. Tutakupigia kupanga muda.",
  },

  appointmentTypes: {
    "new-patient": "Mgonjwa mpya",
    "check-up": "Uchunguzi na kusafisha meno",
    toothache: "Maumivu ya jino au jino lililovunjika",
    fillings: "Kujaza meno na matibabu ya mizizi",
    cosmetic: "Urembo wa meno",
    orthodontics: "Kunyoosha meno (braces, aligners)",
    implants: "Vipandikizi, taji na madaraja ya meno",
    children: "Meno ya watoto",
  },

  forms: {
    sending: "Inatuma…",
    required: "Inahitajika",
    errors: {
      generic: "Kuna tatizo limetokea. Tafadhali jaribu tena au piga simu kliniki.",
      unavailable:
        "Maombi ya mtandaoni bado hayapatikani. Tafadhali piga simu kliniki kupanga miadi yako.",
      rateLimited: "Maombi ni mengi mno. Tafadhali subiri dakika chache kisha ujaribu tena.",
      name: "Tafadhali andika jina lako kamili.",
      phone: "Tafadhali andika namba sahihi ya simu.",
      email: "Tafadhali andika barua pepe sahihi.",
      consent: "Tafadhali weka alama kwenye kisanduku kukubali.",
      type: "Tafadhali chagua moja.",
      date: "Tafadhali chagua tarehe sahihi.",
      message: "Tafadhali andika ujumbe mfupi.",
    },
  },

  booking: {
    eyebrow: "Mwanyamala, Dar es Salaam",
    title: { lead: "Panga", accent: "ziara yako." },
    h1: "Panga ziara yako",
    intro: "Hatua tatu fupi. Huhitaji akaunti. Saa zote ni za Afrika Mashariki (EAT).",
    steps: ["Siku na saa", "Taarifa zako", "Imethibitishwa"],
    stepLabel: (n: number, total: number) => `Hatua ${n} kati ya ${total}`,
    chooseDay: "1. Chagua siku",
    chooseTime: "2. Chagua saa",
    prevMonth: "Mwezi uliopita",
    nextMonth: "Mwezi ujao",
    weekdays: ["Jtt", "Jnn", "Jtn", "Alh", "Ijm", "Jms", "Jpl"],
    legend: {
      available: "Inapatikana",
      chosen: "Chaguo lako",
      unavailable: "Imefungwa au imejaa",
    },
    notChosen: "Bado haijachaguliwa",
    eat: "EAT",
    pickDayFirst: "Chagua siku hapo juu kuona saa zilizo wazi.",
    noTimes: "Hakuna saa zilizobaki siku hii. Tafadhali chagua siku nyingine.",
    loadingTimes: "Inapakia saa…",
    notOpenYet: (date: string) =>
      `Kupanga miadi mtandaoni kutaanza ${date}. Acha namba yako, tutakupigia miadi itakapoanza.`,
    unavailableOnline:
      "Kupanga miadi mtandaoni bado hakupatikani. Tafadhali piga simu kliniki au omba tukupigie.",
    summary: {
      title: "Miadi yako",
      day: "Siku",
      time: "Saa",
      where: "Wapi",
      length: "Muda",
      lengthValue: (min: number) => `Takriban dakika ${min}`,
      chooseFirst: "Chagua siku na saa",
      continue: "Endelea",
      changes: (policy: string) => `Mabadiliko na kughairi: ${policy}`,
    },
    details: {
      title: "Taarifa zako",
      back: "Badilisha siku au saa",
      fullName: "Jina kamili",
      phone: "Namba ya simu",
      phoneHint: "Tutapiga tu ikiwa tunahitaji kukufikia kuhusu miadi hii.",
      email: "Barua pepe",
      emailHint: "Uthibitisho, mwaliko wa kalenda na kikumbusho vitatumwa hapa.",
      appointmentType: "Aina ya miadi",
      noMedical:
        "Tafadhali usiandike taarifa za kitabibu. Tutakuuliza kuhusu afya yako ukiwa kliniki.",
      consentBefore:
        "Ninakubali DECMA Dental Clinic itumie taarifa hizi kusimamia miadi hii na kunitumia vikumbusho, kama ilivyoelezwa katika ",
      consentAfter: ".",
      submit: "Thibitisha miadi",
      slotTaken: "Samahani, muda huo umechukuliwa sasa hivi. Tafadhali chagua muda mwingine.",
    },
    lookup: {
      h1: "Angalia miadi yako",
      intro:
        "Andika namba ya miadi yako na namba ya simu uliyotumia kupanga ili kuona miadi yako, kuiongeza kwenye kalenda au kuighairi.",
      reference: "Namba ya miadi",
      referenceHint: "Kwa mfano DC-4827-1593. Iko kwenye ukurasa wa uthibitisho na kwenye barua pepe yako.",
      phone: "Namba ya simu uliyotumia kupanga",
      submit: "Tafuta miadi yangu",
      invalidReference: "Tafadhali andika namba ya miadi ya tarakimu 8, kwa mfano DC-4827-1593.",
      notFound:
        "Hatukuweza kupata miadi yenye taarifa hizo. Tafadhali hakikisha namba ya miadi na ya simu, au piga simu kliniki.",
      link: "Umeshapanga? Angalia miadi yako",
      help: "Umepoteza namba ya miadi? Piga simu kliniki, tutakutafutia miadi yako.",
    },
    confirmed: {
      title: "Ziara yako imepangwa",
      text: (email: string) => `Tumetuma uthibitisho kwa ${email}.`,
      referenceLabel: "Namba ya miadi yako",
      keepReference: "Hifadhi namba hii. Pamoja na namba yako ya simu, inakuwezesha kuangalia au kughairi miadi mtandaoni, au kuitaja unapotupigia simu.",
      addToCalendar: "Ongeza kwenye kalenda yako",
      addToCalendarText: "Hifadhi miadi pamoja na vikumbusho siku moja na saa mbili kabla.",
      calendars: {
        apple: { label: "Kalenda ya Apple", hint: "iPhone, iPad na Mac" },
        google: { label: "Google Calendar", hint: "Simu za Android na Gmail" },
        outlook: { label: "Outlook.com", hint: "Akaunti binafsi za Outlook na Hotmail" },
        office: { label: "Microsoft 365", hint: "Outlook ya kazini au shuleni" },
        other: { label: "Kalenda nyingine", hint: "Pakua faili ya .ics (Samsung, Thunderbird na nyingine)" },
      },
      manage: "Unahitaji kughairi? Tumia kiungo kilicho kwenye barua pepe ya uthibitisho.",
      manageLink: "Simamia miadi hii",
      notFound: "Hatukuweza kupata miadi hii. Tafadhali angalia kiungo kilicho kwenye barua pepe yako.",
    },
    manage: {
      h1: "Simamia miadi yako",
      status: "Hali",
      statuses: { pending: "Inasubiri", confirmed: "Imethibitishwa", cancelled: "Imeghairiwa" },
      cancel: "Ghairi miadi hii",
      cancelConfirm: "Ndiyo, ghairi miadi yangu",
      cancelled: "Miadi yako imeghairiwa. Tumekutumia barua pepe ya kuthibitisha.",
      rebook: "Panga muda mwingine",
      past: "Miadi hii tayari imeshapita.",
    },
  },

  footer: {
    tagline: "Huduma za meno za kawaida, za kurekebisha na za urembo, Dar es Salaam.",
    clinic: "Kliniki",
    services: "Huduma",
    contact: "Mawasiliano",
    generalCare: "Huduma za kawaida",
    cosmetic: "Urembo wa meno",
    orthodontics: "Kunyoosha meno",
    implants: "Vipandikizi",
    registrations: (facility: string) => `Kituo cha afya kilichosajiliwa, namba ${facility}`,
    copyright: (year: number, name: string) => `© ${year} ${name}. Haki zote zimehifadhiwa.`,
    checkAppointment: "Angalia miadi yako",
    privacy: "Taarifa ya faragha",
    terms: "Masharti ya matumizi",
  },

  notFound: {
    eyebrow: "Ukurasa haupatikani",
    title: "Hatukuweza kupata ukurasa huo",
    text: "Huenda ukurasa umehamishwa. Viungo hivi vitakusaidia kupata unachohitaji.",
  },

  legal: {
    privacyTitle: "Taarifa ya faragha",
    termsTitle: "Masharti ya matumizi",
    draftNote: "Ilisasishwa:",
  },

  emails: {
    greeting: (name: string) => `Mpendwa ${name},`,
    labels: { reference: "Namba ya miadi", day: "Siku", time: "Saa", where: "Wapi", type: "Aina ya miadi" },
    calendar: {
      summary: "Miadi ya meno, DECMA Dental Clinic",
      description: (manageUrl: string) =>
        `Miadi yako DECMA Dental Clinic. Kughairi, tumia kiungo hiki: ${manageUrl}`,
      reminder: "Miadi ya meno DECMA Dental Clinic",
    },
    confirmation: {
      subject: (when: string) => `Miadi yako DECMA Dental Clinic: ${when}`,
      preview: "Ziara yako imepangwa. Iongeze kwenye kalenda yako.",
      heading: "Ziara yako imepangwa",
      intro: "Asante kwa kupanga miadi na DECMA Dental Clinic. Hizi ni taarifa za miadi yako.",
      addToCalendar: "Ongeza kwenye kalenda yako",
      calendarHint:
        "Mwaliko ulioambatishwa (appointment.ics) unafanya kazi na kalenda za Apple, Outlook, Samsung na nyingine nyingi, na una vikumbusho siku moja na saa mbili kabla.",
      bring: "Kama unatumia bima, tafadhali leta kadi yako ya bima.",
    },
    reminder: {
      subject: (when: string) => `Kikumbusho: miadi yako DECMA, ${when}`,
      preview: "Kikumbusho cha miadi yako ya meno inayokuja.",
      heading: "Tutaonana hivi karibuni",
      intro: "Hiki ni kikumbusho cha miadi yako inayokuja DECMA Dental Clinic.",
    },
    cancelled: {
      subject: "Miadi yako DECMA imeghairiwa",
      preview: "Miadi yako imeghairiwa.",
      heading: "Miadi imeghairiwa",
      intro: "Miadi iliyo hapa chini imeghairiwa. Tunatumaini kukuona wakati mwingine.",
      rebook: "Panga muda mwingine",
    },
    manage: "Simamia au ghairi miadi yako",
    footer: (phone: string) =>
      `Tafadhali usijibu kwa taarifa za kitabibu. Kubadilisha miadi yako, tumia kiungo hapo juu au tupigie ${phone}.`,
  },
};
