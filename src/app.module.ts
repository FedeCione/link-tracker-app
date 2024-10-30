import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LinkModule } from 'src/modules/links/links.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LinkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
