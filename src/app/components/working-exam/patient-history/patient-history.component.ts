import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedExam } from '../../../../models/detailed-exam.interface';
import { GraphicFilterComponent, GraphicFilterState } from '../../shared/graphic-filter/graphic-filter.component';
import { Sector } from '../../../../models/sector.interface';

interface MenuOption {
  id: string;
  label: string;
  icon: string;
}

interface ActiveBlock {
  id: string;
  title: string;
  isCollapsed: boolean;
  badges?: string[];
  content?: any;
}

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule, FormsModule, GraphicFilterComponent],
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientHistoryComponent {
  @Input() exam: DetailedExam | null = null;
  @Output() close = new EventEmitter<void>();

  isMenuOpen = false;
  activeBlocks: ActiveBlock[] = [];
  selectedAnatomicalView = 'bones'; // Default to bones view
  svgZoomLevel = 1; // Zoom level for SVG (1 = normal size, 10 = max zoom)
  svgTransformOrigin = 'center center'; // Transform origin for zoom
  private isInitializing: boolean = true;
  
  // Tooltip properties
  hoveredExam: any = null;
  tooltipPosition = { x: 0, y: 0 };
  private tooltipTimeout: any = null;
  
  // Badge selection state
  selectedRegions = new Set<string>();
  
  // Color mapping for anatomical regions
  regionColors: { [key: string]: string } = {
    'Tête': '#ef4444',            // Red
    'Cou': '#f97316',             // Orange
    'Épaule': '#eab308',          // Yellow
    'Thorax': '#22c55e',          // Green
    'Membres supérieurs': '#06b6d4', // Cyan
    'Dos': '#3b82f6',             // Blue
    'Bassin': '#3b82f6',          // Blue
    'Membres inférieurs': '#8b5cf6', // Purple
    'Pied': '#ec4899'             // Pink
  };

  // External sources state
  selectedExternalSource = 'SEGUR';
  showExternalContent = true;
  
  // Graphic filter state
  graphicFilterState: GraphicFilterState = {
    viewMode: 'department',
    selectedDepartment: 'ALL',
    selectedAnatomy: 'ALL',
    selectedTimeline: 'ALL'
  };
  
  // Mock sectors for the filter
  sectors: Sector[] = [
    { id: 'SEC001', name: 'Colon', siteId: 'S001', siteName: 'CHU-Angers', description: 'Colorectal surgery', isActive: true },
    { id: 'SEC002', name: 'Cytology', siteId: 'S001', siteName: 'CHU-Angers', description: 'Cell analysis', isActive: true },
    { id: 'SEC003', name: 'Fluorescence', siteId: 'S001', siteName: 'CHU-Angers', description: 'Fluorescence imaging', isActive: true },
    { id: 'SEC004', name: 'Lungs', siteId: 'S003', siteName: 'CHU-Brest', description: 'Pulmonary medicine', isActive: true },
    { id: 'SEC005', name: 'Chest', siteId: 'S003', siteName: 'CHU-Brest', description: 'Thoracic medicine', isActive: true },
    { id: 'SEC006', name: 'Breast', siteId: 'S003', siteName: 'CHU-Brest', description: 'Breast screening', isActive: true },
    { id: 'SEC007', name: 'Histology', siteId: 'S003', siteName: 'CHU-Brest', description: 'Tissue analysis', isActive: true },
    { id: 'SEC008', name: 'Throat', siteId: 'S002', siteName: 'CHU-Caen', description: 'ENT specialty', isActive: true },
    { id: 'SEC009', name: 'Oncology', siteId: 'S002', siteName: 'CHU-Caen', description: 'Cancer treatment', isActive: true },
    { id: 'SEC010', name: 'General', siteId: 'S002', siteName: 'CHU-Caen', description: 'General medicine', isActive: true }
  ];
  
  constructor(private cdr: ChangeDetectorRef) {}

  menuOptions: MenuOption[] = [
    { id: 'ia-summary', label: 'IA Summary', icon: 'fas fa-brain' },
    { id: 'calendar-map', label: 'Calendar Map', icon: 'fas fa-calendar-alt' },
    { id: 'current-exam', label: 'Current Exam', icon: 'fas fa-file-medical-alt' },
    { id: 'last-report', label: 'Last Radio Report Conclusion', icon: 'fas fa-file-medical' },
    { id: 'patient-records', label: 'Top 10 Patient Record Information', icon: 'fas fa-list' },
    { id: 'visual-map', label: 'Visual Patient Map', icon: 'fas fa-user-md' },
    { id: 'all-images', label: 'All Images', icon: 'fas fa-images' },
    { id: 'patient-info', label: 'Patient Information', icon: 'fas fa-user' },
    { id: 'external-sources', label: 'External sources', icon: 'fas fa-external-link-alt' }
  ];

  // Sample medical images for different dates
  medicalImages = {
    'today': [
      'assets/images/radio/0-thumbnail.jpeg',
      'assets/images/radio/1-thumbnail.jpeg',
      'assets/images/radio/2-thumbnail.jpeg',
      'assets/images/radio/3-thumbnail.jpeg',
      'assets/images/radio/4-thumbnail.jpeg',
      'assets/images/radio/5thumbnail.jpeg'
    ],
    '2025-01-14': [
      'assets/images/radio/7-thumbnail.jpeg',
      'assets/images/radio/8-thumbnail.jpeg',
      'assets/images/radio/9-thumbnail.jpeg'
    ],
    '2025-01-13': [
      'assets/images/radio/11thumbnail.jpeg',
      'assets/images/radio/1thumbnail.jpeg',
      'assets/images/radio/0thumbnail.jpeg',
      'assets/images/radio/2thumbnail.jpeg'
    ],
    '2025-01-10': [
      'assets/images/radio/3thumbnail.jpeg',
      'assets/images/radio/4thumbnail.jpeg'
    ]
  };

  // Sample patient records
  patientRecords = [
    { date: '2025-01-15', name: 'CT Abdomen', description: 'Contrast-enhanced CT scan of the abdomen and pelvis for diagnostic evaluation' },
    { date: '2025-01-12', name: 'Lab Report', description: 'Complete blood count and metabolic panel showing normal values' },
    { date: '2025-01-10', name: 'Blood Sample', description: 'Fasting glucose and lipid profile analysis' },
    { date: '2025-01-08', name: 'MRI Brain', description: 'Brain MRI with and without contrast for neurological assessment' },
    { date: '2025-01-05', name: 'X-Ray Chest', description: 'Posterior-anterior and lateral chest radiographs' },
    { date: '2025-01-03', name: 'Ultrasound', description: 'Abdominal ultrasound examination of liver, gallbladder, and kidneys' },
    { date: '2024-12-28', name: 'ECG', description: '12-lead electrocardiogram showing normal sinus rhythm' },
    { date: '2024-12-25', name: 'Biopsy', description: 'Tissue biopsy sample for histopathological examination' },
    { date: '2024-12-20', name: 'CT Thorax', description: 'High-resolution CT of the chest for pulmonary evaluation' },
    { date: '2024-12-15', name: 'Bone Scan', description: 'Nuclear medicine bone scintigraphy for skeletal assessment' }
  ];

  ngOnInit() {
    // Initialize blocks in the correct order (top to bottom)
    // Patient Information always first and open
    const defaultBlocksInOrder = ['patient-info', 'ia-summary', 'last-report', 'patient-records', 'visual-map', 'all-images'];
    defaultBlocksInOrder.forEach(blockId => {
      const option = this.menuOptions.find(opt => opt.id === blockId);
      if (option) {
        this.selectMenuOption(option);
      }
    });
    this.isInitializing = false;
  }

  onClose(): void {
    this.close.emit();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getAvailableMenuOptions(): MenuOption[] {
    const activeBlockIds = this.activeBlocks.map(block => block.id);
    return this.menuOptions.filter(option => !activeBlockIds.includes(option.id));
  }

  selectMenuOption(option: MenuOption): void {
    this.isMenuOpen = false;
    
    // Check if block already exists
    const existingBlock = this.activeBlocks.find(block => block.id === option.id);
    if (existingBlock) {
      return; // Don't add duplicate blocks
    }

    let newBlock: ActiveBlock;

    switch (option.id) {
      case 'calendar-map':
        newBlock = {
          id: option.id,
          title: 'Calendar Map',
          isCollapsed: false,
          badges: this.getAnatomicalRegionBadges(),
          content: {
            type: 'calendar-map'
          }
        };
        break;

      case 'ia-summary':
        newBlock = {
          id: option.id,
          title: 'IA Summary',
          isCollapsed: true,
          badges: ['General', 'Critical'],
          content: {
            type: 'summary',
            text: 'Based on the comprehensive analysis of medical records, the patient shows stable vital signs with no immediate concerns. Recent imaging studies indicate normal anatomical structures with minor age-related changes. Blood work reveals values within normal ranges. Continued monitoring recommended for optimal health maintenance.'
          }
        };
        break;

      case 'current-exam':
        newBlock = {
          id: option.id,
          title: 'Current Exam',
          isCollapsed: true,
          badges: ['Reference', 'Date', 'Type', 'Description', 'Details'],
          content: {
            type: 'current-exam'
          }
        };
        break;

      case 'last-report':
        newBlock = {
          id: option.id,
          title: 'Last Radio Report Conclusion',
          isCollapsed: false,
          badges: ['Positive', 'Negative'],
          content: {
            type: 'conclusion',
            text: 'Conclusion: The CT examination of the abdomen and pelvis demonstrates no acute abnormalities. The liver, spleen, pancreas, and kidneys appear normal in size and attenuation. No evidence of masses, fluid collections, or inflammatory changes. The bowel loops are unremarkable. Recommendation: Continue routine follow-up as clinically indicated.'
          }
        };
        break;

      case 'patient-records':
        newBlock = {
          id: option.id,
          title: 'Top 10 Patient Record Information',
          isCollapsed: true,
          badges: ['Recent', 'Critical', 'Lab', 'Imaging'],
          content: {
            type: 'records',
            records: this.patientRecords
          }
        };
        break;

      case 'visual-map':
        newBlock = {
          id: option.id,
          title: 'Visual Patient Map',
          isCollapsed: true,
          content: {
            type: 'anatomical'
          }
        };
        break;

      case 'all-images':
        newBlock = {
          id: option.id,
          title: 'All Images',
          isCollapsed: true,
          content: {
            type: 'images',
            imagesByDate: this.medicalImages
          }
        };
        break;

      case 'patient-info':
        newBlock = {
          id: option.id,
          title: 'Patient Information',
          isCollapsed: false,
          content: {
            type: 'patient-info'
          }
        };
        break;

      case 'external-sources':
        newBlock = {
          id: option.id,
          title: 'All the other from external sources',
          isCollapsed: false,
          content: {
            type: 'external-sources'
          }
        };
        break;

      default:
        return;
    }

    // For initialization, add to the end to maintain order
    // For user-added blocks, add to the beginning
    if (this.activeBlocks.length === 0 || this.isInitializing) {
      this.activeBlocks.push(newBlock);
    } else {
      this.activeBlocks.unshift(newBlock);
    }
  }

  removeBlock(blockId: string): void {
    this.activeBlocks = this.activeBlocks.filter(block => block.id !== blockId);
  }

  toggleBlockCollapse(blockId: string): void {
    const block = this.activeBlocks.find(b => b.id === blockId);
    if (block) {
      block.isCollapsed = !block.isCollapsed;
      this.cdr.detectChanges();
    }
  }

  getImageDates(): string[] {
    return Object.keys(this.medicalImages).sort((a, b) => {
      if (a === 'today') return -1;
      if (b === 'today') return 1;
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }

  formatDate(dateStr: string): string {
    if (dateStr === 'today') return 'Today';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  selectOrgan(organName: string): void {
    console.log('Selected organ:', organName);
    // Add logic here to display information about the selected organ
  }

  public onBodyClick(event: MouseEvent): void {
    // Handle clicks on the body SVG
    console.log('Body clicked at:', event.offsetX, event.offsetY);
    // You can add logic here to detect which body part was clicked based on coordinates
  }

  public onSvgWheel(event: WheelEvent): void {
    event.preventDefault(); // Prevent page scrolling
    
    // Get the bounding rectangle of the SVG element
    const svgElement = event.target as HTMLElement;
    const rect = svgElement.getBoundingClientRect();
    
    // Calculate mouse position relative to the SVG element (as percentages)
    const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Update transform origin to mouse position
    this.svgTransformOrigin = `${mouseX}% ${mouseY}%`;
    
    const zoomStep = 0.1;
    const minZoom = 1; // Minimum zoom (current size)
    const maxZoom = 10; // Maximum zoom (x10)
    
    if (event.deltaY < 0) {
      // Scroll up - zoom in
      this.svgZoomLevel = Math.min(this.svgZoomLevel + zoomStep, maxZoom);
    } else {
      // Scroll down - zoom out
      this.svgZoomLevel = Math.max(this.svgZoomLevel - zoomStep, minZoom);
    }
  }

  public getAnatomicalRegionBadges(): string[] {
    // Get unique anatomical regions from current exam and related patient exams
    const regions = new Set<string>();
    
    if (this.exam) {
      regions.add(this.exam.anatomicalRegion);
      
      // Add some sample regions for demonstration
      const sampleRegions = ['Tête', 'Cou', 'Épaule', 'Thorax', 'Membres supérieurs', 'Dos', 'Bassin', 'Membres inférieurs', 'Pied'];
      sampleRegions.forEach(region => regions.add(region));
    }
    
    return Array.from(regions);
  }

  getPatientExams() {
    // Mock data for patient exams - in real app, this would come from a service
    if (!this.exam) return [];
    
    return [
      { date: new Date('2024-01-15'), region: 'Pied', title: 'X-Ray - Foot', sector: 'Orthopedic' },
      { date: new Date('2024-02-20'), region: 'Membres inférieurs', title: 'MRI - Knee', sector: 'Orthopedic' },
      { date: new Date('2024-03-10'), region: 'Bassin', title: 'X-Ray - Pelvis', sector: 'Radiology' },
      { date: new Date('2024-04-05'), region: 'Dos', title: 'MRI - Spine', sector: 'Neurology' },
      { date: new Date('2024-05-12'), region: 'Thorax', title: 'MRI - Chest', sector: 'Cardiology' },
      { date: new Date('2024-06-18'), region: 'Thorax', title: 'X-Ray - Chest', sector: 'Pulmonology' },
      { date: new Date('2024-07-22'), region: 'Tête', title: 'CT Scan - Head', sector: 'Neurology' },
      { date: new Date('2024-08-30'), region: 'Thorax', title: 'Ultrasound', sector: 'Cardiology' },
      { date: new Date('2024-09-15'), region: 'Thorax', title: 'CT Scan - Lungs', sector: 'Pulmonology' },
      { date: new Date('2024-10-08'), region: 'Membres supérieurs', title: 'X-Ray - Wrist', sector: 'Orthopedic' },
      { date: new Date('2024-11-12'), region: 'Bassin', title: 'CT Scan - Hip', sector: 'Orthopedic' },
      { date: new Date('2024-12-20'), region: 'Tête', title: 'MRI - Brain', sector: 'Neurology' },
      { date: new Date('2025-01-15'), region: this.exam.anatomicalRegion, title: this.exam.title }
    ];
  }

  getTimelineMonths() {
    const exams = this.getPatientExams();
    if (exams.length === 0) return [];
    
    const dates = exams.map(exam => exam.date).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    const months = [];
    const current = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    const end = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
    
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  }

  getExamPosition(exam: any) {
    const filteredExams = this.getFilteredExams();
    const dates = filteredExams.map(e => e.date).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const totalTime = lastDate.getTime() - firstDate.getTime();
    
    // X position (time)
    const examTime = exam.date.getTime() - firstDate.getTime();
    const xPercent = totalTime > 0 ? (examTime / totalTime) * 100 : 0;
    
    // Y position (anatomical region) - Positionnement selon les 9 régions
    const regionMap: { [key: string]: number } = {
      'Tête': 10,                    // 10% - En haut
      'Cou': 20,                     // 20%
      'Épaule': 30,                  // 30%
      'Thorax': 40,                  // 40%
      'Membres supérieurs': 50,      // 50%
      'Dos': 60,                     // 60%
      'Bassin': 55,                  // 55% - Entre 50% et 60%
      'Membres inférieurs': 75,      // 75% - Entre 70% et 80%
      'Pied': 95                     // 95% - Entre 90% et 100% (tout en bas)
    };
    
    const yPercent = regionMap[exam.region];
    if (yPercent === undefined) {
      console.warn('Unknown region:', exam.region);
      return { x: xPercent, y: 50 }; // Position par défaut au centre
    }
    
    console.log(`Exam: ${exam.title}, Region: ${exam.region}, Y%: ${yPercent}`);
    
    return { x: xPercent, y: yPercent };
  }

  getMonthPosition(month: Date): number {
    const months = this.getTimelineMonths();
    if (months.length <= 1) return 0;
    
    const firstMonth = months[0];
    const lastMonth = months[months.length - 1];
    const totalTime = lastMonth.getTime() - firstMonth.getTime();
    
    if (totalTime === 0) return 0;
    
    const monthTime = month.getTime() - firstMonth.getTime();
    return (monthTime / totalTime) * 100; // 0% à 100% depuis l'origine
  }

  onRegionHover(event: MouseEvent, region: string) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'rgba(107, 114, 128, 0.3)';
  }

  onRegionLeave(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'transparent';
  }

  onExamPointEnter(event: MouseEvent, exam: any) {
    console.log('onExamPointEnter called for exam:', exam.title);
    this.clearTooltipTimeout();
    
    const target = event.target as HTMLElement;
    const chartArea = target.closest('.chart-area') as HTMLElement;
    
    if (chartArea) {
      const pointRect = target.getBoundingClientRect();
      const chartRect = chartArea.getBoundingClientRect();
      
      // Position initiale du tooltip
      let tooltipX = pointRect.left - chartRect.left + (pointRect.width / 2);
      let tooltipY = pointRect.top - chartRect.top;
      
      // Dimensions approximatives du tooltip
      const tooltipWidth = 180;
      const tooltipHeight = 80;
      
      // Ajuster la position X pour éviter le débordement
      if (tooltipX + tooltipWidth / 2 > chartRect.width) {
        // Trop près du bord droit - décaler vers la gauche
        tooltipX = chartRect.width - tooltipWidth / 2 - 10;
      } else if (tooltipX - tooltipWidth / 2 < 0) {
        // Trop près du bord gauche - décaler vers la droite
        tooltipX = tooltipWidth / 2 + 10;
      }
      
      // Ajuster la position Y pour éviter le débordement
      if (tooltipY - tooltipHeight - 10 < 0) {
        // Pas assez d'espace en haut - afficher en dessous du point
        tooltipY = tooltipY + 20;
      }
      
      this.tooltipPosition = {
        x: tooltipX,
        y: tooltipY
      };
    }
    
    this.hoveredExam = exam;
    this.cdr.detectChanges();
  }

  onExamPointLeave() {
    console.log('onExamPointLeave called');
    // Use a longer delay to allow moving to tooltip
    this.tooltipTimeout = setTimeout(() => {
      console.log('Hiding tooltip after point leave timeout');
      this.hoveredExam = null;
      this.cdr.detectChanges();
    }, 300); // Délai plus long pour permettre de passer au tooltip
  }

  onTooltipEnter() {
    console.log('onTooltipEnter called');
    this.clearTooltipTimeout();
  }

  onTooltipLeave() {
    console.log('onTooltipLeave called');
    // Hide immediately when leaving tooltip
    console.log('Hiding tooltip immediately on tooltip leave');
    // Masquer immédiatement sans délai
    this.clearTooltipTimeout();
    console.log('Hiding tooltip immediately on tooltip leave');
    this.hoveredExam = null;
    this.cdr.detectChanges();
  }

  // Nouvelle méthode pour tester si les événements se déclenchent
  onTooltipMouseMove() {
    console.log('Mouse moving over tooltip');
  }

  private clearTooltipTimeout() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = null;
    }
  }

  ngOnDestroy() {
    this.clearTooltipTimeout();
  }
  
  // Badge selection methods
  onBadgeClick(region: string): void {
    if (this.selectedRegions.has(region)) {
      // Deselect region
      this.selectedRegions.delete(region);
    } else {
      // Select region
      this.selectedRegions.add(region);
    }
    this.cdr.detectChanges();
  }
  
  isBadgeSelected(region: string): boolean {
    return this.selectedRegions.has(region);
  }
  
  getBadgeClass(region: string): string {
    return this.isBadgeSelected(region) ? 'badge selected' : 'badge';
  }
  
  getPointColor(exam: any): string {
    return this.regionColors[exam.region] || '#6b7280';
  }
  
  getPointBorderColor(exam: any): string {
    if (this.selectedRegions.has(exam.region)) {
      // Darker border when region is selected
      const baseColor = this.regionColors[exam.region] || '#6b7280';
      return this.darkenColor(baseColor);
    }
    return this.regionColors[exam.region] || '#6b7280';
  }
  
  isRegionSelected(region: string): boolean {
    return this.selectedRegions.has(region);
  }
  
  private darkenColor(color: string): string {
    // Simple color darkening - remove one level of brightness
    const colorMap: { [key: string]: string } = {
      '#ef4444': '#dc2626', // Red -> Darker red
      '#f59e0b': '#d97706', // Orange -> Darker orange
      '#10b981': '#059669', // Green -> Darker green
      '#3b82f6': '#2563eb', // Blue -> Darker blue
      '#8b5cf6': '#7c3aed', // Purple -> Darker purple
      '#ec4899': '#db2777', // Pink -> Darker pink
      '#6b7280': '#4b5563'  // Gray -> Darker gray
    };
    return colorMap[color] || '#374151';
  }

  onExternalSourceChange(): void {
    // Hide content temporarily
    this.showExternalContent = false;
    this.cdr.detectChanges();
    
    // Show content again after a brief delay
    setTimeout(() => {
      this.showExternalContent = true;
      this.cdr.detectChanges();
    }, 100);
  }
  
  onGraphicFilterChange(filterState: GraphicFilterState): void {
    this.graphicFilterState = filterState;
    this.cdr.detectChanges();
  }
  
  getFilteredExams() {
    let exams = this.getPatientExams();
    
    // Filter by department/sector
    if (this.graphicFilterState.viewMode === 'department' && this.graphicFilterState.selectedDepartment !== 'ALL') {
      exams = exams.filter(exam => exam.sector === this.graphicFilterState.selectedDepartment);
    }
    
    // Filter by anatomy
    if (this.graphicFilterState.viewMode === 'anatomy' && this.graphicFilterState.selectedAnatomy !== 'ALL') {
      if (this.graphicFilterState.selectedAnatomy === 'Others') {
        // Show exams that don't match any standard anatomical region
        const standardRegions = ['Tête', 'Cou', 'Épaule', 'Thorax', 'Membres supérieurs', 'Dos', 'Bassin', 'Membres inférieurs', 'Pied'];
        exams = exams.filter(exam => !standardRegions.includes(exam.region));
      } else {
        exams = exams.filter(exam => exam.region === this.graphicFilterState.selectedAnatomy);
      }
    }
    
    // Filter by timeline
    if (this.graphicFilterState.selectedTimeline !== 'ALL') {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (this.graphicFilterState.selectedTimeline) {
        case '1_WEEK':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1_MONTH':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case '3_MONTHS':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case '6_MONTHS':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case '1_YEAR':
          cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        case '3_YEARS':
          cutoffDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
          break;
        case 'MORE_3_YEARS':
          cutoffDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
          exams = exams.filter(exam => exam.date < cutoffDate);
          return exams;
        default:
          return exams;
      }
      
      exams = exams.filter(exam => exam.date >= cutoffDate);
    }
    
    return exams;
  }
  
  getFilteredTimelineMonths() {
    const filteredExams = this.getFilteredExams();
    if (filteredExams.length === 0) return [];
    
    const dates = filteredExams.map(exam => exam.date).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    const months = [];
    const current = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    const end = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
    
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  }
}