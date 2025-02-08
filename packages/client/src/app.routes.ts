import { Routes } from '@angular/router';
import { FeedbackComponent } from './app/feedback.component';
import { LayoutComponent } from './app/layout.component';

export const routes: Routes = [
  { path: '', component: FeedbackComponent },
  { path: 'layout', component: LayoutComponent },
];
