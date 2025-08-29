import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { Exam } from '../models/exam.interface';
import { SearchCriteria, SearchResult } from '../models/search-criteria.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private exams: Exam[] = [];

  constructor(private mockDataService: MockDataService) {
    this.exams = this.mockDataService.generateExams();
  }

  getById(id: string): Observable<Exam | null> {
    const exam = this.exams.find(e => e.id === id);
    return of(exam || null).pipe(delay(200));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<Exam>> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let filtered = this.exams;
        console.log('ExamService - Total exams before filtering:', this.exams.length);
        
        if (criteria.query) {
          const query = criteria.query.toLowerCase();
          filtered = filtered.filter(exam => 
            exam.title.toLowerCase().includes(query) ||
            exam.patientName.toLowerCase().includes(query) ||
            exam.anatomicalRegion.toLowerCase().includes(query) ||
            exam.department.toLowerCase().includes(query) ||
            exam.diagnosis.toLowerCase().includes(query) ||
            exam.siteName.toLowerCase().includes(query) ||
            exam.sectorName.toLowerCase().includes(query)
          );
        }

        if (criteria.filters) {
          if (criteria.filters['status']) {
            filtered = filtered.filter(exam => exam.status === criteria.filters!['status']);
          }
          if (criteria.filters['diagnosis']) {
            filtered = filtered.filter(exam => exam.diagnosis === criteria.filters!['diagnosis']);
          }
          if (criteria.filters['siteId']) {
            filtered = filtered.filter(exam => exam.siteId === criteria.filters!['siteId']);
          }
        }
        
        console.log('ExamService - Filtered exams:', filtered.length);
        console.log('ExamService - Page:', criteria.page, 'PageSize:', criteria.pageSize);
        
        const startIndex = (criteria.page - 1) * criteria.pageSize;
        const endIndex = startIndex + criteria.pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);
        
        console.log('ExamService - Paginated data:', paginatedData.length, 'StartIndex:', startIndex, 'EndIndex:', endIndex);
        
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

  create(exam: Omit<Exam, 'id'>): Observable<Exam> {
    const newExam: Exam = {
      ...exam,
      id: 'E' + String(this.exams.length + 1).padStart(3, '0')
    };
    this.exams.push(newExam);
    return of(newExam).pipe(delay(500));
  }

  update(id: string, exam: Partial<Exam>): Observable<Exam> {
    const index = this.exams.findIndex(e => e.id === id);
    if (index === -1) {
      return throwError(() => new Error('Exam not found'));
    }
    
    this.exams[index] = { ...this.exams[index], ...exam };
    return of(this.exams[index]).pipe(delay(500));
  }

  delete(id: string): Observable<boolean> {
    const index = this.exams.findIndex(e => e.id === id);
    if (index === -1) {
      return throwError(() => new Error('Exam not found'));
    }
    
    this.exams.splice(index, 1);
    return of(true).pipe(delay(500));
  }
}