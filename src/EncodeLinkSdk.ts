import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

// https://developers.enode.com/docs/link-sdks/react-native#use-the-sdks-in-react-native
export type LinkUICallBackCode =
  | "success"
  | "missingLinkToken"
  | "malformedLinkToken"
  | "dismissedViaDismissFunction"
  | "cancelledByUser"
  | "backendError"
  | "earlyExitRequestedFromFrontend";

export interface Spec extends TurboModule {
  show(
    token: string,
    callback: (code: LinkUICallBackCode, errorMessage: string) => void
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("EncodeLinkSdk");
