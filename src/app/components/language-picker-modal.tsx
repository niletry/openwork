import { For, Show } from "solid-js";
import { CheckCircle2, Circle } from "lucide-solid";
import { LANGUAGE_OPTIONS, type Locale, useI18n } from "../../i18n";

export type LanguagePickerModalProps = {
  open: boolean;
  currentLanguage: Locale;
  onSelect: (language: Locale) => void;
  onClose: () => void;
};

export default function LanguagePickerModal(props: LanguagePickerModalProps) {
  const [t] = useI18n();
  const translate = (key: string) => t(key);

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 bg-gray-1/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-gray-2 border border-gray-6/70 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-12 mb-4">{translate("settings.general.language")}</h3>

            <div class="space-y-2">
              <For each={LANGUAGE_OPTIONS}>
                {(option) => (
                  <button
                    class={`w-full p-3 rounded-xl text-left transition-all border ${props.currentLanguage === option.value
                      ? "bg-gray-3 border-gray-7 text-gray-12 shadow-sm"
                      : "bg-gray-1/40 border-transparent text-gray-11 hover:bg-gray-3/50"
                      }`}
                    onClick={() => {
                      props.onSelect(option.value);
                      props.onClose();
                    }}
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex-1">
                        <div class="font-medium text-sm">{option.nativeName}</div>
                        <Show when={option.label !== option.nativeName}>
                          <div class="text-xs text-gray-10 mt-0.5">{option.label}</div>
                        </Show>
                      </div>
                      <div class="text-gray-10">
                        <Show
                          when={props.currentLanguage === option.value}
                          fallback={<Circle size={14} />}
                        >
                          <CheckCircle2 size={14} class="text-green-600" />
                        </Show>
                      </div>
                    </div>
                  </button>
                )}
              </For>
            </div>

            <button
              class="mt-6 w-full py-2 text-sm text-gray-10 hover:text-gray-12 transition-colors font-medium border border-gray-6 rounded-xl hover:bg-gray-3/50"
              onClick={props.onClose}
            >
              {translate("common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
