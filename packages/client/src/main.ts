import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SocketIoModule } from 'ngx-socket-io';
import { provideHttpClient } from '@angular/common/http';
import { CoreComponent } from './app/core.component';

const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot({ url: 'http://localhost:3000' })),
    provideHttpClient(),
  ],
};


bootstrapApplication(CoreComponent, appConfig)
  .catch((err) => console.error(err));
