import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedExam } from '../../../../models/detailed-exam.interface';
import { ExamElement } from '../../../../models/exam-element.interface';
import { SharedUser } from '../../../../models/shared-user.interface';

export type DisplayMode = 'card' | 'row' | 'table';
export type ViewMode = 'exam' | 'patient';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamResultsComponent implements OnInit, OnChanges {
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
  @Output() openExam = new EventEmitter<DetailedExam>();

  displayMode: DisplayMode = 'card';
  viewMode: ViewMode = 'exam';
  isDisplayMenuOpen = false;
  isViewMenuOpen = false;
  expandedPatients = new Set<string>();
  

  // Internal pagination state
  _currentItemsPerPage = 10;
  _currentPage = 1;
  _groupedPatients: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  get groupedByPatient() {
    return this._groupedPatients;
  }
  
  get paginatedGroupedPatients() {
    // For patient view, show all patients (no pagination for now)
    return this._groupedPatients;
  }
  
  get paginatedExams() {
    // For exam view, use the exams directly from server pagination
    return this.exams;
  }
  
  get totalPatientsCount(): number {
    return this._groupedPatients.length;
  }
  
  get totalPagesForCurrentView(): number {
    if (this.viewMode === 'patient') {
      // Show all patients on one page for now
      return 1;
    }
    // Server-side pagination for exams
    return this.totalPages;
  }
  
  get totalItemsForCurrentView(): number {
    if (this.viewMode === 'patient') {
      return this.totalPatientsCount;
    }
    return this.totalItems;
  }
  
  ngOnInit() {
    this._currentItemsPerPage = this.itemsPerPage;
    this._currentPage = this.currentPage;
    this.expandedPatients.clear(); // Reset expanded state
    this.updateData();
  }
  
  ngOnChanges() {
    this._currentItemsPerPage = this.itemsPerPage;
    this._currentPage = this.currentPage;
    this.updateData();
    this.cdr.detectChanges();
  }

  private updateData() {
    // Group patients
    const grouped = new Map<string, DetailedExam[]>();
    this.exams.forEach(exam => {
      const patientKey = exam.patientName;
      if (!grouped.has(patientKey)) {
        grouped.set(patientKey, []);
      }
      grouped.get(patientKey)!.push(exam);
    });
    
    this._groupedPatients = Array.from(grouped.entries()).map(([patientName, exams]) => ({
      patientName,
      exams,
      patientInfo: exams[0],
      isExpanded: this.expandedPatients.has(patientName)
    }));

    this.cdr.detectChanges();
  }

  togglePatientCard(patientName: string): void {
    if (this.expandedPatients.has(patientName)) {
      this.expandedPatients.delete(patientName);
    } else {
      this.expandedPatients.add(patientName);
    }
    // Update the expanded state in the grouped patients
    this._groupedPatients.forEach(patient => {
      if (patient.patientName === patientName) {
        patient.isExpanded = this.expandedPatients.has(patientName);
      }
    });
    this.cdr.detectChanges();
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = parseInt(target.value);
    this._currentItemsPerPage = newValue;
    
    if (this.viewMode === 'patient') {
      // For patient view, reset to page 1 and update locally
      this._currentPage = 1;
      this.cdr.detectChanges();
    } else {
      // For exam view, emit to parent to handle server-side pagination
      this._currentPage = 1;
    }
    
    this.itemsPerPageChange.emit(newValue);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPagesForCurrentView) {
      this._currentPage = page;
      
      if (this.viewMode === 'exam') {
        // For exam view, emit to parent for server-side pagination
        this.pageChange.emit(page);
      } else {
        // For patient view, just update locally
        this.cdr.detectChanges();
      }
    }
  }

  goToFirstPage(): void {
    this._currentPage = 1;
    if (this.viewMode === 'exam') {
      this.pageChange.emit(1);
    } else {
      this.cdr.detectChanges();
    }
  }

  goToLastPage(): void {
    this._currentPage = this.totalPagesForCurrentView;
    if (this.viewMode === 'exam') {
      this.pageChange.emit(this.totalPagesForCurrentView);
    } else {
      this.cdr.detectChanges();
    }
  }

  previousPage(): void {
    if (this._currentPage > 1) {
      this._currentPage = this._currentPage - 1;
      if (this.viewMode === 'exam') {
        this.pageChange.emit(this._currentPage);
      } else {
        this.cdr.detectChanges();
      }
    }
  }

  nextPage(): void {
    if (this._currentPage < this.totalPagesForCurrentView) {
      this._currentPage = this._currentPage + 1;
      if (this.viewMode === 'exam') {
        this.pageChange.emit(this._currentPage);
      } else {
        this.cdr.detectChanges();
      }
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const totalPages = this.totalPagesForCurrentView;
    let start = Math.max(1, this._currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get currentPageForDisplay(): number {
    return this._currentPage;
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

  onOpenExam(exam: DetailedExam): void {
    this.openExam.emit(exam);
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
    this.isViewMenuOpen = false;
  }

  setDisplayMode(mode: DisplayMode): void {
    this.displayMode = mode;
    this.isDisplayMenuOpen = false;
  }

  toggleViewMenu(): void {
    this.isViewMenuOpen = !this.isViewMenuOpen;
    this.isDisplayMenuOpen = false;
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.isViewMenuOpen = false;
    this._currentPage = 1; // Reset to first page when changing view mode
    this.updateData();
  }

  closeViewMenu(): void {
    this.isViewMenuOpen = false;
  }

  closeDisplayMenu(): void {
    this.isDisplayMenuOpen = false;
  }
}