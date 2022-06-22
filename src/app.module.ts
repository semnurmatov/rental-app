import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { FileSystemController } from './file-system/file-system.controller';
import { FileSystemModule } from './file-system/file-system.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ProductModule,
    FileSystemModule,
    ReviewModule,
    AuthModule,
  ],
  controllers: [AppController, FileSystemController, ReviewController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
