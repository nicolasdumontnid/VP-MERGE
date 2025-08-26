import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from '../shared/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, DashboardFilterComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent {
}