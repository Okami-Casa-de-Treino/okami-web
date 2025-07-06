import { useAuthStore } from '../../../stores/authStore';

export const useStudentDashboard = () => {
  const { user } = useAuthStore();
  
  // Get student data from the user object
  const student = user?.student;
  
  // Mock data for now - in real app, this would come from API calls
  const studentStats = {
    upcomingClasses: 3,
    attendanceThisMonth: 12,
    nextPaymentDue: '2024-02-15',
    currentBelt: student?.belt || 'Branca',
    beltDegree: student?.belt_degree || 1,
    enrollmentDate: student?.enrollment_date || '2023-06-01',
  };

  const upcomingClasses = [
    { id: 1, name: 'Jiu-Jitsu Adulto', time: '19:00', day: 'Segunda-feira', instructor: 'Prof. João' },
    { id: 2, name: 'Jiu-Jitsu Adulto', time: '19:00', day: 'Quarta-feira', instructor: 'Prof. João' },
    { id: 3, name: 'Jiu-Jitsu Adulto', time: '19:00', day: 'Sexta-feira', instructor: 'Prof. João' },
  ];

  const recentCheckins = [
    { id: 1, date: '2024-01-10', time: '19:00', class: 'Jiu-Jitsu Adulto' },
    { id: 2, date: '2024-01-08', time: '19:00', class: 'Jiu-Jitsu Adulto' },
    { id: 3, date: '2024-01-05', time: '19:00', class: 'Jiu-Jitsu Adulto' },
  ];

  const studentName = student?.full_name || user?.name || user?.username || 'Aluno';

  return {
    student,
    studentStats,
    upcomingClasses,
    recentCheckins,
    studentName,
  };
}; 