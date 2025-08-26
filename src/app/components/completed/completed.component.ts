import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from '../shared/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, DashboardFilterComponent],
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletedComponent {
}