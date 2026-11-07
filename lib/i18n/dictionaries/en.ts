import type { AppointmentType } from "@/lib/booking/options";

export const en = {
  a11y: {
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Main navigation",
    footerNav: "Footer navigation",
    breadcrumb: "Breadcrumb",
  },
  nav: {
    home: "Home",
    services: "Services",
    yourVisit: "What to expect",
    tips: "Oral health tips",
    visitUs: "Contact",
    referrals: "Referrals",
    book: "Book an appointment",
  },
  language: {
    label: "Language",
    switchTo: "Kiswahili",
    switchToShort: "SW",
  },
  common: {
    call: (phone: string) => `Call ${phone}`,
    bookAppointment: "Book an appointment",
    requestCallback: "Request a call-back",
    readArticle: "Read the article",
    learnMore: "Learn more",
    reviewedBy: "Reviewed by the DECMA clinical team",
    allServices: "All treatments",
    allTips: "All oral health tips",
  },

  home: {
    eyebrow: "Opening soon",
    h1: "Dental clinic in Mwanyamala, Dar es Salaam",
    tagline: { lead: "Caring for every", accent: "smile." },
    intro:
      "DECMA Dental Clinic offers general, restorative and cosmetic dental care for the whole family. At your first visit we examine your teeth, explain your options and give you a written estimate before any treatment begins.",
    quickServices: "Check-ups & cleaning · Fillings · Whitening · Paediatric dentistry",
    heroImageAlt:
      "Illustration of a large white tooth being cleaned and polished by a team in blue scrubs",
    servicesIntro: "From routine check-ups to implants and braces. Choose a treatment to see what it involves.",
    explore: {
      eyebrow: "Plan your visit",
      title: "Everything you need before you come in",
      cards: {
        visit: {
          title: "What to expect",
          text: "What happens at your appointment, step by step, and answers to common questions.",
        },
        tips: {
          title: "Oral health tips",
          text: "Simple daily habits for healthy teeth and gums, reviewed by our clinical team.",
        },
        visitUs: {
          title: "Contact & directions",
          text: "Address, opening hours and directions in Mwanyamala, or ask us to call you.",
        },
        referrals: {
          title: "For practitioners",
          text: "Refer a patient to DECMA and receive a treatment summary afterwards.",
        },
      },
    },
    info: {
      hoursTitle: "Opening hours",
      hoursText: (weekdays: string, saturday: string) =>
        `Monday to Friday ${weekdays}. Saturday ${saturday}. Walk-ins welcome. Emergencies by phone.`,
      whereTitle: "Where we are",
      whereText: (street: string, landmark: string) =>
        `${street}, Mwanyamala, Dar es Salaam. ${landmark}`,
      paymentTitle: "Payment and insurance",
      paymentText: (insurers: string) =>
        `A written estimate before treatment. Insurance accepted: ${insurers}.`,
    },
  },

  services: {
    eyebrow: "Services",
    title: "Treatments we offer",
    intro:
      "Every treatment starts with an examination. We recommend only what you need, and you decide whether to go ahead.",
    detail: {
      involves: "What the treatment involves",
      whoFor: "Who it is for",
      cost: "What affects the cost",
      costNote:
        "We do not publish prices online, because the right treatment depends on your examination. You always receive a written estimate before any treatment begins.",
      timing: "How long it takes",
      faq: "Frequently asked questions",
      ctaTitle: "Start with an examination",
      ctaText:
        "Book a visit and we will examine your teeth, explain your options and give you a written estimate.",
      otherServices: "Other treatments",
    },
  },

  visit: {
    eyebrow: "What to expect",
    title: "What happens, step by step",
    h1: "What happens at your visit",
    intro:
      "We want you to know exactly what to expect. Nothing happens without your agreement, and you always receive a written estimate before treatment.",
    steps: [
      {
        title: "Book or walk in",
        text: "Book online or by phone, or walk in during opening hours.",
      },
      {
        title: "Examination",
        text: "A full oral examination, with X-rays only if they are needed.",
      },
      {
        title: "Options and estimate",
        text: "We explain your options and give a written estimate. Treatment starts only with your consent.",
      },
      {
        title: "Treatment and follow-up",
        text: "Your treatment, then a follow-up appointment if one is needed.",
      },
    ],
    bringTitle: "What to bring",
    bring: [
      "Your insurance card or membership details, if you are using insurance.",
      "A list of any medicines you take.",
      "Any recent dental X-rays or records, if you have them.",
      "For children: a parent or guardian should come to the appointment.",
    ],
    faqTitle: "Frequently asked questions",
    faqs: (p: { cancellation: string; insurers: string; length: number }) => [
      {
        q: "Do I need an appointment?",
        a: "No. You can walk in during opening hours, or book ahead online or by phone to choose a time that suits you.",
      },
      {
        q: "What should I do in a dental emergency?",
        a: "Call the clinic during opening hours and we will advise you and, where possible, see you the same day. If you have severe swelling, difficulty breathing or swallowing, or heavy bleeding, go to the nearest hospital emergency department.",
      },
      {
        q: "How long is the first visit?",
        a: `Plan for about ${p.length} minutes. This covers your examination, any X-rays that are needed and time to talk through your options.`,
      },
      {
        q: "How can I pay?",
        a: `You receive a written estimate before treatment. Accepted insurance: ${p.insurers}. Please ask reception about cash, mobile money and card payments.`,
      },
      {
        q: "Is there parking?",
        a: "Parking details will be confirmed before the clinic opens. Please call us if you need directions or step-free access.",
      },
      {
        q: "Can I change or cancel my appointment?",
        a: `Yes. Use the link in your confirmation email, go to "Check your appointment" with your appointment number and phone number, or call the clinic. Changes and cancellations: ${p.cancellation}`,
      },
    ],
  },

  tips: {
    eyebrow: "Oral health tips",
    title: "Small habits, healthy teeth",
    h1: "Oral health tips",
    intro:
      "Practical, everyday advice to keep your teeth and gums healthy between visits. Every article is reviewed by the DECMA clinical team.",
  },

  openingSoon: {
    eyebrow: "Opening soon",
    title: (date: string) => `Opening in Mwanyamala. Bookings open ${date}.`,
    text: "Leave your number and we will call you when appointments open.",
  },

  referralBand: {
    eyebrow: "For other practitioners",
    title: "Referring a patient",
    text: "We accept referrals from other practitioners. Please send the referral letter with the patient's consent. With the patient's agreement, we send you a treatment summary afterwards.",
    cta: "Contact the referrals desk",
  },

  referrals: {
    h1: "Referring a patient",
    intro:
      "We welcome referrals from doctors, dentists and other practitioners in Dar es Salaam and beyond.",
    howTitle: "How referrals work",
    how: [
      "Ask for the patient's consent before sharing their details with us.",
      "Send the referral letter to the referrals desk by email, or ask the patient to bring it to their appointment.",
      "We contact the patient to arrange an examination.",
      "With the patient's agreement, we send you a treatment summary afterwards.",
    ],
    emailTitle: "Referrals desk",
    emailText: "Send referral letters to:",
    formTitle: "Ask the referrals desk to contact you",
    formText:
      "Use this form for questions or to arrange a referral. Please do not include patient names or clinical details here; send those by letter.",
    fields: {
      practitionerName: "Your name",
      practice: "Practice or facility",
      phone: "Phone number",
      email: "Email",
      message: "Message",
      consent:
        "I confirm I will only share patient details with the patient's consent, as described in the privacy notice.",
    },
    submit: "Send to the referrals desk",
    success: "Thank you. The referrals desk will be in touch.",
  },

  visitUs: {
    eyebrow: "Contact",
    title: "Find the clinic",
    h1: "Contact us in Mwanyamala",
    labels: {
      address: "Address",
      phone: "Phone",
      email: "Email",
      monFri: "Mon–Fri",
      saturday: "Saturday",
      sunday: "Sunday",
      landmark: "Landmark",
      plusCode: "Plus code",
    },
    directions: "Get directions",
    openInMaps: "Open in Google Maps",
    walkIns: "No appointment needed: walk in during opening hours, or book ahead to choose your time.",
    mapPlaceholder: "Map coming soon",
    mapTitle: "Map showing DECMA Dental Clinic in Mwanyamala, Dar es Salaam",
    registrationsTitle: "Registration",
    facilityReg: (no: string) => `Registered health facility no. ${no}`,
  },

  callback: {
    title: "Prefer a call?",
    textBefore: "Leave your details and we will call you to arrange a time, or ",
    bookOnline: "book online",
    textAfter: ".",
    noMedical: "Please do not include medical details here.",
    fields: {
      fullName: "Full name",
      phone: "Phone number",
      appointmentType: "Appointment type",
      preferredDate: "Preferred date",
    },
    consentBefore:
      "I agree that DECMA Dental Clinic may use these details to contact me about this appointment, as described in the ",
    privacyNotice: "privacy notice",
    consentAfter: ".",
    submit: "Request a call-back",
    success: "Thank you. We will call you to arrange a time.",
  },

  appointmentTypes: {
    "new-patient": "New patient",
    "check-up": "Check-up & cleaning",
    toothache: "Toothache or broken tooth",
    fillings: "Fillings & root canal",
    cosmetic: "Cosmetic dentistry",
    orthodontics: "Orthodontics (braces, aligners)",
    implants: "Implants, crowns & bridges",
    children: "Paediatric dentistry (children)",
  } satisfies Record<AppointmentType, string>,

  forms: {
    sending: "Sending…",
    required: "Required",
    errors: {
      generic: "Something went wrong. Please try again or call the clinic.",
      unavailable:
        "Online requests are not available yet. Please call the clinic to arrange your appointment.",
      rateLimited: "Too many requests. Please wait a few minutes and try again.",
      name: "Please enter your full name.",
      phone: "Please enter a valid phone number.",
      email: "Please enter a valid email address.",
      consent: "Please tick the box to agree.",
      type: "Please choose an option.",
      date: "Please choose a valid date.",
      message: "Please enter a short message.",
    },
  },

  booking: {
    eyebrow: "Mwanyamala, Dar es Salaam",
    title: { lead: "Book your", accent: "visit." },
    h1: "Book your visit",
    intro: "Three short steps. No account needed. All times are East Africa Time.",
    steps: ["Day & time", "Your details", "Confirmed"],
    stepLabel: (n: number, total: number) => `Step ${n} of ${total}`,
    chooseDay: "1. Choose a day",
    chooseTime: "2. Choose a time",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    legend: {
      available: "Available",
      chosen: "Your choice",
      unavailable: "Closed or fully booked",
    },
    notChosen: "Not chosen yet",
    eat: "EAT",
    pickDayFirst: "Pick a day above to see open times.",
    noTimes: "No times left on this day. Please choose another day.",
    loadingTimes: "Loading times…",
    notOpenYet: (date: string) =>
      `Online booking opens ${date}. Leave your number and we will call you when appointments open.`,
    unavailableOnline:
      "Online booking is not available yet. Please call the clinic or request a call-back.",
    summary: {
      title: "Your appointment",
      day: "Day",
      time: "Time",
      where: "Where",
      length: "Length",
      lengthValue: (min: number) => `About ${min} minutes`,
      chooseFirst: "Choose a day and time",
      continue: "Continue",
      changes: (policy: string) => `Changes and cancellations: ${policy}`,
    },
    details: {
      title: "Your details",
      back: "Change day or time",
      fullName: "Full name",
      phone: "Phone number",
      phoneHint: "We will only call if we need to reach you about this appointment.",
      email: "Email",
      emailHint: "Your confirmation, calendar invite and reminder are sent here.",
      appointmentType: "Appointment type",
      noMedical: "Please do not include medical details. We will ask about your health at the clinic.",
      consentBefore:
        "I agree that DECMA Dental Clinic may use these details to manage this appointment and send me reminders, as described in the ",
      consentAfter: ".",
      submit: "Confirm booking",
      slotTaken: "Sorry, that time was just booked. Please choose another time.",
    },
    lookup: {
      h1: "Check your appointment",
      intro:
        "Enter your appointment number and the phone number you booked with to see your appointment, add it to your calendar or cancel it.",
      reference: "Appointment number",
      referenceHint: "For example DC-4827-1593. It is on your confirmation page and in your email.",
      phone: "Phone number used for the booking",
      submit: "Find my appointment",
      invalidReference: "Please enter the 8-digit appointment number, for example DC-4827-1593.",
      notFound:
        "We could not find an appointment with those details. Please check the number and phone number, or call the clinic.",
      link: "Already booked? Check your appointment",
      help: "Lost your appointment number? Call the clinic and we will find your booking for you.",
    },
    confirmed: {
      title: "Your visit is booked",
      text: (email: string) => `We have sent a confirmation to ${email}.`,
      referenceLabel: "Your appointment number",
      keepReference: "Keep this number. With your phone number, it lets you check or cancel your appointment online, or quote it when you call us.",
      addToCalendar: "Add to your calendar",
      addToCalendarText:
        "Save the appointment with reminders one day and two hours before.",
      calendars: {
        apple: { label: "Apple Calendar", hint: "iPhone, iPad and Mac" },
        google: { label: "Google Calendar", hint: "Android phones and Gmail" },
        outlook: { label: "Outlook.com", hint: "Personal Outlook and Hotmail" },
        office: { label: "Microsoft 365", hint: "Work or school Outlook" },
        other: { label: "Other calendar apps", hint: "Download an .ics file (Samsung, Thunderbird and more)" },
      },
      manage: "Need to cancel? Use the link in your confirmation email.",
      manageLink: "Manage this booking",
      notFound: "We could not find this booking. Please check the link in your email.",
    },
    manage: {
      h1: "Manage your booking",
      status: "Status",
      statuses: { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled" },
      cancel: "Cancel this appointment",
      cancelConfirm: "Yes, cancel my appointment",
      cancelled: "Your appointment has been cancelled. We have sent you an email to confirm.",
      rebook: "Book another time",
      past: "This appointment has already taken place.",
    },
  },

  footer: {
    tagline: "General, restorative and cosmetic dental care in Dar es Salaam.",
    clinic: "Clinic",
    services: "Services",
    contact: "Contact",
    generalCare: "General care",
    cosmetic: "Cosmetic",
    orthodontics: "Orthodontics",
    implants: "Implants",
    registrations: (facility: string) => `Registered health facility no. ${facility}`,
    copyright: (year: number, name: string) => `© ${year} ${name}. All rights reserved.`,
    checkAppointment: "Check your appointment",
    privacy: "Privacy notice",
    terms: "Terms of use",
  },

  notFound: {
    eyebrow: "Page not found",
    title: "We couldn't find that page",
    text: "The page may have moved. These links will help you find what you need.",
  },

  legal: {
    privacyTitle: "Privacy notice",
    termsTitle: "Terms of use",
    draftNote: "Last updated:",
  },

  emails: {
    greeting: (name: string) => `Dear ${name},`,
    labels: { reference: "Appointment number", day: "Day", time: "Time", where: "Where", type: "Appointment type" },
    calendar: {
      summary: "Dental appointment, DECMA Dental Clinic",
      description: (manageUrl: string) =>
        `Your appointment at DECMA Dental Clinic. To cancel, use this link: ${manageUrl}`,
      reminder: "Dental appointment at DECMA Dental Clinic",
    },
    confirmation: {
      subject: (when: string) => `Your DECMA Dental Clinic appointment: ${when}`,
      preview: "Your visit is booked. Add it to your calendar.",
      heading: "Your visit is booked",
      intro: "Thank you for booking with DECMA Dental Clinic. Here are your appointment details.",
      addToCalendar: "Add to your calendar",
      calendarHint:
        "The attached invitation (appointment.ics) works with Apple, Outlook, Samsung and most other calendars, and includes reminders one day and two hours before.",
      bring: "If you are using insurance, please bring your insurance card.",
    },
    reminder: {
      subject: (when: string) => `Reminder: your DECMA appointment, ${when}`,
      preview: "A reminder of your upcoming dental appointment.",
      heading: "See you soon",
      intro: "This is a reminder of your upcoming appointment at DECMA Dental Clinic.",
    },
    cancelled: {
      subject: "Your DECMA appointment has been cancelled",
      preview: "Your appointment has been cancelled.",
      heading: "Appointment cancelled",
      intro: "The appointment below has been cancelled. We hope to see you another time.",
      rebook: "Book another time",
    },
    manage: "Manage or cancel your booking",
    footer: (phone: string) =>
      `Please do not reply with medical details. To change your appointment, use the link above or call us on ${phone}.`,
  },
};

export type Dictionary = typeof en;
