import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SocketIoModule } from 'ngx-socket-io';
import { provideHttpClient } from '@angular/common/http';
import { CoreComponent } from './app/components/core.component';

const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot({ url: `${window.location.protocol}//${window.location.hostname}:3000` })),
    provideHttpClient(),
  ],
};

if(window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
  alert('Vous devez utiliser le protocole HTTPS pour accéder à cette application en dehors de localhost');
}

bootstrapApplication(CoreComponent, appConfig)
  .catch((err) => console.error(err));
