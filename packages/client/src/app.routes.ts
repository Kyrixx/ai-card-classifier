import { Routes } from '@angular/router';
import { DisplayOpeningComponent } from './app/components/display-opening.component';
import { SessionsComponent } from './app/components/sessions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'layout', pathMatch: 'full' },
  { path: 'layout', component: DisplayOpeningComponent },
  { path: 'sessions', component: SessionsComponent },
];
