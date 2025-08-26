import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from '../shared/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, DashboardFilterComponent],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingComponent {
}