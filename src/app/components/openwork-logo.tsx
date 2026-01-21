import type { JSX } from "solid-js";
import { useI18n } from "../../i18n";

type Props = {
  size?: number;
  class?: string;
};

export default function OpenWorkLogo(props: Props): JSX.Element {
  const [t] = useI18n();
  const size = props.size ?? 24;
  return (
    <img
      src="/openwork-logo.svg"
      alt={t("common.logo_alt")}
      width={size}
      height={size}
      class={`inline-block rounded-[20%] ${props.class ?? ""}`}
    />
  );
}
