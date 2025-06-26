import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import { LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoggingIn, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login({ username: data.username, password: data.password });
      // Login successful - the auth store will handle navigation via the auth state
    } catch (err) {
      // Error is already handled by the auth store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">🥋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Okami</h1>
          <p className="text-gray-600">Sistema de Gestão</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('username', { 
                required: 'Usuário é obrigatório',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
              })}
              placeholder="Digite seu usuário"
              onFocus={() => error && clearError()}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password', { 
                  required: 'Senha é obrigatória',
                  minLength: { value: 4, message: 'Mínimo 4 caracteres' }
                })}
                placeholder="Digite sua senha"
                onFocus={() => error && clearError()}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-secondary to-primary text-white py-3 px-4 rounded-lg font-medium hover:from-primary/80 hover:to-secondary/80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              <span className="font-medium">Teste:</span> admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 