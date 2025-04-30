import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UniversityModule } from './modules/university/university.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { VerificationLogsModule } from './modules/verification-logs/verification-logs.module'; // <-- New import

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [appConfig],
    }),
    DatabaseModule, // Existing database config
    UsersModule,    // Existing modules
    AuthModule,
    UniversityModule,
    VerificationLogsModule, // New module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}