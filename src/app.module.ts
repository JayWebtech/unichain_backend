import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UniversityModule } from './modules/university/university.module';
import { SupportModule } from './modules/support/support.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { CustomMailerModule } from './mailer/mailer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [appConfig],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    UniversityModule,
    SupportModule,
    CustomMailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
