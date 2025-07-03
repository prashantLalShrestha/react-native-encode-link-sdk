import Foundation
import LinkKit

/*
This module acts as a bridge between the Enode LinkUI SDK and React Native.
See https://developers.enode.com/docs/link-ui and https://developers.enode.com/docs/link-sdks/react-native for additional reference.
*/
@objc(EncodeLinkSdk)
class EncodeLinkSdkModule: NSObject {
  private var handler: Handler?

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func show(_ token: String, callback: @escaping RCTResponseSenderBlock) {
    let vc = RCTPresentedViewController()
    self.handler = Handler(linkToken: token) { (code: LinkResultCode, errMsg: String?) in
      callback([ code.rawValue, errMsg as Any ])
    }

    self.handler?.present(from: vc!)
  }
}
