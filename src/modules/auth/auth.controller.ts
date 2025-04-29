import { Controller,Post ,Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/admin-login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignupAdminDto } from './dto/admin-signup.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post("admin/signup")
    async signupAdmin(@Body() signupAdminDto: SignupAdminDto){
        return this.authService.signupAdmin(signupAdminDto);
    }

    @Post('admin/login')
    async loginAdmin(@Body() loginAdminDto: LoginAdminDto){
        return this.authService.loginAdmin(loginAdminDto);
    }

    @Post('admin/verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto){
        return this.authService.verifyOtp(verifyOtpDto);
    }
}
