export type F1TV_TokenPayload = {
  ExternalAuthorizationsContextData: string;
  FirstName: string;
  LastName: string;
  SessionId: string;
  SubscribedProduct: "F1 TV Pro Annual" | "F1 TV Pro Monthly" | "F1 TV Acess Annual" | "F1 TV Acess Monthly";
  SubscriberId: string;
  Subscription: "PRO" | 'ACCESS';
  SubscriptionStatus: string;
  exp: 1676150872;
  iat: 1675805280;
  iss: "F1TV";
  jti: string;
};
