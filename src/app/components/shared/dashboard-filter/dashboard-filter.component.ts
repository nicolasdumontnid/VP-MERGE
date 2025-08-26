import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  checked: boolean;
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
  
  sectors: FilterOption[] = [
    { id: 'colon', label: 'Colon', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'cytologie', label: 'Cytologie', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'florescence', label: 'Florescence', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'lungs', label: 'Lungs', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'chest', label: 'Chest', count: Math.floor(Math.random() * 16), checked: false }
  ];
  
  assignedDoctors: FilterOption[] = [
    { id: 'damien', label: 'Damien, Oncologue, CHU-Angers', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'nicolas', label: 'Nicolas, Oncologue, CHU-Caen', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'deborah', label: 'Déborah, Pédiatre, CHU-Angers', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'daniel', label: 'Daniel, Radiographer, CHU-Caen', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'sylvie', label: 'Sylvie, Médecin généraliste, CHU-Caen', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'claire', label: 'Claire, Cardiologue, CHU-Brest', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'julien', label: 'Julien, Urgentiste, CHU-Brest', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'fatima', label: 'Fatima, Neurologue, CHU-Brest', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'thomas', label: 'Thomas, Chirurgien orthopédique, CHU-Angers', count: Math.floor(Math.random() * 16), checked: false },
    { id: 'marie', label: 'Marie, Infirmière en chef, Remote site', count: Math.floor(Math.random() * 16), checked: false }
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
  filteredSectors: FilterOption[] = [];
  filteredAssignedDoctors: FilterOption[] = [];

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
    // Filter sites based on selected doctors
    this.filteredSites = this.sites.filter(site => {
      const selectedDoctors = this.assignedDoctors.filter(doc => doc.checked);
      if (selectedDoctors.length === 0) return true;
      // Logic to filter sites based on selected doctors would go here
      return true;
    });

    // Filter sectors based on selected sites
    this.filteredSectors = this.sectors.filter(sector => {
      const selectedSites = this.sites.filter(site => site.checked);
      if (selectedSites.length === 0) return true;
      // Logic to filter sectors based on selected sites would go here
      return true;
    });

    // Assigned doctors are not filtered by other selections
    this.filteredAssignedDoctors = this.assignedDoctors.filter(doctor => {
      const selectedSites = this.sites.filter(site => site.checked);
      if (selectedSites.length === 0) return true;
      // Logic to filter doctors based on selected sites would go here
      return true;
    });
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