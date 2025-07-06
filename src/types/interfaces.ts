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
  FilterParams,
  BeltPromotion,
  BeltProgress,
  BeltOverview,
  PromoteStudentData,
  PromotionResponse,
  Video,
  VideoUploadData,
  VideoUpdateData,
  Module
} from '.';
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
  generateMonthlyPayments(reference_month: string, due_day: number): Promise<ApiResponse<Payment[]>>;
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

export interface IBeltProgressionService {
  // Promotions
  getAllPromotions(params?: FilterParams): Promise<PaginatedResponse<BeltPromotion>>;
  getPromotionById(id: string): Promise<BeltPromotion>;
  promoteStudent(data: PromoteStudentData): Promise<PromotionResponse>;
  
  // Student progress
  getStudentProgress(studentId: string): Promise<BeltProgress>;
  
  // Overview and statistics
  getBeltOverview(): Promise<ApiResponse<BeltOverview>>;
}

export interface ToastOptions {
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

export interface IToastService {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => void;
  dismiss: (toastId?: string | number) => void;
  dismissAll: () => void;
}

export interface IVideoService {
  getAll(params?: FilterParams): Promise<PaginatedResponse<Video>>;
  getById(id: string): Promise<Video>;
  create(videoData: VideoUploadData): Promise<Video>;
  update(id: string, videoData: VideoUpdateData): Promise<Video>;
  delete(id: string): Promise<void>;
  getByModule(moduleId: string): Promise<Video[]>;
  getByClass(classId: string): Promise<Video[]>;
  getFreeVideos(): Promise<Video[]>;
  uploadFile(file: File): Promise<{ success: boolean; data: { file_url: string; thumbnail_url?: string; file_size?: number; mime_type?: string } }>;
}

export interface IModuleService {
  getAll(): Promise<Module[]>;
  getById(id: string): Promise<Module>;
  create(module: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<Module>;
  update(id: string, module: Partial<Module>): Promise<Module>;
  delete(id: string): Promise<void>;
} 