export interface Task {
  id: number;
  assignedTo: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  dueDate: string; // ISO string
  priority: 'Low' | 'Normal' | 'High';
  comments: string;
} 