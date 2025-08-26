import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent {
}