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
  checkin_date: string;
  checkin_time: string;
  method: 'manual' | 'qr_code' | 'app';
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  student?: Student;
  amount: number;
  due_date: string;
  payment_date?: string;
  payment_method?: 'cash' | 'card' | 'pix' | 'bank_transfer';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  reference_month: string;
  discount: number;
  late_fee: number;
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

// ============================================================================
// BELT PROGRESSION TYPES
// ============================================================================

export interface BeltPromotion {
  id: string;
  student_id: string;
  promoted_by: string;
  previous_belt: string;
  previous_degree: number;
  new_belt: string;
  new_degree: number;
  promotion_date: string;
  promotion_type: 'regular' | 'skip_degree' | 'honorary' | 'correction';
  requirements_met: {
    technique_test?: boolean;
    sparring_test?: boolean;
    attendance?: boolean;
    time_requirement?: boolean;
    [key: string]: boolean | undefined;
  };
  notes?: string;
  certificate_url?: string;
  student?: Student;
  promoted_by_user?: {
    id: string;
    username: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

export interface BeltProgress {
  student: {
    id: string;
    full_name: string;
    current_belt: string;
    current_degree: number;
    enrollment_date: string;
    status: string;
  };
  progress: {
    days_since_enrollment: number;
    current_level: string;
    total_promotions?: number;
    last_promotion_date?: string;
    time_at_current_belt?: number;
  };
  promotion_history?: BeltPromotion[];
  message?: string;
}

export interface BeltProgressResponse {
  success: boolean;
  data: BeltProgress;
}

export interface BeltDistribution {
  belt: string;
  degree: number;
  count: number;
  percentage: string;
}

export interface BeltOverview {
  belt_distribution: BeltDistribution[];
  summary: {
    total_active_students: number;
    unique_belt_levels: number;
    recent_promotions: number;
    promotions_this_month: number;
  };
  recent_promotions: {
    student_name: string;
    previous_belt: string;
    new_belt: string;
    promotion_date: string;
    promoted_by: string;
  }[];
}

export interface PromoteStudentData {
  student_id: string;
  new_belt: string;
  new_degree: number;
  promotion_type?: 'regular' | 'skip_degree' | 'honorary' | 'correction';
  requirements_met?: {
    technique_test?: boolean;
    sparring_test?: boolean;
    attendance?: boolean;
    time_requirement?: boolean;
    [key: string]: boolean | undefined;
  };
  notes?: string;
  certificate_url?: string;
  promotion_date?: string;
}

export interface PromotionResponse {
  student: {
    id: string;
    full_name: string;
    belt: string;
    belt_degree: number;
    email: string;
    phone: string;
  };
  promotion: {
    previous_belt: string;
    previous_degree: number;
    new_belt: string;
    new_degree: number;
    promotion_date: string;
    notes?: string;
  };
} 