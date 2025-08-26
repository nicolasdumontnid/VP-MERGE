import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, map, combineLatest } from 'rxjs';
import { PatientService } from '../../../services/patient.service';
import { ExamService } from '../../../services/exam.service';
import { ConversationService } from '../../../services/conversation.service';
import { Exam } from '../../../models/exam.interface';
import { Conversation } from '../../../models/conversation.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  totalPatients = 0;
  totalExams = 0;
  unreadConversations = 0;
  todaysExams = 0;
  recentExams: Exam[] = [];
  recentConversations: Conversation[] = [];

  constructor(
    private patientService: PatientService,
    private examService: ExamService,
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const patients$ = this.patientService.search({ query: '', page: 1, pageSize: 100 });
    const exams$ = this.examService.search({ query: '', page: 1, pageSize: 100 });
    const conversations$ = this.conversationService.search({ query: '', page: 1, pageSize: 100 });

    combineLatest([patients$, exams$, conversations$]).subscribe({
      next: ([patientsResult, examsResult, conversationsResult]) => {
        this.totalPatients = patientsResult.total;
        this.totalExams = examsResult.total;
        this.unreadConversations = conversationsResult.data.filter(c => c.isUnread).length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.todaysExams = examsResult.data.filter(exam => {
          const examDate = new Date(exam.examDate);
          examDate.setHours(0, 0, 0, 0);
          return examDate.getTime() === today.getTime();
        }).length;
        
        this.recentExams = examsResult.data
          .sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())
          .slice(0, 5);
        
        this.recentConversations = conversationsResult.data
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, 5);
      }
    });
  }
}