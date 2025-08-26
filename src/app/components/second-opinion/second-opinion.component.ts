import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-second-opinion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './second-opinion.component.html',
  styleUrls: ['./second-opinion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondOpinionComponent {
}