import { For, Show } from "solid-js";

import type { Skill } from "../types";
import { formatRelativeTime } from "../utils";

import Button from "../components/button";
import TextInput from "../components/text-input";
import { useI18n } from "../../i18n";
import { Box, Download, Package, RefreshCw, Search, Zap } from "lucide-solid";

export type SkillsViewProps = {
  busy: boolean;
  skills: Skill[];
  skillInput: string;
  setSkillInput: (value: string) => void;
  skillStatus: string | null;
  installSkill: () => void;
  importLocalSkill: () => void;
  refreshSkills: () => void;
  isHostMode: boolean;
};

export default function SkillsView(props: SkillsViewProps) {
  const [t] = useI18n();

  return (
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-11 uppercase tracking-wider">{t("skills.title")}</h3>
        <Button variant="ghost" onClick={props.refreshSkills} disabled={props.busy}>
          <RefreshCw size={14} class={props.busy ? "animate-spin" : ""} />
          {t("skills.refresh")}
        </Button>
      </div>

      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-4">
        <div class="flex flex-col gap-4">
          <div class="flex-1 space-y-2">
            <div class="text-sm font-medium text-gray-12">{t("skills.install_from_openpackage")}</div>
            <Show when={!props.isHostMode}>
              <div class="text-xs text-orange-10 bg-orange-2/10 border border-orange-6/20 rounded-lg px-2 py-1 inline-block">
                {t("skills.host_mode_only")}
              </div>
            </Show>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <TextInput
                placeholder={t("skills.source_placeholder")}
                value={props.skillInput}
                onInput={(e) => props.setSkillInput(e.currentTarget.value)}
                disabled={!props.isHostMode || props.busy}
              />
            </div>
            <Button
              variant="secondary"
              onClick={props.installSkill}
              disabled={!props.isHostMode || props.busy || !props.skillInput.trim()}
            >
              <Download size={16} />
              {t("skills.install")}
            </Button>
          </div>
          <p class="text-xs text-gray-10">{t("skills.install_hint")}</p>
        </div>

        <div class="pt-4 border-t border-gray-6/50">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-gray-12">{t("skills.import_local")}</div>
            <Button variant="outline" onClick={props.importLocalSkill} disabled={!props.isHostMode || props.busy}>
              {t("skills.import")}
            </Button>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-xs font-semibold text-gray-10 uppercase tracking-wider">{t("skills.curated_packages")}</h3>

        {/* Notion CRM Pack Card */}
        <div class="bg-gradient-to-br from-indigo-9/10 to-purple-9/10 border border-indigo-6/30 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-6/50 transition-colors">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div class="relative z-10 flex justify-between items-start gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Box size={18} class="text-indigo-2" />
                </div>
                <h4 class="text-base font-semibold text-white">{t("skills.notion_crm_title")}</h4>
              </div>
              <p class="text-sm text-indigo-2 max-w-md">
                {t("skills.notion_crm_description")}
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-indigo-1 border border-white/10">notion</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-indigo-1 border border-white/10">crm</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-indigo-1 border border-white/10">contacts</span>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <Button
                variant="secondary"
                class="bg-white/10 hover:bg-white/20 text-white border-transparent backdrop-blur-md shadow-xl"
                onClick={() => props.setSkillInput("github:anthropics/sdks/packages/mcp-notion")}
              >
                {t("skills.view")}
              </Button>
            </div>
          </div>
        </div>

        <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-4 flex items-center gap-3 text-gray-10">
          <Search size={16} />
          <input
            type="text"
            placeholder={t("skills.search_placeholder")}
            class="bg-transparent border-none focus:outline-none text-sm w-full placeholder-gray-8"
            disabled
          />
        </div>

        <div class="text-center py-8 text-gray-10 text-sm italic">
          {t("skills.no_matches")}
        </div>

        <div class="rounded-xl bg-blue-2/10 border border-blue-6/20 p-4 text-xs text-blue-11 leading-relaxed">
          {t("skills.registry_notice")}
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <h3 class="text-xs font-semibold text-gray-10 uppercase tracking-wider">{t("skills.installed")}</h3>
          <span class="text-xs text-gray-8 bg-gray-3 px-1.5 py-0.5 rounded-full">{props.skills.length}</span>
        </div>

        <Show
          when={props.skills.length}
          fallback={
            <div class="rounded-xl border border-gray-6/60 bg-gray-1/40 p-8 text-center space-y-2">
              <Zap size={24} class="mx-auto text-gray-7 mb-2" />
              <p class="text-sm text-gray-10">{t("skills.no_skills")}</p>
            </div>
          }
        >
          <div class="grid gap-3">
            <For each={props.skills}>
              {(skill) => (
                <div class="group bg-gray-2/30 border border-gray-6/50 rounded-xl p-4 hover:bg-gray-2/50 hover:border-gray-6 transition-all">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <Package size={16} class="text-gray-11" />
                        <div class="font-medium text-gray-12 truncate font-mono text-sm">{skill.name}</div>
                        <Show when={skill.version}>
                          <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-4 text-gray-11 border border-gray-6 font-mono">v{skill.version}</span>
                        </Show>
                      </div>
                      <Show when={skill.description}>
                        <div class="text-xs text-gray-10 truncate mb-1">{skill.description}</div>
                      </Show>
                      <div class="text-xs text-gray-10 truncate font-mono text-opacity-80">{skill.path}</div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      <Show when={props.skillStatus}>
        <div class="fixed bottom-6 right-6 max-w-sm bg-gray-1 border border-gray-6 shadow-2xl rounded-xl p-4 animate-in slide-in-from-bottom-2 duration-200 z-50">
          <div class="text-xs font-mono text-gray-11 break-all">{props.skillStatus}</div>
        </div>
      </Show>
    </section>
  );
}
