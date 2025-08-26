import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { Site } from '../models/site.interface';
import { Sector } from '../models/sector.interface';
import { Patient } from '../models/patient.interface';
import { Exam } from '../models/exam.interface';
import { Conversation, Message } from '../models/conversation.interface';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  generateUsers(): User[] {
    return [
      { id: 'U001', firstName: 'Damien', lastName: 'Petit', email: 'damien.petit@chu-angers.fr', specialty: 'Oncologist', site: 'CHU-Angers', isActive: true },
      { id: 'U002', firstName: 'Nicolas', lastName: 'Martin', email: 'nicolas.martin@chu-caen.fr', specialty: 'Oncologist', site: 'CHU-Caen', isActive: true },
      { id: 'U003', firstName: 'Déborah', lastName: 'Dupont', email: 'deborah.dupont@chu-angers.fr', specialty: 'Pediatrician', site: 'CHU-Angers', isActive: true },
      { id: 'U004', firstName: 'Daniel', lastName: 'Bernard', email: 'daniel.bernard@chu-caen.fr', specialty: 'Radiographer', site: 'CHU-Caen', isActive: true },
      { id: 'U005', firstName: 'Sylvie', lastName: 'Moreau', email: 'sylvie.moreau@chu-caen.fr', specialty: 'General Practitioner', site: 'CHU-Caen', isActive: true },
      { id: 'U006', firstName: 'Claire', lastName: 'Rousseau', email: 'claire.rousseau@chu-brest.fr', specialty: 'Cardiologist', site: 'CHU-Brest', isActive: true },
      { id: 'U007', firstName: 'Julien', lastName: 'Leroy', email: 'julien.leroy@chu-brest.fr', specialty: 'Emergency Physician', site: 'CHU-Brest', isActive: true },
      { id: 'U008', firstName: 'Fatima', lastName: 'Benali', email: 'fatima.benali@chu-brest.fr', specialty: 'Neurologist', site: 'CHU-Brest', isActive: true },
      { id: 'U009', firstName: 'Thomas', lastName: 'Dubois', email: 'thomas.dubois@chu-angers.fr', specialty: 'Orthopedic Surgeon', site: 'CHU-Angers', isActive: true },
      { id: 'U010', firstName: 'Marie', lastName: 'Roux', email: 'marie.roux@remote-site.fr', specialty: 'Head Nurse', site: 'Remote site', isActive: true }
    ];
  }

  generateSites(): Site[] {
    return [
      { id: 'S001', name: 'CHU-Angers', type: 'public', address: '4 rue Larrey', city: 'Angers', phone: '02 41 35 36 37', isActive: true },
      { id: 'S002', name: 'CHU-Caen', type: 'public', address: 'Avenue de la Côte de Nacre', city: 'Caen', phone: '02 31 06 31 06', isActive: true },
      { id: 'S003', name: 'CHU-Brest', type: 'public', address: 'Boulevard Tanguy Prigent', city: 'Brest', phone: '02 98 34 71 85', isActive: true },
      { id: 'S004', name: 'Remote site', type: 'private', address: '15 rue de la Télémédecine', city: 'Tours', phone: '02 47 75 45 45', isActive: true },
      { id: 'S005', name: 'CH Le Mans', type: 'public', address: '194 avenue Rubillard', city: 'Le Mans', phone: '02 43 43 43 43', isActive: true },
      { id: 'S006', name: 'AZ Sint-Maarten', type: 'private', address: 'Rooienberg 25', city: 'Duffel', phone: '+32 15 30 50 11', isActive: true }
    ];
  }

  generateSectors(): Sector[] {
    return [
      { id: 'SEC001', name: 'Colon', siteId: 'S001', siteName: 'CHU-Angers', description: 'Colorectal surgery and treatment', isActive: true },
      { id: 'SEC002', name: 'Cytology', siteId: 'S001', siteName: 'CHU-Angers', description: 'Cell structure analysis', isActive: true },
      { id: 'SEC003', name: 'Fluorescence', siteId: 'S001', siteName: 'CHU-Angers', description: 'Fluorescence imaging', isActive: true },
      { id: 'SEC004', name: 'Lungs', siteId: 'S003', siteName: 'CHU-Brest', description: 'Pulmonary medicine', isActive: true },
      { id: 'SEC005', name: 'Chest', siteId: 'S003', siteName: 'CHU-Brest', description: 'Thoracic medicine', isActive: true },
      { id: 'SEC006', name: 'Breast', siteId: 'S003', siteName: 'CHU-Brest', description: 'Breast cancer screening', isActive: true },
      { id: 'SEC007', name: 'Histology', siteId: 'S003', siteName: 'CHU-Brest', description: 'Tissue analysis', isActive: true },
      { id: 'SEC008', name: 'Throat', siteId: 'S002', siteName: 'CHU-Caen', description: 'ENT specialty', isActive: true },
      { id: 'SEC009', name: 'Oncology', siteId: 'S002', siteName: 'CHU-Caen', description: 'Cancer treatment', isActive: true },
      { id: 'SEC010', name: 'General', siteId: 'S002', siteName: 'CHU-Caen', description: 'General medicine', isActive: true }
    ];
  }

  generatePatients(): Patient[] {
    return [
      { id: 'P001', firstName: 'Adam', lastName: 'Morel', dateOfBirth: new Date('2005-03-14'), gender: 'M', bloodType: 'O+', phone: '0624583912', email: 'adam.morel@example.com', address: '12 rue des Acacias, 57000 Metz', socialSecurityNumber: '105031445812345', createdAt: new Date('2023-01-15') },
      { id: 'P002', firstName: 'Gabriel', lastName: 'Laurent', dateOfBirth: new Date('1998-07-02'), gender: 'M', bloodType: 'A-', phone: '0645728109', email: 'gabriel.laurent@example.com', address: '45 avenue de la Liberté, 54000 Nancy', socialSecurityNumber: '198072245709876', createdAt: new Date('2023-02-20') },
      { id: 'P003', firstName: 'Rebecca', lastName: 'Cohen', dateOfBirth: new Date('1985-11-21'), gender: 'F', bloodType: 'B+', phone: '0758669310', email: 'rebecca.cohen@example.com', address: '7 place Saint-Jacques, 75004 Paris', socialSecurityNumber: '285112145896732', createdAt: new Date('2023-03-10') },
      { id: 'P004', firstName: 'Emmy', lastName: 'Dubois', dateOfBirth: new Date('2010-06-05'), gender: 'F', bloodType: 'AB-', phone: '0687142954', email: 'emmy.dubois@example.com', address: '18 rue des Lilas, 69003 Lyon', socialSecurityNumber: '210060545879611', createdAt: new Date('2023-04-05') },
      { id: 'P005', firstName: 'Bastien', lastName: 'Leroy', dateOfBirth: new Date('1992-09-17'), gender: 'M', bloodType: 'O-', phone: '0722483177', email: 'bastien.leroy@example.com', address: '30 rue de Verdun, 31000 Toulouse', socialSecurityNumber: '192091745123498', createdAt: new Date('2023-05-12') },
      { id: 'P006', firstName: 'Lucie', lastName: 'Bernard', dateOfBirth: new Date('2001-01-29'), gender: 'F', bloodType: 'A+', phone: '0639275502', email: 'lucie.bernard@example.com', address: '4 rue Victor Hugo, 13001 Marseille', socialSecurityNumber: '201012945876564', createdAt: new Date('2023-06-18') }
    ];
  }

  generateExams(): Exam[] {
    const exams: Exam[] = [];
    const patients = this.generatePatients();
    const users = this.generateUsers();
    const sites = this.generateSites();
    const sectors = this.generateSectors();
    
    const anatomicalRegions = ['Chest', 'Abdomen', 'Head', 'Pelvis', 'Spine', 'Extremities'];
    const examTypes = ['CT Scan', 'MRI', 'X-Ray', 'Ultrasound', 'PET Scan', 'Biopsy'];
    const departments = ['Radiology', 'Oncology', 'Internal Medicine', 'Surgery', 'Emergency'];
    
    patients.forEach((patient, patientIndex) => {
      for (let i = 0; i < 10; i++) {
        const examDate = i === 0 
          ? this.getRandomDate(new Date(2025, 0, 1), new Date()) // Current month
          : this.getRandomDate(new Date(2024, 9, 1), new Date()); // Last 3 months
        
        const randomSite = sites[Math.floor(Math.random() * sites.length)];
        const randomSector = sectors.find(s => s.siteId === randomSite.id) || sectors[0];
        const assignedUser = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)].firstName + ' ' + users[Math.floor(Math.random() * users.length)].lastName : null;
        
        const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
        
        exams.push({
          id: `E${String(patientIndex + 1).padStart(3, '0')}-${String(i + 1).padStart(2, '0')}`,
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          title: `${examTypes[Math.floor(Math.random() * examTypes.length)]} - ${anatomicalRegions[Math.floor(Math.random() * anatomicalRegions.length)]}`,
          anatomicalRegion: anatomicalRegions[Math.floor(Math.random() * anatomicalRegions.length)],
          examDate,
          patientWeight: 50 + Math.floor(Math.random() * 50),
          patientAge: age,
          diagnosis: ['positive', 'negative', 'pending'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'pending',
          department: departments[Math.floor(Math.random() * departments.length)],
          description: `${examTypes[Math.floor(Math.random() * examTypes.length)]} examination of ${anatomicalRegions[Math.floor(Math.random() * anatomicalRegions.length)].toLowerCase()} region for diagnostic purposes.`,
          conclusion: Math.random() > 0.5 ? 'Normal findings' : 'Requires follow-up examination',
          prescribingPhysician: users[Math.floor(Math.random() * users.length)].firstName + ' ' + users[Math.floor(Math.random() * users.length)].lastName,
          assignedRadiologist: assignedUser,
          siteId: randomSite.id,
          siteName: randomSite.name,
          sectorId: randomSector.id,
          sectorName: randomSector.name,
          status: ['scheduled', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
        });
      }
    });
    
    return exams;
  }

  generateConversations(): Conversation[] {
    const conversations: Conversation[] = [];
    const users = this.generateUsers();
    const exams = this.generateExams().slice(0, 20);
    const currentUser = users[0]; // Damien
    
    const messageContents = [
      'Hello, I need your opinion on this case.',
      'The imaging results are quite interesting.',
      'Could you review the latest findings?',
      'I think we should discuss the treatment plan.',
      'The patient has been responding well.',
      'We might need additional tests.',
      'Please check the latest lab results.',
      'I recommend scheduling a follow-up.',
      'The diagnosis seems clear now.',
      'Let\'s coordinate the next steps.'
    ];
    
    exams.forEach((exam, index) => {
      const otherUser = users[Math.floor(Math.random() * (users.length - 1)) + 1];
      const messageCount = 5 + Math.floor(Math.random() * 6);
      const messages: Message[] = [];
      
      const isToday = index < 6;
      const baseDate = isToday ? new Date() : this.getRandomDate(new Date(2024, 9, 1), new Date());
      
      for (let i = 0; i < messageCount; i++) {
        const messageDate = new Date(baseDate.getTime() + i * 30 * 60000); // 30 minutes apart
        const isFromCurrentUser = Math.random() > 0.5;
        const sender = isFromCurrentUser ? currentUser : otherUser;
        
        messages.push({
          id: this.generateId(),
          senderId: sender.id,
          senderName: `${sender.firstName} ${sender.lastName}`,
          content: messageContents[Math.floor(Math.random() * messageContents.length)],
          timestamp: messageDate,
          isRead: Math.random() > 0.2
        });
      }
      
      const isUnread = index < 3 || (index === 4); // 3 unread + 1 pinned unread
      const isPinned = index === 4 || index === 5; // 2 pinned (one unread, one read)
      
      conversations.push({
        id: `C${String(index + 1).padStart(3, '0')}`,
        participants: [currentUser.id, otherUser.id],
        participantNames: [`${currentUser.firstName} ${currentUser.lastName}`, `${otherUser.firstName} ${otherUser.lastName}`],
        examId: exam.id,
        examTitle: exam.title,
        patientName: exam.patientName,
        lastMessage: messages[messages.length - 1],
        messages,
        isUnread,
        isPinned,
        createdAt: baseDate,
        updatedAt: messages[messages.length - 1].timestamp
      });
    });
    
    return conversations;
  }
}