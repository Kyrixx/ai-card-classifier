import { Routes } from '@angular/router';
import { DisplayOpeningComponent } from './app/components/display-opening.component';

export const routes: Routes = [
  { path: '', redirectTo: 'layout', pathMatch: 'full' },
  { path: 'layout', component: DisplayOpeningComponent },
];
