import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Exam } from '../../../models/exam.interface';
import { ExamService } from '../../../services/exam.service';
import { SearchResult } from '../../../models/search-criteria.interface';
import { DashboardFilterComponent } from '../shared/dashboard-filter/dashboard-filter.component';

interface ExamElement {
  type: 'radio' | 'mri' | 'slide' | 'video' | 'macro' | 'pdf' | 'excel' | 'text';
  thumbnail: string;
  name: string;
}

interface SharedUser {
  name: string;
  completion: number;
  status: 'pending' | 'in-progress' | 'not-viewed' | 'completed';
}

interface DetailedExam extends Exam {
  reference: string;
  elements: ExamElement[];
  sharedUsers: SharedUser[];
  showImagesInline: boolean;
}

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardFilterComponent],
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletedComponent implements OnInit {
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
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop'
  ];

  private slideThumbnails = [
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop'
  ];

  private videoThumbnails = [
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop'
  ];

  private macroThumbnails = [
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop'
  ];

  constructor(private examService: ExamService) {}

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
        this.exams = result.data.map(exam => this.enhanceExam(exam));
        this.totalPages = result.totalPages;
        this.totalItems = result.total;
        this.currentPage = result.page;
        this.itemsPerPage = itemsPerPage;
      }
    });
  }

  private enhanceExam(exam: Exam): DetailedExam {
    const elements: ExamElement[] = [];
    const elementCount = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < elementCount; i++) {
      const types: ExamElement['type'][] = ['radio', 'mri', 'slide', 'video', 'macro', 'pdf', 'excel', 'text'];
      const type = types[Math.floor(Math.random() * types.length)];
      
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
      { name: 'Dr. Martin', completion: 100, status: 'completed' },
      { name: 'Dr. Dubois', completion: 100, status: 'completed' },
      { name: 'Dr. Leroy', completion: 100, status: 'completed' }
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

  onItemsPerPageChange(): void {
    this.itemsPerPageSubject.next(this.itemsPerPage);
    this.pageSubject.next(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageSubject.next(page);
    }
  }

  goToFirstPage(): void {
    this.pageSubject.next(1);
  }

  goToLastPage(): void {
    this.pageSubject.next(this.totalPages);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageSubject.next(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageSubject.next(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleImageDisplay(exam: DetailedExam): void {
    exam.showImagesInline = !exam.showImagesInline;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'fas fa-pause';
      case 'in-progress': return 'fas fa-hourglass-half';
      case 'not-viewed': return 'fas fa-times';
      case 'completed': return 'fas fa-check';
      default: return 'fas fa-question';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'not-viewed': return '#ef4444';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
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
}