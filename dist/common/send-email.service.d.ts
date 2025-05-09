import { ConfigService } from '@nestjs/config';
export declare class SendEmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, text: string): Promise<boolean>;
}
