import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Site } from '../../../models/site.interface';
import { SiteService } from '../../../services/site.service';
import { SearchResult } from '../../../models/search-criteria.interface';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitesComponent implements OnInit {
  sites: Site[] = [];
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject
    ]).subscribe(([query, page]) => {
      this.loadSites(query, page);
    });

    this.searchSubject.next('');
  }

  private loadSites(query: string, page: number): void {
    this.siteService.search({
      query,
      page,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: SearchResult<Site>) => {
        this.sites = result.data;
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
    console.log('Opening create site modal...');
  }

  editSite(site: Site): void {
    console.log('Editing site:', site);
  }

  deleteSite(id: string): void {
    if (confirm('Are you sure you want to delete this site?')) {
      this.siteService.delete(id).subscribe({
        next: () => {
          this.loadSites(this.searchQuery, this.currentPage);
        }
      });
    }
  }
}