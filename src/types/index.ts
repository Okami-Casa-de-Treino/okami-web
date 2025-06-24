export interface Student {
  id: string;
  fullName: string;
  birthDate: string;
  cpf?: string;
  rg?: string;
  belt?: string;
  beltDegree: number;
  address?: string;
  phone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  medicalObservations?: string;
  photoUrl?: string;
  enrollmentDate: string;
  monthlyFee?: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  birthDate?: string;
  cpf?: string;
  phone?: string;
  email?: string;
  belt?: string;
  beltDegree?: number;
  specialties?: string[];
  hourlyRate?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  teacher?: Teacher;
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  startTime: string;
  endTime: string;
  maxStudents: number;
  beltRequirement?: string;
  ageGroup?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StudentClass {
  id: string;
  studentId: string;
  classId: string;
  student?: Student;
  class?: Class;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
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
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username?: string;
  name?: string;
  reference?: string;
  email?: string;
  role: 'admin' | 'teacher' | 'receptionist';
  teacherId?: string;
  teacher?: Teacher;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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