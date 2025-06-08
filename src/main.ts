// src/main.ts
import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import { ServerResponse } from 'http'
import * as path from 'path'

import { AppModule } from './app.module'
import { TransformInterceptor } from './core/interceptors/transform.interceptor'
import { ValidationPipe } from './core/pipes'
import { CustomLogger } from './core/utils/custom-logger'

function enableGlobalValidations(app: INestApplication) {
    app.useGlobalInterceptors(new TransformInterceptor())
    app.useGlobalPipes(new ValidationPipe())
    app.enableCors({
        origin: '*',
    })
}

async function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('API for demonstrating Unit of Work and core concepts')
        .setDescription(`API for demonstrating Unit of Work and core concepts`)
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .setExternalDoc('Postman Collection', path.join(__dirname, 'docs-json'))
        .build()

    const metadata_ts = './metadata'
    if (fs.existsSync(path.join(__dirname, 'metadata.js'))) {
        const metadata = await import(metadata_ts)
        await SwaggerModule.loadPluginMetadata(metadata.default)
    }

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    })

    app.use('/api-doc', (_, res: ServerResponse) =>
        res.end(JSON.stringify(document)),
    )
}
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new CustomLogger(),
    })

    const logger = new Logger('Bootstrap')

    enableGlobalValidations(app)
    setupSwagger(app)

    await app.listen(process.env.APP_PORT ?? 3000)
    logger.log(`Application is running on port: ${process.env.APP_PORT}`)
}
bootstrap()
