import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { SearchCriteria, SearchResult } from '../models/search-criteria.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor(private mockDataService: MockDataService) {
    this.users = this.mockDataService.generateUsers();
  }

  getById(id: string): Observable<User | null> {
    const user = this.users.find(u => u.id === id);
    return of(user || null).pipe(delay(200));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<User>> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let filtered = this.users;
        
        if (criteria.query) {
          const query = criteria.query.toLowerCase();
          filtered = filtered.filter(user => 
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.specialty.toLowerCase().includes(query) ||
            user.site.toLowerCase().includes(query)
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

  create(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: 'U' + String(this.users.length + 1).padStart(3, '0')
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  update(id: string, user: Partial<User>): Observable<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    this.users[index] = { ...this.users[index], ...user };
    return of(this.users[index]).pipe(delay(500));
  }

  delete(id: string): Observable<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    this.users.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  getCurrentUser(): Observable<User> {
    return this.getById('U001').pipe(
      map(user => user!)
    );
  }
}