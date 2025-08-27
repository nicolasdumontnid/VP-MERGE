import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedExam } from '../../../models/detailed-exam.interface';
import { ExamElement } from '../../../models/exam-element.interface';
import { SharedUser } from '../../../models/shared-user.interface';

export type DisplayMode = 'card' | 'row' | 'table';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamResultsComponent {
  @Input() exams: DetailedExam[] = [];
  @Input() currentPage = 1;
  @Input() itemsPerPage = 10;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() itemsPerPageOptions = [5, 10, 15, 20];
  @Input() pageType: 'inbox' | 'pending' | 'second-opinion' | 'completed' = 'inbox';
  @Input() noResultsIcon = 'fas fa-inbox';
  @Input() noResultsTitle = 'No exams found';
  @Input() noResultsMessage = 'No exams match your current filters.';

  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() addLabel = new EventEmitter<DetailedExam>();
  @Output() assignUser = new EventEmitter<DetailedExam>();
  @Output() shareExam = new EventEmitter<DetailedExam>();
  @Output() moveToWorklist = new EventEmitter<DetailedExam>();
  @Output() pauseExam = new EventEmitter<DetailedExam>();

  displayMode: DisplayMode = 'card';
  isDisplayMenuOpen = false;

  onItemsPerPageChange(event: Event): void {
    const newValue = parseInt((event.target as HTMLSelectElement).value || this.itemsPerPage.toString());
    this.itemsPerPage = newValue;
    this.itemsPerPageChange.emit(newValue);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  goToFirstPage(): void {
    this.pageChange.emit(1);
  }

  goToLastPage(): void {
    this.pageChange.emit(this.totalPages);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
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

  onAddLabel(exam: DetailedExam): void {
    this.addLabel.emit(exam);
  }

  onAssignUser(exam: DetailedExam): void {
    this.assignUser.emit(exam);
  }

  onShareExam(exam: DetailedExam): void {
    this.shareExam.emit(exam);
  }

  onMoveToWorklist(exam: DetailedExam): void {
    this.moveToWorklist.emit(exam);
  }

  onPauseExam(exam: DetailedExam): void {
    this.pauseExam.emit(exam);
  }

  getPageTypeClass(): string {
    return `${this.pageType}-container`;
  }

  getActiveBtnClass(): string {
    switch (this.pageType) {
      case 'pending': return 'active-pending';
      case 'second-opinion': return 'active-second-opinion';
      case 'completed': return 'active-completed';
      default: return 'active-inbox';
    }
  }

  getBorderClass(): string {
    switch (this.pageType) {
      case 'pending': return 'border-pending';
      case 'second-opinion': return 'border-second-opinion';
      case 'completed': return 'border-completed';
      default: return 'border-inbox';
    }
  }

  showUnassignedBadge(): boolean {
    return this.pageType === 'second-opinion';
  }

  showCompletedBadge(): boolean {
    return this.pageType === 'completed';
  }

  showConclusion(): boolean {
    return this.pageType === 'completed';
  }

  getActionButtonClass(isViewBtn: boolean = false): string {
    if (isViewBtn && this.pageType === 'completed') {
      return 'action-btn view-btn';
    }
    if (this.pageType === 'second-opinion') {
      return 'action-btn primary';
    }
    return 'action-btn';
  }

  toggleDisplayMenu(): void {
    this.isDisplayMenuOpen = !this.isDisplayMenuOpen;
  }

  setDisplayMode(mode: DisplayMode): void {
    this.displayMode = mode;
    this.isDisplayMenuOpen = false;
  }

  closeDisplayMenu(): void {
    this.isDisplayMenuOpen = false;
  }
}