// HTTP Client
export { httpClient, HttpClient } from './httpClient';
export type { ApiError, RequestConfig, HttpClientConfig } from './httpClient';

// Services
export { studentService } from './studentService';
export type { StudentService } from './studentService';
export { teacherService } from './teacherService';
export type { TeacherService } from './teacherService';
export { classService } from './classService';
export type { ClassResponse } from './classService';

// Legacy API service (if still needed)
export { apiService } from './api'; 