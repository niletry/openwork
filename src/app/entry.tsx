import App from "./app";
import { GlobalSDKProvider } from "./context/global-sdk";
import { GlobalSyncProvider } from "./context/global-sync";
import { LocalProvider } from "./context/local";
import { ServerProvider } from "./context/server";
import { I18nProvider } from "../i18n";

export default function AppEntry() {
  const defaultUrl = "http://127.0.0.1:4096";

  return (
    <I18nProvider>
      <ServerProvider defaultUrl={defaultUrl}>
        <GlobalSDKProvider>
          <GlobalSyncProvider>
            <LocalProvider>
              <App />
            </LocalProvider>
          </GlobalSyncProvider>
        </GlobalSDKProvider>
      </ServerProvider>
    </I18nProvider>
  );
}
