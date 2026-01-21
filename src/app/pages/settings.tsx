import { Match, Show, Switch } from "solid-js";

import { formatBytes, formatRelativeTime, isTauriRuntime } from "../utils";

import Button from "../components/button";
import { HardDrive, RefreshCcw, Shield, Smartphone } from "lucide-solid";
import { useI18n, LANGUAGE_OPTIONS } from "../../i18n";

export type SettingsViewProps = {
  mode: "host" | "client" | null;
  baseUrl: string;
  headerStatus: string;
  busy: boolean;
  developerMode: boolean;
  toggleDeveloperMode: () => void;
  stopHost: () => void;
  engineSource: "path" | "sidecar";
  setEngineSource: (value: "path" | "sidecar") => void;
  isWindows: boolean;
  defaultModelLabel: string;
  defaultModelRef: string;
  openDefaultModelPicker: () => void;
  showThinking: boolean;
  toggleShowThinking: () => void;
  modelVariantLabel: string;
  editModelVariant: () => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
  demoSequence: "cold-open" | "scheduler" | "summaries" | "groceries";
  setDemoSequence: (value: "cold-open" | "scheduler" | "summaries" | "groceries") => void;
  themeMode: "light" | "dark" | "system";
  setThemeMode: (value: "light" | "dark" | "system") => void;
  updateAutoCheck: boolean;
  toggleUpdateAutoCheck: () => void;
  updateStatus: {
    state: string;
    lastCheckedAt?: number | null;
    version?: string;
    date?: string;
    notes?: string;
    totalBytes?: number | null;
    downloadedBytes?: number;
    message?: string;
  } | null;
  updateEnv: { supported?: boolean; reason?: string | null } | null;
  appVersion: string | null;
  checkForUpdates: () => void;
  downloadUpdate: () => void;
  installUpdateAndRestart: () => void;
  anyActiveRuns: boolean;
  onResetStartupPreference: () => void;
  openResetModal: (mode: "onboarding" | "all") => void;
  resetModalBusy: boolean;
  pendingPermissions: unknown;
  events: unknown;
  safeStringify: (value: unknown) => string;
  repairOpencodeCache: () => void;
  cacheRepairBusy: boolean;
  cacheRepairResult: string | null;
  notionStatus: "disconnected" | "connecting" | "connected" | "error";
  notionStatusDetail: string | null;
  notionError: string | null;
  notionBusy: boolean;
  connectNotion: () => void;
  openLanguagePicker: () => void;
};

export default function SettingsView(props: SettingsViewProps) {
  const [t, { locale: currentLocale }] = useI18n();
  const updateState = () => props.updateStatus?.state ?? "idle";
  const updateNotes = () => props.updateStatus?.notes ?? null;
  const updateVersion = () => props.updateStatus?.version ?? null;
  const updateDate = () => props.updateStatus?.date ?? null;
  const updateLastCheckedAt = () => props.updateStatus?.lastCheckedAt ?? null;
  const updateDownloadedBytes = () => props.updateStatus?.downloadedBytes ?? null;
  const updateTotalBytes = () => props.updateStatus?.totalBytes ?? null;
  const updateErrorMessage = () => props.updateStatus?.message ?? null;

  const notionStatusLabel = () => {
    switch (props.notionStatus) {
      case "connected":
        return t("settings.connection.connected");
      case "connecting":
        return t("settings.connection.reload_required");
      case "error":
        return t("settings.connection.failed");
      default:
        return t("settings.connection.not_connected");
    }
  };

  const notionStatusStyle = () => {
    if (props.notionStatus === "connected") {
      return "bg-green-7/10 text-green-11 border-green-7/20";
    }
    if (props.notionStatus === "error") {
      return "bg-red-7/10 text-red-11 border-red-7/20";
    }
    if (props.notionStatus === "connecting") {
      return "bg-amber-7/10 text-amber-11 border-amber-7/20";
    }
    return "bg-gray-4/60 text-gray-11 border-gray-7/50";
  };


  return (
    <section class="space-y-6">
      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-3">
        <div class="text-sm font-medium text-gray-12">{t("settings.connection.title")}</div>
        <div class="text-xs text-gray-10">{props.headerStatus}</div>
        <div class="text-xs text-gray-7 font-mono">{props.baseUrl}</div>
        <div class="pt-2 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={props.toggleDeveloperMode}>
            <Shield size={16} />
            {props.developerMode ? t("settings.connection.disable_dev_mode") : t("settings.connection.enable_dev_mode")}
          </Button>
          <Show when={props.mode === "host"}>
            <Button variant="danger" onClick={props.stopHost} disabled={props.busy}>
              {t("settings.connection.stop_engine")}
            </Button>
          </Show>
          <Show when={props.mode === "client"}>
            <Button variant="outline" onClick={props.stopHost} disabled={props.busy}>
              {t("settings.connection.disconnect")}
            </Button>
          </Show>
        </div>

        <Show when={isTauriRuntime() && props.mode === "host"}>
          <div class="pt-4 border-t border-gray-6/60 space-y-3">
            <div class="text-xs text-gray-10">{t("settings.connection.engine_source")}</div>
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant={props.engineSource === "path" ? "secondary" : "outline"}
                onClick={() => props.setEngineSource("path")}
                disabled={props.busy}
              >
                {t("settings.connection.path")}
              </Button>
              <Button
                variant={props.engineSource === "sidecar" ? "secondary" : "outline"}
                onClick={() => props.setEngineSource("sidecar")}
                disabled={props.busy || props.isWindows}
                title={props.isWindows ? t("settings.connection.sidecar_not_supported") : ""}
              >
                {t("settings.connection.sidecar")}
              </Button>
            </div>
            <div class="text-[11px] text-gray-7">
              {t("settings.connection.path_desc")}
              <Show when={props.isWindows}>
                <span class="text-gray-10"> {t("settings.connection.sidecar_unavailable")}</span>
              </Show>
            </div>
          </div>
        </Show>
      </div>




      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-gray-12">{t("settings.model.title")}</div>
          <div class="text-xs text-gray-10">{t("settings.model.subtitle")}</div>
        </div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-gray-12 truncate">{props.defaultModelLabel}</div>
            <div class="text-xs text-gray-7 font-mono truncate">{props.defaultModelRef}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.openDefaultModelPicker}
            disabled={props.busy}
          >
            {t("settings.model.change")}
          </Button>
        </div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-gray-12">{t("settings.model.thinking")}</div>
            <div class="text-xs text-gray-7">{t("settings.model.thinking_desc")}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.toggleShowThinking}
            disabled={props.busy}
          >
            {props.showThinking ? t("common.on") : t("common.off")}
          </Button>
        </div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-gray-12">{t("settings.model.model_variant")}</div>
            <div class="text-xs text-gray-7 font-mono truncate">{props.modelVariantLabel}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.editModelVariant}
            disabled={props.busy}
          >
            {t("settings.model.edit")}
          </Button>
        </div>
      </div>

      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-gray-12">{t("settings.appearance.title")}</div>
          <div class="text-xs text-gray-10">{t("settings.appearance.subtitle")}</div>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            variant={props.themeMode === "system" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setThemeMode("system")}
            disabled={props.busy}
          >
            {t("settings.appearance.system")}
          </Button>
          <Button
            variant={props.themeMode === "light" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setThemeMode("light")}
            disabled={props.busy}
          >
            {t("settings.appearance.light")}
          </Button>
          <Button
            variant={props.themeMode === "dark" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setThemeMode("dark")}
            disabled={props.busy}
          >
            {t("settings.appearance.dark")}
          </Button>
        </div>

        <div class="text-xs text-gray-7">
          {t("settings.appearance.desc")}
        </div>

        <div class="pt-4 border-t border-gray-6/60 space-y-4">
          <div>
            <div class="text-sm font-medium text-gray-12">{t("settings.general.language")}</div>
            <div class="text-xs text-gray-10">{t("settings.general.language_desc")}</div>
          </div>

          <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
            <div class="min-w-0">
              <div class="text-sm text-gray-12">{t("settings.general.display_language")}</div>
              <div class="text-xs text-gray-7 font-mono truncate">
                {LANGUAGE_OPTIONS.find(o => o.value === currentLocale())?.nativeName ?? "English"}
              </div>
            </div>
            <Button
              variant="outline"
              class="text-xs h-8 py-0 px-3 shrink-0"
              onClick={props.openLanguagePicker}
              disabled={props.busy}
            >
              {t("settings.model.change")}
            </Button>
          </div>
        </div>
      </div>

      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-gray-12">{t("settings.demo_mode.title")}</div>
          <div class="text-xs text-gray-10">{t("settings.demo_mode.subtitle")}</div>
        </div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-gray-12">{t("settings.demo_mode.enable")}</div>
            <div class="text-xs text-gray-7">{t("settings.demo_mode.enable_desc")}</div>
          </div>
          <Button
            variant={props.demoMode ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={props.toggleDemoMode}
            disabled={props.busy}
          >
            {props.demoMode ? t("settings.demo_mode.on") : t("settings.demo_mode.off")}
          </Button>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            variant={props.demoSequence === "cold-open" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("cold-open")}
            disabled={props.busy || !props.demoMode}
          >
            {t("settings.demo_mode.sequences.cold_open")}
          </Button>
          <Button
            variant={props.demoSequence === "scheduler" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("scheduler")}
            disabled={props.busy || !props.demoMode}
          >
            {t("settings.demo_mode.sequences.scheduler")}
          </Button>
          <Button
            variant={props.demoSequence === "summaries" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("summaries")}
            disabled={props.busy || !props.demoMode}
          >
            {t("settings.demo_mode.sequences.summaries")}
          </Button>
          <Button
            variant={props.demoSequence === "groceries" ? "secondary" : "outline"}
            class="text-xs h-8 py-0 px-3"
            onClick={() => props.setDemoSequence("groceries")}
            disabled={props.busy || !props.demoMode}
          >
            {t("settings.demo_mode.sequences.groceries")}
          </Button>
        </div>

        <div class="text-xs text-gray-7">
          {t("settings.demo_mode.footer")}
        </div>
      </div>

      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-3">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-sm font-medium text-gray-12">{t("settings.updates.title")}</div>
            <div class="text-xs text-gray-10">{t("settings.updates.subtitle")}</div>
          </div>
          <div class="text-xs text-gray-7 font-mono">{props.appVersion ? `v${props.appVersion}` : ""}</div>
        </div>

        <Show
          when={!isTauriRuntime()}
          fallback={
            <Show
              when={props.updateEnv && props.updateEnv.supported === false}
              fallback={
                <>
                  <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6">
                    <div class="space-y-0.5">
                      <div class="text-sm text-gray-12">{t("settings.updates.auto_check")}</div>
                      <div class="text-xs text-gray-7">{t("settings.updates.auto_check_desc")}</div>
                    </div>
                    <button
                      class={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${props.updateAutoCheck
                        ? "bg-gray-12/10 text-gray-12 border-gray-6/20"
                        : "text-gray-10 border-gray-6 hover:text-gray-12"
                        }`}
                      onClick={props.toggleUpdateAutoCheck}
                    >
                      {props.updateAutoCheck ? t("common.on") : t("common.off")}
                    </button>
                  </div>

                  <div class="flex items-center justify-between gap-3 bg-gray-1 p-3 rounded-xl border border-gray-6">
                    <div class="space-y-0.5">
                      <div class="text-sm text-gray-12">
                        <Switch>
                          <Match when={updateState() === "checking"}>{t("settings.updates.checking")}</Match>
                          <Match when={updateState() === "available"}>{t("settings.updates.available")}{updateVersion()}</Match>
                          <Match when={updateState() === "downloading"}>{t("settings.updates.downloading")}</Match>
                          <Match when={updateState() === "ready"}>{t("settings.updates.ready")}{updateVersion()}</Match>
                          <Match when={updateState() === "error"}>{t("settings.updates.failed")}</Match>
                          <Match when={true}>{t("settings.updates.up_to_date")}</Match>
                        </Switch>
                      </div>
                      <Show when={updateState() === "idle" && updateLastCheckedAt()}>
                        <div class="text-xs text-gray-7">
                          {t("settings.updates.last_checked")} {formatRelativeTime(updateLastCheckedAt() as number, t)}
                        </div>
                      </Show>
                      <Show when={updateState() === "available" && updateDate()}>
                        <div class="text-xs text-gray-7">{t("settings.updates.published")} {updateDate()}</div>
                      </Show>
                      <Show when={updateState() === "downloading"}>
                        <div class="text-xs text-gray-7">
                          {formatBytes((updateDownloadedBytes() as number) ?? 0)}
                          <Show when={updateTotalBytes() != null}>
                            {` / ${formatBytes(updateTotalBytes() as number)}`}
                          </Show>
                        </div>
                      </Show>
                      <Show when={updateState() === "error"}>
                        <div class="text-xs text-red-11">{updateErrorMessage()}</div>
                      </Show>
                    </div>

                    <div class="flex items-center gap-2">
                      <Button
                        variant="outline"
                        class="text-xs h-8 py-0 px-3"
                        onClick={props.checkForUpdates}
                        disabled={props.busy || updateState() === "checking" || updateState() === "downloading"}
                      >
                        {t("settings.updates.check")}
                      </Button>

                      <Show when={updateState() === "available"}>
                        <Button
                          variant="secondary"
                          class="text-xs h-8 py-0 px-3"
                          onClick={props.downloadUpdate}
                          disabled={props.busy || updateState() === "downloading"}
                        >
                          {t("settings.updates.download")}
                        </Button>
                      </Show>

                      <Show when={updateState() === "ready"}>
                        <Button
                          variant="secondary"
                          class="text-xs h-8 py-0 px-3"
                          onClick={props.installUpdateAndRestart}
                          disabled={props.busy || props.anyActiveRuns}
                          title={props.anyActiveRuns ? t("settings.updates.stop_runs") : ""}
                        >
                          {t("settings.updates.install_restart")}
                        </Button>
                      </Show>
                    </div>
                  </div>

                  <Show when={updateState() === "available" && updateNotes()}>
                    <div class="rounded-xl bg-gray-1/20 border border-gray-6 p-3 text-xs text-gray-11 whitespace-pre-wrap max-h-40 overflow-auto">
                      {updateNotes()}
                    </div>
                  </Show>
                </>
              }
            >
              <div class="rounded-xl bg-gray-1/20 border border-gray-6 p-3 text-sm text-gray-11">
                {props.updateEnv?.reason ?? t("settings.updates.unsupported")}
              </div>
            </Show>
          }
        >
          <div class="rounded-xl bg-gray-1/20 border border-gray-6 p-3 text-sm text-gray-11">
            {t("settings.updates.desktop_only")}          </div>
        </Show>
      </div>

      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-3">
        <div class="text-sm font-medium text-gray-12">{t("settings.startup.title")}</div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6">
          <div class="flex items-center gap-3">
            <div
              class={`p-2 rounded-lg ${props.mode === "host" ? "bg-indigo-7/10 text-indigo-11" : "bg-green-7/10 text-green-11"
                }`}
            >
              <Show when={props.mode === "host"} fallback={<Smartphone size={18} />}>
                <HardDrive size={18} />
              </Show>
            </div>
            <span class="capitalize text-sm font-medium text-gray-12">{props.mode === "host" ? t("common.host") : t("common.client")} {t("settings.startup.mode")}</span>
          </div>
          <Button variant="outline" class="text-xs h-8 py-0 px-3" onClick={props.stopHost} disabled={props.busy}>
            {t("settings.startup.switch")}
          </Button>
        </div>

        <Button variant="secondary" class="w-full justify-between group" onClick={props.onResetStartupPreference}>
          <span class="text-gray-11">{t("settings.startup.reset")}</span>
          <RefreshCcw size={14} class="text-gray-10 group-hover:rotate-180 transition-transform" />
        </Button>

        <p class="text-xs text-gray-7">
          {t("settings.startup.reset_desc")}
        </p>
      </div>

      <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-5 space-y-4">
        <div>
          <div class="text-sm font-medium text-gray-12">{t("settings.advanced.title")}</div>
          <div class="text-xs text-gray-10">{t("settings.advanced.subtitle")}</div>
        </div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-gray-12">{t("settings.advanced.reset_onboarding")}</div>
            <div class="text-xs text-gray-7">{t("settings.advanced.reset_onboarding_desc")}</div>
          </div>
          <Button
            variant="outline"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={() => props.openResetModal("onboarding")}
            disabled={props.busy || props.resetModalBusy || props.anyActiveRuns}
            title={props.anyActiveRuns ? t("settings.advanced.stop_runs_msg") : ""}
          >
            {t("settings.advanced.reset")}
          </Button>
        </div>

        <div class="flex items-center justify-between bg-gray-1 p-3 rounded-xl border border-gray-6 gap-3">
          <div class="min-w-0">
            <div class="text-sm text-gray-12">{t("settings.advanced.reset_app_data")}</div>
            <div class="text-xs text-gray-7">{t("settings.advanced.reset_app_data_desc")}</div>
          </div>
          <Button
            variant="danger"
            class="text-xs h-8 py-0 px-3 shrink-0"
            onClick={() => props.openResetModal("all")}
            disabled={props.busy || props.resetModalBusy || props.anyActiveRuns}
            title={props.anyActiveRuns ? t("settings.advanced.stop_runs_msg") : ""}
          >
            {t("settings.advanced.reset")}
          </Button>
        </div>

        <div class="text-xs text-gray-7">
          {t("settings.advanced.reset_warning")}
        </div>
      </div>

      <Show when={props.developerMode}>
        <section>
          <h3 class="text-sm font-medium text-gray-11 uppercase tracking-wider mb-4">{t("settings.developer.title")}</h3>

          <div class="space-y-4">
            <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="min-w-0">
                <div class="text-sm text-gray-12">{t("settings.developer.cache")}</div>
                <div class="text-xs text-gray-7">
                  {t("settings.developer.cache_desc")}
                </div>
                <Show when={props.cacheRepairResult}>
                  <div class="text-xs text-gray-11 mt-2">{props.cacheRepairResult}</div>
                </Show>
              </div>
              <Button
                variant="secondary"
                class="text-xs h-8 py-0 px-3 shrink-0"
                onClick={props.repairOpencodeCache}
                disabled={props.cacheRepairBusy || !isTauriRuntime()}
                title={isTauriRuntime() ? "" : t("settings.developer.desktop_only")}
              >
                {props.cacheRepairBusy ? t("settings.developer.repairing") : t("settings.developer.repair")}
              </Button>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-4">
                <div class="text-xs text-gray-10 mb-2">{t("settings.developer.pending_permissions")}</div>
                <pre class="text-xs text-gray-12 whitespace-pre-wrap break-words max-h-64 overflow-auto">
                  {props.safeStringify(props.pendingPermissions)}
                </pre>
              </div>
              <div class="bg-gray-2/30 border border-gray-6/50 rounded-2xl p-4">
                <div class="text-xs text-gray-10 mb-2">{t("settings.developer.recent_events")}</div>
                <pre class="text-xs text-gray-12 whitespace-pre-wrap break-words max-h-64 overflow-auto">
                  {props.safeStringify(props.events)}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </Show>
    </section>
  );
}
