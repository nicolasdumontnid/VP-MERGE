import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletedComponent {
}