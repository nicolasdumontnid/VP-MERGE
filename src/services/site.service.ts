import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { Site } from '../models/site.interface';
import { SearchCriteria, SearchResult } from '../models/search-criteria.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private sites: Site[] = [];

  constructor(private mockDataService: MockDataService) {
    this.sites = this.mockDataService.generateSites();
  }

  getById(id: string): Observable<Site | null> {
    const site = this.sites.find(s => s.id === id);
    return of(site || null).pipe(delay(200));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<Site>> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let filtered = this.sites;
        
        if (criteria.query) {
          const query = criteria.query.toLowerCase();
          filtered = filtered.filter(site => 
            site.name.toLowerCase().includes(query) ||
            site.city.toLowerCase().includes(query) ||
            site.type.toLowerCase().includes(query)
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

  create(site: Omit<Site, 'id'>): Observable<Site> {
    const newSite: Site = {
      ...site,
      id: 'S' + String(this.sites.length + 1).padStart(3, '0')
    };
    this.sites.push(newSite);
    return of(newSite).pipe(delay(500));
  }

  update(id: string, site: Partial<Site>): Observable<Site> {
    const index = this.sites.findIndex(s => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Site not found'));
    }
    
    this.sites[index] = { ...this.sites[index], ...site };
    return of(this.sites[index]).pipe(delay(500));
  }

  delete(id: string): Observable<boolean> {
    const index = this.sites.findIndex(s => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Site not found'));
    }
    
    this.sites.splice(index, 1);
    return of(true).pipe(delay(500));
  }
}