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
    { id: 'remote-site', label: 'Remote site', count: Math.floor(Math.random() * 16), checked: false }
  ];
  
  sectors: SectorFilterOption[] = [
    { id: 'oncologue', label: 'Oncologue', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers', 'chu-caen'] },
    { id: 'pediatre', label: 'Pédiatre', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'radiographer', label: 'Radiographer', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-caen'] },
    { id: 'medecin-generaliste', label: 'Médecin généraliste', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-caen'] },
    { id: 'cardiologue', label: 'Cardiologue', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'urgentiste', label: 'Urgentiste', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'neurologue', label: 'Neurologue', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-brest'] },
    { id: 'chirurgien-orthopedique', label: 'Chirurgien orthopédique', count: Math.floor(Math.random() * 16), checked: false, sites: ['chu-angers'] },
    { id: 'infirmiere-chef', label: 'Infirmière en chef', count: Math.floor(Math.random() * 16), checked: false, sites: ['remote-site'] }
  ];
  
  assignedDoctors: AssignedDoctorFilterOption[] = [
    { id: 'damien', label: 'Damien Suchy', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-angers', sector: 'oncologue' },
    { id: 'nicolas', label: 'Nicolas Dumont', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-caen', sector: 'oncologue' },
    { id: 'deborah', label: 'Déborah Bernard', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-angers', sector: 'pediatre' },
    { id: 'daniel', label: 'Daniel Lopez', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-caen', sector: 'radiographer' },
    { id: 'sylvie', label: 'Sylvie Massip', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-caen', sector: 'medecin-generaliste' },
    { id: 'claire', label: 'Claire Bouvier', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-brest', sector: 'cardiologue' },
    { id: 'julien', label: 'Julien Christman', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-brest', sector: 'urgentiste' },
    { id: 'fatima', label: 'Fatima Nezha', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-brest', sector: 'neurologue' },
    { id: 'thomas', label: 'Thomas Clavi', count: Math.floor(Math.random() * 16), checked: false, site: 'chu-angers', sector: 'chirurgien-orthopedique' },
    { id: 'marie', label: 'Marie Bauer', count: Math.floor(Math.random() * 16), checked: false, site: 'remote-site', sector: 'infirmiere-chef' }
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
    const selectedDoctors = this.assignedDoctors.filter(doc => doc.checked);
    const selectedSites = this.sites.filter(site => site.checked);
    const selectedSectors = this.sectors.filter(sector => sector.checked);

    // Filter sites based on selected doctors
    if (selectedDoctors.length > 0) {
      const doctorSites = selectedDoctors.map(doc => (doc as any).site);
      this.filteredSites = this.sites.filter(site => doctorSites.includes(site.id));
    } else {
      this.filteredSites = [...this.sites];
    }

    // Filter sectors based on selected sites
    if (selectedSites.length > 0) {
      this.filteredSectors = this.sectors.filter(sector => {
        const sectorSites = (sector as any).sites || [];
        return selectedSites.some(site => sectorSites.includes(site.id));
      });
    } else {
      this.filteredSectors = [...this.sectors];
    }

    // Filter assigned doctors based on selected sites (doctors are not filtered by other doctors)
    if (selectedSites.length > 0) {
      this.filteredAssignedDoctors = this.assignedDoctors.filter(doctor => {
        return selectedSites.some(site => (doctor as any).site === site.id);
      });
    } else {
      this.filteredAssignedDoctors = [...this.assignedDoctors];
    }
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