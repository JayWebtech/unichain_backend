import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { OTP } from './entities/otp.entity';
import { OTPUtil } from 'src/utils/otp.util';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/admin-login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignupAdminDto } from './dto/admin-signup.dto';

@Injectable()
export class AuthService {
    constructor(    
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>,
        private otpUtil: OTPUtil, 
        private jwtService: JwtService
    ){}

    async signupAdmin(signupAdminDto: SignupAdminDto){
        if (signupAdminDto.password !== signupAdminDto.passwordConfirm){
            throw new BadRequestException("Passwords do not match")
        }

        const existingAdmin = await this.adminRepository.findOne({where: {email: signupAdminDto.email}})

        if (existingAdmin){
            throw new BadRequestException("Admin already exists")
        }

        // hash password
        const hashedPassword = await bcrypt.hash(signupAdminDto.password, 10)

        // create new admin
        const admin = this.adminRepository.create({
            email: signupAdminDto.email,
            password: hashedPassword,
        })

        // save admin 
        await this.adminRepository.save(admin);

        // geneare and send otp for signup verificaition
        const otpCode = this.otpUtil.generateOTP();
        const expiresAt = this.otpUtil.getOTPExpiration();
        const otp = this.otpRepository.create({
            code: otpCode,
            expiresAt,
            admin
        })

        await this.otpRepository.save(otp);
        // console.log(`SIGNUP OTP FOR ${admin.email}: ${otpCode} (Expires at: ${expiresAt})`);

        return {
            message: "Admin created successfully. OTP sent to email for verification",
            email: admin.email,
        }
        
        
        
        
        
    }

    async validateAdmin(email:string, password:string){
        const admin =  await this.adminRepository.findOne({where:{email}})

        if (!admin){ 
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
          if (!isPasswordValid){
            throw new UnauthorizedException("Invalid credentials")
          }
        return admin 
    } 


    async loginAdmin(loginAdminDto: LoginAdminDto){ 
        const admin = await this.validateAdmin(loginAdminDto.email, loginAdminDto.password);

        // generate and save otp 
        const otpCode = this.otpUtil.generateOTP();
        const expiresAt= this.otpUtil.getOTPExpiration();

        const otp = this.otpRepository.create({
            code: otpCode,
            expiresAt,
            admin
        })
        await this.otpRepository.save(otp);
                console.log(`LOGIN OTP FOR ${admin.email}: ${otpCode} (Expires at: ${expiresAt})`);

        
        // TODO SEND OTP TO ADMIN EMAIL 
        return {
            message : "OTP sent to your email", 
            email : admin.email, 
        }

        
        
    }
    async verifyOtp (verifyOtpDto: VerifyOtpDto){
        const admin = await this.adminRepository.findOne({
            where: {email: verifyOtpDto.email},
            relations: ['otps'],
        })

        if (!admin){
            throw new UnauthorizedException("Admin not found")
        }

        // find the recent otp
        const otp = await this.otpRepository.findOne({
            where: {
                admin : {id :admin.id},
                isUsed: false,
            },
            order: {
                createdAt: 'DESC',
            },
        })

        if (!otp){
            throw new UnauthorizedException("No active OTP found")
        }
        if (this.otpUtil.isOTPExpired(otp.expiresAt)){
            throw new UnauthorizedException("OTP expired")
        }
        if (otp.code !== verifyOtpDto.otp){
            throw new UnauthorizedException("Invalid OTP")
        }

        // mark otp as used
        otp.isUsed = true;
        await this.otpRepository.save(otp);
        
        if (!admin.isVerified){
            admin.isVerified = true;
            await this.adminRepository.save(admin);
        }

        // generate and sign jwt token
        const payload = {
            email : admin.email,
            sub : admin.id,
            isVerified : admin.isVerified,
        }
        const accessToken = this.jwtService.sign(payload)

        return {
            accessToken,
            email : admin.email,
            isVerified : admin.isVerified,
        }
    }
    

}
