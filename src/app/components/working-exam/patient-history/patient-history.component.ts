import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedExam } from '../../../../models/detailed-exam.interface';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientHistoryComponent {
  @Input() exam: DetailedExam | null = null;
}