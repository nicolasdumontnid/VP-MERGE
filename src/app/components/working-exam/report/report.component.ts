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
  
  reportContent = '';
  
  saveReport(): void {
    console.log('Saving report:', this.reportContent);
    // Implement save logic here
  }
  
  generateReport(): void {
    this.reportContent = `Medical Report for ${this.exam?.patientName}

Exam Date: ${this.exam?.examDate}
Exam Type: ${this.exam?.title}
Reference: ${this.exam?.reference}

Findings:
[Enter your findings here]

Conclusion:
[Enter your conclusion here]

Recommendations:
[Enter your recommendations here]`;
  }
}