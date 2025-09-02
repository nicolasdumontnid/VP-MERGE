import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { PendingComponent } from './components/pending/pending.component';
import { SecondOpinionComponent } from './components/second-opinion/second-opinion.component';
import { CompletedComponent } from './components/completed/completed.component';
import { PatientsComponent } from './components/patients/patients.component';
import { ExamsComponent } from './components/exams/exams.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { UsersComponent } from './components/users/users.component';
import { SitesComponent } from './components/sites/sites.component';
import { SectorsComponent } from './components/sectors/sectors.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'second-opinion', component: SecondOpinionComponent },
  { path: 'completed', component: CompletedComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'worklists', component: DashboardComponent }, // Placeholder
  { path: 'labels', component: DashboardComponent }, // Placeholder
  { path: 'templates', component: DashboardComponent }, // Placeholder
  { path: 'patients', component: PatientsComponent },
  { path: 'conversations', component: ConversationsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'sites', component: SitesComponent },
  { path: 'sectors', component: SectorsComponent },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];