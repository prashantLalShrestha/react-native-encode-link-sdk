import EncodeLinkSdk, { type LinkUICallBackCode } from "./EncodeLinkSdk";

const show = (
  token: string,
  onSuccess: () => void,
  onCancel: (code: string, errorMessage: string) => void,
  onError: (code: string, errorMessage: string) => void
) => {
  EncodeLinkSdk.show(
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
export { type LinkUICallBackCode } from "./EncodeLinkSdk";
