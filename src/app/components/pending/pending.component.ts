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
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardFilterComponent, ExamResultsComponent],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingComponent implements OnInit {
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
    'assets/images/micro/0-thumbnail.jpeg',
    'assets/images/micro/1-thumbnail.jpeg',
    'assets/images/micro/2-thumbnail.jpeg',
    'assets/images/micro/3-thumbnail.jpeg',
    'assets/images/micro/4-thumbnail.jpeg',
    'assets/images/micro/5-thumbnail.jpeg',
    'assets/images/micro/6-thumbnail.jpeg',
    'assets/images/micro/7-thumbnail.jpeg',
    'assets/images/micro/8-thumbnail.jpeg',
    'assets/images/micro/9-thumbnail.jpeg',
    'assets/images/micro/10-thumbnail.jpeg',
    'assets/images/micro/11-thumbnail.jpeg',
    'assets/images/micro/12-thumbnail.jpeg',
    'assets/images/micro/13-thumbnail.jpeg',
    'assets/images/micro/14-thumbnail.jpeg',
    'assets/images/micro/15-thumbnail.jpeg',
    'assets/images/micro/16-thumbnail.jpeg',
    'assets/images/micro/17-thumbnail.jpeg'
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
        console.log('Pending - Loaded exams:', result.data.length, 'Total:', result.total);
        this.exams = result.data.map(exam => this.enhanceExam(exam));
        this.totalPages = result.totalPages;
        this.totalItems = result.total;
        this.currentPage = result.page;
        this.itemsPerPage = itemsPerPage;
        
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
    
    // Determine number of videos (0, 1, or 2 maximum)
    const videoCount = Math.floor(Math.random() * 3); // 0, 1, or 2
    let videosAdded = 0;
    
    for (let i = 0; i < elementCount; i++) {
      let types: ExamElement['type'][];
      
      if (isCytologyExam) {
        // For cytology exams, use mostly cytology elements with some supporting files
        types = ['cytology', 'cytology', 'cytology', 'cytology', 'cytology', 'pdf', 'excel', 'text'];
      } else {
        // For other exams, use standard types
        types = ['radio', 'mri', 'slide', 'macro', 'pdf', 'excel', 'text'];
      }
      
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
        case 'cytology':
          thumbnail = this.microThumbnails[Math.floor(Math.random() * this.microThumbnails.length)];
          break;
        case 'radio':
        case 'mri':
        case 'slide':
        case 'video':
        case 'macro':
        case 'pdf':
        case 'excel':
        case 'text':
          thumbnail = this.radioThumbnails[Math.floor(Math.random() * this.radioThumbnails.length)];
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

  openPatientView(exam: DetailedExam): void {
    // Use global function to open patient view
    if ((window as any).openPatientView) {
      (window as any).openPatientView(exam);
    }
  }
}