import { NativeModules } from "react-native";

// https://developers.enode.com/docs/link-sdks/react-native#use-the-sdks-in-react-native
export type LinkUICallBackCode =
  | "success"
  | "missingLinkToken"
  | "malformedLinkToken"
  | "dismissedViaDismissFunction"
  | "cancelledByUser"
  | "backendError"
  | "earlyExitRequestedFromFrontend";

const show = (
  token: string,
  onSuccess: () => void,
  onCancel: (code: string, errorMessage: string) => void,
  onError: (code: string, errorMessage: string) => void
) => {
  NativeModules.EncodeLinkSdk.show(
    token,
    (code: LinkUICallBackCode, errorMessage: string) => {
      switch (code) {
        case "success":
          onSuccess?.();
          break;

        case "cancelledByUser":
          onCancel?.(code, errorMessage);
          break;

        default:
          onError?.(code, errorMessage);
          break;
      }
    }
  );
};

export const LinkUI = { show };
