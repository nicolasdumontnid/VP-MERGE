import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Patient } from '../../../models/patient.interface';
import { PatientService } from '../../../services/patient.service';
import { SearchResult } from '../../../models/search-criteria.interface';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject
    ]).subscribe(([query, page]) => {
      this.loadPatients(query, page);
    });

    this.searchSubject.next('');
  }

  private loadPatients(query: string, page: number): void {
    this.patientService.search({
      query,
      page,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: SearchResult<Patient>) => {
        this.patients = result.data;
        this.totalPages = result.totalPages;
        this.currentPage = result.page;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
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
    // TODO: Implement patient creation modal
    console.log('Opening create patient modal...');
  }

  editPatient(patient: Patient): void {
    // TODO: Implement patient editing
    console.log('Editing patient:', patient);
  }

  deletePatient(id: string): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.delete(id).subscribe({
        next: () => {
          this.loadPatients(this.searchQuery, this.currentPage);
        }
      });
    }
  }
}