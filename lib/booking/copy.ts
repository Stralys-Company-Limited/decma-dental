import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import type { BandCopy } from "@/components/booking/BookingBand";
import type { WizardCopy } from "@/components/booking/BookingWizard";

/** Client components cannot receive the dictionary's formatter functions, so resolve them to plain strings here. */
export function bandCopy(dict: Dictionary): BandCopy {
  const b = dict.booking;
  return {
    eyebrow: b.eyebrow,
    titleLead: b.title.lead,
    titleAccent: b.title.accent,
    intro: b.intro,
    steps: b.steps,
  };
}

export function wizardCopy(dict: Dictionary): WizardCopy {
  const b = dict.booking;
  return {
    band: bandCopy(dict),
    calendar: {
      chooseDay: b.chooseDay,
      prevMonth: b.prevMonth,
      nextMonth: b.nextMonth,
      weekdays: b.weekdays,
      legend: b.legend,
    },
    time: {
      chooseTime: b.chooseTime,
      notChosen: b.notChosen,
      pickDayFirst: b.pickDayFirst,
      noTimes: b.noTimes,
      loadingTimes: b.loadingTimes,
    },
    summary: {
      title: b.summary.title,
      day: b.summary.day,
      time: b.summary.time,
      where: b.summary.where,
      length: b.summary.length,
      lengthValue: b.summary.lengthValue(site.appointmentLengthMinutes),
      changes: b.summary.changes(site.cancellationPolicy),
      chooseFirst: b.summary.chooseFirst,
      continue: b.summary.continue,
    },
    details: {
      ...b.details,
      privacyNotice: dict.callback.privacyNotice,
      sending: dict.forms.sending,
      appointmentTypes: dict.appointmentTypes,
    },
  };
}
