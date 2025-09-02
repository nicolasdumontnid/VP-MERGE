import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientHistoryComponent {
  @Input() exam: DetailedExam | null = null;
  @Output() close = new EventEmitter<void>();

  isMenuOpen = false;
  activeBlocks: ActiveBlock[] = [];

  menuOptions: MenuOption[] = [
    { id: 'ia-summary', label: 'IA Summary', icon: 'fas fa-brain' },
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
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=120&fit=crop&auto=format&sat=-100',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop&auto=format&sat=-100',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&h=120&fit=crop&auto=format&sat=-100',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=120&h=120&fit=crop&auto=format&sat=-100',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=120&h=120&fit=crop&auto=format&sat=-100',
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=120&h=120&fit=crop&auto=format&sat=-100'
    ],
    '2025-01-14': [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.8',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.8',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.8'
    ],
    '2025-01-13': [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.7',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.7',
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.7',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.7'
    ],
    '2025-01-10': [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.6',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&h=120&fit=crop&auto=format&sat=-100&brightness=0.6'
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
    // Initialize only specific blocks by default
    const defaultBlocks = ['ia-summary', 'last-report', 'patient-records', 'visual-map', 'all-images'];
    this.menuOptions.forEach(option => {
      if (defaultBlocks.includes(option.id)) {
        this.selectMenuOption(option);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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
          badges: ['Anterior', 'Posterior', 'Lateral', 'Cross-section'],
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

    this.activeBlocks.push(newBlock);
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
}