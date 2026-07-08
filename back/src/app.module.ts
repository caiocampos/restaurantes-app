import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { moduleList } from './modules-expose';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...moduleList],
})
export class AppModule {}
