import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailedExam } from '../../../../models/detailed-exam.interface';

interface MenuOption {
  id: string;
  label: string;
  icon: string;
}

interface ActiveBlock {
  id: string;
  title: string;
  badges?: string[];
  content?: any;
}

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  menuOptions: MenuOption[] = [
    { id: 'ia-summary', label: 'IA Summary', icon: 'fas fa-brain' },
    { id: 'calendar-map', label: 'Calendar Map', icon: 'fas fa-calendar-alt' },
    { id: 'current-exam', label: 'Current Exam', icon: 'fas fa-file-medical-alt' },
    { id: 'last-report', label: 'Last Radio Report Conclusion', icon: 'fas fa-file-medical' },
    { id: 'patient-records', label: 'Top 10 Patient Record Information', icon: 'fas fa-list' },
    { id: 'visual-map', label: 'Visual Patient Map', icon: 'fas fa-user-md' },
    { id: 'all-images', label: 'All Images', icon: 'fas fa-images' },
    { id: 'patient-info', label: 'Patient Information', icon: 'fas fa-user' }
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
    const defaultBlocksInOrder = ['calendar-map', 'ia-summary', 'last-report', 'patient-records', 'visual-map', 'all-images'];
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
          content: {
            type: 'anatomical'
          }
        };
        break;

      case 'all-images':
        newBlock = {
          id: option.id,
          title: 'All Images',
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
          content: {
            type: 'patient-info'
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

  private getAnatomicalRegionBadges(): string[] {
    // Get unique anatomical regions from current exam and related patient exams
    const regions = new Set<string>();
    
    if (this.exam) {
      regions.add(this.exam.anatomicalRegion);
      
      // Add some sample regions for demonstration
      const sampleRegions = ['Thorax', 'Abdomen', 'Crâne', 'Bassin', 'Colonne vertébrale', 'Membres'];
      sampleRegions.forEach(region => regions.add(region));
    }
    
    return Array.from(regions);
  }

  getPatientExams() {
    // Mock data for patient exams - in real app, this would come from a service
    if (!this.exam) return [];
    
    return [
      { date: new Date('2024-01-15'), region: 'Thorax', title: 'CT Scan - Chest' },
      { date: new Date('2024-02-20'), region: 'Abdomen', title: 'MRI - Abdominal' },
      { date: new Date('2024-03-10'), region: 'Crâne', title: 'CT Scan - Head' },
      { date: new Date('2024-04-05'), region: 'Bassin', title: 'X-Ray - Pelvis' },
      { date: new Date('2024-05-12'), region: 'Membres', title: 'MRI - Knee' },
      { date: new Date('2024-06-18'), region: 'Thorax', title: 'X-Ray - Chest' },
      { date: new Date('2024-07-22'), region: 'Colonne vertébrale', title: 'MRI - Spine' },
      { date: new Date('2024-08-30'), region: 'Abdomen', title: 'Ultrasound' },
      { date: new Date('2024-09-15'), region: 'Crâne', title: 'MRI - Brain' },
      { date: new Date('2024-10-08'), region: 'Membres', title: 'X-Ray - Wrist' },
      { date: new Date('2024-11-12'), region: 'Bassin', title: 'CT Scan - Hip' },
      { date: new Date('2024-12-20'), region: 'Thorax', title: 'CT Scan - Lungs' },
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
    const exams = this.getPatientExams();
    const dates = exams.map(e => e.date).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const totalTime = lastDate.getTime() - firstDate.getTime();
    
    // X position (time)
    const examTime = exam.date.getTime() - firstDate.getTime();
    const xPercent = totalTime > 0 ? (examTime / totalTime) * 100 : 0;
    
    // Y position (anatomical region)
    const regionMap: { [key: string]: number } = {
      'Crâne': 0,
      'Thorax': 1,
      'Abdomen': 2,
      'Bassin': 3,
      'Membres': 4,
      'Colonne vertébrale': 2.5 // Between abdomen and pelvis
    };
    
    const yIndex = regionMap[exam.region] || 2;
    const yPercent = (yIndex / 4) * 100; // 4 main regions
    
    return { x: xPercent, y: yPercent };
  }

  onRegionHover(event: MouseEvent, region: string) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'rgba(107, 114, 128, 0.3)';
  }

  onRegionLeave(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'transparent';
  }
}