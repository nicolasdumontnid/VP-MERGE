import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Exam } from '../../../models/exam.interface';
import { ExamService } from '../../../services/exam.service';
import { SearchResult } from '../../../models/search-criteria.interface';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  searchQuery = '';
  selectedStatus = '';
  selectedDiagnosis = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  private searchSubject = new BehaviorSubject<string>('');
  private filtersSubject = new BehaviorSubject<any>({});
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.filtersSubject,
      this.pageSubject
    ]).subscribe(([query, filters, page]) => {
      this.loadExams(query, filters, page);
    });

    this.searchSubject.next('');
  }

  private loadExams(query: string, filters: any, page: number): void {
    this.examService.search({
      query,
      page,
      pageSize: this.pageSize,
      filters
    }).subscribe({
      next: (result: SearchResult<Exam>) => {
        this.exams = result.data;
        this.totalPages = result.totalPages;
        this.currentPage = result.page;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
    this.pageSubject.next(1);
  }

  onFilterChange(): void {
    const filters: any = {};
    if (this.selectedStatus) filters['status'] = this.selectedStatus;
    if (this.selectedDiagnosis) filters['diagnosis'] = this.selectedDiagnosis;
    
    this.filtersSubject.next(filters);
    this.pageSubject.next(1);
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

  openCreateModal(): void {
    console.log('Opening create exam modal...');
  }

  viewExam(exam: Exam): void {
    console.log('Viewing exam:', exam);
  }

  editExam(exam: Exam): void {
    console.log('Editing exam:', exam);
  }

  deleteExam(id: string): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.delete(id).subscribe({
        next: () => {
          this.loadExams(this.searchQuery, this.filtersSubject.value, this.currentPage);
        }
      });
    }
  }
}