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