import { DEFAULT_LOCALE } from "@/i18n/locale";
import { overwriteGetLocale } from "@/i18n/paraglide/runtime.js";
import { getLocale as getSettingsLocale } from "@/store/atoms/settings";

overwriteGetLocale(() => getSettingsLocale() ?? DEFAULT_LOCALE);
