import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { User } from '../../../models/user.interface';
import { UserService } from '../../../services/user.service';
import { SearchResult } from '../../../models/search-criteria.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject
    ]).subscribe(([query, page]) => {
      this.loadUsers(query, page);
    });

    this.searchSubject.next('');
  }

  private loadUsers(query: string, page: number): void {
    this.userService.search({
      query,
      page,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: SearchResult<User>) => {
        this.users = result.data;
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
    console.log('Opening create user modal...');
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers(this.searchQuery, this.currentPage);
        }
      });
    }
  }
}