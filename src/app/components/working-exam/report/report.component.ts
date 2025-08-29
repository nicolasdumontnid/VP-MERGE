import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedExam } from '../../../../models/detailed-exam.interface';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent {
  @Input() exam: DetailedExam | null = null;

  // Report form data
  reportData = {
    findings: '',
    impression: '',
    recommendation: '',
    conclusion: '',
    additionalNotes: ''
  };

  // Report status
  isDraft = true;
  lastSaved = new Date();

  saveReport(): void {
    this.lastSaved = new Date();
    this.isDraft = false;
    console.log('Report saved:', this.reportData);
  }

  saveDraft(): void {
    this.lastSaved = new Date();
    this.isDraft = true;
    console.log('Draft saved:', this.reportData);
  }

  finalizeReport(): void {
    if (this.isReportComplete()) {
      this.isDraft = false;
      console.log('Report finalized:', this.reportData);
    }
  }

  isReportComplete(): boolean {
    return !!(this.reportData.findings && this.reportData.impression && this.reportData.conclusion);
  }
}