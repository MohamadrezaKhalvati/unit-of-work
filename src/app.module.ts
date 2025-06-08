import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CoreModule } from './core/core.module'
import { DatabaseModule } from './core/database/database.module'

@Module({
    imports: [CoreModule, DatabaseModule],
    controllers: [AppController],
})
export class AppModule {}
