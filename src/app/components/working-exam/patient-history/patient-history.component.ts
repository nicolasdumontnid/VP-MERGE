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

  // Mock previous exams for demonstration
  previousExams = [
    {
      date: new Date('2024-12-15'),
      title: 'CT Scan - Chest',
      reference: 'CT240001',
      diagnosis: 'Normal'
    },
    {
      date: new Date('2024-11-20'),
      title: 'X-Ray - Chest',
      reference: 'XR240045',
      diagnosis: 'Pneumonia'
    },
    {
      date: new Date('2024-10-10'),
      title: 'MRI - Brain',
      reference: 'MR240023',
      diagnosis: 'Normal'
    }
  ];
}