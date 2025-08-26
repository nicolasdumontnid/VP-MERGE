import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFilterComponent } from '../shared/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-second-opinion',
  standalone: true,
  imports: [CommonModule, DashboardFilterComponent],
  templateUrl: './second-opinion.component.html',
  styleUrls: ['./second-opinion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondOpinionComponent {
}