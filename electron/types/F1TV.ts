export type F1TV_TokenPayload = {
  ExternalAuthorizationsContextData: string;
  FirstName: string;
  LastName: string;
  SessionId: string;
  SubscribedProduct: "F1 TV Pro Annual" | "F1 TV Pro Monthly" | "F1 TV Access Annual" | "F1 TV Access Monthly";
  SubscriberId: string;
  Subscription: "PRO" | "ACCESS";
  SubscriptionStatus: string;
  exp: 1676150872;
  iat: 1675805280;
  iss: "F1TV";
  jti: string;
};

export interface F1TV_API_PlaybackResponse {
  resultCode: string;
  message: string;
  errorDescription: string;
  resultObj: ContentStream;
  systemTime: number;
}

export interface ContentStream {
  entitlementToken: string;
  url: string;
  streamType: 'DASHWV' | 'HLSFP' | 'DASH';
  drmType: 'widevine' | 'fairplay';
  drmToken?: string;
  laURL: string;
  certUrl?: string;
  channelId: number;
}
