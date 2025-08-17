import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { startWebsocketConnection } from './app/clients/websocket';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: environment.useHttps ? environment.httpsOptions : undefined,
    cors: true,
  });
  await app.listen(environment.webserverPort);
  console.log(
    `${environment.useHttps ? '[HTTPS]' : '[HTTP]'} Listening on port ${environment.webserverPort}`,
  );
  startWebsocketConnection();
}
bootstrap();
