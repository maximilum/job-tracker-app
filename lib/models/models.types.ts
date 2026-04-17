export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}

export interface Column {
  _id: string;
  name: string;
  boardId: string;
  order: number;
  userId: string;
  jobApplications: JobApplication[];
}

export interface JobApplication {
  _id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  columnId: string;
  boardId: string;
  userId: string;
  order: number;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  appliedDate?: Date;
  tags?: string[];
  description?: string;
}
