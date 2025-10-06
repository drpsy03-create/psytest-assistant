import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Eye, EyeOff, Shield, ArrowLeft, UserCheck, Stethoscope } from 'lucide-react';

interface AuthFormProps {
  onBack: () => void;
  onAuthSuccess: (user: { role: 'doctor' | 'patient'; name: string; id: string }) => void;
}

type AuthMode = 'select' | 'doctor-login' | 'doctor-register' | 'patient-access';

export function AuthForm({ onBack, onAuthSuccess }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('select');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [patientName, setPatientName] = useState('');

  const handleDoctorLogin = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      onAuthSuccess({
        role: 'doctor',
        name: name || email.split('@')[0],
        id: 'doc_' + Date.now()
      });
      setLoading(false);
    }, 1000);
  };

  const handleDoctorRegister = async () => {
    if (!email || !password || !name) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock successful registration
      onAuthSuccess({
        role: 'doctor',
        name,
        id: 'doc_' + Date.now()
      });
      setLoading(false);
    }, 1000);
  };

  const handlePatientAccess = async () => {
    if (!accessCode || !patientName) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock successful access (in real app, validate access code with doctor's system)
      onAuthSuccess({
        role: 'patient',
        name: patientName,
        id: 'patient_' + Date.now()
      });
      setLoading(false);
    }, 1000);
  };

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 
          className="text-2xl leading-tight"
          style={{ 
            fontWeight: '600',
            color: '#1F2937',
            letterSpacing: '-0.02em'
          }}
        >
          Добро пожаловать
        </h2>
        <p style={{ color: '#6B7280', fontWeight: '400' }}>
          Выберите тип доступа к системе
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => setAuthMode('doctor-login')}
          className="w-full py-4 px-6 text-base rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg bg-white border-2 border-blue-100 hover:border-blue-200 text-gray-700 hover:text-gray-900"
        >
          <Stethoscope className="h-5 w-5 mr-3" />
          Я врач
        </Button>
        
        <Button
          onClick={() => setAuthMode('patient-access')}
          className="w-full py-4 px-6 text-base rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
          style={{
            backgroundColor: '#2563EB',
            fontWeight: '600',
            letterSpacing: '-0.01em'
          }}
        >
          <UserCheck className="h-5 w-5 mr-3" />
          Я пациент
        </Button>
      </div>
    </div>
  );

  const renderDoctorAuth = () => (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setAuthMode('select')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: '#6B7280' }} />
        </button>
        <div>
          <h2 
            className="text-2xl leading-tight"
            style={{ 
              fontWeight: '600',
              color: '#1F2937',
              letterSpacing: '-0.02em'
            }}
          >
            Вход для врачей
          </h2>
          <p style={{ color: '#6B7280', fontWeight: '400' }}>
            Доступ к панели управления и результатам
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {authMode === 'doctor-register' && (
          <div className="space-y-3">
            <label 
              className="block text-sm"
              style={{ 
                color: '#374151', 
                fontWeight: '500',
                letterSpacing: '-0.005em'
              }}
            >
              Полное имя
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              className="w-full px-4 py-4 text-base rounded-2xl border border-gray-200/80 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        )}

        <div className="space-y-3">
          <label 
            className="block text-sm"
            style={{ 
              color: '#374151', 
              fontWeight: '500',
              letterSpacing: '-0.005em'
            }}
          >
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@clinic.com"
            className="w-full px-4 py-4 text-base rounded-2xl border border-gray-200/80 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="space-y-3">
          <label 
            className="block text-sm"
            style={{ 
              color: '#374151', 
              fontWeight: '500',
              letterSpacing: '-0.005em'
            }}
          >
            Пароль
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-4 pr-12 text-base rounded-2xl border border-gray-200/80 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" style={{ color: '#6B7280' }} />
              ) : (
                <Eye className="h-4 w-4" style={{ color: '#6B7280' }} />
              )}
            </button>
          </div>
        </div>

        <Button
          onClick={authMode === 'doctor-register' ? handleDoctorRegister : handleDoctorLogin}
          disabled={loading || !email || !password || (authMode === 'doctor-register' && !name)}
          className="w-full py-4 px-6 text-base rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          style={{
            backgroundColor: '#2563EB',
            fontWeight: '600',
            letterSpacing: '-0.01em'
          }}
        >
          {loading ? 'Проверка...' : (authMode === 'doctor-register' ? 'Зарегистрироваться' : 'Войти')}
        </Button>

        <div className="text-center">
          <button
            onClick={() => setAuthMode(authMode === 'doctor-login' ? 'doctor-register' : 'doctor-login')}
            className="text-sm transition-colors duration-200"
            style={{ color: '#6B7280' }}
          >
            {authMode === 'doctor-login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPatientAccess = () => (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setAuthMode('select')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: '#6B7280' }} />
        </button>
        <div>
          <h2 
            className="text-2xl leading-tight"
            style={{ 
              fontWeight: '600',
              color: '#1F2937',
              letterSpacing: '-0.02em'
            }}
          >
            Доступ пациента
          </h2>
          <p style={{ color: '#6B7280', fontWeight: '400' }}>
            Введите код доступа от вашего врача
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label 
            className="block text-sm"
            style={{ 
              color: '#374151', 
              fontWeight: '500',
              letterSpacing: '-0.005em'
            }}
          >
            Ваше имя
          </label>
          <Input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Введите ваше имя"
            className="w-full px-4 py-4 text-base rounded-2xl border border-gray-200/80 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="space-y-3">
          <label 
            className="block text-sm"
            style={{ 
              color: '#374151', 
              fontWeight: '500',
              letterSpacing: '-0.005em'
            }}
          >
            Код доступа
          </label>
          <Input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="ABCD-1234"
            className="w-full px-4 py-4 text-base rounded-2xl border border-gray-200/80 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono tracking-wider"
          />
        </div>

        <Button
          onClick={handlePatientAccess}
          disabled={loading || !accessCode || !patientName}
          className="w-full py-4 px-6 text-base rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          style={{
            backgroundColor: '#2563EB',
            fontWeight: '600',
            letterSpacing: '-0.01em'
          }}
        >
          {loading ? 'Проверка...' : 'Войти в систему'}
        </Button>

        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 mt-0.5" style={{ color: '#3B82F6' }} />
            <div>
              <p className="text-sm" style={{ color: '#1E40AF', fontWeight: '500' }}>
                Код доступа
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                Получите уникальный код у вашего врача для безопасного доступа к тестированию
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #FAFAFA 100%)' }}>
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M20,100 Q50,20 100,50 Q150,80 180,100 Q150,180 100,150 Q50,120 20,100 Z"
            fill="#E5E7EB"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 200" 
          className="w-full h-32 sm:h-40"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,100 C300,150 400,50 600,80 C800,110 900,60 1200,90 L1200,200 L0,200 Z" 
            fill="rgba(239, 246, 255, 0.4)"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-16">
        <div className="w-full max-w-md">
          {/* Back button for main selection */}
          {authMode === 'select' && (
            <div className="flex justify-center mb-8">
              <button
                onClick={onBack}
                className="inline-flex items-center text-sm transition-colors duration-200"
                style={{ color: '#6B7280' }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                На главную
              </button>
            </div>
          )}

          {/* Main form card */}
          <div 
            className="rounded-3xl p-8 backdrop-blur-sm border border-white/60 shadow-lg"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
          >
            {authMode === 'select' && renderRoleSelection()}
            {(authMode === 'doctor-login' || authMode === 'doctor-register') && renderDoctorAuth()}
            {authMode === 'patient-access' && renderPatientAccess()}
          </div>

          {/* Security indicator */}
          <div className="flex items-center justify-center mt-8">
            <Shield className="h-4 w-4 mr-2" style={{ color: '#9CA3AF' }} />
            <span className="text-sm" style={{ color: '#9CA3AF' }}>
              Медицинские данные под защитой
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}