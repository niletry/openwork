import { dict as en } from "./en";
import { dict as zh } from "./zh";

export type Locale = "en" | "zh";
export type Dictionary = typeof en;

export const dictionaries = { en, zh };
