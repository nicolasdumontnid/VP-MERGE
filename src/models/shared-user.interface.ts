export interface SharedUser {
  name: string;
  completion: number;
  status: 'pending' | 'in-progress' | 'not-viewed' | 'completed';
}