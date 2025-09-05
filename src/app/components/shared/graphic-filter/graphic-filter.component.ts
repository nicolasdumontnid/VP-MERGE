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

  // Color mapping for departments/sectors
  sectorColors: { [key: string]: string } = {
    'Colon': '#ef4444',           // Red
    'Cytology': '#f97316',        // Orange
    'Fluorescence': '#eab308',    // Yellow
    'Lungs': '#22c55e',           // Green
    'Chest': '#06b6d4',           // Cyan
    'Breast': '#3b82f6',          // Blue
    'Histology': '#8b5cf6',       // Purple
    'Throat': '#ec4899',          // Pink
    'Oncology': '#f59e0b',        // Amber
    'General': '#6b7280'          // Gray
  };

  // Color mapping for anatomical regions
  anatomicalColors: { [key: string]: string } = {
    'Tête': '#ef4444',            // Red
    'Cou': '#f97316',             // Orange
    'Épaule': '#eab308',          // Yellow
    'Thorax': '#22c55e',          // Green
    'Membres supérieurs': '#06b6d4', // Cyan
    'Dos': '#3b82f6',             // Blue
    'Bassin': '#8b5cf6',          // Purple
    'Membres inférieurs': '#ec4899', // Pink
    'Pied': '#f59e0b'             // Amber
  };

  // Filter state
  viewMode: 'department' | 'anatomy' = 'department';
  selectedDepartment = 'ALL';
  selectedAnatomy = 'ALL';
  selectedTimeline = 'ALL';

  // Anatomical regions
  anatomicalRegions = [
    'Head',
    'Neck', 
    'Shoulder',
    'Thorax',
    'Upper limbs',
    'Back',
    'Pelvis',
    'Lower limbs',
    'Foot'
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

  getSectorButtonStyle(sectorName: string): any {
    const color = this.sectorColors[sectorName];
    if (color && this.selectedDepartment === sectorName) {
      return {
        'background-color': color,
        'border-color': color,
        'color': 'white'
      };
    }
    return {};
  }

  getAnatomyButtonStyle(anatomy: string): any {
    const color = this.anatomicalColors[anatomy];
    if (color && this.selectedAnatomy === anatomy) {
      return {
        'background-color': color,
        'border-color': color,
        'color': 'white'
      };
    }
    return {};
  }
}