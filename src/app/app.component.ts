import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Medical Application';
  currentBreadcrumb = 'Dashboard';
  isManagementDropdownOpen = false;
  isMenuDropdownOpen = false;
  
  // BOXES data
  inboxCount = Math.floor(Math.random() * 21);
  pendingCount = Math.floor(Math.random() * 21);
  secondOpinionCount = Math.floor(Math.random() * 21);
  completedCount = Math.floor(Math.random() * 21);
  
  // PRESETS data
  presetsFilter = '';
  presetsCollapsed = false;
  presets = [
    { name: 'Hopital Saint-Luc (UCLouvain)', count: 12 },
    { name: 'Clinique Saint-Luc (Bouge)', count: 7 },
    { name: 'Hôpital Vivalia (Arlon)', count: 3 },
    { name: 'URGENCE Jolimont', count: 1 }
  ];
  filteredPresets = [...this.presets];
  
  // CHAT data
  chatFilter = '';
  chatCollapsed = true;
  selectedConversation: any = null;
  newMessage = '';
  
  conversations = [
    {
      id: 1,
      recipient: 'Dr. Marie Dubois',
      patientName: 'Jean Martin',
      examDate: new Date('2025-01-15'),
      examDescription: 'CT Scan - Chest examination for diagnostic purposes. Patient presents with persistent cough and chest pain.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isUnread: false,
      isPinned: true,
      lastMessageDate: new Date('2025-01-15T14:30:00'),
      messages: [
        { sender: 'Dr. Marie Dubois', content: 'Hello, I need your opinion on this case.', timestamp: new Date('2025-01-15T14:00:00') },
        { sender: 'Damien', content: 'Of course, I\'ll take a look at the images.', timestamp: new Date('2025-01-15T14:30:00') }
      ]
    },
    {
      id: 2,
      recipient: 'Dr. Pierre Leroy',
      patientName: 'Sophie Bernard',
      examDate: new Date('2025-01-14'),
      examDescription: 'MRI - Brain scan following patient complaints of severe headaches and vision problems.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T16:45:00'),
      messages: [
        { sender: 'Dr. Pierre Leroy', content: 'Could you review the latest findings?', timestamp: new Date('2025-01-15T16:45:00') }
      ]
    },
    {
      id: 3,
      recipient: 'Dr. Claire Moreau',
      patientName: 'Michel Rousseau',
      examDate: new Date('2025-01-13'),
      examDescription: 'X-Ray - Spine examination after patient fall. Checking for potential fractures or displacement.',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T09:20:00'),
      messages: [
        { sender: 'Dr. Claire Moreau', content: 'The patient has been responding well.', timestamp: new Date('2025-01-15T09:20:00') }
      ]
    },
    {
      id: 4,
      recipient: 'Dr. Thomas Petit',
      patientName: 'Anne Durand',
      examDate: new Date('2025-01-12'),
      examDescription: 'Ultrasound - Abdominal examination for suspected gallbladder issues.',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-14T11:15:00'),
      messages: [
        { sender: 'Dr. Thomas Petit', content: 'I recommend scheduling a follow-up.', timestamp: new Date('2025-01-14T11:15:00') },
        { sender: 'Damien', content: 'Agreed, let\'s schedule it for next week.', timestamp: new Date('2025-01-14T11:30:00') }
      ]
    },
    {
      id: 5,
      recipient: 'Dr. Sarah Johnson',
      patientName: 'Paul Mercier',
      examDate: new Date('2025-01-11'),
      examDescription: 'CT Scan - Abdominal examination for suspected appendicitis.',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T08:30:00'),
      messages: [
        { sender: 'Dr. Sarah Johnson', content: 'Urgent case, please review ASAP.', timestamp: new Date('2025-01-15T08:30:00') }
      ]
    },
    {
      id: 6,
      recipient: 'Dr. Marc Lefebvre',
      patientName: 'Emma Girard',
      examDate: new Date('2025-01-10'),
      examDescription: 'MRI - Knee examination following sports injury.',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      isUnread: false,
      isPinned: true,
      lastMessageDate: new Date('2025-01-14T17:20:00'),
      messages: [
        { sender: 'Dr. Marc Lefebvre', content: 'The MRI shows some interesting findings.', timestamp: new Date('2025-01-14T17:20:00') }
      ]
    },
    {
      id: 7,
      recipient: 'Dr. Julie Roux',
      patientName: 'Lucas Blanc',
      examDate: new Date('2025-01-09'),
      examDescription: 'X-Ray - Chest examination for pneumonia screening.',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T12:45:00'),
      messages: [
        { sender: 'Dr. Julie Roux', content: 'Patient shows signs of improvement.', timestamp: new Date('2025-01-15T12:45:00') }
      ]
    },
    {
      id: 8,
      recipient: 'Dr. Antoine Duval',
      patientName: 'Camille Faure',
      examDate: new Date('2025-01-08'),
      examDescription: 'Ultrasound - Cardiac examination for arrhythmia investigation.',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-13T15:10:00'),
      messages: [
        { sender: 'Dr. Antoine Duval', content: 'Cardiac function appears normal.', timestamp: new Date('2025-01-13T15:10:00') }
      ]
    },
    {
      id: 9,
      recipient: 'Dr. Isabelle Martin',
      patientName: 'Hugo Lemoine',
      examDate: new Date('2025-01-07'),
      examDescription: 'CT Scan - Head examination following concussion.',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T10:15:00'),
      messages: [
        { sender: 'Dr. Isabelle Martin', content: 'No signs of internal bleeding detected.', timestamp: new Date('2025-01-15T10:15:00') }
      ]
    },
    {
      id: 10,
      recipient: 'Dr. François Garnier',
      patientName: 'Léa Moreau',
      examDate: new Date('2025-01-06'),
      examDescription: 'MRI - Spine examination for chronic back pain.',
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-12T14:30:00'),
      messages: [
        { sender: 'Dr. François Garnier', content: 'Disc herniation confirmed at L4-L5.', timestamp: new Date('2025-01-12T14:30:00') }
      ]
    },
    {
      id: 11,
      recipient: 'Dr. Nathalie Perrin',
      patientName: 'Maxime Roussel',
      examDate: new Date('2025-01-05'),
      examDescription: 'X-Ray - Wrist examination following fracture.',
      avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T13:20:00'),
      messages: [
        { sender: 'Dr. Nathalie Perrin', content: 'Healing process is progressing well.', timestamp: new Date('2025-01-15T13:20:00') }
      ]
    },
    {
      id: 12,
      recipient: 'Dr. Olivier Bonnet',
      patientName: 'Chloé Dupuis',
      examDate: new Date('2025-01-04'),
      examDescription: 'Ultrasound - Thyroid examination for nodule assessment.',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      isUnread: false,
      isPinned: true,
      lastMessageDate: new Date('2025-01-14T09:45:00'),
      messages: [
        { sender: 'Dr. Olivier Bonnet', content: 'Nodule appears benign, recommend monitoring.', timestamp: new Date('2025-01-14T09:45:00') }
      ]
    },
    {
      id: 13,
      recipient: 'Dr. Céline Vidal',
      patientName: 'Nathan Chevalier',
      examDate: new Date('2025-01-03'),
      examDescription: 'CT Scan - Lung examination for persistent cough.',
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T11:30:00'),
      messages: [
        { sender: 'Dr. Céline Vidal', content: 'Possible pneumonia, starting treatment.', timestamp: new Date('2025-01-15T11:30:00') }
      ]
    },
    {
      id: 14,
      recipient: 'Dr. Stéphane Leclerc',
      patientName: 'Manon Gauthier',
      examDate: new Date('2025-01-02'),
      examDescription: 'MRI - Shoulder examination for rotator cuff injury.',
      avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-13T16:15:00'),
      messages: [
        { sender: 'Dr. Stéphane Leclerc', content: 'Partial tear confirmed, surgery recommended.', timestamp: new Date('2025-01-13T16:15:00') }
      ]
    },
    {
      id: 15,
      recipient: 'Dr. Valérie Morel',
      patientName: 'Théo Lambert',
      examDate: new Date('2025-01-01'),
      examDescription: 'X-Ray - Hip examination for arthritis assessment.',
      avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T14:50:00'),
      messages: [
        { sender: 'Dr. Valérie Morel', content: 'Advanced arthritis, consider joint replacement.', timestamp: new Date('2025-01-15T14:50:00') }
      ]
    },
    {
      id: 16,
      recipient: 'Dr. Jérôme Fournier',
      patientName: 'Inès Barbier',
      examDate: new Date('2024-12-31'),
      examDescription: 'Ultrasound - Liver examination for hepatitis screening.',
      avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-12T10:20:00'),
      messages: [
        { sender: 'Dr. Jérôme Fournier', content: 'Liver function tests are normal.', timestamp: new Date('2025-01-12T10:20:00') }
      ]
    },
    {
      id: 17,
      recipient: 'Dr. Sandrine Giraud',
      patientName: 'Quentin Mercier',
      examDate: new Date('2024-12-30'),
      examDescription: 'CT Scan - Pelvis examination for trauma assessment.',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T15:40:00'),
      messages: [
        { sender: 'Dr. Sandrine Giraud', content: 'No fractures detected, soft tissue injury only.', timestamp: new Date('2025-01-15T15:40:00') }
      ]
    },
    {
      id: 18,
      recipient: 'Dr. Christophe Renard',
      patientName: 'Jade Fontaine',
      examDate: new Date('2024-12-29'),
      examDescription: 'MRI - Brain examination for migraine investigation.',
      avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-11T13:25:00'),
      messages: [
        { sender: 'Dr. Christophe Renard', content: 'No structural abnormalities found.', timestamp: new Date('2025-01-11T13:25:00') }
      ]
    },
    {
      id: 19,
      recipient: 'Dr. Aurélie Blanchard',
      patientName: 'Romain Lefevre',
      examDate: new Date('2024-12-28'),
      examDescription: 'X-Ray - Ankle examination following sprain.',
      avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
      isUnread: true,
      isPinned: false,
      lastMessageDate: new Date('2025-01-15T16:10:00'),
      messages: [
        { sender: 'Dr. Aurélie Blanchard', content: 'Grade 2 sprain, recommend physiotherapy.', timestamp: new Date('2025-01-15T16:10:00') }
      ]
    },
    {
      id: 20,
      recipient: 'Dr. Philippe Rousseau',
      patientName: 'Océane Dubois',
      examDate: new Date('2024-12-27'),
      examDescription: 'Ultrasound - Kidney examination for stone detection.',
      avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
      isUnread: false,
      isPinned: false,
      lastMessageDate: new Date('2025-01-10T12:00:00'),
      messages: [
        { sender: 'Dr. Philippe Rousseau', content: 'Small stone detected, monitoring recommended.', timestamp: new Date('2025-01-10T12:00:00') }
      ]
    }
  ];
  
  filteredConversations = [...this.conversations];
  isConversationMenuOpen = false;
  

  toggleManagementDropdown(): void {
    this.isManagementDropdownOpen = !this.isManagementDropdownOpen;
    this.isMenuDropdownOpen = false;
    this.isConversationMenuOpen = false;
  }

  toggleMenuDropdown(): void {
    this.isMenuDropdownOpen = !this.isMenuDropdownOpen;
    this.isManagementDropdownOpen = false;
  }
  
  toggleConversationMenu(): void {
    this.isConversationMenuOpen = !this.isConversationMenuOpen;
  }

  closeDropdowns(): void {
    this.isManagementDropdownOpen = false;
    this.isMenuDropdownOpen = false;
    this.isConversationMenuOpen = false;
  }

  public setBreadcrumb(breadcrumb: string): void {
    this.currentBreadcrumb = breadcrumb;
    this.closeDropdowns();
  }

  logout(): void {
    console.log('Logout clicked');
    this.closeDropdowns();
  }
  
  // BOXES navigation methods
  navigateToInbox(): void {
    this.setBreadcrumb('Inbox');
    this.router.navigate(['/inbox']);
  }
  
  navigateToPending(): void {
    this.setBreadcrumb('Pending');
    this.router.navigate(['/pending']);
  }
  
  navigateToSecondOpinion(): void {
    this.setBreadcrumb('Second Opinion');
    this.router.navigate(['/second-opinion']);
  }
  
  navigateToCompleted(): void {
    this.setBreadcrumb('Completed');
    this.router.navigate(['/completed']);
  }
  
  // PRESETS methods
  filterPresets(): void {
    if (!this.presetsFilter.trim()) {
      this.filteredPresets = [...this.presets];
    } else {
      this.filteredPresets = this.presets.filter(preset =>
        preset.name.toLowerCase().includes(this.presetsFilter.toLowerCase())
      );
    }
  }
  
  public expandPresets(): void {
    this.presetsCollapsed = false;
  }
  
  togglePresetsCollapse(): void {
    this.presetsCollapsed = !this.presetsCollapsed;
  }
  
  selectPreset(preset: any): void {
    this.setBreadcrumb(preset.name);
  }
  
  // CHAT methods
  filterConversations(): void {
    if (!this.chatFilter.trim()) {
      this.filteredConversations = [...this.conversations];
    } else {
      this.filteredConversations = this.conversations.filter(conv =>
        conv.recipient.toLowerCase().includes(this.chatFilter.toLowerCase()) ||
        conv.patientName.toLowerCase().includes(this.chatFilter.toLowerCase()) ||
        conv.examDescription.toLowerCase().includes(this.chatFilter.toLowerCase())
      );
    }
    this.sortConversations();
  }
  
  public expandChat(): void {
    this.chatCollapsed = false;
  }
  
  toggleChatCollapse(): void {
    this.chatCollapsed = !this.chatCollapsed;
  }
  
  sortConversations(): void {
    this.filteredConversations.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isUnread && !b.isUnread) return -1;
      if (!a.isUnread && b.isUnread) return 1;
      return b.lastMessageDate.getTime() - a.lastMessageDate.getTime();
    });
  }
  
  openConversationModal(conversation: any): void {
    this.selectedConversation = conversation;
    if (conversation.isUnread) {
      conversation.isUnread = false;
    }
  }
  
  closeConversationModal(): void {
    this.selectedConversation = null;
    this.newMessage = '';
    this.isConversationMenuOpen = false;
  }
  
  markAsUnread(conversation: any): void {
    conversation.isUnread = true;
    this.sortConversations();
    this.closeConversationModal();
  }
  
  togglePin(conversation: any): void {
    conversation.isPinned = !conversation.isPinned;
    this.sortConversations();
    this.isConversationMenuOpen = false;
  }
  
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    
    const message = {
      sender: 'Damien',
      content: this.newMessage.trim(),
      timestamp: new Date()
    };
    
    this.selectedConversation.messages.push(message);
    this.selectedConversation.lastMessageDate = new Date();
    this.newMessage = '';
  }
  
  formatTimestamp(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  }
  
  formatExamDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  
  formatMessageTime(date: Date): string {
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  truncateDescription(description: string): string {
    const maxLength = 60;
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }
  
  constructor(private router: Router) {
    this.sortConversations();
  }
}