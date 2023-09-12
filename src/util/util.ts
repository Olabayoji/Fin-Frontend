export const BASE_URL = 'https://web-production-ef0b6.up.railway.app'

export interface IOHLCData {
    readonly close: number;
    readonly date: Date;
    readonly high: number;
    readonly low: number;
    readonly open: number;
    readonly volume: number;
}