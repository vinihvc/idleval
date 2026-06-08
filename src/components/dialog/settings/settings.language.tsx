import type React from "react";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  LOCALE_LABELS,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from "@/i18n/locale";
import { m } from "@/i18n/messages";
import { useLocale } from "@/i18n/provider";
import { cn } from "@/lib/cn";

export const SettingsLanguage = (
  props: React.ComponentProps<typeof FieldSet>
) => {
  const { className, ...rest } = props;

  const { locale, setLocale } = useLocale();

  return (
    <FieldSet className={cn("gap-4", className)} {...rest}>
      <FieldLegend className="sr-only" variant="legend">
        {m["ui.settings.language"]()}
      </FieldLegend>

      <Field>
        <FieldLabel>{m["ui.settings.language"]()}</FieldLabel>
        <FieldContent>
          <ToggleGroup
            aria-label={m["ui.settings.language"]()}
            className="w-full"
            multiple={false}
            onValueChange={(details) => {
              const next = details.value[0];

              if (next) {
                setLocale(normalizeLocale(next));
              }
            }}
            size="lg"
            value={[locale]}
          >
            {SUPPORTED_LOCALES.map((option) => (
              <ToggleGroupItem
                className="min-w-0 flex-1 justify-center px-1.5 sm:px-2"
                key={option}
                value={option}
              >
                {LOCALE_LABELS[option]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldContent>
      </Field>
    </FieldSet>
  );
};
