import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../../../../models/sector.interface';

export interface GraphicFilterState {
  viewMode: 'department' | 'anatomy';
  selectedDepartment: string;
  selectedAnatomy: string;
  selectedTimeline: string;
}

@Component({
  selector: 'app-graphic-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphic-filter.component.html',
  styleUrls: ['./graphic-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicFilterComponent implements OnInit {
  @Input() sectors: Sector[] = [];
  @Output() filterChange = new EventEmitter<GraphicFilterState>();

  // Filter state
  viewMode: 'department' | 'anatomy' = 'department';
  selectedDepartment = 'ALL';
  selectedAnatomy = 'ALL';
  selectedTimeline = 'ALL';

  // Anatomical regions
  anatomicalRegions = [
    'Tête',
    'Cou', 
    'Épaule',
    'Thorax',
    'Membres supérieurs',
    'Dos',
    'Bassin',
    'Membres inférieurs',
    'Pied'
  ];

  // Timeline options
  timelineOptions = [
    { id: 'ALL', label: 'ALL' },
    { id: '1_WEEK', label: '1 Week' },
    { id: '1_MONTH', label: '1 Month' },
    { id: '3_MONTHS', label: '3 Months' },
    { id: '6_MONTHS', label: '6 Months' },
    { id: '1_YEAR', label: '1 Year' },
    { id: '3_YEARS', label: '3 Years' },
    { id: 'MORE_3_YEARS', label: 'More than 3 years' }
  ];

  ngOnInit(): void {
    this.emitFilterChange();
  }

  onViewModeChange(mode: 'department' | 'anatomy'): void {
    this.viewMode = mode;
    this.emitFilterChange();
  }

  onDepartmentChange(department: string): void {
    this.selectedDepartment = department;
    this.emitFilterChange();
  }

  onAnatomyChange(anatomy: string): void {
    this.selectedAnatomy = anatomy;
    this.emitFilterChange();
  }

  onTimelineChange(timeline: string): void {
    this.selectedTimeline = timeline;
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    this.filterChange.emit({
      viewMode: this.viewMode,
      selectedDepartment: this.selectedDepartment,
      selectedAnatomy: this.selectedAnatomy,
      selectedTimeline: this.selectedTimeline
    });
  }

  get isDepartmentViewActive(): boolean {
    return this.viewMode === 'department';
  }

  get isAnatomyViewActive(): boolean {
    return this.viewMode === 'anatomy';
  }
}