import { useEffect, useMemo } from 'react';
import { useStudentStore } from '../../../stores/studentStore';
import { useTeacherStore } from '../../../stores/teacherStore';
import { useClassStore } from '../../../stores/classStore';
import { useCheckinStore } from '../../../stores/checkinStore';
import { usePaymentStore } from '../../../stores/paymentStore';
import { formatTime } from '../../../utils/dateUtils';

interface Activity {
  time: string;
  activity: string;
  type: 'checkin' | 'payment' | 'student' | 'class' | 'teacher';
}

export const useAdminDashboard = () => {
  // Store hooks
  const { fetchStudents, students, isLoading: isLoadingStudents } = useStudentStore();
  const { fetchTeachers, teachers, isLoading: isLoadingTeachers } = useTeacherStore();
  const { fetchClasses, classes, isLoading: isLoadingClasses } = useClassStore();
  const { fetchTodayCheckins, todayCheckins, isLoadingToday } = useCheckinStore();
  const { fetchPayments, fetchOverduePayments, payments, overduePayments, loading: paymentLoading } = usePaymentStore();

  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchStudents({ limit: 1000 }); 
    fetchTeachers({ limit: 1000 }); 
    fetchClasses({ limit: 1000 }); 
    fetchTodayCheckins();
    fetchPayments();
    fetchOverduePayments();
  }, [fetchStudents, fetchTeachers, fetchClasses, fetchTodayCheckins, fetchPayments, fetchOverduePayments]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeTeachers = teachers.filter(teacher => teacher.status === 'active');
    const activeClasses = classes.filter(classItem => classItem.status === 'active');
    
    // Calculate monthly revenue from paid payments
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date || '');
      return payment.status === 'paid' && 
             paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyPayments.reduce((total, payment) => {
      const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : (payment.amount || 0);
      return total + amount;
    }, 0);
    
    // Calculate pending payments
    const pendingPayments = payments.filter(payment => payment.status === 'pending');
    
    // Calculate new students this month
    const newStudentsThisMonth = students.filter(student => {
      const enrollmentDate = new Date(student.enrollment_date);
      return enrollmentDate.getMonth() === currentMonth && 
             enrollmentDate.getFullYear() === currentYear;
    });

    return [
      {
        title: 'Total de Alunos',
        value: students.length,
        description: `${newStudentsThisMonth.length} novos este mês`,
        trend: newStudentsThisMonth.length > 0 ? `+${newStudentsThisMonth.length}` : '0'
      },
      {
        title: 'Professores Ativos',
        value: activeTeachers.length,
        description: `${activeTeachers.length} de ${teachers.length} disponíveis`,
        trend: teachers.length > 0 ? `${Math.round((activeTeachers.length / teachers.length) * 100)}%` : '0%'
      },
      {
        title: 'Aulas Ativas',
        value: activeClasses.length,
        description: `${activeClasses.length} aulas disponíveis`,
        trend: classes.length > 0 ? `${Math.round((activeClasses.length / classes.length) * 100)}%` : '0%'
      },
      {
        title: 'Check-ins Hoje',
        value: todayCheckins.length,
        description: `Última hora: ${todayCheckins.filter(checkin => {
          const checkinTime = new Date(checkin.created_at);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          return checkinTime > oneHourAgo;
        }).length}`,
        trend: todayCheckins.length > 0 ? `+${todayCheckins.length}` : '0'
      },
      {
        title: 'Receita Mensal',
        value: formatCurrency(monthlyRevenue),
        description: `Receita do mês atual`,
        trend: monthlyRevenue > 0 ? `+${formatCurrency(monthlyRevenue)}` : 'R$ 0,00'
      },
      {
        title: 'Pagamentos Pendentes',
        value: pendingPayments.length,
        description: `${overduePayments.length} em atraso`,
        trend: overduePayments.length > 0 ? `+${overduePayments.length}` : '0'
      }
    ];
  }, [students, teachers, classes, todayCheckins, payments, overduePayments]);

  // Get recent activities
  const recentActivities = useMemo(() => {
    const activities: Activity[] = [];
    
    // Add recent check-ins
    const recentCheckins = todayCheckins.slice(0, 3);
    recentCheckins.forEach(checkin => {
      activities.push({
        time: new Date(checkin.created_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        activity: `${checkin.student?.full_name || 'Aluno'} fez check-in na aula`,
        type: 'checkin'
      });
    });

    // Add recent payments
    const recentPayments = payments
      .filter(payment => payment.status === 'paid')
      .slice(0, 2);
    recentPayments.forEach(payment => {
      activities.push({
        time: new Date(payment.payment_date || payment.created_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        activity: `${payment.student?.full_name || 'Aluno'} pagou mensalidade`,
        type: 'payment'
      });
    });

    // Add recent student enrollments
    const recentStudents = students
      .sort((a, b) => new Date(b.enrollment_date).getTime() - new Date(a.enrollment_date).getTime())
      .slice(0, 2);
    recentStudents.forEach(student => {
      activities.push({
        time: new Date(student.enrollment_date).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        activity: `Novo aluno cadastrado: ${student.full_name}`,
        type: 'student'
      });
    });

    // Sort by time and take the most recent 5
    return activities
      .sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      })
      .slice(0, 5);
  }, [todayCheckins, payments, students]);

  // Get upcoming classes for today
  const upcomingClasses = useMemo(() => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    return classes
      .filter(classItem => {
        // Filter classes that happen today
        return classItem.status === 'active' && classItem.days_of_week.includes(today);
      })
      .map(classItem => {
        // Parse start time
        const [hours, minutes] = classItem.start_time.split(':').map(Number);
        const classStartTime = hours * 60 + minutes;
        
        // Determine if it's the next class
        const isNext = classStartTime > currentTime && classStartTime <= currentTime + 60; // Within next hour
        
        return {
          time: formatTime(classItem.start_time), // Format the ISO date string to HH:mm
          name: classItem.name,
          teacher: classItem.teacher?.full_name || 'Professor',
          students: 0, // This would need to be fetched from class enrollments
          status: isNext ? 'next' : 'scheduled'
        };
      })
      .sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      })
      .slice(0, 4);
  }, [classes]);

  const isLoading = isLoadingStudents || isLoadingTeachers || isLoadingClasses || isLoadingToday || paymentLoading.list;

  return {
    stats,
    recentActivities,
    upcomingClasses,
    isLoading,
    students,
    teachers,
    classes,
    todayCheckins,
    payments,
    overduePayments
  };
}; 