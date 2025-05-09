import { SendSmsService } from '../common/send-sms.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
export declare class OtpService {
    private readonly sendSmsService;
    private readonly configService;
    private userRepo;
    constructor(sendSmsService: SendSmsService, configService: ConfigService, userRepo: Repository<User>);
    generateOtp(): string;
    saveOtp(phoneNumber: string, otp: string): Promise<void>;
    verifyOtp(numeroTelephone: string, otp_code: string): Promise<boolean>;
    sendOtp(phoneNumber: string): Promise<void>;
}
