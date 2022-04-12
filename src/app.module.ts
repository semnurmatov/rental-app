import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ImageController } from './image/image.controller';
import { ImageModule } from './image/image.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const parsed = new URL(configService.get('JAWSDB_URL'));
        return {
          dialect: 'mysql',
          host: parsed.hostname,
          port: Number(parsed.port),
          username: parsed.username,
          password: parsed.password,
          database: parsed.pathname.replace('/', ''),
          autoLoadModels: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    ImageModule,
    ReviewModule,
    AuthModule,
  ],
  controllers: [AppController, ImageController, ReviewController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
