import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SocketIoModule } from 'ngx-socket-io';
import { provideHttpClient } from '@angular/common/http';
import { CoreComponent } from './app/components/core.component';
import { appConfig } from './app.config';

const booststrapConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot({ url: `${appConfig.webSocket.protocol}//${appConfig.webSocket.baseUrl}:${appConfig.webSocket.port}` })),
    provideHttpClient(),
  ],
};

if(window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
  alert('Vous devez utiliser le protocole HTTPS pour accéder à cette application en dehors de localhost');
}

bootstrapApplication(CoreComponent, booststrapConfig)
  .catch((err) => console.error(err));
