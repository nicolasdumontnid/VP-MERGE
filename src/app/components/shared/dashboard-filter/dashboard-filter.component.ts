import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  checked: boolean;
}

interface SectorFilterOption extends FilterOption {
  sites: string[];
}

interface AssignedDoctorFilterOption extends FilterOption {
  site: string;
  sector: string;
}

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface DateOption {
  id: string;
  label: string;
  from: Date | null;
  to: Date | null;
}

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardFilterComponent implements OnInit {
  @Input() title: string = 'Inbox';
  @Input() icon: string = 'fas fa-inbox';
  @Input() foundCount: number = 6;

  isExpanded = true;
  
  // Filter inputs
  filterText = '';
  siteFilter = '';
  sectorsFilter = '';
  assignedDoctorsFilter = '';
  
  // Radio button selections
  selectedCaseType = 'all';
  selectedScanType = 'all';
  selectedDateRange = 'all';
  
  // Date inputs
  fromDate = '';
  toDate = '';
  dateHeaderInput = '';
  
  // Filter options
  caseTypeOptions: RadioOption[] = [
    { id: 'all', label: 'All', value: 'all' },
    { id: 'my-cases', label: 'My cases', value: 'my-cases' },
    { id: 'unassigned', label: 'Unassigned', value: 'unassigned' }
  ];
  
  scanTypeOptions: RadioOption[] = [
    { id: 'all', label: 'All', value: 'all' },
    { id: 'fully-scanned', label: 'Fully scanned', value: 'fully-scanned' },
    { id: 'pending', label: 'Pending', value: 'pending' }
  ];
  
  filterCheckboxes: FilterOption[] = [
    { id: 'urgent', label: 'Urgent only', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'no-images', label: 'No images scanned only', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'completed-shares', label: 'Completed shares only', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'unseen-images', label: 'With unseen images only', count: Math.floor(Math.random() * 16), checked: false }
  ];
  
  sites: FilterOption[] = [
    { id: 'chu-angers', label: 'CHU-Angers', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'chu-caen', label: 'CHU-Caen', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'chu-brest', label: 'CHU-Brest', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'remote-site', label: 'Remote site', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'ch-le-mans', label: 'CH Le Mans', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'az-sint-maarten', label: 'AZ Sint-Maarten', count: Math.floor(Math.random() * 16), checked: false }
  ];
  
  sectors: SectorFilterOption[] = [
    { id: 'oncology-angers', label: 'Oncology', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'pediatric', label: 'Pediatric', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'radiology', label: 'Radiology', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'general-medicine', label: 'General medicine', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'cardiology', label: 'Cardiology', count: Math.floor(Math.random() * 16), checked: false, sites: ['ch-le-mans'] },
    { id: 'emergency', label: 'Emergency', count: Math.floor(Math.random() * 16), checked: false, sites: ['az-sint-maarten'] },
    { id: 'neurology', label: 'Neurology', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'orthopedic', label: 'Orthopedic', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-caen'] },
    { id: 'colon', label: 'Colon', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'cytologie', label: 'Cytologie', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'florescence', label: 'Florescence', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'lungs', label: 'Lungs', count: Math.floor(Math.random() * 16), checked: false, sites: ['az-sint-maarten'] },
    { id: 'chest', label: 'Chest', count: Math.floor(Math.random() * 16), checked: false, sites: ['ch-le-mans'] },
    { id: 'breast', label: 'Breast', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'histologie', label: 'Histologie', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'throat', label: 'Throat', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-caen'] },
    { id: 'oncology-caen', label: 'Oncology', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-caen'] },
    { id: 'general', label: 'General', count: Math.floor(Math.random() * 16), checked: false, sites: ['az-sint-maarten'] }
  ];
  
  assignedDoctors: AssignedDoctorFilterOption[] = [
    { id: 'damien', label: 'Damien Suchy', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-angers', sector: 'oncology-angers' },
    { id: 'nicolas', label: 'Nicolas Dumont', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-caen', sector: 'oncology-caen' },
    { id: 'deborah', label: 'Déborah Bernard', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-angers', sector: 'pediatric' },
    { id: 'daniel', label: 'Daniel Lopez', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-caen', sector: 'orthopedic' },
    { id: 'sylvie', label: 'Sylvie Massip', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-caen', sector: 'throat' },
    { id: 'claire', label: 'Claire Bouvier', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-brest', sector: 'general-medicine' },
    { id: 'julien', label: 'Julien Christman', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-brest', sector: 'neurology' },
    { id: 'fatima', label: 'Fatima Nezha', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-brest', sector: 'breast' },
    { id: 'thomas', label: 'Thomas Clavi', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-angers', sector: 'radiology' },
    { id: 'marie', label: 'Marie Bauer', count: Math.floor(Math.random() * 16), checked: false, site: 'remote-site', sector: '' }
  ];
  
  dateOptions: DateOption[] = [
    { id: 'all', label: 'All', from: null, to: null },
    { id: 'today', label: 'Today', from: new Date(), to: new Date() },
    { id: 'yesterday', label: 'Yesterday', from: this.getYesterday(), to: this.getYesterday() },
    { id: 'last-week', label: 'Last Week', from: this.getLastWeek(), to: new Date() },
    { id: 'last-6-months', label: 'Last 6 Months', from: this.getLast6Months(), to: new Date() },
    { id: 'from', label: 'From', from: null, to: new Date() }
  ];
  
  // Filtered lists
  filteredSites: FilterOption[] = [];
  filteredSectors: SectorFilterOption[] = [];
  filteredAssignedDoctors: AssignedDoctorFilterOption[] = [];

  ngOnInit(): void {
    this.updateFilteredLists();
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    console.log('Toggle expanded:', this.isExpanded); // Debug log
  }

  onDateRangeChange(): void {
    const selectedOption = this.dateOptions.find(option => option.id === this.selectedDateRange);
    if (selectedOption) {
      this.fromDate = selectedOption.from ? this.formatDate(selectedOption.from) : '';
      this.toDate = selectedOption.to ? this.formatDate(selectedOption.to) : '';
    }
  }

  onManualDateChange(): void {
    this.selectedDateRange = 'from';
  }

  onDateTextInput(): void {
    if (this.dateHeaderInput) {
      this.fromDate = this.dateHeaderInput;
      this.toDate = this.dateHeaderInput;
      this.toDate = this.dateHeaderInput;
      this.selectedDateRange = 'from';
    }
  }

  onRadioHover(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = '#374151';
  }

  onRadioLeave(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = '';
  }

  updateFilteredLists(): void {
    const selectedSites = this.sites.filter(site => site.checked);
    const selectedSectors = this.sectors.filter(sector => sector.checked);
    const selectedAssignedDoctors = this.assignedDoctors.filter(doc => doc.checked);

    // Filter sites based on selected sectors first, then assigned doctors
    let sitesToShow = [...this.sites];
    
    if (selectedSectors.length > 0) {
      const sectorSites = selectedSectors.flatMap(sector => sector.sites);
      sitesToShow = sitesToShow.filter(site => sectorSites.includes(site.id));
    }
    
    if (selectedAssignedDoctors.length > 0) {
      const doctorSites = selectedAssignedDoctors.map(doc => doc.site);
      sitesToShow = sitesToShow.filter(site => doctorSites.includes(site.id));
    }
    
    this.filteredSites = sitesToShow;

    // Filter sectors based on selected sites and assigned doctors
    let sectorsToShow = [...this.sectors];
    
    if (selectedSites.length > 0) {
      sectorsToShow = sectorsToShow.filter(sector => 
        sector.sites.some(siteId => selectedSites.some(site => site.id === siteId))
      );
    }
    
    if (selectedAssignedDoctors.length > 0) {
      const doctorSectors = selectedAssignedDoctors.map(doc => doc.sector).filter(s => s);
      sectorsToShow = sectorsToShow.filter(sector => doctorSectors.includes(sector.id));
    }
    
    this.filteredSectors = sectorsToShow;

    // Filter assigned doctors based on selected sites and sectors
    let doctorsToShow = [...this.assignedDoctors];
    
    if (selectedSites.length > 0) {
      doctorsToShow = doctorsToShow.filter(doctor => 
        selectedSites.some(site => site.id === doctor.site)
      );
    }
    
    if (selectedSectors.length > 0) {
      const sectorIds = selectedSectors.map(sector => sector.id);
      doctorsToShow = doctorsToShow.filter(doctor => 
        sectorIds.includes(doctor.sector)
      );
    } else {
      this.filteredAssignedDoctors = doctorsToShow;
    }

    this.filteredAssignedDoctors = doctorsToShow;
  }

  onFilterChange(): void {
    this.updateFilteredLists();
  }

  private getYesterday(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }

  private getLastWeek(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  private getLastMonth(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  private getLast6Months(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}