export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  examId: string;
  examTitle: string;
  patientName: string;
  lastMessage: Message;
  messages: Message[];
  isUnread: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}