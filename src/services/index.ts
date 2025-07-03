// HTTP Client
export { httpClient, HttpClient } from './httpClient';
export type { ApiError, RequestConfig, HttpClientConfig } from './httpClient';

// Services
export { studentService } from './studentService';
export type { StudentService } from './studentService';
export { teacherService } from './teacherService';
export type { TeacherService } from './teacherService';
export { classService } from './classService';
export type { ClassResponse, ScheduleResponse } from './classService';
export { checkinService } from './checkinService';
export type { CheckinResponse, CheckinCreateData } from './checkinService';
export { paymentService } from './paymentService';
export type { PaymentResponse, PaymentCreateData, MarkAsPaidData } from './paymentService';
export { beltProgressionService } from './beltProgressionService';
export type { BeltProgressionService, BeltProgressionResponse, BeltProgressResponse, BeltOverviewResponse } from './beltProgressionService';

// Legacy API service (if still needed)
export { apiService } from './api'; 