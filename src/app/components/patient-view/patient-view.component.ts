import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedExam } from '@models/detailed-exam.interface';
import { PatientHistoryComponent } from '../working-exam/patient-history/patient-history.component';

@Component({
  selector: 'app-patient-view',
  standalone: true,
  imports: [CommonModule, PatientHistoryComponent],
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientViewComponent {
  @Input() exam: DetailedExam | null = null;
  @Output() closePatientView = new EventEmitter<void>();

  onClosePatientView(): void {
    this.closePatientView.emit();
  }
}