#import <Cordova/CDV.h>

@interface cordovaNetworkManager : CDVPlugin 

// Main functions
- (void)iOSConnectNetwork:(CDVInvokedUrlCommand *)command;
- (void)iOSDisconnectNetwork:(CDVInvokedUrlCommand *)command;
- (void)getCurrentSSID:(CDVInvokedUrlCommand*)command;
- (void)getConnectedBSSID:(CDVInvokedUrlCommand*)command;

// Android Functions
- (void)addNetwork:(CDVInvokedUrlCommand*)command;
- (void)removeNetwork:(CDVInvokedUrlCommand*)command;
- (void)androidConnectNetwork:(CDVInvokedUrlCommand*)command;
- (void)androidDisconnectNetwork:(CDVInvokedUrlCommand*)command;
- (void)listNetworks:(CDVInvokedUrlCommand*)command;
- (void)getScanResults:(CDVInvokedUrlCommand*)command;
- (void)startScan:(CDVInvokedUrlCommand*)command;
- (void)disconnect:(CDVInvokedUrlCommand*)command;
- (void)isWifiEnabled:(CDVInvokedUrlCommand*)command;
- (void)setWifiEnabled:(CDVInvokedUrlCommand*)command;

@end
