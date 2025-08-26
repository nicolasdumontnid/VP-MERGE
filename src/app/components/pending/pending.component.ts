import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingComponent {
}