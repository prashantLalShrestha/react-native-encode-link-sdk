#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(EncodeLinkSdk, NSObject)
RCT_EXTERN_METHOD(show:(NSString *)token callback:(RCTResponseSenderBlock)callback)
@end