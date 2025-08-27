export interface ExamElement {
  type: 'radio' | 'mri' | 'slide' | 'video' | 'macro' | 'pdf' | 'excel' | 'text';
  thumbnail: string;
  name: string;
}