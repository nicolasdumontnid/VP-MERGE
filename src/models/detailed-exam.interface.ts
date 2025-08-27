import { Exam } from './exam.interface';
import { ExamElement } from './exam-element.interface';
import { SharedUser } from './shared-user.interface';

export interface DetailedExam extends Exam {
  reference: string;
  elements: ExamElement[];
  sharedUsers: SharedUser[];
  showImagesInline: boolean;
}