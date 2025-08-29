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
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&auto=format&sat=-100'
  ];

  private slideThumbnails = [
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=100&h=100&fit=crop&auto=format&sat=-100'
  ];

  private videoThumbnails = [
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&auto=format&sat=-100'
  ];

  private macroThumbnails = [
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop&auto=format&sat=-100',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop&auto=format&sat=-100'
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
    // For patient view, we need to load ALL exams to group them properly
    // For exam view, we use normal pagination
    const searchCriteria = {
      query,
      page: 1, // Always load from page 1 to get all data for patient grouping
      pageSize: 1000 // Load a large number to get all exams
    };
    
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
    const elementCount = 20 + Math.floor(Math.random() * 10);
    
    // Determine number of videos (0, 1, or 2 maximum)
    const videoCount = Math.floor(Math.random() * 3); // 0, 1, or 2
    let videosAdded = 0;
    
    for (let i = 0; i < elementCount; i++) {
      let types: ExamElement['type'][] = ['radio', 'mri', 'slide', 'macro', 'pdf', 'excel', 'text'];
      
      // Only add video to possible types if we haven't reached the limit
      if (videosAdded < videoCount) {
        types.push('video');
      }
      
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Track video count
      if (type === 'video') {
        videosAdded++;
      }
      
      let thumbnail = '';
      switch (type) {
        case 'radio':
        case 'mri':
          thumbnail = this.radioThumbnails[Math.floor(Math.random() * this.radioThumbnails.length)];
          break;
        case 'slide':
          thumbnail = this.slideThumbnails[Math.floor(Math.random() * this.slideThumbnails.length)];
          break;
        case 'video':
          thumbnail = this.videoThumbnails[Math.floor(Math.random() * this.videoThumbnails.length)];
          break;
        case 'macro':
          thumbnail = this.macroThumbnails[Math.floor(Math.random() * this.macroThumbnails.length)];
          break;
        case 'pdf':
          thumbnail = 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
          break;
        case 'excel':
          thumbnail = 'https://cdn-icons-png.flaticon.com/512/732/732220.png';
          break;
        case 'text':
          thumbnail = 'https://cdn-icons-png.flaticon.com/512/337/337932.png';
          break;
      }
      
      elements.push({
        type,
        thumbnail,
        name: `${type}_${i + 1}.${type === 'pdf' ? 'pdf' : type === 'excel' ? 'xlsx' : type === 'text' ? 'txt' : 'dcm'}`
      });
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
}