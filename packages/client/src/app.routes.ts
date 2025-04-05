import { Routes } from '@angular/router';
import { DisplayOpeningComponent } from './app/components/display-opening.component';
import { SessionsComponent } from './app/components/sessions.component';
import { DeckComponent } from './app/components/deck.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  { path: 'layout', component: DisplayOpeningComponent },
  { path: 'session/:sessionId', component: DisplayOpeningComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'deck', component: DeckComponent },
];
