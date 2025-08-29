import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedExam } from '../../../models/detailed-exam.interface';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ReportComponent } from './report/report.component';

@Component({
  selector: 'app-working-exam',
  standalone: true,
  imports: [CommonModule, PatientHistoryComponent, ViewerComponent, ReportComponent],
  templateUrl: './working-exam.component.html',
  styleUrls: ['./working-exam.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkingExamComponent {
  @Input() exam: DetailedExam | null = null;
  @Output() closeExam = new EventEmitter<void>();

  onCloseExam(): void {
    this.closeExam.emit();
  }
}