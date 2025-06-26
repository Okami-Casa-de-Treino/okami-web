export interface Student {
  id: string;
  full_name: string;
  birth_date: string;
  cpf?: string;
  rg?: string;
  belt?: string;
  belt_degree: number;
  address?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  medical_observations?: string;
  photo_url?: string;
  enrollment_date: string;
  monthly_fee?: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  full_name: string;
  birth_date?: string;
  cpf?: string;
  phone?: string;
  email?: string;
  belt?: string;
  belt_degree?: number;
  specialties?: string[];
  hourly_rate?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface TeacherResponse {
  data: Teacher;
  success: boolean;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  teacher_id?: string;
  teacher?: Teacher;
  days_of_week: number[]; // Array of days: 0=Sunday, 1=Monday, etc.
  start_time: string;
  end_time: string;
  max_students: number;
  belt_requirement?: string;
  age_group?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface StudentClass {
  id: string;
  student_id: string;
  class_id: string;
  student?: Student;
  class?: Class;
  enrollment_date: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Checkin {
  id: string;
  studentId: string;
  classId: string;
  student?: Student;
  class?: Class;
  checkinDate: string;
  checkinTime: string;
  method: 'manual' | 'qr_code' | 'app';
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  studentId: string;
  student?: Student;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'cash' | 'card' | 'pix' | 'bank_transfer';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  referenceMonth: string;
  discount: number;
  lateFee: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username?: string;
  name?: string;
  reference?: string;
  email?: string;
  role: 'admin' | 'teacher' | 'receptionist' | 'student';
  teacherId?: string;
  teacher?: Teacher;
  studentId?: string;
  student?: Student;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayCheckins: number;
  pendingPayments: number;
  overduePayments: number;
  monthlyRevenue: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} 