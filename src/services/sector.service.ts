import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { Sector } from '../models/sector.interface';
import { SearchCriteria, SearchResult } from '../models/search-criteria.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private sectors: Sector[] = [];

  constructor(private mockDataService: MockDataService) {
    this.sectors = this.mockDataService.generateSectors();
  }

  getById(id: string): Observable<Sector | null> {
    const sector = this.sectors.find(s => s.id === id);
    return of(sector || null).pipe(delay(200));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<Sector>> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let filtered = this.sectors;
        
        if (criteria.query) {
          const query = criteria.query.toLowerCase();
          filtered = filtered.filter(sector => 
            sector.name.toLowerCase().includes(query) ||
            sector.siteName.toLowerCase().includes(query) ||
            sector.description.toLowerCase().includes(query)
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

  create(sector: Omit<Sector, 'id'>): Observable<Sector> {
    const newSector: Sector = {
      ...sector,
      id: 'SEC' + String(this.sectors.length + 1).padStart(3, '0')
    };
    this.sectors.push(newSector);
    return of(newSector).pipe(delay(500));
  }

  update(id: string, sector: Partial<Sector>): Observable<Sector> {
    const index = this.sectors.findIndex(s => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Sector not found'));
    }
    
    this.sectors[index] = { ...this.sectors[index], ...sector };
    return of(this.sectors[index]).pipe(delay(500));
  }

  delete(id: string): Observable<boolean> {
    const index = this.sectors.findIndex(s => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Sector not found'));
    }
    
    this.sectors.splice(index, 1);
    return of(true).pipe(delay(500));
  }
}