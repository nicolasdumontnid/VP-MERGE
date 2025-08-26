import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
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
  isConversationMenuOpen = false;
  
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
  chatCollapsed = false;
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
    }
  ];
  
  filteredConversations = [...this.conversations];
  isConversationMenuOpen = false;
  
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
  chatCollapsed = false;
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
    }
  ];
  
  filteredConversations = [...this.conversations];

  toggleManagementDropdown(): void {
    this.isManagementDropdownOpen = !this.isManagementDropdownOpen;
    this.isMenuDropdownOpen = false;
    this.isConversationMenuOpen = false;
  }

  toggleMenuDropdown(): void {
    this.isMenuDropdownOpen = !this.isMenuDropdownOpen;
    this.isManagementDropdownOpen = false;
    this.isConversationMenuOpen = false;
  }
  
  toggleConversationMenu(): void {
    this.isConversationMenuOpen = !this.isConversationMenuOpen;
    this.isConversationMenuOpen = false;
  }
  
  toggleConversationMenu(): void {
    this.isConversationMenuOpen = !this.isConversationMenuOpen;
  }

  closeDropdowns(): void {
    this.isManagementDropdownOpen = false;
    this.isMenuDropdownOpen = false;
    this.isConversationMenuOpen = false;
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
  }
  
  navigateToPending(): void {
    this.setBreadcrumb('Pending');
  }
  
  navigateToSecondOpinion(): void {
    this.setBreadcrumb('Second Opinion');
  }
  
  navigateToCompleted(): void {
    this.setBreadcrumb('Completed');
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
  
  constructor() {
    this.sortConversations();
  }
  
  // BOXES navigation methods
  navigateToInbox(): void {
    this.setBreadcrumb('Inbox');
  }
  
  navigateToPending(): void {
    this.setBreadcrumb('Pending');
  }
  
  navigateToSecondOpinion(): void {
    this.setBreadcrumb('Second Opinion');
  }
  
  navigateToCompleted(): void {
    this.setBreadcrumb('Completed');
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
  
  constructor() {
    this.sortConversations();
  }
}