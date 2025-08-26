import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { Patient } from '../models/patient.interface';
import { SearchCriteria, SearchResult } from '../models/search-criteria.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: Patient[] = [];

  constructor(private mockDataService: MockDataService) {
    this.patients = this.mockDataService.generatePatients();
  }

  getById(id: string): Observable<Patient | null> {
    const patient = this.patients.find(p => p.id === id);
    return of(patient || null).pipe(delay(200));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<Patient>> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let filtered = this.patients;
        
        if (criteria.query) {
          const query = criteria.query.toLowerCase();
          filtered = filtered.filter(patient => 
            patient.firstName.toLowerCase().includes(query) ||
            patient.lastName.toLowerCase().includes(query) ||
            patient.email.toLowerCase().includes(query) ||
            patient.phone.includes(query) ||
            patient.socialSecurityNumber.includes(query)
          );
        }
        
        const startIndex = (criteria.page - 1) * criteria.pageSize;
        const endIndex = startIndex + criteria.pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);
        
        return {
          data: paginatedData,
          total: filtered.length,
          page: criteria.page,
          pageSize: criteria.pageSize,
          totalPages: Math.ceil(filtered.length / criteria.pageSize)
        };
      })
    );
  }

  create(patient: Omit<Patient, 'id' | 'createdAt'>): Observable<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: 'P' + String(this.patients.length + 1).padStart(3, '0'),
      createdAt: new Date()
    };
    this.patients.push(newPatient);
    return of(newPatient).pipe(delay(500));
  }

  update(id: string, patient: Partial<Patient>): Observable<Patient> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Patient not found'));
    }
    
    this.patients[index] = { ...this.patients[index], ...patient };
    return of(this.patients[index]).pipe(delay(500));
  }

  delete(id: string): Observable<boolean> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Patient not found'));
    }
    
    this.patients.splice(index, 1);
    return of(true).pipe(delay(500));
  }
}