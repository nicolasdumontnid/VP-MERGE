import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Sector } from '../../../models/sector.interface';
import { SectorService } from '../../../services/sector.service';
import { SearchResult } from '../../../models/search-criteria.interface';

@Component({
  selector: 'app-sectors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectorsComponent implements OnInit {
  sectors: Sector[] = [];
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(private sectorService: SectorService) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject
    ]).subscribe(([query, page]) => {
      this.loadSectors(query, page);
    });

    this.searchSubject.next('');
  }

  private loadSectors(query: string, page: number): void {
    this.sectorService.search({
      query,
      page,
      pageSize: this.pageSize
    }).subscribe({
      next: (result: SearchResult<Sector>) => {
        this.sectors = result.data;
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
    console.log('Opening create sector modal...');
  }

  editSector(sector: Sector): void {
    console.log('Editing sector:', sector);
  }

  deleteSector(id: string): void {
    if (confirm('Are you sure you want to delete this sector?')) {
      this.sectorService.delete(id).subscribe({
        next: () => {
          this.loadSectors(this.searchQuery, this.currentPage);
        }
      });
    }
  }
}