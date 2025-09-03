import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
      envFilePath: ['.env.development.local', '.env.development'], // flexible env support
    }),
    HealthModule,
  ],
})
export class AppModule {}
