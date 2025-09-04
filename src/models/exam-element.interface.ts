export interface ExamElement {
  type: 'radio' | 'mri' | 'slide' | 'video' | 'macro' | 'pdf' | 'excel' | 'text' | 'cytology';
  thumbnail: string;
  name: string;
}