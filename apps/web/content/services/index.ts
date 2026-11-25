import { checkUpsCleaning } from "./check-ups-cleaning";
import { fillingsRootCanal } from "./fillings-root-canal";
import { cosmeticDentistry } from "./cosmetic-dentistry";
import { orthodontics } from "./orthodontics";
import { implants } from "./implants";
import { paediatricDentistry } from "./paediatric-dentistry";
import type { Service } from "./types";

/** Order matches the mockup's services grid. */
export const services: Service[] = [
  checkUpsCleaning,
  fillingsRootCanal,
  cosmeticDentistry,
  orthodontics,
  implants,
  paediatricDentistry,
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export type { Service, ServiceCopy } from "./types";
