import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { Conversation } from '../../../models/conversation.interface';
import { ConversationService } from '../../../services/conversation.service';
import { UserService } from '../../../services/user.service';
import { SearchResult } from '../../../models/search-criteria.interface';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsComponent implements OnInit {
  conversations: Conversation[] = [];
  searchQuery = '';
  showUnreadOnly = false;
  showPinnedOnly = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  selectedConversation: Conversation | null = null;
  newMessage = '';
  
  private searchSubject = new BehaviorSubject<string>('');
  private filtersSubject = new BehaviorSubject<any>({});
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(
    private conversationService: ConversationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.filtersSubject,
      this.pageSubject
    ]).subscribe(([query, filters, page]) => {
      this.loadConversations(query, filters, page);
    });

    this.searchSubject.next('');
  }

  private loadConversations(query: string, filters: any, page: number): void {
    this.conversationService.search({
      query,
      page,
      pageSize: this.pageSize,
      filters
    }).subscribe({
      next: (result: SearchResult<Conversation>) => {
        this.conversations = result.data;
        this.totalPages = result.totalPages;
        this.currentPage = result.page;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
    this.pageSubject.next(1);
  }

  toggleUnreadFilter(): void {
    this.showUnreadOnly = !this.showUnreadOnly;
    this.updateFilters();
  }

  togglePinnedFilter(): void {
    this.showPinnedOnly = !this.showPinnedOnly;
    this.updateFilters();
  }

  private updateFilters(): void {
    const filters: any = {};
    if (this.showUnreadOnly) filters['isUnread'] = true;
    if (this.showPinnedOnly) filters['isPinned'] = true;
    
    this.filtersSubject.next(filters);
    this.pageSubject.next(1);
  }

  getOtherParticipants(conversation: Conversation): string {
    return conversation.participantNames.filter(name => !name.includes('Damien')).join(', ');
  }

  openConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    if (conversation.isUnread) {
      this.markAsRead(conversation);
    }
  }

  closeConversation(): void {
    this.selectedConversation = null;
    this.newMessage = '';
  }

  sendMessage(): void {
    if (!this.selectedConversation || !this.newMessage.trim()) return;

    this.conversationService.addMessage(this.selectedConversation.id, {
      senderId: 'U001', // Damien's ID
      senderName: 'Damien Petit',
      content: this.newMessage.trim(),
      isRead: true
    }).subscribe({
      next: (message) => {
        if (this.selectedConversation) {
          this.selectedConversation.messages.push(message);
          this.selectedConversation.lastMessage = message;
          this.selectedConversation.updatedAt = message.timestamp;
        }
        this.newMessage = '';
      }
    });
  }

  togglePin(conversation: Conversation): void {
    this.conversationService.togglePin(conversation.id).subscribe({
      next: (isPinned) => {
        conversation.isPinned = isPinned;
      }
    });
  }

  markAsRead(conversation: Conversation): void {
    this.conversationService.markAsRead(conversation.id).subscribe({
      next: () => {
        conversation.isUnread = false;
        conversation.messages.forEach(message => message.isRead = true);
      }
    });
  }

  deleteConversation(id: string): void {
    if (confirm('Are you sure you want to delete this conversation?')) {
      this.conversationService.delete(id).subscribe({
        next: () => {
          this.loadConversations(this.searchQuery, this.filtersSubject.value, this.currentPage);
          if (this.selectedConversation?.id === id) {
            this.closeConversation();
          }
        }
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageSubject.next(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageSubject.next(this.currentPage + 1);
    }
  }
}