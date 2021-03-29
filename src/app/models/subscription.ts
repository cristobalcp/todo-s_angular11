export interface Subscription {
    userId: string;
    subDate: Date;
    endpoint: string;
    expirationTime: number;
    options: {
        applicationServerKey: ArrayBuffer;
        userVisibleOnly: boolean;
    },
}