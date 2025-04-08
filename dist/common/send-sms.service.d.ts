import { ConfigService } from '@nestjs/config';
export declare class SendSmsService {
    private readonly configService;
    private readonly apiUrl;
    private readonly apiToken;
    private readonly apiUsername;
    private readonly sender;
    constructor(configService: ConfigService);
    sendSms(to: string, message: string): Promise<boolean>;
}
