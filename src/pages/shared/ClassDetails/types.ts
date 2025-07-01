// Shared types for ClassDetails components

export interface StudentEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrollment_date: string;
  status: string;
  created_at: string;
  student: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    belt: string | null;
    belt_degree: number | null;
    status: string;
    created_at: string;
  };
}

export type TabType = 'details' | 'students' | 'checkins'; 