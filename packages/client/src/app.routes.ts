import { Routes } from '@angular/router';
import { FeedbackComponent } from './app/components/feedback.component';
import { LayoutComponent } from './app/components/layout.component';

export const routes: Routes = [
  { path: '', component: FeedbackComponent },
  { path: 'layout', component: LayoutComponent },
];
