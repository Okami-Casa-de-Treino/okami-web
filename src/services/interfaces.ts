import { 
  Student, 
  Teacher, 
  Class, 
  Checkin, 
  Payment, 
  User, 
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  FilterParams 
} from '../types';
import { StudentEnrollment } from '../pages/shared/ClassDetails/types';

export interface IApiService {
  get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

export interface IStudentService {
  getAll(params?: FilterParams): Promise<PaginatedResponse<Student>>;
  getById(id: string): Promise<Student>;
  create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student>;
  update(id: string, student: Partial<Student>): Promise<Student>;
  delete(id: string): Promise<void>;
  getCheckins(id: string): Promise<Checkin[]>;
  getPayments(id: string): Promise<Payment[]>;
  getClasses(id: string): Promise<Class[]>;
  enrollInClass(studentId: string, classId: string): Promise<void>;
  unenrollFromClass(studentId: string, classId: string): Promise<void>;
}

export interface ITeacherService {
  getAll(params?: FilterParams): Promise<PaginatedResponse<Teacher>>;
  getById(id: string): Promise<Teacher>;
  create(teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher>;
  update(id: string, teacher: Partial<Teacher>): Promise<Teacher>;
  delete(id: string): Promise<void>;
  getClasses(id: string): Promise<Class[]>;
}

export interface IClassService {
  getAll(params?: FilterParams): Promise<PaginatedResponse<Class>>;
  getById(id: string): Promise<Class>;
  create(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<Class>;
  update(id: string, classData: Partial<Class>): Promise<Class>;
  delete(id: string): Promise<void>;
  getStudents(id: string): Promise<StudentEnrollment[]>;
  getCheckins(id: string): Promise<Checkin[]>;
  getSchedule(): Promise<Record<string, Class[]>>;
}

export interface ICheckinService {
  getAll(params?: FilterParams): Promise<PaginatedResponse<Checkin>>;
  create(checkin: Omit<Checkin, 'id' | 'created_at'>): Promise<Checkin>;
  getTodayCheckins(): Promise<Checkin[]>;
  getByStudent(studentId: string): Promise<Checkin[]>;
  getByClass(classId: string): Promise<Checkin[]>;
  delete(id: string): Promise<void>;
}

export interface IPaymentService {
  getAll(params?: FilterParams): Promise<PaginatedResponse<Payment>>;
  getById(id: string): Promise<Payment>;
  create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment>;
  update(id: string, payment: Partial<Payment>): Promise<Payment>;
  delete(id: string): Promise<void>;
  markAsPaid(id: string, paymentMethod: string, paymentDate?: string): Promise<Payment>;
  getOverdue(): Promise<Payment[]>;
  getByStudent(studentId: string): Promise<Payment[]>;
  generateMonthlyPayments(month: string): Promise<Payment[]>;
}

export interface IAuthService {
  login(username: string, password: string): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  getCurrentUser(): Promise<User>;
}

export interface IReportService {
  getDashboardStats(): Promise<DashboardStats>;
  getAttendanceReport(params?: FilterParams): Promise<Record<string, unknown>>;
  getFinancialReport(params?: FilterParams): Promise<Record<string, unknown>>;
  getStudentReport(params?: FilterParams): Promise<Record<string, unknown>>;
  getClassReport(params?: FilterParams): Promise<Record<string, unknown>>;
} 