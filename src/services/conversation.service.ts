import { Injectable } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { Conversation, Message } from '../models/conversation.interface';
import { SearchCriteria, SearchResult } from '../models/search-criteria.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private conversations: Conversation[] = [];

  constructor(private mockDataService: MockDataService) {
    this.conversations = this.mockDataService.generateConversations();
  }

  getById(id: string): Observable<Conversation | null> {
    const conversation = this.conversations.find(c => c.id === id);
    return of(conversation || null).pipe(delay(200));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<Conversation>> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let filtered = this.conversations;
        
        if (criteria.query) {
          const query = criteria.query.toLowerCase();
          filtered = filtered.filter(conversation => 
            conversation.examTitle.toLowerCase().includes(query) ||
            conversation.patientName.toLowerCase().includes(query) ||
            conversation.participantNames.some(name => name.toLowerCase().includes(query))
          );
        }

        if (criteria.filters) {
          if (criteria.filters['isUnread']) {
            filtered = filtered.filter(conversation => conversation.isUnread === criteria.filters!['isUnread']);
          }
          if (criteria.filters['isPinned']) {
            filtered = filtered.filter(conversation => conversation.isPinned === criteria.filters!['isPinned']);
          }
        }
        
        // Sort by updatedAt desc by default
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        
        const startIndex = (criteria.page - 1) * criteria.pageSize;
        const endIndex = startIndex + criteria.pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);
        
        return {
          data: paginatedData,
          total: filtered.length,
          page: criteria.page,
          pageSize: criteria.pageSize,
          totalPages: Math.ceil(filtered.length / criteria.pageSize)
        };
      })
    );
  }

  create(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Observable<Conversation> {
    const newConversation: Conversation = {
      ...conversation,
      id: 'C' + String(this.conversations.length + 1).padStart(3, '0'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.conversations.push(newConversation);
    return of(newConversation).pipe(delay(500));
  }

  update(id: string, conversation: Partial<Conversation>): Observable<Conversation> {
    const index = this.conversations.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Conversation not found'));
    }
    
    this.conversations[index] = { 
      ...this.conversations[index], 
      ...conversation,
      updatedAt: new Date()
    };
    return of(this.conversations[index]).pipe(delay(500));
  }

  delete(id: string): Observable<boolean> {
    const index = this.conversations.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Conversation not found'));
    }
    
    this.conversations.splice(index, 1);
    return of(true).pipe(delay(500));
  }

  addMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Observable<Message> {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) {
      return throwError(() => new Error('Conversation not found'));
    }

    const newMessage: Message = {
      ...message,
      id: 'M' + Date.now().toString(),
      timestamp: new Date()
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date();

    return of(newMessage).pipe(delay(300));
  }

  markAsRead(conversationId: string): Observable<boolean> {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) {
      return throwError(() => new Error('Conversation not found'));
    }

    conversation.isUnread = false;
    conversation.messages.forEach(message => message.isRead = true);

    return of(true).pipe(delay(200));
  }

  togglePin(conversationId: string): Observable<boolean> {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) {
      return throwError(() => new Error('Conversation not found'));
    }

    conversation.isPinned = !conversation.isPinned;
    return of(conversation.isPinned).pipe(delay(200));
  }
}