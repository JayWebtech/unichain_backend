import { BadRequestException, Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUniversityDTO } from './dtos/create-university.dto';
import { ZodValidationPipe } from '../../utils/ZodValidationPipe';
import { registerUniversitySchema } from './schema/register-university.schema';
import { UniversityService } from './university.service';

interface RegisterUniversityResponse {
  message: string;
  data: Omit<CreateUniversityDTO, 'password'> & { id: number };
}

@Controller('university')
export class UniversityController {
    constructor(private readonly universityService: UniversityService) {}

    @Post('register-university')
    @UsePipes(new ZodValidationPipe(registerUniversitySchema))
    async registerUniversity(@Body() signup: CreateUniversityDTO): Promise<RegisterUniversityResponse> {
        try {
            const university = await this.universityService.registerUniversity(signup);
            return {
                message: 'University registered successfully',
                data: university,
            };
        } catch (error) {
            throw new BadRequestException('Registration failed: ' + error.message);
        }
    }
}