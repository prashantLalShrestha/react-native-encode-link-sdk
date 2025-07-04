import { LinkUI } from "../index";
import EncodeLinkSdk, { type LinkUICallBackCode } from "../EncodeLinkSdk";

jest.mock("../EncodeLinkSdk", () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
  },
}));

describe("LinkUI.show", () => {
  const token = "test-token";
  let onSuccess: jest.Mock;
  let onCancel: jest.Mock;
  let onError: jest.Mock;

  beforeEach(() => {
    onSuccess = jest.fn();
    onCancel = jest.fn();
    onError = jest.fn();
    (EncodeLinkSdk.show as jest.Mock).mockClear();
  });

  it("calls EncodeLinkSdk.show with correct arguments", () => {
    LinkUI.show(token, onSuccess, onCancel, onError);
    expect(EncodeLinkSdk.show).toHaveBeenCalledWith(
      token,
      expect.any(Function)
    );
  });

  it('calls onSuccess when code is "success"', () => {
    LinkUI.show(token, onSuccess, onCancel, onError);
    const callback = (EncodeLinkSdk.show as jest.Mock).mock.calls[0][1];
    callback("success", "");
    expect(onSuccess).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onCancel when code is "cancelledByUser"', () => {
    LinkUI.show(token, onSuccess, onCancel, onError);
    const callback = (EncodeLinkSdk.show as jest.Mock).mock.calls[0][1];
    callback("cancelledByUser", "User cancelled");
    expect(onCancel).toHaveBeenCalledWith("cancelledByUser", "User cancelled");
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("calls onError for unknown code", () => {
    LinkUI.show(token, onSuccess, onCancel, onError);
    const callback = (EncodeLinkSdk.show as jest.Mock).mock.calls[0][1];
    callback("unknown_code", "Some error");
    expect(onError).toHaveBeenCalledWith("unknown_code", "Some error");
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("does not throw if callbacks are undefined", () => {
    LinkUI.show(token, undefined as any, undefined as any, undefined as any);
    const callback = (EncodeLinkSdk.show as jest.Mock).mock.calls[0][1];
    expect(() => callback("success", "")).not.toThrow();
    expect(() => callback("cancelledByUser", "msg")).not.toThrow();
    expect(() => callback("unknown", "msg")).not.toThrow();
  });
});
