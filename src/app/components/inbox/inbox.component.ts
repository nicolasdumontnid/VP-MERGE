import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Exam } from '../../../models/exam.interface';
import { ExamService } from '../../../services/exam.service';
import { SearchResult } from '../../../models/search-criteria.interface';
import { DashboardFilterComponent } from '../shared/dashboard-filter/dashboard-filter.component';
import { ExamResultsComponent } from '../shared/exam-results/exam-results.component';
import { DetailedExam } from '../../../models/detailed-exam.interface';
import { ExamElement } from '../../../models/exam-element.interface';
import { SharedUser } from '../../../models/shared-user.interface';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardFilterComponent, ExamResultsComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent implements OnInit {
  exams: DetailedExam[] = [];
  allExams: DetailedExam[] = []; // Store all exams for patient view
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;
  itemsPerPageOptions = [5, 10, 15, 20];
  
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);
  private itemsPerPageSubject = new BehaviorSubject<number>(10);

  // Sample thumbnails for different types
  private radioThumbnails = [
    'assets/images/radio/0-thumbnail.jpeg',
    'assets/images/radio/1-thumbnail.jpeg',
    'assets/images/radio/2-thumbnail.jpeg',
    'assets/images/radio/3-thumbnail.jpeg',
    'assets/images/radio/4-thumbnail.jpeg',
    'assets/images/radio/5thumbnail.jpeg',
    'assets/images/radio/7-thumbnail.jpeg',
    'assets/images/radio/8-thumbnail.jpeg',
    'assets/images/radio/9-thumbnail.jpeg',
    'assets/images/radio/11thumbnail.jpeg',
    'assets/images/radio/1thumbnail.jpeg',
    'assets/images/radio/0thumbnail.jpeg',
    'assets/images/radio/2thumbnail.jpeg',
    'assets/images/radio/3thumbnail.jpeg',
    'assets/images/radio/4thumbnail.jpeg',
    'assets/images/radio/8thumbnail.jpeg',
    'assets/images/radio/9thumbnail.jpeg',
    'assets/images/radio/99thumbnail.jpeg'
  ];

  private microThumbnails = [
    'assets/images/micro/micro-0-thumbnail.jpeg',
    'assets/images/micro/micro-1-thumbnail.jpeg',
    'assets/images/micro/thumbnail.jpeg',
    'assets/images/micro/thumbnail (1).jpeg',
    'assets/images/micro/thumbnail (2).jpeg',
    'assets/images/micro/thumbnail (3).jpeg',
    'assets/images/micro/thumbnail (4).jpeg',
    'assets/images/micro/thumbnail (5).jpeg',
    'assets/images/micro/thumbnail (6).jpeg',
    'assets/images/micro/thumbnail (7).jpeg',
    'assets/images/micro/thumbnail (8).jpeg',
    'assets/images/micro/thumbnail (9).jpeg',
    'assets/images/micro/thumbnail (10).jpeg',
    'assets/images/micro/thumbnail (11).jpeg',
    'assets/images/micro/thumbnail (12).jpeg',
    'assets/images/micro/thumbnail (13).jpeg',
    'assets/images/micro/thumbnail (14).jpeg',
    'assets/images/micro/thumbnail (15).jpeg'
  ];

  constructor(
    private examService: ExamService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject,
      this.itemsPerPageSubject
    ]).subscribe(([query, page, itemsPerPage]) => {
      this.loadExams(query, page, itemsPerPage);
    });

    this.searchSubject.next('');
  }

  private loadExams(query: string, page: number, itemsPerPage: number): void {
    this.examService.search({
      query,
      page,
      pageSize: itemsPerPage
    }).subscribe({
      next: (result: SearchResult<Exam>) => {
        console.log('Loaded exams:', result.data.length, 'Total:', result.total);
        this.exams = result.data.map(exam => this.enhanceExam(exam));
        this.totalPages = result.totalPages;
        this.totalItems = result.total;
        this.currentPage = result.page;
        this.itemsPerPage = itemsPerPage;
        console.log('Enhanced exams:', this.exams.length);
        console.log('Total pages:', this.totalPages, 'Current page:', this.currentPage);
        
        // Force change detection
        this.cdr.detectChanges();
      }
    });
  }

  private enhanceExam(exam: Exam): DetailedExam {
    const elements: ExamElement[] = [];
    
    // Determine if this is a cytology exam
    const isCytologyExam = exam.sectorName === 'Cytology' || exam.title.toLowerCase().includes('cytologie');
    const elementCount = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < elementCount; i++) {
      if (isCytologyExam) {
        // For cytology exams, use ONLY cytology elements
        elements.push({
          type: 'cytology',
          thumbnail: this.microThumbnails[Math.floor(Math.random() * this.microThumbnails.length)],
          name: `cytology_${i + 1}.dcm`
        });
      } else {
        // For radiological exams, use ONLY radiological elements
        const types: ExamElement['type'][] = ['radio', 'mri', 'slide', 'video', 'macro'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        elements.push({
          type,
          thumbnail = this.radioThumbnails[Math.floor(Math.random() * this.radioThumbnails.length)];
          name: `${type}_${i + 1}.dcm`
        });
      }
    }

    const allSharedUsers: SharedUser[] = [
      { name: 'Dr. Martin', completion: Math.floor(Math.random() * 100), status: 'in-progress' },
      { name: 'Dr. Dubois', completion: Math.floor(Math.random() * 100), status: 'completed' },
      { name: 'Dr. Leroy', completion: Math.floor(Math.random() * 100), status: 'pending' }
    ];
    const sharedUsers = allSharedUsers.slice(0, Math.floor(Math.random() * 4));

    return {
      ...exam,
      reference: this.generateReference(),
      elements,
      sharedUsers,
      showImagesInline: true
    };
  }

  private generateReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage = newItemsPerPage;
    this.itemsPerPageSubject.next(newItemsPerPage);
    this.pageSubject.next(1);
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  addLabel(exam: DetailedExam): void {
    console.log('Add label to exam:', exam.id);
  }

  assignUser(exam: DetailedExam): void {
    console.log('Assign user to exam:', exam.id);
  }

  shareExam(exam: DetailedExam): void {
    console.log('Share exam:', exam.id);
  }

  moveToWorklist(exam: DetailedExam): void {
    console.log('Move exam to worklist:', exam.id);
  }

  pauseExam(exam: DetailedExam): void {
    console.log('Pause exam:', exam.id);
  }

  openExam(exam: DetailedExam): void {
    // Use global function to open working exam
    if ((window as any).openWorkingExam) {
      (window as any).openWorkingExam(exam);
    }
  }

  openPatientView(exam: DetailedExam): void {
    // Use global function to open patient view
    if ((window as any).openPatientView) {
      (window as any).openPatientView(exam);
    }
  }

  loadAllDataForPatientView(): void {
    console.log('Loading all data for patient view...');
    this.examService.search({
      query: this.searchQuery,
      page: 1,
      pageSize: 1000 // Load all exams
    }).subscribe({
      next: (result: SearchResult<Exam>) => {
        console.log('Loaded ALL exams for patient view:', result.data.length);
        this.exams = result.data.map(exam => this.enhanceExam(exam));
        this.cdr.detectChanges();
      }
    });
  }
}